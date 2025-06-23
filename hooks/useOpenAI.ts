import { useCallback } from 'react'

export const useOpenAI = () => {
  const generateOpenAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: 'You are a helpful finance advisor. Provide clear, actionable advice about budgeting, investing, and financial planning. Keep responses concise and practical.'
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.response
      } else {
        throw new Error('OpenAI API call failed')
      }
    } catch (error) {
      console.error('OpenAI error:', error)
      return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again."
    }
  }, [])

  return {
    generateOpenAIResponse
  }
} 