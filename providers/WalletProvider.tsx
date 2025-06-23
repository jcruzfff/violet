'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { createGelatoSmartWalletClient, sponsored } from '@gelatonetwork/smartwallet'
import { baseSepolia } from 'viem/chains'
import { http, createWalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

// User interface
export interface User {
  walletAddress?: string
  smartWalletAddress?: string
  isAuthenticated: boolean
  privateKey?: string // Store private key for persistence
}

// Simplified Smart Wallet Client type to avoid viem conflicts
type ExecuteParams = {
  payment: ReturnType<typeof sponsored>
  calls: Array<{ to: string; data?: string; value: bigint }>
}

type GelatoSmartWalletClient = {
  account: { address: string }
  execute: (params: ExecuteParams) => Promise<{ id: string; wait: () => Promise<string> }>
  estimate?: (params: ExecuteParams) => Promise<unknown>
} | null

// Wallet context interface
interface WalletContextType {
  user: User | null
  smartWalletClient: GelatoSmartWalletClient
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
  sendTestTransaction: () => Promise<void>
  onDisconnectCallback?: () => void
  setOnDisconnectCallback: (callback: () => void) => void
}

// Create context
const WalletContext = createContext<WalletContextType>({
  user: null,
  smartWalletClient: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
  sendTestTransaction: async () => {},
  onDisconnectCallback: undefined,
  setOnDisconnectCallback: () => {}
})

// Custom hook to use wallet context
export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

// Helper functions for localStorage
const WALLET_STORAGE_KEY = 'gelato_wallet_data'

const saveWalletToStorage = (user: User) => {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(user))
  } catch (error) {
    console.warn('Failed to save wallet to localStorage:', error)
  }
}

const loadWalletFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(WALLET_STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn('Failed to load wallet from localStorage:', error)
    return null
  }
}

const clearWalletFromStorage = () => {
  try {
    localStorage.removeItem(WALLET_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear wallet from localStorage:', error)
  }
}

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [smartWalletClient, setSmartWalletClient] = useState<GelatoSmartWalletClient>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [onDisconnectCallback, setOnDisconnectCallback] = useState<(() => void) | undefined>()

  // Use Base Sepolia as our test chain
  const testChain = baseSepolia

  // Debug environment variables
  console.log('🔧 Direct Smart Wallet Environment:')
  console.log('  - GELATO_SPONSOR_API_KEY:', process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY ? 'Set' : 'Missing')
  console.log('  - Chain ID:', testChain.id)
  console.log('  - Chain Name:', testChain.name)

  const restoreWalletFromPrivateKey = useCallback(async (privateKey: string) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GELATO_SPONSOR_API_KEY is not set')
      }

      const ownerAccount = privateKeyToAccount(privateKey as `0x${string}`)
      console.log('✅ Owner account restored:', ownerAccount.address)

      // Create a basic wallet client with viem
      const walletClient = createWalletClient({
        account: ownerAccount,
        chain: testChain,
        transport: http()
      })

      // Create Gelato Smart Wallet Client
      const gelatoClient = await createGelatoSmartWalletClient(
        walletClient as Parameters<typeof createGelatoSmartWalletClient>[0], 
        {
          apiKey: apiKey,
          scw: {
            type: "gelato"
          }
        }
      )
      
      const smartWalletAddress = gelatoClient.account.address
      
      // Type assertion to handle the interface mismatch
      setSmartWalletClient(gelatoClient as GelatoSmartWalletClient)
      
      const userData: User = {
        walletAddress: ownerAccount.address,
        smartWalletAddress: smartWalletAddress,
        isAuthenticated: true,
        privateKey: privateKey
      }
      
      setUser(userData)
      saveWalletToStorage(userData)
      console.log('✅ Wallet restored successfully!')

    } catch (error) {
      console.error('❌ Error restoring wallet:', error)
      throw error
    }
  }, [testChain])

  // Load wallet from localStorage on initialization
  useEffect(() => {
    const initializeWallet = async () => {
      const savedUser = loadWalletFromStorage()
      if (savedUser && savedUser.privateKey) {
        console.log('🔄 Restoring wallet from localStorage...')
        try {
          // Recreate the wallet client from saved private key
          await restoreWalletFromPrivateKey(savedUser.privateKey)
        } catch (error) {
          console.error('❌ Failed to restore wallet:', error)
          // Clear invalid data
          clearWalletFromStorage()
        }
      }
      setIsInitialized(true)
    }

    initializeWallet()
  }, [restoreWalletFromPrivateKey])

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      console.log('🚀 Creating Real Gelato Smart Wallet...')
      console.log('📋 Environment Check:')
      console.log('  - API Key exists:', !!process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY)
      console.log('  - Chain:', testChain.name, testChain.id)

      // Validate API key format
      const apiKey = process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY
      if (!apiKey) {
        throw new Error('NEXT_PUBLIC_GELATO_SPONSOR_API_KEY is not set')
      }
      if (apiKey.length < 20) {
        console.warn('⚠️ API key seems too short, might be invalid')
      }
      console.log('🔑 API key format check:')
      console.log('  - Length:', apiKey.length)
      console.log('  - Prefix:', apiKey.substring(0, 8) + '...')
      console.log('  - Contains numbers:', /\d/.test(apiKey))
      console.log('  - Contains letters:', /[a-zA-Z]/.test(apiKey))

      // Check if we already have a saved wallet
      const savedUser = loadWalletFromStorage()
      let privateKey: string
      
      if (savedUser && savedUser.privateKey) {
        console.log('🔄 Using existing wallet from storage')
        privateKey = savedUser.privateKey
      } else {
        console.log('🆕 Generating new wallet')
        const { generatePrivateKey } = await import('viem/accounts')
        privateKey = generatePrivateKey()
      }

      await restoreWalletFromPrivateKey(privateKey)
      console.log('🎉 Real Gelato Smart Wallet connection successful!')

    } catch (error) {
      console.error('❌ Error creating Gelato Smart Wallet:')
      console.error('  - Error message:', error instanceof Error ? error.message : String(error))
      console.error('  - Full error:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // Update setUser to also save to localStorage
  const updateUser = (userData: User | null) => {
    setUser(userData)
    if (userData) {
      saveWalletToStorage(userData)
    } else {
      clearWalletFromStorage()
    }
  }

  const sendTestTransaction = async () => {
    if (!smartWalletClient) {
      console.error('❌ No smart wallet client available')
      return
    }

    try {
      console.log('🚀 Testing Smart Wallet with deployment transaction...')
      
      // Check if client has estimate method for safer testing
      const hasEstimate = 'estimate' in smartWalletClient && typeof smartWalletClient.estimate === 'function'
      console.log('📊 Client capabilities:', { hasEstimate, hasExecute: 'execute' in smartWalletClient })
      
      // Use a simple contract interaction that doesn't require ETH balance
      // This will deploy the smart wallet if it doesn't exist
      const testRecipient = smartWalletClient.account.address // Send to self
      
      console.log('📋 Transaction details:')
      console.log('  - From (Smart Wallet):', smartWalletClient.account.address)
      console.log('  - To (Self - Deployment Test):', testRecipient)
      console.log('  - Value: 0 ETH (deployment only)')
      console.log('  - Payment: Sponsored by Gelato')
      console.log('  - API Key exists:', !!process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY)
      
      const transactionParams = {
        payment: sponsored(process.env.NEXT_PUBLIC_GELATO_SPONSOR_API_KEY as string),
        calls: [
          {
            to: testRecipient, // Send to self
            data: "0x", // Empty data
            value: BigInt('0'), // Zero value - just deploy the wallet
          }
        ]
      }
      
      // Try gas estimation first if available
      if (hasEstimate) {
        try {
          console.log('🔍 Estimating gas first...')
          const gasEstimate = await smartWalletClient.estimate!(transactionParams)
          console.log('✅ Gas estimation successful:', gasEstimate)
        } catch (estimateError) {
          console.log('⚠️ Gas estimation failed, proceeding with direct execution...')
          console.log('  - Estimate error:', estimateError instanceof Error ? estimateError.message : String(estimateError))
        }
      }
      
      // Send a zero-value sponsored transaction to deploy the wallet
      console.log('📤 Executing transaction...')
      const results = await smartWalletClient.execute(transactionParams)

      console.log('✅ Smart Wallet deployment/test transaction submitted!')
      console.log('  - UserOp ID:', results.id)
      console.log('  - Results object keys:', Object.keys(results))
      
      // Wait for transaction confirmation
      console.log('⏳ Waiting for transaction confirmation...')
      const txHash = await results.wait()
      console.log('✅ Transaction confirmed!')
      console.log('  - Transaction hash:', txHash)
      console.log('  - Explorer link: https://sepolia.basescan.org/tx/' + txHash)
      console.log('🎉 Smart wallet is now deployed and ready!')

    } catch (error) {
      console.error('❌ Error with smart wallet transaction:')
      console.error('  - Error message:', error instanceof Error ? error.message : String(error))
      console.error('  - Error type:', typeof error)
      console.error('  - Full error:', error)
      
      // Enhanced error analysis
      if (error instanceof Error) {
        const errorMsg = error.message.toLowerCase()
        
        if (errorMsg.includes('execution reverted')) {
          console.log('💡 Execution Reverted - Possible causes:')
          console.log('  - Smart wallet deployment failed')
          console.log('  - Invalid API key or rate limit exceeded')
          console.log('  - Network/RPC issues with Base Sepolia')
          console.log('  - Gelato relayer temporarily unavailable')
          
          // Try to extract more specific error information
          if (error.message.includes('AA')) {
            console.log('🔍 Account Abstraction Error Code detected:')
            if (error.message.includes('AA10')) console.log('  - AA10: sender already constructed')
            if (error.message.includes('AA13')) console.log('  - AA13: initCode failed or OOG')
            if (error.message.includes('AA21')) console.log('  - AA21: didn\'t pay prefund')
            if (error.message.includes('AA23')) console.log('  - AA23: reverted (or OOG)')
            if (error.message.includes('AA24')) console.log('  - AA24: signature error')
          }
        }
        
        if (errorMsg.includes('estimate gas') || errorMsg.includes('gas')) {
          console.log('💡 Gas Estimation Failed:')
          console.log('  - This usually means the transaction would fail on-chain')
          console.log('  - Try with a simpler transaction or check API key')
          console.log('  - Network might be congested or having issues')
        }
        
        if (errorMsg.includes('invalid signature') || errorMsg.includes('unauthorized')) {
          console.log('💡 Authorization Error:')
          console.log('  - Check if API key is valid and has correct permissions')
          console.log('  - Verify sponsor API key matches Gelato dashboard')
        }
        
        if (errorMsg.includes('insufficient')) {
          console.log('💡 Insufficient Balance:')
          console.log('  - Gelato sponsor might be out of funds')
          console.log('  - Check Gelato dashboard for sponsor balance')
        }
        
        if (errorMsg.includes('rate limit') || errorMsg.includes('429')) {
          console.log('💡 Rate Limiting:')
          console.log('  - Gelato API rate limit exceeded')
          console.log('  - Wait a moment and try again')
        }
      }
      
      // Try to provide actionable next steps
      console.log('🔧 Troubleshooting steps:')
      console.log('  1. Verify NEXT_PUBLIC_GELATO_SPONSOR_API_KEY is correct')
      console.log('  2. Check Gelato dashboard for sponsor status')
      console.log('  3. Try again in a few moments (network issues)')
      console.log('  4. Check Base Sepolia RPC status')
      console.log('  5. Verify API key has Base Sepolia permissions')
    }
  }

  const disconnectWallet = () => {
    updateUser(null)
    setSmartWalletClient(null)
    console.log('🔌 Wallet disconnected and cleared from storage')
    
    // Call the disconnect callback if it exists
    if (onDisconnectCallback) {
      onDisconnectCallback()
    }
  }

  // Don't render children until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Initializing wallet...</p>
        </div>
      </div>
    )
  }

  return (
    <WalletContext.Provider
      value={{
        user,
        smartWalletClient,
        connectWallet,
        disconnectWallet,
        isConnecting,
        sendTestTransaction,
        onDisconnectCallback,
        setOnDisconnectCallback
      }}
    >
      {children}
    </WalletContext.Provider>
  )
} 