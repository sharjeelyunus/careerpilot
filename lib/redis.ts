import { Redis } from '@upstash/redis';

// Create Redis instance with environment variables
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Validate Redis configuration
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  console.warn(
    'Redis configuration is missing. Rate limiting will be disabled.'
  );
}

// Cache helper functions
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return null;
    }
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  value: T,
  ttl?: number
): Promise<void> => {
  try {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return;
    }
    if (ttl) {
      await redis.set(key, value, { ex: ttl });
    } else {
      await redis.set(key, value);
    }
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return;
    }
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return;
    }
    await redis.flushall();
  } catch (error) {
    console.error('Redis clear error:', error);
  }
};
