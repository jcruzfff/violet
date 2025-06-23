import { useState, useCallback } from 'react'
import { StreamData, HeyGenTokenResponse, HeyGenStreamResponse } from '../types'

export const useHeyGen = () => {
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Ready to create stream')

  const closeAllSessions = useCallback(async (): Promise<void> => {
    try {
      setConnectionStatus('🧹 Closing any existing sessions...')
      
      const listResponse = await fetch('https://api.heygen.com/v1/streaming.list', {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_HEYGEN_API_KEY || '',
        },
      })

      if (listResponse.ok) {
        const sessionsData = await listResponse.json()
        
        if (sessionsData.data?.sessions?.length > 0) {
          console.log(`Found ${sessionsData.data.sessions.length} active sessions, closing them...`)
          
          for (const session of sessionsData.data.sessions) {
            await fetch('https://api.heygen.com/v1/streaming.stop', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.NEXT_PUBLIC_HEYGEN_API_KEY || '',
              },
              body: JSON.stringify({
                session_id: session.session_id
              })
            })
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    } catch (error) {
      console.warn('Session cleanup failed:', error)
    }
  }, [])

  const createHeyGenStream = useCallback(async (): Promise<void> => {
    try {
      await closeAllSessions()
      
      setConnectionStatus('🔑 Creating HeyGen token...')
      
      const tokenResponse = await fetch('https://api.heygen.com/v1/streaming.create_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': process.env.NEXT_PUBLIC_HEYGEN_API_KEY || '',
        },
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text()
        throw new Error(`Token creation failed: ${tokenResponse.status} - ${errorText}`)
      }

      const tokenData: HeyGenTokenResponse = await tokenResponse.json()
      setConnectionStatus('🎬 Creating stream session...')

      await new Promise(resolve => setTimeout(resolve, 1000))

      const streamResponse = await fetch('https://api.heygen.com/v1/streaming.new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.data.token}`,
        },
        body: JSON.stringify({
          quality: 'medium',
          avatar_name: 'Pedro_CasualLook_public',
          version: 'v2',
          video_encoding: 'H264',
          knowledge_base: 'You are a helpful finance advisor. Provide clear, actionable advice about budgeting, investing, and financial planning. Keep responses concise and practical.'
        })
      })

      if (!streamResponse.ok) {
        const errorText = await streamResponse.text()
        throw new Error(`Stream creation failed: ${streamResponse.status} - ${errorText}`)
      }

      const streamResponseData: HeyGenStreamResponse = await streamResponse.json()
      setConnectionStatus('▶️ Starting stream...')

      await new Promise(resolve => setTimeout(resolve, 1000))

      const startResponse = await fetch('https://api.heygen.com/v1/streaming.start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.data.token}`,
        },
        body: JSON.stringify({
          session_id: streamResponseData.data.session_id
        })
      })

      if (!startResponse.ok) {
        const errorText = await startResponse.text()
        throw new Error(`Stream start failed: ${startResponse.status} - ${errorText}`)
      }

      setStreamData({
        stream_url: streamResponseData.data.url,
        access_token: streamResponseData.data.access_token,
        session_id: streamResponseData.data.session_id
      })

      setConnectionStatus('✅ Stream created! Ready to connect to LiveKit')
      
    } catch (error) {
      console.error('HeyGen stream creation error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setConnectionStatus(`❌ Network Error: Check your internet connection and try again`)
      } else {
        setConnectionStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }, [closeAllSessions])

  const sendTextToAvatar = useCallback(async (text: string, taskType: 'talk' | 'repeat' = 'repeat') => {
    if (!streamData) return
    
    try {
      setConnectionStatus('💬 Avatar speaking...')
      
      const response = await fetch('https://api.heygen.com/v1/streaming.task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HEYGEN_API_KEY}`,
        },
        body: JSON.stringify({
          session_id: streamData.session_id,
          text: text,
          task_type: taskType
        })
      })
      
      if (response.ok) {
        setConnectionStatus('✅ Avatar spoke successfully')
        if (taskType === 'talk') {
          setTimeout(() => {
            setConnectionStatus('✅ Connected and ready')
          }, 2000)
        }
      } else {
        console.error('Failed to send text to avatar:', response.status)
      }
    } catch (error) {
      console.error('Error sending text to avatar:', error)
    }
  }, [streamData])

  return {
    streamData,
    connectionStatus,
    createHeyGenStream,
    sendTextToAvatar,
    setConnectionStatus
  }
} 