/**
 * Live Auction Tracker
 * Real-time display of recent auction purchases
 */

'use client'

import { useState, useEffect } from 'react'
import { Activity, MapPin, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import Badge from '../ui/Badge'

interface AuctionPurchase {
  id: string
  parcelApn: string
  county: string
  state: string
  propertyType: string
  purchasePrice: number
  auctionDate: string
  status: 'won' | 'pending' | 'confirmed'
  timestamp: Date
}

interface LiveAuctionTrackerProps {
  limit?: number
}

// Generate sample live purchase data
const generateSamplePurchases = (count: number): AuctionPurchase[] => {
  const counties = ['Maricopa', 'Pinal', 'Pima', 'Yavapai', 'Coconino']
  const types = ['Residential', 'Commercial', 'Vacant Land', 'Industrial']
  const statuses: ('won' | 'pending' | 'confirmed')[] = ['won', 'pending', 'confirmed']

  return Array.from({ length: count }, (_, i) => ({
    id: `purchase-${i}`,
    parcelApn: `${Math.floor(Math.random() * 900000 + 100000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    county: counties[Math.floor(Math.random() * counties.length)],
    state: 'AZ',
    propertyType: types[Math.floor(Math.random() * types.length)],
    purchasePrice: Math.floor(Math.random() * 50000 + 5000),
    auctionDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: new Date(Date.now() - i * 1000 * 60 * 5) // 5 minutes apart
  }))
}

export default function LiveAuctionTracker({ limit = 5 }: LiveAuctionTrackerProps) {
  const [purchases, setPurchases] = useState<AuctionPurchase[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Initialize with sample data
    setPurchases(generateSamplePurchases(limit))

    // Simulate new purchases every 10 seconds
    const interval = setInterval(() => {
      if (isLive) {
        const newPurchase = generateSamplePurchases(1)[0]
        setPurchases(prev => [newPurchase, ...prev.slice(0, limit - 1)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [limit, isLive])

  const getStatusBadge = (status: AuctionPurchase['status']) => {
    switch (status) {
      case 'won':
        return <Badge variant="emerald">Won</Badge>
      case 'confirmed':
        return <Badge variant="blue">Confirmed</Badge>
      case 'pending':
        return <Badge variant="gold">Pending</Badge>
    }
  }

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Live Auction Tracker</h3>
              <p className="text-sm text-slate-500">Recent purchases across the platform</p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isLive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`} />
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Purchase list */}
      <div className="divide-y divide-slate-100">
        {purchases.map((purchase, index) => (
          <div
            key={purchase.id}
            className="p-4 hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-2"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              {/* Property type icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-slate-600" />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-slate-900 truncate">
                    Parcel #{purchase.parcelApn}
                  </p>
                  {getStatusBadge(purchase.status)}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{purchase.county}, {purchase.state}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span>{purchase.propertyType}</span>
                  <span className="text-slate-400">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{new Date(purchase.auctionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Price & Time */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-emerald-600 mb-1">
                  <DollarSign className="w-5 h-5" />
                  <span>{purchase.purchasePrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500">{getTimeAgo(purchase.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button className="w-full text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
          View All Auction Activity →
        </button>
      </div>
    </div>
  )
}
