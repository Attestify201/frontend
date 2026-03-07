/**
 * Server-side execution of agent tools.
 * Read tools: call chain + Graph and return data.
 * Write tools: return transaction intent for the frontend to execute via Wagmi.
 */

import { createPublicClient, http, formatUnits, type Address } from 'viem'
import { celo } from 'viem/chains'
import {
  VAULT_ADDRESS,
  STRATEGY_ADDRESS,
  CUSD_ADDRESS,
  GRAPH_URL,
  ERC20_ABI,
  VAULT_ABI,
  STRATEGY_ABI,
} from './constants'

const publicClient = createPublicClient({
  chain: celo,
  transport: http(process.env.CELO_RPC_URL ?? 'https://forno.celo.org'),
})

async function graphQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Graph request failed: ${res.status}`)
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0]?.message ?? 'Graph error')
  return json.data as T
}

/** Run a read tool and return result for Claude. */
export async function executeReadTool(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case 'get_vault_balance': {
      const user = args.user_address as string
      if (!user) return JSON.stringify({ error: 'user_address required' })
      const balance = await publicClient.readContract({
        address: VAULT_ADDRESS as Address,
        abi: VAULT_ABI,
        functionName: 'balanceOf',
        args: [user as Address],
      })
      const formatted = formatUnits(balance, 18)
      return JSON.stringify({ vault_balance_cusd: formatted, raw: balance.toString() })
    }
    case 'get_wallet_balance': {
      const user = args.user_address as string
      if (!user) return JSON.stringify({ error: 'user_address required' })
      const balance = await publicClient.readContract({
        address: CUSD_ADDRESS as Address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [user as Address],
      })
      const formatted = formatUnits(balance, 18)
      return JSON.stringify({ wallet_balance_cusd: formatted, raw: balance.toString() })
    }
    case 'get_transaction_history': {
      const user = (args.user_address as string)?.toLowerCase()
      if (!user) return JSON.stringify({ error: 'user_address required' })
      const limit = Math.min(Number(args.limit) || 10, 20)
      const data = await graphQuery<{
        depositeds: { assets: string; blockTimestamp: string; transactionHash: string }[]
        withdrawns: { assets: string; blockTimestamp: string; transactionHash: string }[]
      }>(
        `query GetHistory($user: Bytes!, $first: Int!) {
          depositeds(where: { user: $user }, orderBy: blockTimestamp, orderDirection: desc, first: $first) {
            assets
            blockTimestamp
            transactionHash
          }
          withdrawns(where: { user: $user }, orderBy: blockTimestamp, orderDirection: desc, first: $first) {
            assets
            blockTimestamp
            transactionHash
          }
        }`,
        { user, first: limit }
      )
      const deposits = (data.depositeds ?? []).map((d) => ({
        type: 'deposit',
        assets: formatUnits(BigInt(d.assets), 18),
        date: new Date(Number(d.blockTimestamp) * 1000).toISOString(),
        txHash: d.transactionHash,
      }))
      const withdrawals = (data.withdrawns ?? []).map((w) => ({
        type: 'withdrawal',
        assets: formatUnits(BigInt(w.assets), 18),
        date: new Date(Number(w.blockTimestamp) * 1000).toISOString(),
        txHash: w.transactionHash,
      }))
      const combined = [...deposits, ...withdrawals].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ).reverse()
      return JSON.stringify({ transactions: combined.slice(0, limit) })
    }
    case 'get_apy': {
      const basisPoints = await publicClient.readContract({
        address: STRATEGY_ADDRESS as Address,
        abi: STRATEGY_ABI,
        functionName: 'getCurrentAPY',
      })
      const percent = Number(basisPoints) / 100
      return JSON.stringify({ apy_basis_points: Number(basisPoints), apy_percent: percent })
    }
    case 'get_total_earnings': {
      const user = args.user_address as string
      if (!user) return JSON.stringify({ error: 'user_address required' })
      const balance = await publicClient.readContract({
        address: VAULT_ADDRESS as Address,
        abi: VAULT_ABI,
        functionName: 'balanceOf',
        args: [user as Address],
      })
      const formatted = formatUnits(balance, 18)
      return JSON.stringify({ total_vault_balance_cusd: formatted, raw: balance.toString() })
    }
    default:
      return JSON.stringify({ error: `Unknown read tool: ${name}` })
  }
}

/** Whether the tool is a write (transaction) tool; we return intent instead of executing. */
export function isWriteTool(name: string): boolean {
  return name === 'deposit' || name === 'withdraw'
}

/** Build transaction intent for the frontend. */
export function buildTransactionIntent(
  name: string,
  args: Record<string, unknown>
): { action: 'deposit' | 'withdraw'; amount_cusd: number } | null {
  if (name === 'deposit') {
    const amount = Number(args.amount_cusd)
    if (!Number.isFinite(amount) || amount <= 0) return null
    return { action: 'deposit', amount_cusd: amount }
  }
  if (name === 'withdraw') {
    const amount = Number(args.amount_cusd)
    if (!Number.isFinite(amount) || amount <= 0) return null
    return { action: 'withdraw', amount_cusd: amount }
  }
  return null
}
