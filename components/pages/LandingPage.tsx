import Image from 'next/image'
import { useWallet } from '../../providers/WalletProvider'
import WalletDropdown from '../UI/WalletDropdown'

interface LandingPageProps {
  onNext: () => void
}

export default function LandingPage({ onNext }: LandingPageProps) {
  const { user } = useWallet()

  const handleLaunchApp = () => {
    if (user) {
      // If user is already connected, go to portfolio
      onNext()
      onNext() // Skip wallet connection page
    } else {
      // If no user, go to wallet connection
      onNext()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Header with Wallet Dropdown */}
      {user && (
        <div className="absolute top-0 right-0 z-20 p-4">
          <WalletDropdown position="right" />
        </div>
      )}

      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/icons/bg-hero3.svg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
          quality={100}
          style={{ opacity: 1 }}
        />
        {/* Dark overlay for better text readability */}
   
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Centered Content */}
        <div className="text-center text-white max-w-4xl -mt-24">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Accessible Wealth Management
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-[28px] text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
            No guess work. Sign in and let our live agents walk you 
            <br />
           through creating and managing your crypto portfolio.
          </p>
          
          {/* CTA Button */}
          <button
            onClick={handleLaunchApp}
            className="bg-[#B38D5F] text-white px-28 py-4 cursor-pointer rounded-xl text-lg font-semibold hover:bg-[#B38D5F]/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {user ? 'Continue to App' : 'Launch App'}
          </button>
        </div>

        {/* Coin Icons Row */}
        {/* <div className="absolute bottom-32 -left-[600px] -right-[600px]">
          <Image
            src="/icons/coin-icons.svg"
            alt="Cryptocurrency Icons"
            width={2200}
            height={230}
            className="opacity-80 hover:opacity-100 transition-opacity duration-300 w-full"
          />
        </div> */}
      </div>
    </div>
  )
} 