/**
 * Investment Bento Grid
 * Responsive grid showing user's investments and saved opportunities
 */

'use client'

import { useState } from 'react'
import GlassCard from './GlassCard'
import { MapPin, Calendar, DollarSign, Eye, TrendingUp } from 'lucide-react'

interface Investment {
  id: string
  address: string
  parcelApn: string
  county: string
  state: string
  assetType: 'Tax Lien' | 'Tax Deed'
  price: number
  status: 'active' | 'watching' | 'redeemed' | 'pending' | 'sold' | 'requires_review'
  auctionDate: string
}

interface InvestmentGridProps {
  investments?: Investment[]
  loading?: boolean
}

// Sample data
const sampleInvestments: Investment[] = [
  {
    id: '1',
    address: '1234 Oak Street',
    parcelApn: '123-456-789',
    county: 'Maricopa',
    state: 'AZ',
    assetType: 'Tax Lien',
    price: 12500,
    status: 'active',
    auctionDate: '2026-07-15'
  },
  {
    id: '2',
    address: '5678 Pine Avenue',
    parcelApn: '987-654-321',
    county: 'Pinal',
    state: 'AZ',
    assetType: 'Tax Deed',
    price: 45000,
    status: 'watching',
    auctionDate: '2026-08-01'
  },
  {
    id: '3',
    address: '9012 Maple Drive',
    parcelApn: '456-789-012',
    county: 'Pima',
    state: 'AZ',
    assetType: 'Tax Lien',
    price: 8900,
    status: 'pending',
    auctionDate: '2026-07-22'
  },
  {
    id: '4',
    address: '3456 Cedar Lane',
    parcelApn: '789-012-345',
    county: 'Yavapai',
    state: 'AZ',
    assetType: 'Tax Deed',
    price: 65000,
    status: 'redeemed',
    auctionDate: '2026-06-10'
  },
  {
    id: '5',
    address: '7890 Birch Court',
    parcelApn: '012-345-678',
    county: 'Coconino',
    state: 'AZ',
    assetType: 'Tax Lien',
    price: 15750,
    status: 'requires_review',
    auctionDate: '2026-07-28'
  },
  {
    id: '6',
    address: '2345 Elm Street',
    parcelApn: '345-678-901',
    county: 'Mohave',
    state: 'AZ',
    assetType: 'Tax Deed',
    price: 38500,
    status: 'sold',
    auctionDate: '2026-05-20'
  }
]

export default function InvestmentGrid({
  investments = sampleInvestments,
  loading = false
}: InvestmentGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const getStatusBadge = (status: Investment['status']) => {
    const styles = {
      active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      watching: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      redeemed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      pending: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
      sold: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
      requires_review: 'bg-red-500/20 text-red-400 border-red-500/30'
    }

    const labels = {
      active: 'Active',
      watching: 'Watching',
      redeemed: 'Redeemed',
      pending: 'Pending',
      sold: 'Sold',
      requires_review: 'Requires Review'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
              <div className="h-10 bg-white/10 rounded" />
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <TrendingUp className="w-16 h-16 text-white/20 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white/60 mb-2">No Investments Yet</h3>
        <p className="text-white/40">
          Start exploring the marketplace to find your first opportunity
        </p>
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-semibold hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] transition-all">
          Browse Marketplace
        </button>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investments.map((investment, index) => (
        <GlassCard
          key={investment.id}
          hover
          glow
          glowColor={investment.status === 'active' ? 'blue' : investment.status === 'watching' ? 'purple' : 'gold'}
          className={`p-6 cursor-pointer ${
            index % 5 === 0 ? 'lg:col-span-2' : ''
          }`}
          onMouseEnter={() => setHoveredId(investment.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  investment.assetType === 'Tax Lien'
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'bg-neon-purple/20 text-neon-purple'
                }`}>
                  {investment.assetType}
                </span>
                {getStatusBadge(investment.status)}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{investment.address}</h3>
              <p className="text-sm text-white/40 font-mono">APN: {investment.parcelApn}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4 text-neon-blue" />
              <span className="text-sm">{investment.county}, {investment.state}</span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <DollarSign className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-semibold">${investment.price.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <Calendar className="w-4 h-4 text-neon-purple" />
              <span className="text-sm">{new Date(investment.auctionDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            className={`
              w-full py-3 rounded-xl font-semibold
              bg-white/5 border border-white/10
              hover:bg-white/10 hover:border-neon-blue/50
              transition-all duration-300
              ${hoveredId === investment.id ? 'text-neon-blue' : 'text-white/60'}
            `}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            View Details
          </button>
        </GlassCard>
      ))}
    </div>
  )
}
