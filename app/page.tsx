'use client'

import { useState, useCallback } from 'react'
import { AvatarVideo } from '../components/Avatar/AvatarVideo'
import { TextChat } from '../components/UI/TextChat'
import { useHeyGen } from '../hooks/useHeyGen'
import { useLiveKit } from '../hooks/useLiveKit'
import { useOpenAI } from '../hooks/useOpenAI'
import { ConversationMessage, AIMode } from '../types'

// Step Components
function LandingPage({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl px-6">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Finance Advice
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Get personalized financial guidance from our AI-powered advisors. 
          Build your wealth with expert insights tailored to your goals.
        </p>
        <button
          onClick={onNext}
          className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

function PortfolioPage({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#141414] relative">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-[rgba(255,255,255,0.08)] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="bg-[#303030] border border-[#535353] rounded-lg p-2 hover:bg-[#404040] transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">
              ←
            </div>
          </button>
          
          {/* User Profile */}
          <div className="bg-[#303030] border border-[#535353] rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#464646] rounded-full"></div>
            <span className="text-white text-sm font-medium">0xl..2i8D</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        {/* Title Section */}
        <div className="text-center text-white mb-12 max-w-lg">
          <h1 className="text-4xl font-semibold mb-3 tracking-wide">
            Portfolio Advisors
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Choose from one of our available top exports to help you build
          </p>
        </div>

        {/* Portfolio Chart */}
        <div className="relative mb-8">
          <div className="w-[341px] h-[341px] relative flex items-center justify-center">
            {/* Donut Chart Background */}
            <div className="absolute inset-0 rounded-full border-[40px] border-gray-600"></div>
            <div className="absolute inset-0 rounded-full border-[40px] border-transparent"
                 style={{
                   background: `conic-gradient(
                     from 0deg,
                     #f97316 0deg 144deg,
                     #2563eb 144deg 252deg,
                     #7c3aed 252deg 324deg,
                     #10b981 324deg 360deg
                   )`,
                   borderRadius: '50%',
                   mask: 'radial-gradient(circle, transparent 120px, black 120px, black 170px, transparent 170px)'
                 }}>
            </div>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[#49474a] text-lg mb-2">Total Value</p>
              <p className="text-[#b6b4b7] text-3xl font-semibold tracking-wider">$24,567</p>
            </div>
          </div>
        </div>

        {/* Call Advisor Button */}
        <button
          onClick={onNext}
          className="bg-white text-black px-16 py-3 rounded-xl text-base font-medium hover:bg-gray-100 transition-all duration-300 mb-12"
        >
          Call Advisor
        </button>

        {/* Portfolio Items Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-6">
          {/* Bitcoin */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">₿</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Bitcoin</p>
                <p className="text-[#d6d6d6] text-xs">BTC • 40%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$9,827</p>
              <p className="text-green-600 text-xs">+5.2%</p>
            </div>
          </div>

          {/* Solana */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">◎</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Solana</p>
                <p className="text-[#d6d6d6] text-xs">SOL • 20%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$4,913</p>
              <p className="text-green-600 text-xs">+12.7%</p>
            </div>
          </div>

          {/* Ethereum */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">Ξ</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Ethereum</p>
                <p className="text-[#d6d6d6] text-xs">ETH • 30%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$7,370</p>
              <p className="text-green-600 text-xs">+8.1%</p>
            </div>
          </div>

          {/* Cardano */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">₳</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Cardano</p>
                <p className="text-[#d6d6d6] text-xs">ADA • 10%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$2,457</p>
              <p className="text-red-500 text-xs">-2.1%</p>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-[#3a3a3a] rounded-xl p-6 flex items-center space-x-4 max-w-2xl w-full">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-4 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm opacity-80"></div>
            </div>
          </div>
          <div>
            <p className="text-white text-base font-semibold">AI Recommendation</p>
            <p className="text-[#d6d6d6] text-sm">Optimized portfolio package</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdvisorSelectionPage({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('')

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

  return (
    <div className="min-h-screen bg-[#141414] relative">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-[rgba(255,255,255,0.08)] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="bg-[#303030] border border-[#535353] rounded-lg p-2 hover:bg-[#404040] transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">
              ←
            </div>
          </button>
          
          {/* User Profile */}
          <div className="bg-[#303030] border border-[#535353] rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#464646] rounded-full"></div>
            <span className="text-white text-sm font-medium">0xl..2i8D</span>
          </div>
        </div>
      </div>

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
              className={`bg-[#1b1b1b] rounded-[32px] p-6 cursor-pointer transition-all duration-300 border-2 ${
                selectedAdvisor === advisor.id
                  ? 'border-[#4318FF] scale-105'
                  : 'border-transparent hover:border-gray-600'
              }`}
              onClick={() => setSelectedAdvisor(advisor.id)}
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
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedAdvisor(advisor.id)
                  onNext()
                }}
                className="w-full bg-white text-black py-3 rounded-xl text-base font-medium hover:bg-gray-100 transition-all duration-300"
              >
                {advisor.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex space-x-4 mt-12">
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-6 py-3 rounded-full text-lg hover:bg-gray-700 transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!selectedAdvisor}
            className={`px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              selectedAdvisor
                ? 'bg-[#4318FF] text-white hover:bg-[#3614CC]'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            Start Call
          </button>
        </div>
      </div>
    </div>
  )
}

function CallPage({ onBack }: { onBack: () => void }) {
  // State
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false)
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [aiMode, setAiMode] = useState<AIMode>('heygen')

  // Custom hooks
  const { streamData, connectionStatus, createHeyGenStream, sendTextToAvatar, setConnectionStatus } = useHeyGen()
  const { videoRef, isConnected, connectToLiveKit, disconnect } = useLiveKit(streamData, setConnectionStatus)
  const { generateOpenAIResponse } = useOpenAI()

  // Message handling
  const handleUserMessage = useCallback(async (userMessage: string) => {
    try {
      setIsAvatarSpeaking(true)
      setConnectionStatus('🤖 Avatar thinking...')
      
      // Add user message to conversation
      setConversation(prev => [...prev, { role: 'user', message: userMessage }])
      
      if (aiMode === 'heygen') {
        // Use HeyGen's built-in AI with 'talk' task type
        await sendTextToAvatar(userMessage, 'talk')
      } else {
        // Use OpenAI and then make avatar repeat the response
        setConnectionStatus('🤖 Consulting OpenAI...')
        const aiResponse = await generateOpenAIResponse(userMessage)
        
        // Add AI response to conversation
        setConversation(prev => [...prev, { role: 'avatar', message: aiResponse }])
        
        // Make avatar speak the OpenAI response
        await sendTextToAvatar(aiResponse, 'repeat')
      }
      
    } catch (error) {
      console.error('Error handling user message:', error)
      setConnectionStatus('❌ Error processing message')
    } finally {
      setIsAvatarSpeaking(false)
    }
  }, [sendTextToAvatar, aiMode, generateOpenAIResponse, setConnectionStatus])

  return (
    <div className="relative">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-10 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300"
      >
        ← Back to Advisors
      </button>
      
      <AvatarVideo
        videoRef={videoRef}
        connectionStatus={connectionStatus}
        streamData={streamData}
        isConnected={isConnected}
        onCreateStream={createHeyGenStream}
        onConnect={connectToLiveKit}
        onDisconnect={disconnect}
      />
      
      <TextChat
        isConnected={isConnected}
        conversation={conversation}
        aiMode={aiMode}
        onSendMessage={handleUserMessage}
        onAiModeChange={setAiMode}
        isAvatarSpeaking={isAvatarSpeaking}
      />
    </div>
  )
}

// Main App Component
export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1)

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  return (
    <div>
      {currentStep === 1 && <LandingPage onNext={nextStep} />}
      {currentStep === 2 && <PortfolioPage onNext={nextStep} onBack={prevStep} />}
      {currentStep === 3 && <AdvisorSelectionPage onNext={nextStep} onBack={prevStep} />}
      {currentStep === 4 && <CallPage onBack={prevStep} />}
    </div>
  )
} 