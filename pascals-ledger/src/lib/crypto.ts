import { blake3 } from '@noble/hashes/blake3';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate BLAKE3 hash from input data
 * @param data - Input data to hash (string or Buffer)
 * @returns Hexadecimal hash string
 */
export function generateBlake3Hash(data: string | Buffer): string {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  const hash = blake3(input);
  return bytesToHex(hash);
}

/**
 * Generate SHA-256 hash from input data
 * @param data - Input data to hash (string or Buffer)
 * @returns Hexadecimal hash string
 */
export function generateSHA256Hash(data: string | Buffer): string {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  const hash = sha256(input);
  return bytesToHex(hash);
}

/**
 * Generate SPHINCS+ quantum-resistant signature (Premium feature)
 * Note: This is a placeholder. Real SPHINCS+ implementation requires specialized libraries
 * For production, integrate a proper SPHINCS+ library or quantum-safe signature scheme
 * @param data - Input data to sign
 * @param privateKey - User's private key (should be securely stored)
 * @returns Signature string
 */
export function generateSphincsSignature(data: string | Buffer, privateKey?: string): string {
  // Placeholder implementation using HMAC as a demonstration
  // TODO: Replace with actual SPHINCS+ implementation
  const key = privateKey || process.env.SPHINCS_DEFAULT_KEY || 'default-quantum-key';
  const hmac = crypto.createHmac('sha512', key);
  const input = typeof data === 'string' ? data : data.toString('hex');
  hmac.update(input);
  return hmac.digest('hex');
}

/**
 * Combine input data with entropy metadata to create unique hash input
 * @param content - User's input content
 * @param entropy - Environmental entropy data
 * @returns Combined data buffer for hashing
 */
export function combineWithEntropy(
  content: string | Buffer,
  entropy: Record<string, any>
): string {
  const contentStr = typeof content === 'string' ? content : content.toString('base64');
  const entropyStr = JSON.stringify(entropy);
  return `${contentStr}::ENTROPY::${entropyStr}`;
}

/**
 * Generate all three hashes (BLAKE3, SHA-256, and optionally SPHINCS+)
 * @param content - Input content
 * @param entropy - Entropy metadata
 * @param isPremium - Whether user is premium (enables SPHINCS+)
 * @returns Object containing all hash values
 */
export function generateAllHashes(
  content: string | Buffer,
  entropy: Record<string, any>,
  isPremium: boolean = false
): {
  blake3: string;
  sha256: string;
  sphincs: string | null;
} {
  const combinedData = combineWithEntropy(content, entropy);

  return {
    blake3: generateBlake3Hash(combinedData),
    sha256: generateSHA256Hash(combinedData),
    sphincs: isPremium ? generateSphincsSignature(combinedData) : null,
  };
}

/**
 * Hash password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Verify password against hash
 * @param password - Plain text password
 * @param hash - Stored hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate secure random token
 * @param length - Token length in bytes
 * @returns Hexadecimal token string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
