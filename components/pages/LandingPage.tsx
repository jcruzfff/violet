interface LandingPageProps {
  onNext: () => void
}

export default function LandingPage({ onNext }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="text-center text-white max-w-4xl px-6">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Finance Advice
        </h1>
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Get personalized financial guidance from our AI-powered advisors. 
          Build your wealth with expert insights tailored to your goals.
        </p>
        <button
          onClick={onNext}
          className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  )
} 