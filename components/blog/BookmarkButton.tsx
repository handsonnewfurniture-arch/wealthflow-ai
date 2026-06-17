/**
 * Bookmark Button
 * Save/unsave articles for later reading
 */
'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'

interface BookmarkButtonProps {
  postSlug: string
  size?: 'sm' | 'md' | 'lg'
}

export default function BookmarkButton({ postSlug, size = 'md' }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleBookmark = () => {
    setIsAnimating(true)
    setIsSaved(!isSaved)

    // In production, save to database/local storage
    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <button
      onClick={handleBookmark}
      className={`${sizeClasses[size]} flex items-center justify-center bg-cream-50 hover:bg-gold-50 border ${
        isSaved ? 'border-gold-400 bg-gold-50' : 'border-forest-200'
      } rounded-lg transition-all group ${isAnimating ? 'scale-110' : ''}`}
      title={isSaved ? 'Remove from saved' : 'Save for later'}
    >
      <Bookmark
        className={`${iconSizes[size]} ${
          isSaved ? 'text-gold-600 fill-gold-600' : 'text-forest-600 group-hover:text-gold-600'
        } transition-all`}
      />
    </button>
  )
}
