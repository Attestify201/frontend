/**
 * GET /api/agent/trust
 * Returns SelfClaw verification status for this agent (human-backed trust).
 * Frontend can use this to show "Verified by SelfClaw" / "Human-backed agent".
 * If SELFCLAW_AGENT_PUBLIC_KEY is not set, returns configured: false.
 */

import { NextResponse } from 'next/server'

const SELFCLAW_AGENT_API = 'https://selfclaw.ai/api/selfclaw/v1/agent'
const CACHE_MS = 60 * 1000 // 1 minute
let cached: { at: number; data: unknown } | null = null

export async function GET(request: Request) {
  const publicKey = (process.env.SELFCLAW_AGENT_PUBLIC_KEY ?? '').trim()

  if (!publicKey) {
    return NextResponse.json({
      configured: false,
      verified: false,
      message: 'SelfClaw not configured. Set SELFCLAW_AGENT_PUBLIC_KEY in .env after registering at https://selfclaw.ai/verify',
    })
  }

  try {
    if (cached && Date.now() - cached.at < CACHE_MS) {
      return NextResponse.json(cached.data)
    }

    const url = `${SELFCLAW_AGENT_API}?publicKey=${encodeURIComponent(publicKey)}`
    const res = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })
    const data = await res.json().catch(() => ({}))

    const payload = {
      configured: true,
      verified: Boolean(data?.verified),
      humanId: data?.humanId ?? null,
      agentName: data?.agentName ?? null,
      swarm: data?.swarm ?? null,
      reputation: data?.reputation
        ? {
            hasErc8004: Boolean(data.reputation?.hasErc8004),
            endpoint: data.reputation?.endpoint ?? null,
          }
        : null,
      selfxyz: data?.selfxyz
        ? { verified: Boolean(data.selfxyz.verified), registeredAt: data.selfxyz.registeredAt ?? null }
        : null,
    }

    cached = { at: Date.now(), data: payload }
    return NextResponse.json(payload)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      {
        configured: true,
        verified: false,
        error: 'SelfClaw check failed',
        details: message,
      },
      { status: 502 }
    )
  }
}
