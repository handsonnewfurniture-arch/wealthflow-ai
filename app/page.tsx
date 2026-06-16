'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  TrendingUp,
  MapPin,
  DollarSign,
  Shield,
  Zap,
  Target,
  ChartBar,
  BookOpen,
  Award,
  ArrowRight,
  Check
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

export default function Home() {
  const [email, setEmail] = useState('')
  const [initialCapital, setInitialCapital] = useState(50000)

  // Simple wealth projection calculator
  const projectedWealth = (capital: number, years: number, avgReturn: number = 0.16) => {
    return capital * Math.pow(1 + avgReturn, years)
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-semibold">AI-Powered Tax Lien Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Find Hidden Real Estate Opportunities{' '}
            <span className="gradient-text">Before Other Investors</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto text-balance">
            Track tax lien auctions, analyze counties, discover undervalued properties, and build a portfolio that compounds year after year.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/dashboard">
              <Button variant="gold" size="lg">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="secondary" size="lg">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="stat-card">
              <div className="text-3xl md:text-4xl font-bold gradient-text">20+</div>
              <div className="text-sm text-gray-400">Counties Tracked</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl md:text-4xl font-bold gradient-text">18%</div>
              <div className="text-sm text-gray-400">Max Interest Rate</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl md:text-4xl font-bold gradient-text">100+</div>
              <div className="text-sm text-gray-400">Opportunities</div>
            </div>
            <div className="stat-card">
              <div className="text-3xl md:text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-gray-400">AI Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Wealth Projection Calculator */}
      <section className="py-20 px-4 bg-navy-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h2 className="section-title text-center">Your Wealth Projection</h2>
            <p className="text-gray-300 text-center mb-8">
              See how tax lien investing can grow your wealth
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Starting Capital: ${initialCapital.toLocaleString()}
              </label>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="w-full h-2 bg-navy-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card text-center">
                <div className="text-sm text-gray-400 mb-2">Year 1</div>
                <div className="text-2xl font-bold text-emerald-400">
                  ${projectedWealth(initialCapital, 1).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">16% avg return</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-sm text-gray-400 mb-2">Year 3</div>
                <div className="text-2xl font-bold text-emerald-400">
                  ${projectedWealth(initialCapital, 3).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">Compounded</div>
              </div>
              <div className="stat-card text-center">
                <div className="text-sm text-gray-400 mb-2">Year 5</div>
                <div className="text-2xl font-bold text-gold-400">
                  ${projectedWealth(initialCapital, 5).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-gray-500 mt-1">Long-term growth</div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-6">
              * Projections based on 16% average annual return from tax liens. Past performance does not guarantee future results.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Everything You Need to Build Wealth with Tax Liens</h2>
            <p className="text-xl text-gray-300">One platform. Complete intelligence. Maximum returns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="space-y-4">
              <div className="bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">County Intelligence</h3>
              <p className="text-gray-400">
                Track 20+ high-yield counties with auction dates, interest rates, redemption periods, and competition levels.
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="bg-gold-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold">Opportunity Scoring</h3>
              <p className="text-gray-400">
                AI-powered 0-100 scoring system rates every lien based on yield, property value, crime risk, and redemption probability.
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Risk Avoidance</h3>
              <p className="text-gray-400">
                Automatically flags high-crime areas, vacant land, flood zones, and other red flags to protect your capital.
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="bg-gold-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold">Portfolio Tracking</h3>
              <p className="text-gray-400">
                Monitor your liens, track redemptions, calculate returns, and manage reinvestment to maximize capital velocity.
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="bg-emerald-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold">Capital Velocity Engine</h3>
              <p className="text-gray-400">
                Get alerts to reinvest redeemed capital within 48 hours. Keep your money working, not sitting idle.
              </p>
            </Card>

            <Card className="space-y-4">
              <div className="bg-gold-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="text-xl font-bold">Wealth Academy</h3>
              <p className="text-gray-400">
                Learn tax lien strategy from basics to advanced. Gamified lessons earn you XP and unlock insider knowledge.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* County Opportunity Cards Preview */}
      <section id="demo" className="py-20 px-4 bg-navy-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Live Opportunities</h2>
            <p className="text-xl text-gray-300">Real counties. Real auctions. Real returns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample County Card 1 */}
            <Card hover className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">Sarasota, FL</h3>
                  <p className="text-sm text-gray-400">Tax Lien · Online</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  Score: 98
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Interest Rate</div>
                  <div className="text-lg font-bold text-gold-400">18%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Auction Date</div>
                  <div className="text-lg font-bold">Jul 25, 2026</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Median Value</div>
                  <div className="text-lg font-bold">$465k</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Crime Risk</div>
                  <div className="text-lg font-bold text-emerald-400">Low</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href="/counties">
                  <Button variant="secondary" className="w-full">View Details</Button>
                </Link>
              </div>
            </Card>

            {/* Sample County Card 2 */}
            <Card hover className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">Polk, IA</h3>
                  <p className="text-sm text-gray-400">Tax Deed · In-Person</p>
                </div>
                <div className="bg-gold-500/20 text-gold-400 text-xs font-bold px-3 py-1 rounded-full">
                  Score: 94
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Interest Rate</div>
                  <div className="text-lg font-bold text-gold-400">24%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Auction Date</div>
                  <div className="text-lg font-bold">Oct 15, 2026</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Median Value</div>
                  <div className="text-lg font-bold">$245k</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Competition</div>
                  <div className="text-lg font-bold text-emerald-400">Low</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href="/counties">
                  <Button variant="secondary" className="w-full">View Details</Button>
                </Link>
              </div>
            </Card>

            {/* Sample County Card 3 */}
            <Card hover className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">St Johns, FL</h3>
                  <p className="text-sm text-gray-400">Tax Lien · Online</p>
                </div>
                <div className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                  Score: 98
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Interest Rate</div>
                  <div className="text-lg font-bold text-gold-400">18%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Auction Date</div>
                  <div className="text-lg font-bold">Jul 28, 2026</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Median Value</div>
                  <div className="text-lg font-bold">$425k</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Crime Risk</div>
                  <div className="text-lg font-bold text-emerald-400">Very Low</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link href="/counties">
                  <Button variant="secondary" className="w-full">View Details</Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/counties">
              <Button variant="primary" size="lg">
                Explore All Counties
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your investment goals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-1">
                  $29<span className="text-lg text-gray-400">/mo</span>
                </div>
                <p className="text-sm text-gray-400">Perfect for beginners</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">County database access</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Auction calendar</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Basic lessons</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Weekly newsletter</span>
                </li>
              </ul>

              <Link href="/pricing">
                <Button variant="secondary" className="w-full">Get Started</Button>
              </Link>
            </Card>

            {/* Pro */}
            <Card className="space-y-6 border-2 border-emerald-500/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-1">
                  $79<span className="text-lg text-gray-400">/mo</span>
                </div>
                <p className="text-sm text-gray-400">For serious investors</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Starter</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Investor scores</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">County rankings</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Portfolio tracker</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Downloadable reports</span>
                </li>
              </ul>

              <Link href="/pricing">
                <Button variant="primary" className="w-full">Get Started</Button>
              </Link>
            </Card>

            {/* Elite */}
            <Card className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                <div className="text-4xl font-bold mb-1">
                  $199<span className="text-lg text-gray-400">/mo</span>
                </div>
                <p className="text-sm text-gray-400">Maximum intelligence</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">AI opportunity finder</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Capital deployment tools</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Priority support</span>
                </li>
              </ul>

              <Link href="/pricing">
                <Button variant="gold" className="w-full">Get Started</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-navy-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold mb-2">What is a tax lien?</h3>
              <p className="text-gray-400">
                A tax lien is a legal claim placed on a property when the owner fails to pay property taxes. You can purchase these liens at county auctions and earn high interest rates (12-24%) when the owner pays back the taxes.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-2">How much money do I need to start?</h3>
              <p className="text-gray-400">
                Most investors start with $10,000-$50,000. Individual liens can range from a few hundred dollars to tens of thousands, depending on the property value and delinquent tax amount.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-2">What returns can I expect?</h3>
              <p className="text-gray-400">
                Tax lien returns are governed by state statute. Different states offer different maximum interest rates, ranging from 12% to 24% annually. Your actual returns depend on redemption rates and capital velocity.
              </p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold mb-2">Is this legal financial advice?</h3>
              <p className="text-gray-400">
                No. WealthFlow AI provides research, education, and data tools only. It is not financial, legal, tax, or investment advice. Always consult licensed professionals before making investment decisions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Lead Capture CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Building Your Tax Lien Portfolio Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join investors earning 12-24% returns on secured real estate liens
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Link href="/dashboard">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              No credit card required · 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <span className="font-bold gradient-text">WealthFlow AI</span>
              </div>
              <p className="text-sm text-gray-400">
                Tax lien intelligence platform for serious investors.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/counties" className="hover:text-white">Counties</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link href="/academy" className="hover:text-white">Academy</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
            <p className="mb-4">
              <strong>Disclaimer:</strong> WealthFlow AI provides research, education, and data tools only. It is not financial, legal, tax, or investment advice. Users must perform their own due diligence and consult licensed professionals. Past performance does not guarantee future results.
            </p>
            <p>© 2026 WealthFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
