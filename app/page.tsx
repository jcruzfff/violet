'use client'

import React, { useState, useEffect } from 'react'
import { StreamData } from '../types'
import { WalletProvider, useWallet } from '../providers/WalletProvider'
import LandingPage from '../components/pages/LandingPage'
import WalletConnectPage from '../components/pages/WalletConnectPage'
import PortfolioPage from '../components/pages/PortfolioPage'
import AdvisorSelectionPage from '../components/pages/AdvisorSelectionPage'
import CallPage from '../components/pages/CallPage'

// App Content Component (needs to be inside WalletProvider)
function AppContent() {
  const [currentStep, setCurrentStep] = useState<number>(0) // Start with Landing Page
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('')
  const { setOnDisconnectCallback, user } = useWallet()

  // Set up disconnect callback to return to landing page
  useEffect(() => {
    setOnDisconnectCallback(() => {
      console.log('🏠 App: Wallet disconnected, returning to landing page')
      setCurrentStep(0)
    })
  }, [setOnDisconnectCallback])

  // Wallet protection: redirect to landing if not connected and trying to access protected pages
  useEffect(() => {
    if (!user && currentStep > 1) {
      console.log('🔒 App: No wallet connected, redirecting to landing page')
      setCurrentStep(0)
    }
  }, [user, currentStep])

  // Debug step changes
  useEffect(() => {
    console.log('📍 App: Current step changed to:', currentStep)
  }, [currentStep])

  const nextStep = () => {
    console.log('⏭️ App: nextStep called, current:', currentStep)
    setCurrentStep(prev => {
      // Don't allow advancing to protected pages without wallet connection
      if (prev === 1 && !user) {
        console.log('🔒 App: Cannot advance without wallet connection')
        return prev
      }
      const newStep = Math.min(prev + 1, 4)
      console.log('➡️ App: Moving to step:', newStep)
      return newStep
    })
  }

  const prevStep = () => {
    console.log('⏮️ App: prevStep called, current:', currentStep)
    setCurrentStep(prev => {
      const newStep = Math.max(prev - 1, 0)
      console.log('⬅️ App: Moving to step:', newStep)
      return newStep
    })
  }

  // Handle back to landing on wallet disconnect
  const backToLanding = () => {
    console.log('🏠 App: Returning to landing page')
    setCurrentStep(0)
  }

  // Debug stream data updates
  const handleStreamCreated = (data: StreamData) => {
    console.log('✅ App: Stream data received')
    setStreamData(data)
  }

  const handleAdvisorSelected = (advisor: string) => {
    console.log('✅ App: Advisor selected:', advisor)
    setSelectedAdvisor(advisor)
  }

  return (
    <div>
      {currentStep === 0 && <LandingPage onNext={nextStep} />}
      {currentStep === 1 && <WalletConnectPage onNextAction={nextStep} />}
      {currentStep === 2 && <PortfolioPage onNext={nextStep} onBack={backToLanding} />}
      {currentStep === 3 && (
        <AdvisorSelectionPage 
          onNextAction={nextStep} 
          onBackAction={prevStep}
          onStreamCreatedAction={handleStreamCreated}
          onAdvisorSelectedAction={handleAdvisorSelected}
        />
      )}
      {currentStep === 4 && (
        <CallPage 
          onBackAction={prevStep} 
          initialStreamData={streamData}
          advisorName={selectedAdvisor}
        />
      )}
    </div>
  )
}

// Main App Component
export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  )
} 