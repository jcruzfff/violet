'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ConversationMessage } from '../../types'

interface ChatWindowProps {
  advisorName: string
  conversation: ConversationMessage[]
  onSendMessageAction: (message: string) => void
  onCloseAction: () => void
  isAvatarSpeaking: boolean
  showChart?: boolean
  showActionButtons?: boolean
}

export default function ChatWindow({ 
  advisorName, 
  conversation, 
  onSendMessageAction, 
  onCloseAction,
  isAvatarSpeaking,
  showChart = false,
  showActionButtons = false
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (messageInput.trim() && !isAvatarSpeaking) {
      onSendMessageAction(messageInput.trim())
      setMessageInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Get the latest message for timestamp display
  const latestMessage = conversation[conversation.length - 1]
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  // Format timestamp
  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return 'now'
    const now = new Date()
    const diff = Math.floor((now.getTime() - timestamp.getTime()) / 1000 / 60) // minutes
    if (diff < 1) return 'now'
    if (diff < 60) return `${diff}m`
    if (diff < 1440) return `${Math.floor(diff / 60)}h`
    return `${Math.floor(diff / 1440)}d`
  }

  return (
    <div className="backdrop-blur-[63px] backdrop-filter bg-[#1b1b1b] overflow-hidden relative rounded-[32px] w-full h-full max-w-[512px]">
      {/* Header */}
      <div className="absolute left-6 top-[18px] right-12">
        <h2 className="font-semibold text-white text-[24px] tracking-[-0.456px] leading-[1.5] truncate">
          Ask {advisorName}
        </h2>
      </div>

      {/* Close Button */}
      <button
        onClick={onCloseAction}
        className="absolute right-6 top-6 w-6 h-6 flex items-center justify-center text-white hover:text-gray-300 transition-colors flex-shrink-0"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 1L1 11M1 1L11 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Avatar Info */}
      <div className="absolute left-6 top-[82px] right-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-[41px] h-[41px] bg-[#626262] rounded-full mr-4 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">
                {advisorName.charAt(0)}
              </span>
            </div>
            {/* Name */}
            <div className="font-bold text-white text-[16px] leading-[1.2]">
              {advisorName.split(' ')[0]}
            </div>
          </div>
          {/* Timestamp */}
          <div className="font-normal text-[#9a9a9a] text-[16px] leading-[24px] flex-shrink-0">
            {formatTimestamp(latestMessage?.timestamp)}
          </div>
        </div>
      </div>

      {/* Graph/Chart Area - Only show when needed */}
      {showChart && (
        <div className="absolute left-6 top-[147px] right-6 h-[340px] overflow-hidden">
          <div className="bg-[#323232] w-full h-full rounded-[17px] flex items-center justify-center">
            <span className="text-[#9a9a9a] text-sm">Chart visualization area</span>
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`absolute left-[30px] right-[30px] ${showChart ? 'top-[510px]' : 'top-[147px]'} bottom-[140px] overflow-y-auto`}>
        <div className="space-y-4">
          {conversation.length === 0 ? (
            <div className="font-normal text-white text-[16px] leading-[24px] w-full">
              <p className="text-[#9a9a9a]">Start a conversation...</p>
            </div>
          ) : (
            conversation.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${
                  message.role === 'user' 
                    ? 'bg-white text-black rounded-l-2xl rounded-tr-2xl rounded-br-md' 
                    : 'bg-transparent text-white'
                } p-3`}>
                  <div className="font-normal text-[16px] leading-[24px] whitespace-pre-wrap">
                    {message.message}
                  </div>
                </div>
              </div>
                          ))
            )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Action Buttons - Only show when needed */}
      {showActionButtons && (
        <div className="absolute left-6 right-6 bottom-[116px] flex gap-[4px]">
          <button className="bg-white rounded-xl flex-1 h-[44px] flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="font-medium text-black text-[16px]">Pass</span>
          </button>
          <button className="bg-white rounded-xl flex-1 h-[44px] flex items-center justify-center hover:bg-gray-100 transition-colors">
            <span className="font-medium text-black text-[16px]">Buy</span>
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="absolute bottom-6 left-6 right-6 h-16">
        <div className="bg-[rgba(121,121,121,0.14)] border border-[#3e3e3e] rounded-[60px] h-full w-full relative">
          <div className="absolute left-6 top-4 right-6 flex items-center justify-between">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send message"
              disabled={isAvatarSpeaking}
              className="bg-transparent text-white text-[16px] font-normal leading-[24px] outline-none flex-1 placeholder:text-white mr-4"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isAvatarSpeaking}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Image
                src="/icons/send-icon.svg"
                alt="Send"
                width={20}
                height={20}
                className="w-8 h-8"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 