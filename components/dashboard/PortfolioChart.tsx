/**
 * Portfolio Growth Chart
 * Line chart showing portfolio value or purchase volume over 30 days
 */

'use client'

import { TrendingUp } from 'lucide-react'

interface ChartDataPoint {
  date: string
  value: number
}

interface PortfolioChartProps {
  data?: ChartDataPoint[]
  title?: string
  valuePrefix?: string
  loading?: boolean
}

// Generate sample data for last 30 days
const generateSampleData = (): ChartDataPoint[] => {
  const data: ChartDataPoint[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Generate trending upward values with some variance
    const baseValue = 400000
    const trend = (29 - i) * 3000
    const variance = Math.random() * 10000 - 5000

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(baseValue + trend + variance)
    })
  }

  return data
}

export default function PortfolioChart({
  data = generateSampleData(),
  title = 'Portfolio Growth (30 Days)',
  valuePrefix = '$',
  loading = false
}: PortfolioChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="h-8 w-48 bg-slate-100 rounded mb-6 animate-pulse" />
        <div className="h-64 bg-slate-50 rounded animate-pulse" />
      </div>
    )
  }

  // Calculate chart dimensions
  const width = 100 // percentage
  const height = 256 // pixels
  const padding = { top: 20, right: 20, bottom: 30, left: 50 }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const valueRange = maxValue - minValue

  // Calculate points for the line
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = ((maxValue - point.value) / valueRange) * 100

    return { x, y, ...point }
  })

  // Create SVG path
  const pathData = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${point.x} ${point.y}`
    })
    .join(' ')

  // Create gradient area path
  const areaPathData = `${pathData} L 100 100 L 0 100 Z`

  // Calculate total growth
  const firstValue = data[0]?.value || 0
  const lastValue = data[data.length - 1]?.value || 0
  const growth = lastValue - firstValue
  const growthPercent = ((growth / firstValue) * 100).toFixed(1)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {valuePrefix}{lastValue.toLocaleString()}
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span>+{growthPercent}%</span>
            </div>
          </div>
        </div>

        {/* Time period selector */}
        <div className="flex gap-2">
          {['7D', '30D', '90D', '1Y'].map((period) => (
            <button
              key={period}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                period === '30D'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Area under the line */}
          <path
            d={areaPathData}
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="1.5"
                fill="white"
                stroke="#10b981"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                className="hover:r-2 cursor-pointer transition-all"
              />
            </g>
          ))}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 -ml-12">
          <span>{valuePrefix}{maxValue.toLocaleString()}</span>
          <span>{valuePrefix}{((maxValue + minValue) / 2).toLocaleString()}</span>
          <span>{valuePrefix}{minValue.toLocaleString()}</span>
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 -mb-6">
          <span>{data[0]?.date}</span>
          <span>{data[Math.floor(data.length / 2)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  )
}
