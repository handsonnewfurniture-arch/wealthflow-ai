/**
 * Investor Profile Page
 * Personal dashboard for tax lien/deed investors
 * Dark mode with glassmorphism and futuristic design
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/profile/GlassCard'
import ScrollingMarquee from '@/components/profile/ScrollingMarquee'
import InvestmentGrid from '@/components/profile/InvestmentGrid'
import LiveActivity from '@/components/profile/LiveActivity'
import {
  TrendingUp,
  FileText,
  Landmark,
  Gavel,
  Bookmark,
  Clock,
  User,
  Briefcase,
  CreditCard,
  GraduationCap,
  Settings
} from 'lucide-react'

const investorTags = [
  'Tax Liens',
  'Tax Deeds',
  'Auctions',
  'Due Diligence',
  'Portfolio Growth',
  'Redemption Tracking',
  'County Research',
  'Real Estate Data'
]

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)

  // User data (would come from auth/database)
  const userData = {
    name: 'Tiger McBride',
    headline: 'Tax Lien Investor • Auction Tracker • Property Opportunity Hunter',
    bio: 'Investor focused on finding overlooked tax lien and tax deed opportunities through research, auction tracking, and disciplined due diligence.',
    stats: {
      portfolioValue: 487350,
      activeLiens: 23,
      taxDeeds: 8,
      auctionsParticipated: 47,
      dealsWatching: 156,
      redemptionDeadlines: 3
    }
  }

  const profileOverviewStats = [
    {
      label: 'Portfolio Value',
      value: `$${userData.stats.portfolioValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Active Tax Liens',
      value: userData.stats.activeLiens,
      icon: FileText,
      color: 'text-neon-blue',
      bg: 'bg-neon-blue/10'
    },
    {
      label: 'Tax Deeds Owned',
      value: userData.stats.taxDeeds,
      icon: Landmark,
      color: 'text-neon-purple',
      bg: 'bg-neon-purple/10'
    },
    {
      label: 'Auctions Participated',
      value: userData.stats.auctionsParticipated,
      icon: Gavel,
      color: 'text-gold-400',
      bg: 'bg-gold-400/10'
    },
    {
      label: 'Deals Watching',
      value: userData.stats.dealsWatching,
      icon: Bookmark,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Redemption Deadlines',
      value: userData.stats.redemptionDeadlines,
      icon: Clock,
      color: 'text-red-400',
      bg: 'bg-red-500/10'
    }
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* User Avatar */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-gold-400 p-1 shadow-[0_0_50px_rgba(0,212,255,0.5)]">
              <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center">
                <User className="w-16 h-16 text-white/60" />
              </div>
            </div>

            {/* Name */}
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-neon-blue to-neon-purple bg-clip-text text-transparent">
              {userData.name}
            </h1>

            {/* Headline */}
            <p className="text-xl text-white/60 mb-8 font-medium">
              {userData.headline}
            </p>

            {/* Scrolling Marquee */}
            <ScrollingMarquee tags={investorTags} />
          </div>
        </section>

        {/* Profile Overview Cards */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Portfolio Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profileOverviewStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <GlassCard
                    key={index}
                    hover
                    className="p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`text-3xl font-black ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                    <p className="text-white/60 text-sm font-medium">{stat.label}</p>
                  </GlassCard>
                )
              })}
            </div>
          </div>
        </section>

        {/* Investment Portfolio Grid */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">My Investments</h2>
              <button className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all">
                Add Investment
              </button>
            </div>
            <InvestmentGrid loading={loading} />
          </div>
        </section>

        {/* About Section */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">About</h2>
            <GlassCard className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Bio Text */}
                <div className="lg:col-span-2">
                  <p className="text-lg text-white/80 leading-relaxed">
                    {userData.bio}
                  </p>
                  <div className="flex gap-4 mt-6">
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-neon-blue/50 transition-all">
                      Edit Profile
                    </button>
                    <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-neon-purple/50 transition-all">
                      Share Profile
                    </button>
                  </div>
                </div>

                {/* Profile Image Placeholder */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center">
                    <User className="w-24 h-24 text-white/40" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Live Activity */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Recent Activity</h2>
            <LiveActivity loading={loading} limit={5} />
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="px-6 py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 text-lg">
              <Link
                href="/profile"
                className="text-white/60 hover:text-neon-blue transition-colors relative group"
              >
                <User className="w-5 h-5 inline mr-2" />
                Profile
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/dashboard"
                className="text-white/60 hover:text-neon-blue transition-colors relative group"
              >
                <Briefcase className="w-5 h-5 inline mr-2" />
                Portfolio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/dashboard/transactions"
                className="text-white/60 hover:text-neon-blue transition-colors relative group"
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Transactions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/academy"
                className="text-white/60 hover:text-neon-blue transition-colors relative group"
              >
                <GraduationCap className="w-5 h-5 inline mr-2" />
                Education
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-white/60 hover:text-neon-blue transition-colors relative group"
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-center mt-12 text-white/40 text-sm">
              <p>© 2026 WealthFlow AI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
