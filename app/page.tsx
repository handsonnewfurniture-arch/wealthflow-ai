import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">WealthFlow AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern & Bold */}
      <div className="relative overflow-hidden">
        {/* Gradient Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-32 pb-24 md:pt-40 md:pb-32">
          <div className="text-center mb-20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold text-orange-400">Live Tax Lien Intelligence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
              Tax Lien Investment<br/>
              <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-gold-400 bg-clip-text text-transparent">
                Intelligence Platform
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Find hidden real estate opportunities before other investors. Track tax lien auctions,
              analyze counties, discover undervalued properties, and build a portfolio that compounds year after year.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/pricing" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 hover:-translate-y-0.5">
                Start Free Trial
              </Link>
              <Link href="/counties" className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 hover:border-white/20 rounded-2xl font-bold text-lg transition-all duration-300 hover:-translate-y-0.5">
                Explore Counties →
              </Link>
            </div>

            {/* Social Proof */}
            <p className="text-sm text-gray-500 mt-8">
              Join 2,500+ investors earning 12-24% annual returns
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid - Modern Bento Style */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Everything you need to <span className="gradient-text">invest smarter</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Professional-grade tools designed for serious tax lien investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">County Intelligence</h3>
            <p className="text-gray-400 leading-relaxed">
              Track 100+ high-yield counties across 8 states. Get auction dates, interest rates, and 0-100 investor scores.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Portfolio Tracking</h3>
            <p className="text-gray-400 leading-relaxed">
              Monitor active liens and redemptions. Calculate returns and capital velocity automatically.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gold-500/20 group-hover:shadow-gold-500/40 transition-shadow">
              <svg className="w-8 h-8 text-navy-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Wealth Academy</h3>
            <p className="text-gray-400 leading-relaxed">
              Learn tax lien investing from basics to advanced strategies. Gamified lessons with XP and badges.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section - Modern */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 py-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-gold-500/10 border border-orange-500/20 rounded-3xl p-12 md:p-16">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-gold-500/10 blur-3xl"></div>

          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Investing?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join 2,500+ investors building wealth through tax liens
            </p>
            <Link href="/pricing" className="inline-block px-12 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 hover:-translate-y-1">
              View Pricing Plans
            </Link>
            <p className="text-gray-400 mt-6 text-sm">
              Plans starting at $29/month • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400">
          <p>&copy; 2026 WealthFlow AI. Built for real estate investors.</p>
        </div>
      </div>
    </div>
  )
}
