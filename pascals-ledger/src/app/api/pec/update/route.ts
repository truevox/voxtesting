import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { query } from '@/lib/db';
import { generateAllHashes } from '@/lib/crypto';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { generatePECEntropy, validateSensorData } from '@/lib/entropy';

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

    // Verify user is premium with PEC enabled
    const userResult = await query(
      'SELECT tier, pec_enabled FROM users WHERE id = $1',
      [userSession.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];
    if (user.tier !== 'premium' || !user.pec_enabled) {
      return NextResponse.json(
        {
          success: false,
          error: 'PEC feature requires Premium subscription',
        },
        { status: 403 }
      );
    }

    // Parse sensor data from request
    const body = await request.json();
    const { sensorData, parentHashId } = body;

    if (!sensorData) {
      return NextResponse.json(
        { success: false, error: 'Sensor data is required' },
        { status: 400 }
      );
    }

    // Validate sensor data
    const validatedSensorData = validateSensorData(sensorData);
    if (!validatedSensorData) {
      return NextResponse.json(
        { success: false, error: 'Invalid sensor data format' },
        { status: 400 }
      );
    }

    // Get previous hash if exists
    let previousHash = '';
    if (parentHashId) {
      const hashResult = await query(
        'SELECT blake3_hash FROM hashes WHERE id = $1 AND user_id = $2',
        [parentHashId, userSession.userId]
      );
      if (hashResult.rows.length > 0) {
        previousHash = hashResult.rows[0].blake3_hash;
      }
    } else {
      // Get most recent PEC hash for this user
      const pecResult = await query(
        `SELECT current_blake3 FROM pec_rolling_hashes
         WHERE user_id = $1
         ORDER BY updated_at DESC
         LIMIT 1`,
        [userSession.userId]
      );
      if (pecResult.rows.length > 0) {
        previousHash = pecResult.rows[0].current_blake3;
      }
    }

    // Generate entropy for PEC update
    const pecEntropy = await generatePECEntropy(
      validatedSensorData,
      previousHash
    );

    // Generate new hashes
    const hashes = generateAllHashes(pecEntropy, validatedSensorData, true);

    // Update PEC rolling hash
    const pecId = uuidv4();
    await query(
      `INSERT INTO pec_rolling_hashes (
        id, user_id, parent_hash_id, current_blake3,
        current_sha256, current_sphincs, sensor_data, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        pecId,
        userSession.userId,
        parentHashId || null,
        hashes.blake3,
        hashes.sha256,
        hashes.sphincs,
        JSON.stringify(validatedSensorData),
      ]
    );

    return NextResponse.json(
      {
        success: true,
        pecUpdate: {
          id: pecId,
          blake3: hashes.blake3,
          sha256: hashes.sha256,
          sphincs: hashes.sphincs,
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('PEC update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Fetch PEC history
    const result = await query(
      `SELECT id, current_blake3, current_sha256, current_sphincs,
              sensor_data, updated_at
       FROM pec_rolling_hashes
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 100`,
      [userSession.userId]
    );

    return NextResponse.json({
      success: true,
      pecHistory: result.rows.map((row) => ({
        id: row.id,
        blake3: row.current_blake3,
        sha256: row.current_sha256,
        sphincs: row.current_sphincs,
        sensorData: row.sensor_data,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error('PEC history fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
