/**
 * Dashboard Metric Overview Cards
 * Key portfolio metrics at a glance
 */

'use client'

import { TrendingUp, TrendingDown, DollarSign, FileText, Gavel, ShoppingCart } from 'lucide-react'

interface Metric {
  label: string
  value: string
  change: number
  changeLabel: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

interface MetricCardsProps {
  metrics?: Metric[]
  loading?: boolean
}

const defaultMetrics: Metric[] = [
  {
    label: 'Total Portfolio Value',
    value: '$487,350',
    change: 12.5,
    changeLabel: 'vs last month',
    icon: DollarSign,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50'
  },
  {
    label: 'Active Tax Liens',
    value: '23',
    change: 3,
    changeLabel: 'new this week',
    icon: FileText,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50'
  },
  {
    label: 'Upcoming Auctions',
    value: '47',
    change: -5,
    changeLabel: 'vs last week',
    icon: Gavel,
    iconColor: 'text-gold-600',
    iconBg: 'bg-gold-50'
  },
  {
    label: 'Total Purchases',
    value: '156',
    change: 8,
    changeLabel: 'this month',
    icon: ShoppingCart,
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-50'
  }
]

export default function MetricCards({ metrics = defaultMetrics, loading = false }: MetricCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg" />
              <div className="w-16 h-6 bg-slate-100 rounded" />
            </div>
            <div className="w-24 h-8 bg-slate-100 rounded mb-2" />
            <div className="w-32 h-4 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon
        const isPositive = metric.change > 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
          >
            {/* Icon & Trend */}
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>

              <div className={`flex items-center gap-1 text-sm font-semibold ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                <TrendIcon className="w-4 h-4" />
                <span>{Math.abs(metric.change)}%</span>
              </div>
            </div>

            {/* Value */}
            <div className="mb-1">
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
            </div>

            {/* Label */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">{metric.label}</p>
            </div>

            {/* Change label */}
            <p className="text-xs text-slate-500 mt-2">{metric.changeLabel}</p>
          </div>
        )
      })}
    </div>
  )
}
