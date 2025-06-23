export interface StreamData {
  stream_url: string
  access_token: string
  session_id: string
}

export interface HeyGenTokenResponse {
  data: {
    token: string
  }
}

export interface HeyGenStreamResponse {
  data: {
    session_id: string
    access_token: string
    url: string
    is_paid: boolean
    session_duration_limit: number
  }
}

export interface ConversationMessage {
  role: 'user' | 'avatar'
  message: string
  timestamp?: Date
}

export interface BrowserInfo {
  isSecureContext: string
  protocol: string
  userAgent: string
  language: string
  isOnline: string
}

export type AIMode = 'heygen' | 'openai' 