import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
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

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch user's hashes
    const result = await query(
      `SELECT
        id, blake3_hash, sha256_hash, sphincs_signature,
        timestamp, entropy_metadata, qr_code_url, public_verification_url, created_at
       FROM hashes
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userSession.userId, limit, offset]
    );

    // Get total count
    const countResult = await query(
      'SELECT COUNT(*) as total FROM hashes WHERE user_id = $1',
      [userSession.userId]
    );

    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      success: true,
      hashes: result.rows.map((row) => ({
        id: row.id,
        blake3Hash: row.blake3_hash,
        sha256Hash: row.sha256_hash,
        sphincsSignature: row.sphincs_signature,
        timestamp: row.timestamp,
        entropyMetadata: row.entropy_metadata,
        qrCodeUrl: row.qr_code_url,
        publicVerificationUrl: row.public_verification_url,
        createdAt: row.created_at,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('List hashes error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
