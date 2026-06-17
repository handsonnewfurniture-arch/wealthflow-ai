/**
 * Scrolling Marquee Component
 * Infinite scroll of investor tags
 */

'use client'

interface ScrollingMarqueeProps {
  tags: string[]
  speed?: 'slow' | 'medium' | 'fast'
}

export default function ScrollingMarquee({ tags, speed = 'medium' }: ScrollingMarqueeProps) {
  const speeds = {
    slow: 'animate-marquee-slow',
    medium: 'animate-marquee',
    fast: 'animate-marquee-fast'
  }

  // Duplicate tags for seamless loop
  const allTags = [...tags, ...tags]

  return (
    <div className="relative overflow-hidden py-6">
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

      {/* Scrolling content */}
      <div className="flex gap-8 whitespace-nowrap">
        <div className={`flex gap-8 ${speeds[speed]}`}>
          {allTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-white/40 font-medium"
            >
              <span className="text-neon-blue">•</span>
              <span>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
