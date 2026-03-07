declare module '@chaoschain/sdk' {
  export enum NetworkConfig {
    CELO_MAINNET = 'CELO_MAINNET',
  }

  export enum AgentRole {
    WORKER = 'WORKER',
  }

  export interface ChaosChainSDKConfig {
    agentName: string
    agentDomain: string
    agentRole: AgentRole
    network: NetworkConfig
    privateKey: string
    rpcUrl: string
  }

  export class ChaosChainSDK {
    constructor(config: ChaosChainSDKConfig)
    giveFeedback(params: {
      agentId: bigint
      rating: number
      feedbackUri: string
      feedbackData?: Record<string, unknown>
    }): Promise<void>
  }
}
