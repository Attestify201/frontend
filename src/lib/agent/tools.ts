/**
 * Claude tool definitions for the LiquiFi agent.
 * Used by the chat API to declare available tools (read + write intent).
 */

import type { Tool } from '@anthropic-ai/sdk/resources/messages.mjs'

export const AGENT_SYSTEM_PROMPT = `You are the LiquiFi AI Yield Advisor. You help users with their DeFi vault on Celo: deposits, withdrawals, balance checks, transaction history, and APY.

- Be concise and friendly. Use the provided tools to get real data.
- For balance/history/APY questions, use the read tools and summarize the results clearly.
- For deposit or withdraw requests, use the deposit or withdraw tool with the amount in cUSD. The user will then approve the transaction in their wallet; you never execute transactions yourself.
- Amounts are always in cUSD (18 decimals). When the user says "$100" or "100 cUSD", use amount 100.
- If the user's wallet address is not provided, ask them to connect their wallet first.
- For general DeFi or vault strategy questions, answer from knowledge: the vault uses Aave V3 on Celo to earn yield on cUSD; APY varies with market conditions.
- When using tools, use only the API's structured function-call format; do not output tool names or arguments as raw text or inside angle brackets like <function=...>.`

/** Claude tool definitions (function calling schema) */
export const agentTools: Tool[] = [
  {
    name: 'get_vault_balance',
    description: 'Get the user\'s vault balance in cUSD (amount deposited in the LiquiFi vault).',
    input_schema: {
      type: 'object' as const,
      properties: {
        user_address: { type: 'string', description: 'Ethereum address of the user (0x...)' },
      },
      required: ['user_address'],
    },
  },
  {
    name: 'get_wallet_balance',
    description: 'Get the user\'s wallet cUSD balance (not yet deposited in the vault).',
    input_schema: {
      type: 'object' as const,
      properties: {
        user_address: { type: 'string', description: 'Ethereum address of the user (0x...)' },
      },
      required: ['user_address'],
    },
  },
  {
    name: 'get_transaction_history',
    description: 'Get the user\'s recent deposit and withdrawal history from the vault.',
    input_schema: {
      type: 'object' as const,
      properties: {
        user_address: { type: 'string', description: 'Ethereum address of the user (0x...)' },
        limit: { type: 'number', description: 'Max number of transactions to return (default 10)', default: 10 },
      },
      required: ['user_address'],
    },
  },
  {
    name: 'get_apy',
    description: 'Get the current vault APY (annual percentage yield) in basis points; divide by 100 for percentage.',
    input_schema: {
      type: 'object' as const,
      properties: {},
    },
  },
  {
    name: 'get_total_earnings',
    description: 'Get the user\'s total assets in the vault (same as vault balance; used for "total earnings" or "how much I have" questions).',
    input_schema: {
      type: 'object' as const,
      properties: {
        user_address: { type: 'string', description: 'Ethereum address of the user (0x...)' },
      },
      required: ['user_address'],
    },
  },
  {
    name: 'deposit',
    description: 'Initiate a deposit of cUSD into the vault. Call this when the user wants to deposit. The user must approve the transaction in their wallet; you only request the action with an amount in cUSD.',
    input_schema: {
      type: 'object' as const,
      properties: {
        amount_cusd: { type: 'number', description: 'Amount to deposit in cUSD (e.g. 100 for $100)' },
      },
      required: ['amount_cusd'],
    },
  },
  {
    name: 'withdraw',
    description: 'Initiate a withdrawal of cUSD from the vault to the user\'s wallet. The user must approve the transaction in their wallet.',
    input_schema: {
      type: 'object' as const,
      properties: {
        amount_cusd: { type: 'number', description: 'Amount to withdraw in cUSD (e.g. 50 for $50)' },
      },
      required: ['amount_cusd'],
    },
  },
]

/** OpenAI-compatible tool definitions (for testing with free-tier OpenAI credits) */
export function getOpenAITools(): Array<{ type: 'function'; function: { name: string; description: string; parameters: { type: 'object'; properties: Record<string, { type: string; description?: string; default?: number }>; required?: string[] } } }> {
  return agentTools.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description || '',
      parameters: {
        type: 'object',
        properties: t.input_schema.properties as Record<string, { type: string; description?: string; default?: number }>,
        required: t.input_schema.required ?? [],
      },
    },
  }))
}

/** Gemini FunctionDeclaration[] for Google AI (free tier via Google AI Studio) */
export function getGeminiTools(): Array<{ name: string; description?: string; parametersJsonSchema?: object }> {
  return agentTools.map((t) => ({
    name: t.name,
    description: t.description,
    parametersJsonSchema: {
      type: 'object',
      properties: t.input_schema.properties as Record<string, { type: string; description?: string; default?: number }>,
      required: t.input_schema.required ?? [],
    },
  }))
}
