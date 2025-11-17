import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userSession = verifyToken(token);
    if (!userSession) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { tier } = body;

    if (!tier || (tier !== 'standard' && tier !== 'premium')) {
      return NextResponse.json(
        { success: false, error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Get user details
    const userResult = await query(
      'SELECT id, email, stripe_customer_id FROM users WHERE id = $1',
      [userSession.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [
        customerId,
        user.id,
      ]);
    }

    // Create checkout session based on tier
    if (tier === 'standard') {
      // One-time payment of $1
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Pascal\'s Ledger - Standard Tier',
                description: 'One-time hash generation with BLAKE3 and SHA-256',
              },
              unit_amount: 100, // $1.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
        metadata: {
          userId: user.id,
          tier: 'standard',
        },
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });
    } else {
      // Premium subscription - $5/year
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Pascal\'s Ledger - Premium Tier',
                description:
                  'Annual subscription with quantum-resistant signatures and PEC features',
              },
              unit_amount: 500, // $5.00
              recurring: {
                interval: 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
        metadata: {
          userId: user.id,
          tier: 'premium',
        },
      });

      return NextResponse.json({
        success: true,
        sessionId: session.id,
        url: session.url,
      });
    }
  } catch (error) {
    console.error('Payment checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
