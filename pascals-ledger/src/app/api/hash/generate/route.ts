import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { generateAllHashes } from '@/lib/crypto';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { generateEntropyMetadata, validateSensorData } from '@/lib/entropy';
import { generateHashQRCode } from '@/lib/qrcode';
import { checkRateLimit } from '@/lib/ratelimit';
import { HashGenerationRequest } from '@/types';

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

    // Get user tier for rate limiting
    const userResult = await query('SELECT tier FROM users WHERE id = $1', [
      userSession.userId,
    ]);

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const userTier = userResult.rows[0].tier;
    const isPremium = userTier === 'premium';

    // Check rate limit based on tier
    const rateLimitType = isPremium
      ? 'hashGenerationPremium'
      : 'hashGenerationStandard';
    const rateLimitCheck = await checkRateLimit(
      userSession.userId,
      rateLimitType
    );

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: HashGenerationRequest = await request.json();
    const { inputType, content, imageData, location, sensorData } = body;

    // Validate input
    if (!inputType || (inputType !== 'text' && inputType !== 'image')) {
      return NextResponse.json(
        { success: false, error: 'Invalid input type' },
        { status: 400 }
      );
    }

    if (inputType === 'text' && !content) {
      return NextResponse.json(
        { success: false, error: 'Text content is required' },
        { status: 400 }
      );
    }

    if (inputType === 'image' && !imageData) {
      return NextResponse.json(
        { success: false, error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Prepare content for hashing
    let hashInput: string | Buffer;
    if (inputType === 'text') {
      hashInput = content || '';
    } else {
      // Decode base64 image data
      const base64Data = imageData!.replace(/^data:image\/\w+;base64,/, '');
      hashInput = Buffer.from(base64Data, 'base64');
    }

    // Generate entropy metadata
    const validatedSensorData = sensorData
      ? validateSensorData(sensorData)
      : null;
    const entropyMetadata = await generateEntropyMetadata({
      latitude: location?.latitude,
      longitude: location?.longitude,
      sensorData: validatedSensorData || undefined,
    });

    // Generate hashes
    const hashes = generateAllHashes(hashInput, entropyMetadata, isPremium);

    // Generate hash ID and QR code
    const hashId = uuidv4();
    const qrCodeData = await generateHashQRCode(hashId);

    // Store hash in database
    const timestamp = new Date();
    await query(
      `INSERT INTO hashes (
        id, user_id, blake3_hash, sha256_hash, sphincs_signature,
        timestamp, entropy_metadata, qr_code_url, public_verification_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        hashId,
        userSession.userId,
        hashes.blake3,
        hashes.sha256,
        hashes.sphincs,
        timestamp,
        JSON.stringify(entropyMetadata),
        qrCodeData.qrCodeDataURL,
        qrCodeData.url,
      ]
    );

    // Return hash data
    return NextResponse.json(
      {
        success: true,
        hash: {
          id: hashId,
          blake3Hash: hashes.blake3,
          sha256Hash: hashes.sha256,
          sphincsSignature: hashes.sphincs,
          timestamp: timestamp.toISOString(),
          entropyMetadata,
          qrCodeUrl: qrCodeData.qrCodeDataURL,
          publicVerificationUrl: qrCodeData.url,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Hash generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
