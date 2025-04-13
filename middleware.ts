import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

// Create a new ratelimiter that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});

// Security headers configuration
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export async function middleware(request: NextRequest) {
  // Skip rate limiting if Redis is not configured
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=60'
    );
    return response;
  }

  // Get the IP address of the request
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';

  try {
    // Rate limit check
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_${ip}`
    );

    // Add rate limit headers
    const response = NextResponse.next();
    addSecurityHeaders(response);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());

    // If rate limit is exceeded, return 429
    if (!success) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // Add compression headers
    response.headers.set('Content-Encoding', 'gzip');
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=60'
    );

    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If rate limiting fails, allow the request to proceed
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }
}

function addSecurityHeaders(response: NextResponse) {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
}

export const config = {
  matcher: [
    '/api/:path*',
    '/interview/:path*',
    '/feedback/:path*',
    '/profile/:path*',
    '/leaderboard',
  ],
};
