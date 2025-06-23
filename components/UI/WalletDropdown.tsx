import { useState } from 'react'
import { useWallet } from '../../providers/WalletProvider'
import Image from 'next/image'

interface WalletDropdownProps {
  position?: 'left' | 'right'
}

export default function WalletDropdown({ position = 'right' }: WalletDropdownProps) {
  const { user, disconnectWallet } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Don't render if no user
  if (!user) return null

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return 'No wallet'
    return `${address.slice(0, 4)}..${address.slice(-4)}`
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setIsDropdownOpen(false)
  }

  return (
    <>
      {/* Wallet Button */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-[#303030] border border-[#535353] rounded-lg px-4 py-2 flex items-center space-x-3 hover:bg-[#404040] transition-colors"
        >
          <div className="w-6 h-6 bg-[#464646] rounded-full"></div>
          <span className="text-white text-sm font-medium">
            {user?.smartWalletAddress ? formatWalletAddress(user.smartWalletAddress) : 'No wallet'}
          </span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className={`absolute ${position === 'left' ? 'left-0' : 'right-0'} mt-2 w-80 bg-[#2a2a2a] border border-[#404040] rounded-lg shadow-xl z-50`}>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Smart Wallet Connected</p>
                  <p className="text-green-400 text-xs">Base Sepolia</p>
                </div>
              </div>

              {user && (
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Smart Wallet Address</p>
                    <p className="text-[#B38D5F] font-mono text-xs break-all">{user.smartWalletAddress}</p>
                  </div>
                  
                  {/* Investment Settings Display */}
                  {user.investmentSettings && (
                    <div className="bg-[#1e1e1e] rounded-lg p-3 border border-[#404040]">
                      <p className="text-gray-400 text-xs mb-2 font-medium">Investment Settings</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-xs">Amount:</span>
                          <span className="text-white text-xs font-medium">${user.investmentSettings.investmentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-xs">Risk Level:</span>
                          <div className="flex items-center space-x-1">
                            <Image 
                              src={`/icons/${user.investmentSettings.riskLevel === 'Aggressive' ? 'aggreseive' : user.investmentSettings.riskLevel.toLowerCase()}-icon.svg`}
                              alt={user.investmentSettings.riskLevel}
                              width={12}
                              height={12}
                              className="w-3 h-3"
                            />
                            <span className="text-white text-xs font-medium">{user.investmentSettings.riskLevel}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-xs">Time Horizon:</span>
                          <span className="text-white text-xs font-medium">
                            {user.investmentSettings.timeHorizon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-[#404040] pt-4">
                <button
                  onClick={handleDisconnect}
                  className="w-full bg-[#272727] border border-[#404040] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#2f2f2f] transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </>
  )
} 