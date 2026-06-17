/**
 * Category Pills
 * Horizontal scrollable category filters
 */

'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count: number
}

interface CategoryPillsProps {
  categories?: Category[]
  onCategoryChange?: (categoryId: string) => void
}

// Sample categories
const defaultCategories: Category[] = [
  { id: 'all', name: 'All Articles', count: 47 },
  { id: 'education', name: 'Education', count: 18 },
  { id: 'case-studies', name: 'Case Studies', count: 12 },
  { id: 'market-analysis', name: 'Market Analysis', count: 8 },
  { id: 'legal', name: 'Legal & Compliance', count: 5 },
  { id: 'strategies', name: 'Investment Strategies', count: 9 },
  { id: 'news', name: 'Industry News', count: 6 },
  { id: 'guides', name: 'How-To Guides', count: 11 }
]

export default function CategoryPills({
  categories = defaultCategories,
  onCategoryChange
}: CategoryPillsProps) {
  const [activeCategory, setActiveCategory] = useState('all')

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    onCategoryChange?.(categoryId)
  }

  return (
    <section className="bg-[#f9f9f9] border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Gradient fade on right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f9f9f9] to-transparent pointer-events-none z-10" />

          <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
            <div className="flex gap-3 min-w-max">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap
                    transition-all duration-200
                    ${activeCategory === category.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }
                  `}
                >
                  {category.name}
                  <span className={`ml-2 ${activeCategory === category.id ? 'text-white/70' : 'text-slate-400'}`}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
