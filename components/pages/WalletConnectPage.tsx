'use client'

import { useState } from 'react'
import { useWallet } from '../../providers/WalletProvider'


interface WalletConnectPageProps {
  onNextAction: () => void
}

export default function WalletConnectPage({ onNextAction }: WalletConnectPageProps) {
  const { user, smartWalletClient, connectWallet, disconnectWallet, isConnecting, sendTestTransaction } = useWallet()
  const [isSendingTx, setIsSendingTx] = useState(false)

  const handleTestTransaction = async () => {
    setIsSendingTx(true)
    try {
      await sendTestTransaction()
    } catch (error) {
      console.error('Transaction failed:', error)
    } finally {
      setIsSendingTx(false)
    }
  }



  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      <div className="text-center text-white max-w-lg">
        <h1 className="text-4xl font-semibold mb-6 tracking-wide">
          Direct Smart Wallet Test
        </h1>
        <p className="text-gray-300 text-base leading-relaxed mb-8">
          Testing Gelato Smart Wallet SDK with direct client creation
        </p>

        {/* Connection Status */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">
          <h3 className="text-xl font-medium mb-4">Connection Status</h3>
          
          {!user ? (
            <div className="space-y-4">
              <p className="text-gray-400">No wallet connected</p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
                  isConnecting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isConnecting ? 'Creating Smart Wallet...' : 'Connect Smart Wallet'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-left">
                <p className="text-sm text-gray-400">Owner Address:</p>
                <p className="text-green-400 font-mono text-sm break-all">{user.walletAddress}</p>
              </div>
              
              <div className="text-left">
                <p className="text-sm text-gray-400">Smart Wallet Address:</p>
                <p className="text-blue-400 font-mono text-sm break-all">{user.smartWalletAddress}</p>
              </div>
              
              <div className="text-left">
                <p className="text-sm text-gray-400">Status:</p>
                <p className="text-green-400">✅ Connected & Ready</p>
              </div>

              <button
                onClick={disconnectWallet}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Real Transaction Section */}
        {user && smartWalletClient && (
          <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">
            <h3 className="text-xl font-medium mb-4">Send Real Sponsored Transaction</h3>
            <p className="text-gray-400 text-sm mb-4">
              Send 0.0001 ETH to test address with gas sponsored by Gelato
            </p>
            
            <button
              onClick={handleTestTransaction}
              disabled={isSendingTx}
              className={`w-full py-3 rounded-xl text-white font-medium transition-all ${
                isSendingTx 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSendingTx ? 'Sending Real Transaction...' : 'Send Real Transaction'}
            </button>
          </div>
        )}

                 {/* Next Button */}
         {user && (
           <button
             onClick={onNextAction}
             className="bg-[#B38D5F] text-white px-16 py-3 rounded-xl text-base font-medium hover:bg-[#B38D5F]/80 transition-all duration-300"
           >
             Continue to Portfolio →
           </button>
         )}
      </div>
    </div>
  )
} 