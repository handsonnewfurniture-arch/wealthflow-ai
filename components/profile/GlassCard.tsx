/**
 * Glassmorphism Card Component
 * Premium dark mode card with glass effect
 */

import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  glowColor?: 'blue' | 'purple' | 'gold'
}

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  glowColor = 'blue'
}: GlassCardProps) {
  const glowColors = {
    blue: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]',
    purple: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    gold: 'hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]'
  }

  return (
    <div
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl
        transition-all duration-300
        ${hover ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]' : ''}
        ${glow ? glowColors[glowColor] : ''}
        ${className}
      `}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
