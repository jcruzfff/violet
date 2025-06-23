import React, { useState } from 'react'
import { ConversationMessage, AIMode } from '../../types'

interface TextChatProps {
  isConnected: boolean
  conversation: ConversationMessage[]
  aiMode: AIMode
  onSendMessage: (message: string) => void
  onAiModeChange: (mode: AIMode) => void
  isAvatarSpeaking: boolean
}

export const TextChat: React.FC<TextChatProps> = ({
  isConnected,
  conversation,
  aiMode,
  onSendMessage,
  onAiModeChange,
  isAvatarSpeaking
}) => {
  const [textInput, setTextInput] = useState<string>('')

  const handleSendMessage = () => {
    if (textInput.trim()) {
      onSendMessage(textInput.trim())
      setTextInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && textInput.trim()) {
      handleSendMessage()
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div>
      {/* AI Mode Toggle */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label style={{ marginRight: '10px', fontSize: '14px', fontWeight: 'bold' }}>
          AI Mode:
        </label>
        <button
          onClick={() => onAiModeChange('heygen')}
          style={{
            padding: '8px 16px',
            backgroundColor: aiMode === 'heygen' ? '#2196F3' : '#ddd',
            color: aiMode === 'heygen' ? 'white' : '#666',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginRight: '10px'
          }}
        >
          🤖 HeyGen AI
        </button>
        <button
          onClick={() => onAiModeChange('openai')}
          style={{
            padding: '8px 16px',
            backgroundColor: aiMode === 'openai' ? '#4CAF50' : '#ddd',
            color: aiMode === 'openai' ? 'white' : '#666',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🧠 OpenAI
        </button>
      </div>

      {/* Text Input */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message to the avatar..."
          disabled={isAvatarSpeaking}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '6px',
            border: '2px solid #ddd',
            fontSize: '16px',
            opacity: isAvatarSpeaking ? 0.5 : 1
          }}
        />
        <button
          onClick={handleSendMessage}
          disabled={isAvatarSpeaking || !textInput.trim()}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            opacity: (isAvatarSpeaking || !textInput.trim()) ? 0.5 : 1
          }}
        >
          💬 Send
        </button>
      </div>

      {/* Conversation Display */}
      {conversation.length > 0 && (
        <div style={{
          marginBottom: '1rem',
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Conversation:</h3>
          {conversation.map((msg, index) => (
            <div key={index} style={{
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5',
              borderRadius: '6px',
              borderLeft: `4px solid ${msg.role === 'user' ? '#2196F3' : '#9c27b0'}`
            }}>
              <strong>{msg.role === 'user' ? '👤 You:' : '🤖 Avatar:'}</strong> {msg.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 