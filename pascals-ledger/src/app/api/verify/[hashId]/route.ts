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
        id, blake3_hash, sha256_hash, sphincs_signature,
        timestamp, entropy_metadata, qr_code_url, created_at
       FROM hashes
       WHERE id = $1`,
      [hashId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hash not found' },
        { status: 404 }
      );
    }

    const hash = result.rows[0];

    // Return hash data
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
