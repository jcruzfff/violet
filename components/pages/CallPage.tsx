'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { AvatarVideo } from '../Avatar/AvatarVideo'
import ChatWindow from '../UI/ChatWindow'
import { useHeyGen } from '../../hooks/useHeyGen'
import { useLiveKit } from '../../hooks/useLiveKit'
import { useOpenAI } from '../../hooks/useOpenAI'
import { ConversationMessage, StreamData, AIMode } from '../../types'
import Image from 'next/image'



interface CallPageProps {
  onBackAction: () => void
  initialStreamData: StreamData | null
  advisorName: string
}

type RiskLevel = 'Conservative' | 'Balanced' | 'Aggressive'

export default function CallPage({ onBackAction, initialStreamData, advisorName }: CallPageProps) {
  // State
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [autoConnectAttempted, setAutoConnectAttempted] = useState<boolean>(false)
  const [isAutoConnecting, setIsAutoConnecting] = useState<boolean>(false)
  const [showChatWindow, setShowChatWindow] = useState<boolean>(true)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Conservative')
  const [showRiskDropdown, setShowRiskDropdown] = useState<boolean>(false)
  const [aiMode] = useState<AIMode>('heygen')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Custom hooks
  const { streamData, connectionStatus, createHeyGenStream, sendTextToAvatar, setConnectionStatus } = useHeyGen(initialStreamData)
  
  // Refs to avoid stale closures in useEffect (declare after hooks)
  const transcribeAudioRef = useRef<((audioBlob: Blob) => Promise<void>) | null>(null)
  const setConnectionStatusRef = useRef(setConnectionStatus)
  const setIsRecordingRef = useRef(setIsRecording)
  const { videoRef, isConnected, connectToLiveKit, disconnect } = useLiveKit(initialStreamData || streamData, setConnectionStatus)
  const { generateOpenAIResponse } = useOpenAI()

  // Auto-connection effect with robust safeguards
  useEffect(() => {
    const attemptAutoConnect = async () => {
      if (!initialStreamData || !advisorName || autoConnectAttempted || isConnected || isAutoConnecting) {
        return
      }

      console.log('🚀 Starting auto-connection to', advisorName)
      setAutoConnectAttempted(true)
      setIsAutoConnecting(true)
      setConnectionStatus(`🚀 Auto-connecting to ${advisorName}...`)

      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        if (isConnected) {
          console.log('Already connected, skipping auto-connect')
          return
        }

        await connectToLiveKit()
        console.log('✅ Auto-connection successful!')
        setConnectionStatus(`✅ Connected to ${advisorName}! Ready to chat.`)
        
      } catch (error) {
        console.error('❌ Auto-connection failed:', error)
        setConnectionStatus(`⚠️ Auto-connection failed. Click "Connect to Avatar Stream" to try manually.`)
      } finally {
        setIsAutoConnecting(false)
      }
    }

    const timeoutId = setTimeout(attemptAutoConnect, 200)
    return () => clearTimeout(timeoutId)
  }, [initialStreamData, advisorName, autoConnectAttempted, isConnected, isAutoConnecting, connectToLiveKit, setConnectionStatus])

  // Initial status setup
  useEffect(() => {
    if (initialStreamData && advisorName && !autoConnectAttempted) {
      console.log('💡 CallPage ready with stream data for:', advisorName)
      setConnectionStatus(`📡 Stream ready for ${advisorName}. Preparing to connect...`)
    } else if (!initialStreamData) {
      console.log('⚠️ No initial stream data available')
      setConnectionStatus('⚠️ No stream data available. Please create a stream.')
    }
  }, [initialStreamData, advisorName, autoConnectAttempted, setConnectionStatus])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log('🧹 CallPage unmounting, cleaning up...')
      try {
        disconnect()
      } catch (error) {
        console.log('Cleanup disconnect error (safe to ignore):', error)
      }
    }
  }, [disconnect])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRiskDropdown) {
        const target = event.target as HTMLElement
        if (!target.closest('.risk-dropdown')) {
          setShowRiskDropdown(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showRiskDropdown])

  // Message handling
  const handleUserMessage = useCallback(async (userMessage: string) => {
    console.log('🔵 [CallPage] handleUserMessage started:', userMessage)
    console.log('🔵 [CallPage] Current aiMode:', aiMode)
    console.log('🔵 [CallPage] isConnected:', isConnected)
    
    try {
      console.log('🔵 [CallPage] Setting isAvatarSpeaking to true')
      setIsAvatarSpeaking(true)
      setConnectionStatus('🤖 Avatar thinking...')
      
      // Add user message to conversation
      console.log('🔵 [CallPage] Adding user message to conversation')
      setConversation(prev => [...prev, { role: 'user', message: userMessage }])
      
      if (aiMode === 'heygen') {
        console.log('🔵 [CallPage] Using HeyGen mode - calling sendTextToAvatar with "talk"')
        console.log('🔵 [CallPage] Message being sent:', userMessage)
        
        const result = await sendTextToAvatar(userMessage, 'talk')
        console.log('🔵 [CallPage] sendTextToAvatar result:', result)
        console.log('🔵 [CallPage] HeyGen talk completed successfully')
        
      } else {
        console.log('🔵 [CallPage] Using OpenAI mode')
        setConnectionStatus('🤖 Consulting OpenAI...')
        const aiResponse = await generateOpenAIResponse(userMessage)
        console.log('🔵 [CallPage] OpenAI response:', aiResponse)
        
        // Add AI response to conversation
        setConversation(prev => [...prev, { role: 'avatar', message: aiResponse }])
        
        // Make avatar speak the OpenAI response
        console.log('🔵 [CallPage] Making avatar repeat OpenAI response')
        await sendTextToAvatar(aiResponse, 'repeat')
        console.log('🔵 [CallPage] OpenAI flow completed successfully')
      }
      
      console.log('🔵 [CallPage] Message handling completed successfully')
      
    } catch (error) {
      console.error('🔴 [CallPage] Error handling user message:', error)
      setConnectionStatus('❌ Error processing message')
    } finally {
      console.log('🔵 [CallPage] Setting isAvatarSpeaking to false')
      setIsAvatarSpeaking(false)
      console.log('🔵 [CallPage] handleUserMessage finished')
    }
  }, [sendTextToAvatar, aiMode, generateOpenAIResponse, setConnectionStatus, isConnected])

  // Transcribe audio using OpenAI Whisper API
  const transcribeAudioWithOpenAI = useCallback(async (audioBlob: Blob) => {
    console.log('🎤 [Whisper] 🚀 Starting OpenAI Whisper transcription...')
    
    try {
      // Create FormData for the audio file
      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', 'whisper-1')
      formData.append('language', 'en')
      
      console.log('🎤 [Whisper] 📤 Sending audio to OpenAI...')
      
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('🎤 [Whisper] 📝 Transcription result:', result)
      
      if (result.text && result.text.trim()) {
        const transcript = result.text.trim()
        console.log('🎤 [Whisper] ✅ Transcript received:', transcript)
        setConnectionStatus('✅ Connected and ready')
        
        // Send the transcribed text as a message
        handleUserMessage(transcript)
      } else {
        console.log('🎤 [Whisper] ⚠️ Empty transcription result')
        setConnectionStatus('⚠️ No speech detected - try again')
      }
      
    } catch (error) {
      console.error('🎤 [Whisper] ❌ Transcription error:', error)
      setConnectionStatus('❌ Transcription failed - try again')
    }
  }, [handleUserMessage, setConnectionStatus])

  // Update the refs whenever the functions change
  useEffect(() => {
    transcribeAudioRef.current = transcribeAudioWithOpenAI
    setConnectionStatusRef.current = setConnectionStatus
    setIsRecordingRef.current = setIsRecording
  }, [transcribeAudioWithOpenAI, setConnectionStatus, setIsRecording])

  // Initialize audio recording with MediaRecorder for OpenAI Whisper
  useEffect(() => {
    console.log('🎤 [Audio] Initializing MediaRecorder for OpenAI Whisper transcription...')
    
    if (typeof window === 'undefined') {
      console.warn('🎤 [Audio] Window not available')
      return
    }

    // Check for MediaRecorder support
    if (!window.MediaRecorder) {
      console.warn('🎤 [Audio] ❌ MediaRecorder API not supported in this browser')
      setConnectionStatus('❌ Audio recording not supported')
      return
    }

    // Check for secure context
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost'
    console.log(`🎤 [Audio] Secure context: ${isSecureContext}, Protocol: ${window.location.protocol}`)
    
    if (!isSecureContext) {
      console.warn('🎤 [Audio] ⚠️ MediaRecorder requires a secure context (HTTPS or localhost)')
      setConnectionStatus('❌ Audio recording requires HTTPS')
      return
    }

    // Initialize microphone access
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      } 
    })
    .then((mediaStream) => {
      console.log('🎤 [Audio] ✅ Microphone access granted')
      setStream(mediaStream)
      
      // Create MediaRecorder with optimal settings for speech
      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      let audioChunks: Blob[] = []
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
          console.log('🎤 [Audio] 📦 Audio chunk received:', event.data.size, 'bytes')
        }
      }
      
      recorder.onstop = async () => {
        console.log('🎤 [Audio] ⏹️ Recording stopped, processing audio...')
        setIsRecordingRef.current(false)
        setConnectionStatusRef.current('🔄 Transcribing audio...')
        
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
        console.log('🎤 [Audio] 🎵 Audio blob created:', audioBlob.size, 'bytes')
        
        // Clear chunks for next recording
        audioChunks = []
        
        // Send to OpenAI Whisper for transcription using ref to avoid stale closure
        if (transcribeAudioRef.current) {
          await transcribeAudioRef.current(audioBlob)
        }
      }
      
      recorder.onstart = () => {
        console.log('🎤 [Audio] ▶️ Recording started')
        setIsRecordingRef.current(true)
        setConnectionStatusRef.current('🎤 Recording...')
        audioChunks = [] // Reset chunks
      }
      
      recorder.onerror = (event) => {
        console.error('🎤 [Audio] ❌ MediaRecorder error:', event)
        setIsRecordingRef.current(false)
        setConnectionStatusRef.current('❌ Recording error')
      }
      
      setMediaRecorder(recorder)
      console.log('🎤 [Audio] ✅ MediaRecorder initialized successfully')
      setConnectionStatusRef.current('✅ Connected and ready')
    })
    .catch((error) => {
      console.error('🎤 [Audio] ❌ Failed to access microphone:', error)
      let errorMessage = 'Microphone access failed'
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied - Please allow microphone access'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone found - Please connect a microphone'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Microphone is being used by another application'
      }
      
      setConnectionStatusRef.current(`❌ ${errorMessage}`)
    })

    // Cleanup
    return () => {
      if (stream) {
        console.log('🎤 [Audio] 🧹 Cleaning up media stream')
        stream.getTracks().forEach(track => track.stop())
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty to prevent infinite loop - refs handle updates

  // Voice recording handlers
  const startRecording = useCallback(async () => {
    console.log('🎤 [Audio] startRecording called')
    console.log('🎤 [Audio] State check:', {
      hasMediaRecorder: !!mediaRecorder,
      isRecording,
      isAvatarSpeaking,
      recorderState: mediaRecorder?.state
    })

    if (isAvatarSpeaking) {
      console.log('🎤 [Audio] ❌ Cannot record while avatar is speaking')
      setConnectionStatus('❌ Cannot record while avatar is speaking')
      return
    }

    if (!mediaRecorder) {
      console.log('🎤 [Audio] ❌ MediaRecorder not available')
      setConnectionStatus('❌ Audio recording not available')
      return
    }

    if (isRecording || mediaRecorder.state === 'recording') {
      console.log('🎤 [Audio] ⚠️ Already recording')
      return
    }

    try {
      console.log('🎤 [Audio] 🚀 Starting audio recording...')
      mediaRecorder.start()
      
    } catch (error) {
      console.error('🎤 [Audio] ❌ Error starting recording:', error)
      setIsRecording(false)
      
      const err = error as Error
      setConnectionStatus(`❌ Recording start error: ${err.message || 'Unknown error'}`)
    }
  }, [mediaRecorder, isRecording, isAvatarSpeaking, setConnectionStatus])

  const stopRecording = useCallback(() => {
    console.log('🎤 [Audio] stopRecording called')
    
    if (!mediaRecorder) {
      console.log('🎤 [Audio] ❌ MediaRecorder not available')
      return
    }

    if (!isRecording && mediaRecorder.state !== 'recording') {
      console.log('🎤 [Audio] ⚠️ Not currently recording')
      return
    }

    try {
      console.log('🎤 [Audio] ⏹️ Stopping audio recording...')
      mediaRecorder.stop()
    } catch (error) {
      console.error('🎤 [Audio] ❌ Error stopping recording:', error)
      setIsRecording(false)
    }
  }, [mediaRecorder, isRecording])

  return (
    <div className={`bg-[#141414] relative w-full h-screen overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-20 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
          <div>Advisor: {advisorName}</div>
          <div>Has Stream: {initialStreamData ? 'Yes' : 'No'}</div>
          <div>Connected: {isConnected ? 'Yes' : 'No'}</div>
          <div>Auto-connecting: {isAutoConnecting ? 'Yes' : 'No'}</div>
          <div>Auto-connect attempted: {autoConnectAttempted ? 'Yes' : 'No'}</div>
          <div>Status: {connectionStatus}</div>
          <div>Recording: {isRecording ? 'Yes' : 'No'}</div>
          <div>MediaRecorder: {mediaRecorder ? `Available (${mediaRecorder.state})` : 'Not Available'}</div>
          <div>Secure: {typeof window !== 'undefined' ? window.isSecureContext?.toString() : 'Unknown'}</div>
        </div>
      )}

      {/* Audio Recording Troubleshooting */}
      {(connectionStatus.includes('Audio recording') || connectionStatus.includes('Microphone') || connectionStatus.includes('Recording')) && connectionStatus.includes('❌') && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-900/90 text-white p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-bold mb-4">🎤 Audio Recording Issue</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Current error:</strong> {connectionStatus}</p>
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Ensure you&apos;re using HTTPS (not HTTP)</li>
              <li>Allow microphone permissions when prompted</li>
              <li>Check your microphone is connected and working</li>
              <li>Close other apps that might be using your microphone</li>
              <li>Try refreshing the page</li>
              <li>Use Chrome or Edge (best support)</li>
            </ul>
            <button 
              onClick={() => setConnectionStatus('✅ Connected and ready')}
              className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      {!isFullscreen && (
        <div className="absolute top-0 left-0 right-0 bg-[#1e1e1e] border-b border-[rgba(255,255,255,0.08)] h-[67px] z-30">
          <div className="flex items-center justify-between h-full px-7">
            {/* Left: Back button */}
            <button
              onClick={onBackAction}
              className="bg-[#303030] border border-[#535353] rounded-lg w-10 h-10 flex items-center justify-center hover:bg-[#404040] transition-colors"
            >
              <Image 
                src="/icons/home-icon.svg" 
                alt="Home" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            </button>

            {/* Right: Portfolio value, user info, menu */}
            <div className="flex items-center space-x-4">
              {/* Portfolio Value */}
              <div className="bg-[#303030] border border-[#535353] rounded-lg h-10 px-4 flex items-center">
                <span className="text-white text-sm font-medium tracking-[-0.28px]">$123.47</span>
              </div>
              
              {/* User Profile */}
              <div className="bg-[#303030] border border-[#535353] rounded-lg h-10 px-4 flex items-center space-x-2">
                <div className="w-[25px] h-[25px] bg-[#464646] rounded-full overflow-hidden">
                  {/* User avatar placeholder */}
                </div>
                <span className="text-white text-sm font-medium tracking-[-0.28px]">0xl..2i8D</span>
              </div>
              
              {/* Menu button */}
              <button className="bg-[#303030] border border-[#535353] rounded-lg w-10 h-10 flex items-center justify-center hover:bg-[#404040] transition-colors">
                <div className="flex flex-col space-y-1">
                  <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                  <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                  <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex h-screen ${isFullscreen ? 'pt-0' : 'pt-[67px]'}`}>
        {/* Left Side: Video and Info */}
        <div className={`transition-all duration-300 ${isFullscreen ? 'w-full' : showChatWindow ? 'flex-1 min-w-0' : 'w-full'} relative overflow-hidden`}>
          {/* Title and Status Bar */}
          {!isFullscreen && (
            <div className="absolute top-[30px] left-[27px] right-[27px] z-20 flex items-center justify-between">
              {/* Left: Title and Time */}
              <div className="flex items-center space-x-8">
                <h1 className="text-white text-[24px] font-semibold tracking-[0.48px]">Advisor Call</h1>
                <span className="text-[#b5b5b5] text-[14px] font-semibold">Time 1:28m</span>
              </div>

              {/* Center: APY and Risk Indicator */}
              <div className="flex items-center space-x-6">
                <span className="text-green-600 text-[14px] font-semibold">4-6% APY</span>
                
                {/* Risk dots */}
                <div className="flex items-center space-x-6">
                  <div className="flex space-x-[12px]">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-[rgba(229,231,235,0.19)] rounded-full"></div>
                    <div className="w-2 h-2 bg-[rgba(229,231,235,0.19)] rounded-full"></div>
                    <div className="w-2 h-2 bg-[rgba(229,231,235,0.19)] rounded-full"></div>
                    <div className="w-2 h-2 bg-[rgba(229,231,235,0.19)] rounded-full"></div>
                  </div>
                  <span className="text-[#b5b5b5] text-[12px]">Low Risk</span>
                </div>
              </div>

              {/* Right: Risk level dropdown */}
              <div className="relative risk-dropdown">
                <button
                  onClick={() => setShowRiskDropdown(!showRiskDropdown)}
                  className="bg-[rgba(255,255,255,0.05)] rounded-[95px] h-[41px] w-48 flex items-center justify-center hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="bg-[rgba(220,252,231,0.1)] rounded-[53px] w-[29px] h-[29px] flex items-center justify-center">
                      <Image 
                        src={`/icons/${riskLevel.toLowerCase()}-icon.svg`}
                        alt={riskLevel}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                    <span className="text-white text-[18px] font-semibold">{riskLevel}</span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-transform ${showRiskDropdown ? 'rotate-180' : ''}`}>
                      <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showRiskDropdown && (
                  <div className="absolute top-[45px] right-0 bg-[#2a2a2a] border border-[#535353] rounded-lg w-48 py-2 z-50">
                    {(['Conservative', 'Balanced', 'Aggressive'] as RiskLevel[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setRiskLevel(level)
                          setShowRiskDropdown(false)
                        }}
                        className={`w-full py-2 text-left hover:bg-[#404040] transition-colors flex items-center ${
                          riskLevel === level ? 'bg-[#404040]' : ''
                        }`}
                        style={{ paddingLeft: '24px' }}
                      >
                        <div className="flex items-center space-x-6">
                          <Image 
                            src={`/icons/${level === 'Aggressive' ? 'aggreseive' : level.toLowerCase()}-icon.svg`}
                            alt={level}
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                          <span className="text-white text-[16px] font-medium">{level}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Container - Fixed spacing: 30px (top) + 41px (dropdown height) + 24px (gap) = 95px */}
          <div className={`absolute ${isFullscreen ? 'top-0 left-0 w-full h-full rounded-none' : 'top-[95px] left-0 right-0 bottom-[140px] rounded-tr-[32px] rounded-br-[32px]'} overflow-hidden`}>
            <div className="relative w-full h-full">
              <AvatarVideo
                videoRef={videoRef}
                connectionStatus={connectionStatus}
                streamData={initialStreamData || streamData}
                isConnected={isConnected}
                onCreateStream={createHeyGenStream}
                onConnect={connectToLiveKit}
                onDisconnect={disconnect}
              />
            </div>
          </div>

          {/* Bottom Control Buttons */}
          <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 flex items-center space-x-[84px] z-20 ">
            {/* Hang Up Button (Leftmost) */}
            <button 
              onClick={() => {
                // Disconnect the stream first
                disconnect()
                // Then navigate back to advisors page
                onBackAction()
              }}
              className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
              title="Hang Up"
            >
              <Image 
                src="/icons/end-cal-icon.svg" 
                alt="End Call" 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            </button>

            {/* Voice Recording/Microphone Button (Center) */}
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAvatarSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : isAvatarSpeaking 
                    ? 'bg-[#2a2a2a] opacity-50 cursor-not-allowed'
                    : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
              }`}
              title={
                isAvatarSpeaking 
                  ? 'Cannot record while avatar is speaking' 
                  : isRecording 
                    ? 'Stop Recording' 
                    : 'Start Voice Recording'
              }
            >
              <Image 
                src="/icons/microphone-icon.svg" 
                alt="Microphone" 
                width={24} 
                height={24}
                className={`w-6 h-6 ${isRecording ? 'animate-pulse' : ''}`}
              />
            </button>

            {/* Fullscreen/Expand Button (Rightmost) */}
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              <Image 
                src="/icons/expand-icon.svg" 
                alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} 
                width={24} 
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        {/* Right Side: Chat Window */}
        {showChatWindow && !isFullscreen && (
          <div className="w-[512px] min-w-[400px] max-w-[512px] h-full pl-6 pt-[27px] pr-6 pb-6 flex-shrink-0 lg:flex hidden">
            <ChatWindow
              advisorName={advisorName}
              conversation={conversation}
              onSendMessageAction={handleUserMessage}
              onCloseAction={() => setShowChatWindow(false)}
              isAvatarSpeaking={isAvatarSpeaking}
            />
          </div>
        )}
      </div>

      {/* Mobile Chat toggle button */}
      {!showChatWindow && !isFullscreen && (
        <button
          onClick={() => setShowChatWindow(true)}
          className="absolute bottom-6 right-6 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 z-20 lg:inline-block"
        >
          Ask {advisorName}
        </button>
      )}

      {/* Mobile Chat Overlay */}
      {showChatWindow && !isFullscreen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowChatWindow(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-[90vw] bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 h-full">
              <ChatWindow
                advisorName={advisorName}
                conversation={conversation}
                onSendMessageAction={handleUserMessage}
                onCloseAction={() => setShowChatWindow(false)}
                isAvatarSpeaking={isAvatarSpeaking}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 