import { useState, useEffect } from 'react'
import Image from 'next/image'

interface InvestmentSetupOverlayProps {
  onSave: (settings: InvestmentSettings) => void
  isVisible: boolean
}

export interface InvestmentSettings {
  investmentAmount: number
  riskLevel: 'Conservative' | 'Balanced' | 'Aggressive'
  timeHorizon: '3-months' | '6-months' | '1-year' | '3-years' | '5-years'
}

export default function InvestmentSetupOverlay({ onSave, isVisible }: InvestmentSetupOverlayProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [investmentAmount, setInvestmentAmount] = useState<string>('')
  const [riskLevel, setRiskLevel] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Conservative')
  const [timeHorizon, setTimeHorizon] = useState<'3-months' | '6-months' | '1-year' | '3-years' | '5-years'>('1-year')
  const [showRiskDropdown, setShowRiskDropdown] = useState<boolean>(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ amount?: string }>({})

  // Portfolio color scheme from PortfolioPage
  const portfolioColors = {
    primary: '#507084', // Augusta Blue
    secondary: '#66A3A3', // Trevi
    accent: '#B38D5F', // Crown Gold
    neutral: '#7B7B7B' // Pantheon
  }

  // Time horizon options
  const timeOptions = [
    { value: '3-months', label: '3 Months', description: 'Short-term' },
    { value: '6-months', label: '6 Months', description: 'Short-term' },
    { value: '1-year', label: '1 Year', description: 'Medium-term' },
    { value: '3-years', label: '3 Years', description: 'Long-term' },
    { value: '5-years', label: '5 Years', description: 'Long-term' },
  ] as const

  // Risk level options - removed colors since we're not using backgrounds
  const riskLevels = [
    { value: 'Conservative', icon: 'conservative', description: 'Low risk, stable returns' },
    { value: 'Balanced', icon: 'balanced', description: 'Moderate risk, balanced growth' },
    { value: 'Aggressive', icon: 'aggreseive', description: 'High risk, high potential returns' },
  ] as const

  // Handle input validation
  const validateAmount = (value: string) => {
    const numValue = parseFloat(value)
    if (!value || value.trim() === '') {
      return 'Investment amount is required'
    }
    if (isNaN(numValue) || numValue <= 0) {
      return 'Please enter a valid amount greater than 0'
    }
    if (numValue < 100) {
      return 'Minimum investment amount is $100'
    }
    return null
  }

  // Handle continue to step 2
  const handleContinue = () => {
    setCurrentStep(2)
  }

  // Handle back to step 1
  const handleBack = () => {
    setCurrentStep(1)
  }

  // Handle save
  const handleSave = () => {
    const amountError = validateAmount(investmentAmount)
    
    if (amountError) {
      setErrors({ amount: amountError })
      return
    }

    const settings: InvestmentSettings = {
      investmentAmount: parseFloat(investmentAmount),
      riskLevel,
      timeHorizon
    }

    onSave(settings)
  }

  // Reset to step 1 when overlay closes/opens
  useEffect(() => {
    if (isVisible) {
      setCurrentStep(1)
    }
  }, [isVisible])

  // Clear errors when amount changes
  useEffect(() => {
    if (errors.amount && investmentAmount) {
      const error = validateAmount(investmentAmount)
      if (!error) {
        setErrors(prev => ({ ...prev, amount: undefined }))
      }
    }
  }, [investmentAmount, errors.amount])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.risk-dropdown')) {
        setShowRiskDropdown(false)
      }
      if (!target.closest('.time-dropdown')) {
        setShowTimeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!isVisible) return null

  // Step 1: Welcome Screen
  const renderWelcomeStep = () => (
    <div className="bg-[#1e1e1e] rounded-[24px] max-w-md w-full mx-auto border border-[#404040] shadow-2xl">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="text-center">
          <h2 className="text-white text-2xl font-semibold mb-6">Welcome to Coinadvisor</h2>

        </div>
      </div>

      {/* Welcome Image - Full Width */}
      <div className="h-48 mb-6 overflow-hidden">
        <Image
          src="/welcome-image.png"
          alt="Welcome to Coinadvisor"
          width={400}
          height={192}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Welcome Content */}
      <div className="p-6 pt-0">

        {/* Welcome Text */}
        <div className="text-center mb-8">
          <h3 className="text-white text-lg font-semibold mb-3">
            Easily build a balanced portfolio.
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            We&apos;ll help you set up your investment preferences based on your goals, risk tolerance, and time horizon. 
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-[#507084] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm">Personalized investment recommendations</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-[#66A3A3] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm">AI-powered portfolio optimization</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-[#B38D5F] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-gray-300 text-sm">Real-time market insights & advice</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <button
          onClick={handleContinue}
          className="w-full bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )

  // Step 2: Investment Configuration
  const renderConfigurationStep = () => (
    <div className="bg-[#1e1e1e] rounded-2xl max-w-md w-full mx-auto border border-[#404040] shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-[#404040]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-white text-2xl font-semibold mb-1">Investment Setup</h2>
              <p className="text-gray-400 text-sm">Configure your investment preferences</p>
            </div>
          </div>
         
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Investment Amount */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Investment Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="0.00"
              className={`w-full bg-[#272727] border rounded-lg pl-8 pr-12 py-3 text-white text-lg focus:outline-none transition-all number-input ${
                errors.amount 
                  ? 'border-red-500 focus:bg-[#3a2a2a]' 
                  : 'border-[#404040] focus:bg-[#2f2f2f] focus:border-[#505050]'
              }`}
              min="0"
              step="0.01"
              style={{
                /* Hide default number input spinners */
                WebkitAppearance: 'textfield',
                MozAppearance: 'textfield'
              }}
            />
            {/* Custom up/down controls */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  const currentValue = parseFloat(investmentAmount) || 0
                  setInvestmentAmount((currentValue + 100).toString())
                }}
                className="w-6 h-3 bg-[#404040] hover:bg-[#505050] rounded-t flex items-center justify-center transition-colors"
              >
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentValue = parseFloat(investmentAmount) || 0
                  const newValue = Math.max(0, currentValue - 100)
                  setInvestmentAmount(newValue.toString())
                }}
                className="w-6 h-3 bg-[#404040] hover:bg-[#505050] rounded-b flex items-center justify-center transition-colors"
              >
                <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Minimum investment: $100</p>
        </div>

        {/* Risk Level Dropdown */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Risk Management Level
          </label>
          <div className="relative risk-dropdown">
            <button
              onClick={() => setShowRiskDropdown(!showRiskDropdown)}
              className="w-full bg-[#272727] border border-[#404040] rounded-lg p-3 flex items-center justify-between hover:bg-[#2f2f2f] transition-colors focus:outline-none focus:bg-[#2f2f2f] focus:border-[#505050]"
            >
              <div className="flex items-center space-x-3">
                {/* Icon without background */}
                <Image 
                  src={`/icons/${riskLevels.find(r => r.value === riskLevel)?.icon}-icon.svg`}
                  alt={riskLevel}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{riskLevel}</p>
                  <p className="text-gray-400 text-xs">{riskLevels.find(r => r.value === riskLevel)?.description}</p>
                </div>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${showRiskDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Risk Dropdown Menu */}
            {showRiskDropdown && (
              <div className="absolute top-full mt-1 w-full bg-[#2a2a2a] border border-[#404040] rounded-lg py-2 z-50 shadow-xl">
                {riskLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => {
                      setRiskLevel(level.value)
                      setShowRiskDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#404040] transition-colors flex items-center space-x-3 ${
                      riskLevel === level.value ? 'bg-[#404040]' : ''
                    }`}
                  >
                    {/* Icon without background */}
                    <Image 
                      src={`/icons/${level.icon}-icon.svg`}
                      alt={level.value}
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-white text-sm font-medium">{level.value}</p>
                      <p className="text-gray-400 text-xs">{level.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time Horizon Dropdown */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Investment Time Horizon
          </label>
          <div className="relative time-dropdown">
            <button
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="w-full bg-[#272727] border border-[#404040] rounded-lg p-3 flex items-center justify-between hover:bg-[#2f2f2f] transition-colors focus:outline-none focus:bg-[#2f2f2f] focus:border-[#505050]"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: portfolioColors.neutral }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{timeOptions.find(t => t.value === timeHorizon)?.label}</p>
                  <p className="text-gray-400 text-xs">{timeOptions.find(t => t.value === timeHorizon)?.description}</p>
                </div>
              </div>
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Time Dropdown Menu */}
            {showTimeDropdown && (
              <div className="absolute top-full mt-1 w-full bg-[#2a2a2a] border border-[#404040] rounded-lg py-2 z-50 shadow-xl">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTimeHorizon(option.value)
                      setShowTimeDropdown(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-[#404040] transition-colors flex items-center space-x-3 ${
                      timeHorizon === option.value ? 'bg-[#404040]' : ''
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: portfolioColors.neutral }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{option.label}</p>
                      <p className="text-gray-400 text-xs">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-[#404040] flex space-x-3">
        <button
          onClick={handleBack}
          className="flex-1 bg-[#272727] border border-[#404040] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#2f2f2f] transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-white text-black py-3 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {currentStep === 1 ? renderWelcomeStep() : renderConfigurationStep()}
    </div>
  )
} 