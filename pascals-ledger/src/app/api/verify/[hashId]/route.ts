import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { hashId: string } }
) {
  try {
    const { hashId } = params;

    // Fetch hash data (no authentication required - public verification)
    const result = await query(
      `SELECT
        h.id, h.blake3_hash, h.sha256_hash, h.sphincs_signature,
        h.timestamp, h.entropy_metadata, h.qr_code_url, h.created_at,
        u.email
       FROM hashes h
       JOIN users u ON h.user_id = u.id
       WHERE h.id = $1`,
      [hashId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hash not found' },
        { status: 404 }
      );
    }

    const hash = result.rows[0];

    // Return hash data (excluding user's email for privacy)
    return NextResponse.json({
      success: true,
      hash: {
        id: hash.id,
        blake3Hash: hash.blake3_hash,
        sha256Hash: hash.sha256_hash,
        sphincsSignature: hash.sphincs_signature,
        timestamp: hash.timestamp,
        entropyMetadata: hash.entropy_metadata,
        qrCodeUrl: hash.qr_code_url,
        createdAt: hash.created_at,
        verified: true,
      },
    });
  } catch (error) {
    console.error('Verify hash error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
