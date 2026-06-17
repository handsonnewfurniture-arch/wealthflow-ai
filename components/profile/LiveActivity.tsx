/**
 * Live Activity Feed
 * Recent user actions and updates
 */

'use client'

import { useState, useEffect } from 'react'
import GlassCard from './GlassCard'
import { Bookmark, ShoppingCart, Gavel, CheckCircle, Clock, Activity } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'saved' | 'purchased' | 'auction' | 'status_update' | 'deadline_review'
  description: string
  timestamp: Date
  icon: React.ElementType
  color: string
}

interface LiveActivityProps {
  limit?: number
  loading?: boolean
}

// Generate sample activity
const generateSampleActivity = (): ActivityItem[] => {
  const activities = [
    {
      type: 'saved' as const,
      description: 'Saved a new tax lien in Maricopa County',
      icon: Bookmark,
      color: 'text-neon-blue'
    },
    {
      type: 'purchased' as const,
      description: 'Purchased a tax deed for $45,000',
      icon: ShoppingCart,
      color: 'text-emerald-400'
    },
    {
      type: 'auction' as const,
      description: 'Joined Pinal County auction',
      icon: Gavel,
      color: 'text-neon-purple'
    },
    {
      type: 'status_update' as const,
      description: 'Updated portfolio status for 3 properties',
      icon: CheckCircle,
      color: 'text-gold-400'
    },
    {
      type: 'deadline_review' as const,
      description: 'Reviewed redemption deadline for APN 123-456',
      icon: Clock,
      color: 'text-red-400'
    }
  ]

  return activities.map((activity, index) => ({
    id: `activity-${index}`,
    ...activity,
    timestamp: new Date(Date.now() - index * 1000 * 60 * Math.random() * 60)
  }))
}

export default function LiveActivity({ limit = 5, loading = false }: LiveActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])

  useEffect(() => {
    setActivities(generateSampleActivity().slice(0, limit))
  }, [limit])

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-neon-blue animate-pulse" />
          <h3 className="text-xl font-bold text-white">Live Activity</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Activity className="w-6 h-6 text-neon-blue" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white">Live Activity</h3>
      </div>

      {/* Activity Feed */}
      <div className="space-y-6 relative">
        {activities.map((activity, index) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.id}
              className="flex gap-4 group relative"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors z-10`}>
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="text-white/80 text-sm leading-relaxed mb-1">
                  {activity.description}
                </p>
                <span className="text-white/40 text-xs">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* View All Button */}
      <button className="w-full mt-6 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-neon-blue border border-white/10 hover:border-neon-blue/50 hover:bg-white/5 transition-all">
        View All Activity
      </button>
    </GlassCard>
  )
}
