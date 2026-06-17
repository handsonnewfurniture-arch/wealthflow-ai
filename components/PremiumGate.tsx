/**
 * PremiumGate Component
 *
 * Access control overlay for premium content
 * Shows upgrade prompt for users without required subscription tier
 */

'use client'

import { Lock, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Button from './ui/Button'
import Card from './ui/Card'

interface PremiumGateProps {
  /** Current user's subscription tier */
  userTier: string
  /** Required tier to access content (default: 'pro') */
  requiredTier?: 'pro' | 'elite'
  /** Content to gate */
  children: React.ReactNode
  /** Whether to blur the background content (default: true) */
  blurred?: boolean
  /** Custom message to display */
  message?: string
  /** Show compact version (smaller overlay) */
  compact?: boolean
  /** Optional upgrade link */
  upgradeLink?: string
}

/**
 * Wrapper component that conditionally shows premium gate overlay
 * if user doesn't have required subscription tier
 */
export default function PremiumGate({
  userTier,
  requiredTier = 'pro',
  children,
  blurred = true,
  message,
  compact = false,
  upgradeLink = '/pricing'
}: PremiumGateProps) {
  // Check if user has access
  const hasAccess = ['pro', 'elite'].includes(userTier) ||
    (requiredTier === 'elite' && userTier === 'elite')

  // If user has access, just render children
  if (hasAccess) {
    return <>{children}</>
  }

  // Default messages based on tier
  const defaultMessage = requiredTier === 'elite'
    ? 'Upgrade to Elite to access this exclusive content'
    : 'Upgrade to Pro to view all photos, videos, and documents for this property'

  const displayMessage = message || defaultMessage

  // Compact version (for inline use)
  if (compact) {
    return (
      <div className="relative">
        {blurred && (
          <div className="blur-md pointer-events-none select-none">{children}</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-900/90 backdrop-blur-sm rounded-lg">
          <div className="text-center p-4">
            <Lock className="w-6 h-6 text-gold-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 mb-3">{displayMessage}</p>
            <Link href={upgradeLink}>
              <Button variant="primary" size="sm">
                Upgrade to {requiredTier === 'elite' ? 'Elite' : 'Pro'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Full version (for page sections)
  return (
    <div className="relative min-h-[400px]">
      {blurred && (
        <div className="blur-sm pointer-events-none select-none opacity-40">
          {children}
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-navy-900/80 to-navy-950/90 backdrop-blur-md">
        <Card className="max-w-md mx-4 bg-navy-800/95 border-gold-400/30 backdrop-blur-sm">
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400/20 to-emerald-400/20 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-gold-400/10 animate-pulse" />
              <Lock className="w-10 h-10 text-gold-400 relative z-10" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-gold-400" />
              Premium Content
            </h3>

            {/* Message */}
            <p className="text-gray-300 mb-6 leading-relaxed">
              {displayMessage}
            </p>

            {/* Benefits List */}
            <div className="mb-6 space-y-2 text-left bg-navy-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Access to all property photos and videos
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Download legal documents and reports
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Virtual property tours and drone footage
                </p>
              </div>
              {requiredTier === 'elite' && (
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">
                    Exclusive Elite-only investment opportunities
                  </p>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Link href={upgradeLink} className="block">
                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                >
                  Upgrade to {requiredTier === 'elite' ? 'Elite' : 'Pro'}
                </Button>
              </Link>
              <Link href="/pricing" className="block">
                <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                  View All Plans
                </Button>
              </Link>
            </div>

            {/* Current Tier Badge */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Current plan: <span className="text-gray-400 capitalize font-semibold">{userTier}</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

/**
 * Inline version of PremiumGate for smaller UI elements
 * Shows a simple lock icon with tooltip
 */
export function PremiumBadge({ requiredTier = 'pro' }: { requiredTier?: 'pro' | 'elite' }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gold-400/10 border border-gold-400/30">
      <Lock className="w-3 h-3 text-gold-400" />
      <span className="text-xs font-semibold text-gold-400 uppercase">
        {requiredTier}
      </span>
    </div>
  )
}
