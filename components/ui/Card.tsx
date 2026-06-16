import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'glass-card p-6',
        hover && 'glass-card-hover cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
