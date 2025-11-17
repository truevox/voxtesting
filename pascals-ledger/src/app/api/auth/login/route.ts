import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword } from '@/lib/crypto';
import { generateToken } from '@/lib/auth';
import { checkRateLimit, getClientIP } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check rate limit
    const clientIP = getClientIP(request);
    const rateLimitCheck = await checkRateLimit(clientIP, 'auth');
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    // Find user
    const result = await query(
      'SELECT id, email, password_hash, tier FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    // Timing attack mitigation: always perform password comparison
    // Use a dummy hash if user doesn't exist to maintain consistent timing
    const dummyHash = '$2a$12$dummyhashtopreventtimingattacksxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const userHash = result.rows.length > 0 ? result.rows[0].password_hash : dummyHash;

    const isPasswordValid = await verifyPassword(password, userHash);

    // Check if user exists AND password is valid
    if (result.rows.length === 0 || !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      tier: user.tier,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        tier: user.tier,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
