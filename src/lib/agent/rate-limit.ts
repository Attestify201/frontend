/**
 * In-memory rate limiting for the agent API.
 * Limits requests per identifier (e.g. wallet address or IP) per window.
 */

const store = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  let entry = store.get(identifier)

  if (!entry) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (now >= entry.resetAt) {
    entry = { count: 1, resetAt: now + WINDOW_MS }
    store.set(identifier, entry)
    return { allowed: true }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: entry.resetAt - now }
  }
  return { allowed: true }
}

/** Optional: cleanup old entries to avoid unbounded growth */
export function pruneRateLimitStore(): void {
  const now = Date.now()
  for (const [key, value] of store.entries()) {
    if (now >= value.resetAt) store.delete(key)
  }
}
