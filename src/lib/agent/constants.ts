/**
 * Backend-only constants for the LiquiFi AI agent.
 * Contract addresses and minimal ABIs for server-side reads.
 */

export const VAULT_ADDRESS = '0x5e12835dd11a7d35e0d5e49e2c66b9235c148243' as const
export const STRATEGY_ADDRESS = '0x549e5a5e7299A00b23cE3811913EFB549FAA470f' as const
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const

export const GRAPH_URL = 'https://api.studio.thegraph.com/query/109462/liquifi/version/latest'

/** Minimal ABIs for read-only contract calls (viem) */
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const VAULT_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const STRATEGY_ABI = [
  {
    inputs: [],
    name: 'getCurrentAPY',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const CELO_CHAIN_ID = 42220
