'use client'

import React, { useState } from 'react'
import { useHeyGen } from '../../hooks/useHeyGen'
import { useWallet } from '../../providers/WalletProvider'
import { StreamData } from '../../types'
import WalletDropdown from '../UI/WalletDropdown'

interface AdvisorSelectionPageProps {
  onNextAction: () => void
  onBackAction: () => void
  onStreamCreatedAction: (data: StreamData) => void
  onAdvisorSelectedAction: (advisor: string) => void
}

export default function AdvisorSelectionPage({ 
  onNextAction, 
  onBackAction, 
  onStreamCreatedAction, 
  onAdvisorSelectedAction 
}: AdvisorSelectionPageProps) {
  const [isCreatingStream, setIsCreatingStream] = useState<boolean>(false)
  const [connectingAdvisor, setConnectingAdvisor] = useState<string>('')

  // Add HeyGen hook to create streams
  const { streamData, connectionStatus, createHeyGenStream, setConnectionStatus } = useHeyGen()
  
  // Get wallet context for dropdown
  const { user } = useWallet()

  // Pass stream data to parent when it's available
  React.useEffect(() => {
    if (streamData) {
      console.log('✅ Stream data created, passing to parent')
      onStreamCreatedAction(streamData)
    }
  }, [streamData, onStreamCreatedAction])

  // Wallet protection check - must be AFTER all hooks
  if (!user) {
    onBackAction() // Go back to previous page (which should redirect to landing)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Redirecting to connect wallet...</p>
        </div>
      </div>
    )
  }

  const advisors = [
    {
      id: 'george',
      name: 'George Williams',
      title: 'Financial Strategist',
      experience: '12+ years experience',
      specialty: 'Growth & Tech specialist',
      availability: 'Available now',
      bgColor: 'bg-[#73c255]',
      buttonText: 'Call George'
    },
    {
      id: 'james',
      name: 'James Chen',
      title: 'Investment Advisor',
      experience: '12+ years experience',
      specialty: 'Growth & Tech specialist',
      availability: 'Available now',
      bgColor: 'bg-[#f09b83]',
      buttonText: 'Call James'
    },
    {
      id: 'jessica',
      name: 'Jessica Rodriguez',
      title: 'Portfolio Manager',
      experience: '12+ years experience',
      specialty: 'Growth & Tech specialist',
      availability: 'Available now',
      bgColor: 'bg-[#ebebeb]',
      buttonText: 'Call Jessica'
    }
  ]

  const handleCallAdvisor = async (advisorId: string, advisorName: string) => {
    try {
      setIsCreatingStream(true)
      setConnectingAdvisor(advisorId)
      setConnectionStatus('🚀 Creating stream for ' + advisorName + '...')
      
      // Create the HeyGen stream
      await createHeyGenStream()
      
      // Pass the selected advisor to parent immediately
      onAdvisorSelectedAction(advisorName)
      
      setConnectionStatus('✅ Stream created! Connecting to ' + advisorName + '...')
      setIsCreatingStream(false) // Reset creating state so useEffect can run
      
      // Small delay to show success message, then proceed
      setTimeout(() => {
        onNextAction()
      }, 1000)
      
    } catch (error) {
      console.error('Error creating stream:', error)
      setConnectionStatus('❌ Failed to create stream')
      setIsCreatingStream(false)
      setConnectingAdvisor('')
    }
  }



  return (
    <div className="min-h-screen bg-[#141414] relative">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-[rgba(255,255,255,0.08)] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBackAction}
            className="bg-[#303030] border border-[#535353] rounded-lg p-2 hover:bg-[#404040] transition-colors"
            disabled={isCreatingStream}
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">
              ←
            </div>
          </button>
          
          {/* User Profile with Dropdown */}
          <WalletDropdown position="right" />
        </div>
      </div>



      {/* Connection Status Overlay */}
      {isCreatingStream && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1b1b1b] rounded-xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">{connectionStatus}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        {/* Title Section */}
        <div className="text-center text-white mb-16 max-w-lg">
          <h1 className="text-4xl font-semibold mb-3 tracking-wide">
            Select Your Advisors
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Choose from one of our available top exports to help you build
          </p>
        </div>

        {/* Advisor Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {advisors.map((advisor) => (
            <div
              key={advisor.id}
              className={`bg-[#1b1b1b] rounded-[32px] p-6 transition-opacity duration-300 ${
                isCreatingStream ? 'opacity-50' : ''
              }`}
            >
              {/* Profile Image */}
              <div className={`${advisor.bgColor} h-[306px] w-full rounded-xl mb-[18px] overflow-hidden relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-black/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {advisor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Name and Title */}
              <div className="mb-[18px]">
                <h3 className="text-white text-lg font-semibold leading-6 mb-1.5">
                  {advisor.name}
                </h3>
                <p className="text-[#b9b9b9] text-[15px] leading-6">
                  {advisor.title}
                </p>
              </div>

              {/* Credentials */}
              <div className="space-y-4 mb-[18px]">
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-white text-sm">{advisor.experience}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 bg-green-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-white text-sm">{advisor.specialty}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3.5 h-3.5 bg-orange-500 rounded-sm flex-shrink-0"></div>
                  <span className="text-white text-sm">{advisor.availability}</span>
                </div>
              </div>

              {/* Call Button */}
              <button
                onClick={() => {
                  if (!isCreatingStream) {
                    handleCallAdvisor(advisor.id, advisor.name)
                  }
                }}
                disabled={isCreatingStream}
                className={`w-full py-3 rounded-xl text-base font-medium transition-all duration-300 cursor-pointer ${
                  isCreatingStream 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-100 hover:scale-105'
                }`}
              >
                {isCreatingStream && connectingAdvisor === advisor.id 
                  ? 'Connecting...' 
                  : advisor.buttonText
                }
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 