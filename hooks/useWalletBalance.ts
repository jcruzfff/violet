import { useState, useEffect, useCallback } from 'react'
import { useGelatoSmartWalletProviderContext } from '@gelatonetwork/smartwallet-react-sdk'

interface WalletBalance {
  flow: string
  usd: string
  isLoading: boolean
  error: string | null
}

export function useWalletBalance() {
  const [balance, setBalance] = useState<WalletBalance>({
    flow: '0',
    usd: '0',
    isLoading: true,
    error: null
  })

  const { gelato: { client } } = useGelatoSmartWalletProviderContext()
  const walletAddress = client?.account?.address

  const fetchBalance = useCallback(async () => {
    try {
      setBalance(prev => ({ ...prev, isLoading: true, error: null }))

      if (!walletAddress) {
        setBalance({
          flow: '0',
          usd: '0',
          isLoading: false,
          error: null
        })
        return
      }

      // Fetch FLOW balance from Flow EVM
      const response = await fetch('https://testnet.evm.nodes.onflow.org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [walletAddress, 'latest'],
          id: 1
        })
      })

      const data = await response.json()
      
      if (data.result) {
        // Convert wei to FLOW (18 decimals)
        const balanceWei = BigInt(data.result)
        const balanceFlow = Number(balanceWei) / 1e18
        
        // Mock USD conversion (in production, use a price API)
        const flowToUsd = 0.65 // Mock price
        const balanceUsd = balanceFlow * flowToUsd

        setBalance({
          flow: balanceFlow.toFixed(4),
          usd: balanceUsd.toFixed(2),
          isLoading: false,
          error: null
        })
      } else {
        throw new Error('Failed to fetch balance')
      }
    } catch (error) {
      console.error('Balance fetch error:', error)
      setBalance(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch balance'
      }))
    }
  }, [walletAddress])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])



  return {
    ...balance,
    refetch: fetchBalance
  }
} 