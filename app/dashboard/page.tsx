'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  DollarSign,
  Zap,
  Calendar,
  Award,
  BookOpen,
  Target,
  Bell,
  Settings,
  Search,
  Filter,
  ChevronRight,
  Star,
  TrendingDown,
  PiggyBank
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user data - in production, fetch from Supabase
  const user = {
    name: 'Tiger McBride',
    email: 'handsonnewfurniture@gmail.com',
    xpPoints: 1250,
    xpLevel: 2,
    subscriptionTier: 'pro'
  }

  // Mock portfolio data
  const portfolio = {
    totalValue: 125000,
    cashAvailable: 25000,
    capitalDeployed: 100000,
    expectedYield: 16.5,
    activeOpportunities: 8,
    redemptions: 2
  }

  // Calculate progress to next level
  const currentLevelMin = (user.xpLevel - 1) * 1000
  const nextLevelMin = user.xpLevel * 1000
  const progressPercent = ((user.xpPoints - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100

  // Mock upcoming auctions
  const upcomingAuctions = [
    { id: 1, county: 'Sarasota, FL', date: '2026-07-25', parcels: 234, score: 98 },
    { id: 2, county: 'St Johns, FL', date: '2026-07-28', parcels: 156, score: 98 },
    { id: 3, county: 'Lake, FL', date: '2026-07-18', parcels: 189, score: 85 },
    { id: 4, county: 'Yavapai, AZ', date: '2026-09-10', parcels: 78, score: 92 }
  ]

  // Mock opportunity feed
  const opportunities = [
    {
      id: 1,
      address: '123 Palm Ave, Sarasota, FL',
      county: 'Sarasota',
      state: 'FL',
      assessedValue: 385000,
      lienAmount: 8500,
      interestRate: 18,
      score: 98,
      propertyType: 'Residential'
    },
    {
      id: 2,
      address: '789 Ocean View Dr, St Augustine, FL',
      county: 'St Johns',
      state: 'FL',
      assessedValue: 465000,
      lienAmount: 9200,
      interestRate: 18,
      score: 98,
      propertyType: 'Residential'
    },
    {
      id: 3,
      address: '1234 Oak St, Des Moines, IA',
      county: 'Polk',
      state: 'IA',
      assessedValue: 245000,
      lienAmount: 5200,
      interestRate: 24,
      score: 91,
      propertyType: 'Residential'
    }
  ]

  // Mock watchlist
  const watchlist = [
    { id: 1, county: 'Sarasota, FL', opportunities: 5, avgScore: 96 },
    { id: 2, county: 'Polk, IA', opportunities: 3, avgScore: 92 },
    { id: 3, county: 'Yavapai, AZ', opportunities: 2, avgScore: 90 }
  ]

  // Recent badges
  const recentBadges = [
    { id: 1, name: 'County Scout', icon: '🔍', tier: 'bronze' },
    { id: 2, name: 'First Lesson Complete', icon: '📚', tier: 'bronze' }
  ]

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* Modern Dashboard Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-32 pb-12">
          <div className="flex items-start justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-emerald-400">Portfolio Active</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
              <p className="text-xl text-gray-400">Here's your tax lien portfolio overview</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>

            {/* XP Progress Bar */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold">Level {user.xpLevel} · {user.xpPoints.toLocaleString()} XP</div>
                    <div className="text-sm text-gray-400">{nextLevelMin - user.xpPoints} XP to Level {user.xpLevel + 1}</div>
                  </div>
                </div>
                <Badge variant="gold">Opportunity Hunter</Badge>
              </div>
              <div className="w-full bg-navy-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </Card>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Portfolio Value</div>
              <div className="text-2xl font-bold gradient-text">
                ${(portfolio.totalValue / 1000).toFixed(0)}k
              </div>
              <div className="flex items-center text-xs text-emerald-400">
                <TrendingUp className="w-3 h-3 mr-1" />
                +16.5%
              </div>
            </Card>

            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Cash Available</div>
              <div className="text-2xl font-bold text-emerald-400">
                ${(portfolio.cashAvailable / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500">Ready to deploy</div>
            </Card>

            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Deployed</div>
              <div className="text-2xl font-bold">
                ${(portfolio.capitalDeployed / 1000).toFixed(0)}k
              </div>
              <div className="text-xs text-gray-500">{portfolio.activeOpportunities} liens</div>
            </Card>

            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Expected Yield</div>
              <div className="text-2xl font-bold text-gold-400">
                {portfolio.expectedYield}%
              </div>
              <div className="text-xs text-gray-500">Avg annual</div>
            </Card>

            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Capital Velocity</div>
              <div className="text-2xl font-bold text-emerald-400">
                2.3x
              </div>
              <div className="text-xs text-gray-500">Turnover rate</div>
            </Card>

            <Card className="space-y-2">
              <div className="text-sm text-gray-400">Redemptions</div>
              <div className="text-2xl font-bold">
                {portfolio.redemptions}
              </div>
              <div className="text-xs text-emerald-400">This month</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily Opportunity Feed */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Daily Opportunities</h2>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search opportunities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-glass pl-10 pr-4 py-2 w-64"
                      />
                    </div>
                    <button className="p-2 rounded-lg glass-card hover:bg-white/5">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {opportunities.map((opp) => (
                    <Card key={opp.id} hover className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold">{opp.address}</h3>
                            <Badge variant={opp.score >= 95 ? 'emerald' : 'gold'}>
                              Score: {opp.score}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            {opp.county}, {opp.state} · {opp.propertyType}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gold-400 transition-colors">
                          <Star className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400">Assessed Value</div>
                          <div className="font-semibold">
                            ${(opp.assessedValue / 1000).toFixed(0)}k
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Lien Amount</div>
                          <div className="font-semibold text-emerald-400">
                            ${opp.lienAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Interest Rate</div>
                          <div className="font-semibold text-gold-400">
                            {opp.interestRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">LTV Ratio</div>
                          <div className="font-semibold">
                            {((opp.lienAmount / opp.assessedValue) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center space-x-2">
                          <Badge variant="emerald">Low Crime</Badge>
                          <Badge variant="blue">Owner Occupied</Badge>
                        </div>
                        <Link href={`/counties/${opp.state}`}>
                          <Button variant="secondary" size="sm">
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1 inline" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <Link href="/counties">
                    <Button variant="secondary">View All Opportunities</Button>
                  </Link>
                </div>
              </div>

              {/* Upcoming Auctions */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Upcoming Auctions</h2>
                <div className="space-y-3">
                  {upcomingAuctions.map((auction) => (
                    <Card key={auction.id} hover className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="bg-emerald-500/20 p-3 rounded-lg">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold mb-1">{auction.county}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(auction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })} · {auction.parcels} parcels
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={auction.score >= 95 ? 'emerald' : 'gold'}>
                            {auction.score}
                          </Badge>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/counties">
                    <button className="w-full btn-secondary flex items-center justify-between">
                      <span className="flex items-center">
                        <Target className="w-4 h-4 mr-2" />
                        Explore Counties
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/portfolio">
                    <button className="w-full btn-secondary flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        My Portfolio
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/academy">
                    <button className="w-full btn-secondary flex items-center justify-between">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Wealth Academy
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </Card>

              {/* Watchlist */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Watchlist</h3>
                  <Badge>{watchlist.length}</Badge>
                </div>
                <div className="space-y-3">
                  {watchlist.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-900/50 border border-white/5">
                      <div>
                        <div className="font-semibold text-sm">{item.county}</div>
                        <div className="text-xs text-gray-400">{item.opportunities} opportunities</div>
                      </div>
                      <Badge variant="emerald" className="text-xs">
                        {item.avgScore}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Link href="/counties" className="w-full mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors block text-center">
                  View All
                </Link>
              </Card>

              {/* Recent Badges */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Recent Achievements</h3>
                <div className="space-y-3">
                  {recentBadges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-3 rounded-lg bg-navy-900/50 border border-white/5">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-400 capitalize">{badge.tier} tier</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/academy">
                  <button className="w-full mt-4 text-sm text-gold-400 hover:text-gold-300 transition-colors">
                    View All Badges
                  </button>
                </Link>
              </Card>

              {/* Capital Velocity Alert */}
              <Card className="p-6 border-2 border-emerald-500/30">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Deploy Within 48h</h3>
                    <p className="text-sm text-gray-400">
                      You have $25k available for reinvestment. Keep your capital working!
                    </p>
                  </div>
                </div>
                <Link href="/counties">
                  <Button variant="primary" size="sm" className="w-full">
                    Find Opportunities
                  </Button>
                </Link>
              </Card>

              {/* Subscription Status */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Pro Plan</h3>
                  <Badge variant="emerald">Active</Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Full access to investor scores, county rankings, and portfolio tracking.
                </p>
                <Link href="/pricing" className="text-sm text-gold-400 hover:text-gold-300 transition-colors">
                  Upgrade to Elite →
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
