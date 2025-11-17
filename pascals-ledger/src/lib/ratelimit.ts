import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

// Rate limiters for different operations
const rateLimiters = {
  // Hash generation: 10 per hour for standard users
  hashGenerationStandard: new RateLimiterMemory({
    points: 10,
    duration: 3600,
  }),

  // Hash generation: 100 per hour for premium users
  hashGenerationPremium: new RateLimiterMemory({
    points: 100,
    duration: 3600,
  }),

  // Authentication: 5 attempts per 15 minutes
  auth: new RateLimiterMemory({
    points: 5,
    duration: 900,
  }),

  // Registration: 3 per hour per IP
  registration: new RateLimiterMemory({
    points: 3,
    duration: 3600,
  }),

  // API general: 100 requests per minute
  api: new RateLimiterMemory({
    points: 100,
    duration: 60,
  }),
};

/**
 * Check rate limit for a specific operation
 */
export async function checkRateLimit(
  key: string,
  limiterType: keyof typeof rateLimiters
): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    await rateLimiters[limiterType].consume(key);
    return { allowed: true };
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return {
        allowed: false,
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
      };
    }
    throw error;
  }
}

/**
 * Get remaining points for a key
 */
export async function getRemainingPoints(
  key: string,
  limiterType: keyof typeof rateLimiters
): Promise<number> {
  try {
    const limiterRes = await rateLimiters[limiterType].get(key);
    if (!limiterRes) {
      return rateLimiters[limiterType].points;
    }
    return limiterRes.remainingPoints;
  } catch (error) {
    console.error('Error getting remaining points:', error);
    return 0;
  }
}

/**
 * Extract IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }

  return 'unknown';
}
