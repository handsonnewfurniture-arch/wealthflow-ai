import { ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'emerald' | 'gold' | 'red' | 'blue' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'emerald', className }: BadgeProps) {
  const variants = {
    emerald: 'badge-emerald',
    gold: 'badge-gold',
    red: 'badge-red',
    blue: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    gray: 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }

  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  )
}
