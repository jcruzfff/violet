'use client'

import React, { useState, useEffect } from 'react'
import { StreamData } from '../types'
import { WalletProvider } from '../providers/WalletProvider'
import WalletConnectPage from '../components/pages/WalletConnectPage'
import PortfolioPage from '../components/pages/PortfolioPage'
import AdvisorSelectionPage from '../components/pages/AdvisorSelectionPage'
import CallPage from '../components/pages/CallPage'

// Main App Component
export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('')

  // Debug step changes
  useEffect(() => {
    console.log('📍 App: Current step changed to:', currentStep)
  }, [currentStep])

  const nextStep = () => {
    console.log('⏭️ App: nextStep called, current:', currentStep)
    setCurrentStep(prev => {
      const newStep = Math.min(prev + 1, 4)
      console.log('➡️ App: Moving to step:', newStep)
      return newStep
    })
  }

  const prevStep = () => {
    console.log('⏮️ App: prevStep called, current:', currentStep)
    setCurrentStep(prev => {
      const newStep = Math.max(prev - 1, 1)
      console.log('⬅️ App: Moving to step:', newStep)
      return newStep
    })
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
    <WalletProvider>
      <div>
        {currentStep === 1 && <WalletConnectPage onNextAction={nextStep} />}
        {currentStep === 2 && <PortfolioPage onNext={nextStep} onBack={prevStep} />}
        {currentStep === 3 && (
          <AdvisorSelectionPage 
            onNext={nextStep} 
            onBack={prevStep}
            onStreamCreated={handleStreamCreated}
            onAdvisorSelected={handleAdvisorSelected}
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
    </WalletProvider>
  )
} 