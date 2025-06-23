import { useWallet } from '../../providers/WalletProvider'
import WalletDropdown from '../UI/WalletDropdown'

interface PortfolioPageProps {
  onNext: () => void
  onBack: () => void
}

export default function PortfolioPage({ onNext, onBack }: PortfolioPageProps) {
  // Get wallet context
  const { user } = useWallet()

  // Redirect if no wallet connected
  if (!user) {
    onBack() // Go back to landing page
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Redirecting to connect wallet...</p>
        </div>
      </div>
    )
  }

  // Portfolio data with sophisticated color palette
  const portfolioData = [
    { name: 'Bitcoin', symbol: 'BTC', percentage: 40, value: 9827, change: 5.2, color: '#507084', icon: '₿' }, // Augusta Blue
    { name: 'Ethereum', symbol: 'ETH', percentage: 30, value: 7370, change: 8.1, color: '#66A3A3', icon: 'Ξ' }, // Trevi
    { name: 'Solana', symbol: 'SOL', percentage: 20, value: 4913, change: 12.7, color: '#B38D5F', icon: '◎' }, // Crown Gold
    { name: 'Cardano', symbol: 'ADA', percentage: 10, value: 2457, change: -2.1, color: '#7B7B7B', icon: '₳' } // Pantheon
  ]

  // Calculate angles for the pie chart
  const createPieSegments = () => {
    let currentAngle = 0
    return portfolioData.map(item => {
      const angle = (item.percentage / 100) * 360
      const segment = {
        ...item,
        startAngle: currentAngle,
        endAngle: currentAngle + angle
      }
      currentAngle += angle
      return segment
    })
  }

  const segments = createPieSegments()

  // Create SVG path for donut segment
  const createPath = (centerX: number, centerY: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180)
    const endAngleRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad)
    const y1 = centerY + outerRadius * Math.sin(startAngleRad)
    const x2 = centerX + outerRadius * Math.cos(endAngleRad)
    const y2 = centerY + outerRadius * Math.sin(endAngleRad)
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    
    return [
      'M', x1, y1, 
      'A', outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
      'L', x3, y3,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      'Z'
    ].join(' ')
  }

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return 'No wallet'
    return `${address.slice(0, 4)}..${address.slice(-4)}`
  }

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
          
          {/* User Profile with Dropdown */}
          <WalletDropdown position="right" />
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
            Choose from one of our available top experts to help you build
          </p>
        </div>

        {/* Portfolio Chart */}
        <div className="relative mb-2">
          <div className="w-[400px] h-[400px] relative flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg width="400" height="400" className="absolute inset-0">
              <defs>
                {/* Add subtle gradients for each segment */}
                {segments.map((segment, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={segment.color} stopOpacity="1" />
                    <stop offset="100%" stopColor={segment.color} stopOpacity="0.8" />
                  </linearGradient>
                ))}
              </defs>
              
              {/* Chart segments */}
              {segments.map((segment, index) => (
                <path
                  key={index}
                  d={createPath(200, 200, 120, 180, segment.startAngle, segment.endAngle)}
                  fill={`url(#gradient-${index})`}
                  stroke="#141414"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
              
              {/* Inner circle border for cleaner look */}
              <circle
                cx="200"
                cy="200"
                r="120"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
              
              {/* Outer circle border */}
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="1"
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
              <p className="text-[#9a9a9a] text-lg mb-2 font-medium">Total Value</p>
              <p className="text-white text-4xl font-semibold tracking-wider">$24,567</p>
              <div className="mt-2 flex items-center space-x-1">
                <span className="text-green-500 text-sm">+</span>
                <span className="text-green-500 text-sm font-medium">8.2%</span>
                <span className="text-[#9a9a9a] text-sm">24h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Status */}
        {user && (
          <div className="mb-4 bg-[#272727] rounded-lg p-3 max-w-2xl w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Wallet Connected</p>
                  <p className="text-gray-400 text-xs">Base Sepolia • {formatWalletAddress(user.smartWalletAddress || user.walletAddress || '')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-500 text-sm font-medium">✓ Active</p>
                <p className="text-gray-400 text-xs">Smart Wallet</p>
              </div>
            </div>
          </div>
        )}

        {/* Call Advisor Button */}
        <button
          onClick={onNext}
          className="bg-white text-black px-16 py-3 rounded-xl text-base font-medium hover:bg-gray-100 transition-all duration-300 mb-8"
        >
          Call Advisor
        </button>

        {/* Portfolio Items Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-4">
          {portfolioData.map((item, index) => (
            <div key={index} className="bg-[#272727] rounded-xl p-4 flex items-center justify-between hover:bg-[#2f2f2f] transition-colors">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-white text-sm font-bold">{item.icon}</span>
                </div>
                <div>
                  <p className="text-white text-base font-medium">{item.name}</p>
                  <p className="text-[#d6d6d6] text-xs">{item.symbol} • {item.percentage}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white text-base font-semibold">${item.value.toLocaleString()}</p>
                <p className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change >= 0 ? '+' : ''}{item.change}%
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Recommendation */}
        <div className="bg-[#3a3a3a] rounded-xl p-6 pl-4 flex items-center space-x-4 max-w-2xl w-full">
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