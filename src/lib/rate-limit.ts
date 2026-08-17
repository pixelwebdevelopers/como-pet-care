import { NextRequest } from 'next/server';

interface RateLimiterOptions {
  limit: number; // Maximum number of requests allowed
  windowMs: number; // Time window in milliseconds
}

class InMemoryRateLimiter {
  private hits = new Map<string, number[]>();
  private windowMs: number;
  private limit: number;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.limit = options.limit;

    // Periodically clean up stale IPs to prevent memory leaks (runs every 5 minutes)
    if (typeof window === 'undefined') {
      setInterval(() => this.pruneStaleHits(), 5 * 60 * 1000);
    }
  }

  /**
   * Checks if an IP address has exceeded the rate limit.
   * @returns true if rate-limited (block), false if allowed.
   */
  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = this.hits.get(ip) || [];

    // Filter timestamps to only keep those within the active window
    const activeTimestamps = timestamps.filter((time) => time > windowStart);

    if (activeTimestamps.length >= this.limit) {
      this.hits.set(ip, activeTimestamps);
      return true;
    }

    activeTimestamps.push(now);
    this.hits.set(ip, activeTimestamps);
    return false;
  }

  private pruneStaleHits() {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [ip, timestamps] of this.hits.entries()) {
      const activeTimestamps = timestamps.filter((time) => time > windowStart);
      if (activeTimestamps.length === 0) {
        this.hits.delete(ip);
      } else {
        this.hits.set(ip, activeTimestamps);
      }
    }
  }
}

// Registry to store multiple rate limiters (e.g. "email-send", "auth")
const limiters = new Map<string, InMemoryRateLimiter>();

/**
 * Retrieves or creates a rate limiter by name.
 */
export function getRateLimiter(name: string, options: RateLimiterOptions) {
  let limiter = limiters.get(name);
  if (!limiter) {
    limiter = new InMemoryRateLimiter(options);
    limiters.set(name, limiter);
  }
  return limiter;
}

/**
 * Gets the client IP address from request headers.
 */
export function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}
