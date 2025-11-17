import { Pool, QueryResult } from 'pg';

let pool: Pool | null = null;

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

/**
 * Execute a database query
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

/**
 * Execute a transaction
 */
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

/**
 * Initialize database schema
 */
export async function initializeDatabase(): Promise<void> {
  const schema = `
    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      tier VARCHAR(20) DEFAULT 'standard' CHECK (tier IN ('standard', 'premium')),
      created_at TIMESTAMP DEFAULT NOW(),
      subscription_end_date TIMESTAMP NULL,
      pec_enabled BOOLEAN DEFAULT FALSE,
      stripe_customer_id VARCHAR(255) NULL,
      stripe_subscription_id VARCHAR(255) NULL
    );

    -- Create index on email for faster lookups
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

    -- Hashes table
    CREATE TABLE IF NOT EXISTS hashes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      blake3_hash VARCHAR(64) NOT NULL,
      sha256_hash VARCHAR(64) NOT NULL,
      sphincs_signature TEXT NULL,
      timestamp TIMESTAMP NOT NULL,
      entropy_metadata JSONB NOT NULL,
      qr_code_url TEXT NOT NULL,
      public_verification_url TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes for faster queries
    CREATE INDEX IF NOT EXISTS idx_hashes_user_id ON hashes(user_id);
    CREATE INDEX IF NOT EXISTS idx_hashes_blake3 ON hashes(blake3_hash);
    CREATE INDEX IF NOT EXISTS idx_hashes_sha256 ON hashes(sha256_hash);
    CREATE INDEX IF NOT EXISTS idx_hashes_timestamp ON hashes(timestamp);

    -- PEC Rolling Hashes table (Premium feature)
    CREATE TABLE IF NOT EXISTS pec_rolling_hashes (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      parent_hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
      current_blake3 VARCHAR(64) NOT NULL,
      current_sha256 VARCHAR(64) NOT NULL,
      current_sphincs TEXT NOT NULL,
      sensor_data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_pec_user_id ON pec_rolling_hashes(user_id);
    CREATE INDEX IF NOT EXISTS idx_pec_parent_hash ON pec_rolling_hashes(parent_hash_id);

    -- Hash storage locations table (for redundancy tracking)
    CREATE TABLE IF NOT EXISTS hash_storage_locations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      hash_id UUID REFERENCES hashes(id) ON DELETE CASCADE,
      storage_type VARCHAR(50) NOT NULL, -- 's3', 'ipfs', 'arweave', etc.
      storage_url TEXT NOT NULL,
      stored_at TIMESTAMP DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'failed'))
    );

    -- Create index
    CREATE INDEX IF NOT EXISTS idx_storage_hash_id ON hash_storage_locations(hash_id);

    -- Payment transactions table
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      stripe_payment_intent_id VARCHAR(255) NULL,
      amount INTEGER NOT NULL, -- in cents
      currency VARCHAR(3) DEFAULT 'USD',
      tier VARCHAR(20) NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create index
    CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payment_transactions(user_id);
  `;

  try {
    await query(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
}
