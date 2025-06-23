interface PortfolioPageProps {
  onNext: () => void
  onBack: () => void
}

export default function PortfolioPage({ onNext, onBack }: PortfolioPageProps) {
  return (
    <div className="min-h-screen bg-[#141414] relative">
      {/* Header */}
      <div className="bg-[#1e1e1e] border-b border-[rgba(255,255,255,0.08)] p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="bg-[#303030] border border-[#535353] rounded-lg p-2 hover:bg-[#404040] transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center text-white">
              ←
            </div>
          </button>
          
          {/* User Profile */}
          <div className="bg-[#303030] border border-[#535353] rounded-lg px-4 py-2 flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#464646] rounded-full"></div>
            <span className="text-white text-sm font-medium">0xl..2i8D</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-6 py-12">
        {/* Title Section */}
        <div className="text-center text-white mb-12 max-w-lg">
          <h1 className="text-4xl font-semibold mb-3 tracking-wide">
            Portfolio Advisors
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Choose from one of our available top exports to help you build
          </p>
        </div>

        {/* Portfolio Chart */}
        <div className="relative mb-8">
          <div className="w-[341px] h-[341px] relative flex items-center justify-center">
            {/* Donut Chart Background */}
            <div className="absolute inset-0 rounded-full border-[40px] border-gray-600"></div>
            <div className="absolute inset-0 rounded-full border-[40px] border-transparent"
                 style={{
                   background: `conic-gradient(
                     from 0deg,
                     #f97316 0deg 144deg,
                     #2563eb 144deg 252deg,
                     #7c3aed 252deg 324deg,
                     #10b981 324deg 360deg
                   )`,
                   borderRadius: '50%',
                   mask: 'radial-gradient(circle, transparent 120px, black 120px, black 170px, transparent 170px)'
                 }}>
            </div>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[#49474a] text-lg mb-2">Total Value</p>
              <p className="text-[#b6b4b7] text-3xl font-semibold tracking-wider">$24,567</p>
            </div>
          </div>
        </div>

        {/* Call Advisor Button */}
        <button
          onClick={onNext}
          className="bg-white text-black px-16 py-3 rounded-xl text-base font-medium hover:bg-gray-100 transition-all duration-300 mb-12"
        >
          Call Advisor
        </button>

        {/* Portfolio Items Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-6">
          {/* Bitcoin */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">₿</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Bitcoin</p>
                <p className="text-[#d6d6d6] text-xs">BTC • 40%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$9,827</p>
              <p className="text-green-600 text-xs">+5.2%</p>
            </div>
          </div>

          {/* Solana */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">◎</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Solana</p>
                <p className="text-[#d6d6d6] text-xs">SOL • 20%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$4,913</p>
              <p className="text-green-600 text-xs">+12.7%</p>
            </div>
          </div>

          {/* Ethereum */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">Ξ</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Ethereum</p>
                <p className="text-[#d6d6d6] text-xs">ETH • 30%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$7,370</p>
              <p className="text-green-600 text-xs">+8.1%</p>
            </div>
          </div>

          {/* Cardano */}
          <div className="bg-[#272727] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">₳</span>
              </div>
              <div>
                <p className="text-white text-base font-medium">Cardano</p>
                <p className="text-[#d6d6d6] text-xs">ADA • 10%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-base font-semibold">$2,457</p>
              <p className="text-red-500 text-xs">-2.1%</p>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-[#3a3a3a] rounded-xl p-6 flex items-center space-x-4 max-w-2xl w-full">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full flex items-center justify-center">
            <div className="w-5 h-4 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm opacity-80"></div>
            </div>
          </div>
          <div>
            <p className="text-white text-base font-semibold">AI Recommendation</p>
            <p className="text-[#d6d6d6] text-sm">Optimized portfolio package</p>
          </div>
        </div>
      </div>
    </div>
  )
} 