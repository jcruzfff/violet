'use client'

import React, { useState } from 'react'
import { StreamData } from '../types'
import LandingPage from '../components/pages/LandingPage'
import PortfolioPage from '../components/pages/PortfolioPage'
import AdvisorSelectionPage from '../components/pages/AdvisorSelectionPage'
import CallPage from '../components/pages/CallPage'

// Main App Component
export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [streamData, setStreamData] = useState<StreamData | null>(null)
  const [selectedAdvisor, setSelectedAdvisor] = useState<string>('')

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
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
      {currentStep === 1 && <LandingPage onNext={nextStep} />}
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
  )
} 