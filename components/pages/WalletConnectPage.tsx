'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWallet } from '../../providers/WalletProvider'

interface WalletConnectPageProps {
  onNextAction: () => void
}

export default function WalletConnectPage({ onNextAction }: WalletConnectPageProps) {
  const { user, smartWalletClient, connectWallet, isConnecting, sendTestTransaction } = useWallet()
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentComplete, setDeploymentComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState<'connecting' | 'deploying' | 'complete'>('connecting')

  // Wrap onNextAction in useCallback to prevent dependency issues
  const handleNextAction = useCallback(() => {
    onNextAction()
  }, [onNextAction])

  // Auto-connect when component mounts (coming from landing page)
  useEffect(() => {
    const autoConnect = async () => {
      if (!user && !isConnecting) {
        console.log('🚀 Auto-connecting wallet from landing page...')
        await connectWallet()
      }
    }
    autoConnect()
  }, [user, isConnecting, connectWallet])

  // Auto-deploy smart wallet after connection
  useEffect(() => {
    const autoDeploy = async () => {
      if (user && smartWalletClient && !deploymentComplete && !isDeploying) {
        console.log('🚀 Auto-deploying smart wallet...')
        setCurrentStep('deploying')
        setIsDeploying(true)
        
        try {
          // Send the deployment transaction automatically
          await sendTestTransaction()
          setDeploymentComplete(true)
          setCurrentStep('complete')
          console.log('✅ Smart wallet deployed successfully!')
          
          // Auto-advance to portfolio after successful deployment
          setTimeout(() => {
            handleNextAction()
          }, 2000)
          
        } catch (error) {
          console.error('❌ Deployment failed:', error)
          setCurrentStep('complete') // Still allow manual continuation
        } finally {
          setIsDeploying(false)
        }
      }
    }
    autoDeploy()
  }, [user, smartWalletClient, deploymentComplete, isDeploying, sendTestTransaction, handleNextAction])

  const getStatusMessage = () => {
    if (currentStep === 'connecting') {
      return {
        title: 'Creating Your Smart Wallet',
        message: 'Setting up your secure, gasless wallet...',
        status: 'Creating...'
      }
    } else if (currentStep === 'deploying') {
      return {
        title: 'Deploying Smart Wallet',
        message: 'Deploying your wallet to the blockchain with sponsored gas...',
        status: 'Deploying...'
      }
    } else {
      return {
        title: 'Smart Wallet Ready!',
        message: 'Your wallet has been created and deployed successfully.',
        status: '✅ Ready'
      }
    }
  }

  const statusInfo = getStatusMessage()

  return (
    <div className="min-h-screen bg-[#141414] relative overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#141414] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="absolute inset-0 bg-[url('/icons/bg-hero3.svg')] bg-cover bg-center opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-center text-white max-w-lg">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 tracking-wide">
            {statusInfo.title}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-12">
            {statusInfo.message}
          </p>

          {/* Progress Card */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 mb-8">
            {/* Loading Animation */}
            <div className="flex items-center justify-center mb-6">
              {currentStep !== 'complete' ? (
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#B38D5F]/30 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#B38D5F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              )}
            </div>

            {/* Status Info */}
            <div className="space-y-4">
              <div className="text-left">
                <p className="text-sm text-gray-400 mb-1">Status:</p>
                <p className={`font-medium ${currentStep === 'complete' ? 'text-green-400' : 'text-[#B38D5F]'}`}>
                  {statusInfo.status}
                </p>
              </div>

              {user && (
                <>
                  <div className="text-left">
                    <p className="text-sm text-gray-400 mb-1">Owner Address:</p>
                    <p className="text-blue-400 font-mono text-sm break-all">{user.walletAddress}</p>
                  </div>
                  
                  <div className="text-left">
                    <p className="text-sm text-gray-400 mb-1">Smart Wallet Address:</p>
                    <p className="text-[#B38D5F] font-mono text-sm break-all">{user.smartWalletAddress}</p>
                  </div>
                </>
              )}

              {currentStep === 'complete' && (
                <div className="text-left">
                  <p className="text-sm text-gray-400 mb-1">Blockchain:</p>
                  <p className="text-green-400">Base Sepolia (Testnet)</p>
                </div>
              )}
            </div>

            {/* Manual Continue Button (if auto-advance fails) */}
            {currentStep === 'complete' && (
              <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
                <button
                  onClick={handleNextAction}
                  className="w-full bg-[#B38D5F] text-white py-3 rounded-xl text-base font-medium hover:bg-[#B38D5F]/80 transition-all duration-300"
                >
                  Continue to Portfolio →
                </button>
              </div>
            )}
          </div>

          {/* Footer Message */}
          <p className="text-gray-500 text-sm">
            {currentStep === 'complete' 
              ? 'Redirecting to your portfolio...' 
              : 'This may take a few moments'
            }
          </p>
        </div>
      </div>
    </div>
  )
} 