/**
 * Simple in-memory agent conversation state.
 * Optional: pass conversationId in request body to maintain history for the current session.
 * For production at scale, replace with Redis or a database.
 */

export type AgentMessage = {
  role: 'user' | 'assistant'
  content: string
  /** If present, the assistant response included a transaction request for the frontend */
  transactionRequest?: { action: 'deposit' | 'withdraw'; amount_usdm: number }
}

const conversations = new Map<string, AgentMessage[]>()

const MAX_MESSAGES_PER_CONVERSATION = 50
const MAX_CONVERSATIONS = 1000

export function getConversationHistory(conversationId: string | null): AgentMessage[] {
  if (!conversationId) return []
  return conversations.get(conversationId) ?? []
}

export function appendToConversation(
  conversationId: string | null,
  message: AgentMessage
): void {
  if (!conversationId) return
  let list = conversations.get(conversationId)
  if (!list) {
    list = []
    conversations.set(conversationId, list)
  }
  list.push(message)
  if (list.length > MAX_MESSAGES_PER_CONVERSATION) {
    list.splice(0, list.length - MAX_MESSAGES_PER_CONVERSATION)
  }
  if (conversations.size > MAX_CONVERSATIONS) {
    const keys = [...conversations.keys()]
    keys.slice(0, 100).forEach((k) => conversations.delete(k))
  }
}

export function clearConversation(conversationId: string): void {
  conversations.delete(conversationId)
}
