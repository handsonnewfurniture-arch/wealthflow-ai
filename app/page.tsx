import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-950">
      {/* Simple Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">WealthFlow AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/simple" className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium">
                Test Page
              </Link>
              <Link href="/pricing" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Tax Lien Investment Intelligence
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find hidden real estate opportunities before other investors. Track tax lien auctions,
            analyze counties, discover undervalued properties, and build a portfolio that compounds year after year.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/pricing" className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-lg">
              Start Free Trial
            </Link>
            <Link href="/counties" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 font-bold text-lg">
              Explore Counties
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">County Intelligence</h3>
            <p className="text-gray-400">
              Track 20+ high-yield counties. Get auction dates, interest rates, and 0-100 investor scores.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Portfolio Tracking</h3>
            <p className="text-gray-400">
              Monitor active liens and redemptions. Calculate returns and capital velocity automatically.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Wealth Academy</h3>
            <p className="text-gray-400">
              Learn tax lien investing from basics to advanced. Gamified lessons with XP and badges.
            </p>
          </div>
        </div>

        {/* Pricing Teaser */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start Your Free Trial</h2>
          <p className="text-gray-300 mb-8">Plans starting at $29/month. Cancel anytime.</p>
          <Link href="/pricing" className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-lg inline-block">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
