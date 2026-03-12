/**
 * POST /api/agent/feedback
 * Body: { tx_hash: string, success: boolean, response_time_ms?: number }
 * Submits reputation feedback to ERC-8004 (ChaosChain) after a user completes a transaction.
 * Only submits when success is true (positive feedback for successful operations).
 */

import { NextResponse } from 'next/server'

async function getERC8004Sdk() {
  const privateKey = process.env.AGENT_PRIVATE_KEY
  const rpcUrl = process.env.CELO_RPC_URL
  const agentId = process.env.AGENT_ID

  if (!privateKey || !rpcUrl || !agentId) return null

  try {
    // Dynamic import to avoid CommonJS require issues in serverless
    const { ChaosChainSDK, NetworkConfig, AgentRole } = await import('@chaoschain/sdk')
    return new ChaosChainSDK({
      agentName: process.env.AGENT_NAME ?? 'LiquiFi Yield Advisor',
      agentDomain: process.env.AGENT_DOMAIN ?? new URL(process.env.NEXT_PUBLIC_URL ?? 'https://example.com').hostname,
      agentRole: AgentRole.WORKER,
      network: NetworkConfig.CELO_MAINNET,
      privateKey,
      rpcUrl,
    })
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const txHash = typeof body.tx_hash === 'string' ? body.tx_hash.trim() : ''
    const success = body.success === true
    const responseTimeMs = typeof body.response_time_ms === 'number' ? body.response_time_ms : undefined

    if (!txHash) {
      return NextResponse.json({ error: 'tx_hash is required' }, { status: 400 })
    }

    if (!success) {
      return NextResponse.json({ ok: true, message: 'Feedback skipped (success=false)' })
    }

    const sdk = await getERC8004Sdk()
    if (!sdk) {
      return NextResponse.json(
        { ok: false, error: 'ERC-8004 not configured (AGENT_PRIVATE_KEY, CELO_RPC_URL, AGENT_ID)' },
        { status: 503 }
      )
    }

    const agentIdNum = Number(process.env.AGENT_ID)
    if (!Number.isInteger(agentIdNum) || agentIdNum < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid AGENT_ID' }, { status: 503 })
    }

    await sdk.giveFeedback({
      agentId: BigInt(agentIdNum),
      rating: 95,
      feedbackUri: `tx:${txHash}`,
      feedbackData: {
        txHash,
        success: true,
        ...(responseTimeMs != null && { responseTimeMs }),
      },
    })

    return NextResponse.json({ ok: true, message: 'Feedback submitted' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { ok: false, error: 'Feedback submission failed', details: message },
      { status: 500 }
    )
  }
}
