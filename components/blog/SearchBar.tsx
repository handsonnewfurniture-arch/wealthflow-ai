/**
 * Search Bar
 * Search articles by title, content, or author
 */
'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  category: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock search - in production, query API
  const performSearch = (searchQuery: string) => {
    setIsSearching(true)

    // Simulate API delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          slug: 'understanding-tax-lien-investing',
          title: 'Understanding Tax Lien Investing: A Complete Beginner\'s Guide',
          excerpt: 'Learn the fundamentals of tax lien investing, from how it works to potential returns...',
          category: 'Education',
        },
        {
          slug: 'due-diligence-checklist',
          title: 'The Ultimate Tax Lien Due Diligence Checklist',
          excerpt: 'A comprehensive 25-point checklist to evaluate every tax lien opportunity...',
          category: 'Guides',
        },
        {
          slug: 'florida-tax-lien-guide',
          title: 'Complete Guide to Florida Tax Lien Investing',
          excerpt: 'State-specific rules, redemption periods, and strategies for Florida...',
          category: 'Guides',
        },
      ].filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )

      setResults(mockResults)
      setIsSearching(false)
    }, 300)
  }

  useEffect(() => {
    if (query.length > 2) {
      performSearch(query)
    } else {
      setResults([])
    }
  }, [query])

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative max-w-2xl w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search articles..."
          className="w-full pl-12 pr-12 py-3 bg-white border border-forest-200 rounded-xl focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-100 transition-all"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center hover:bg-forest-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-forest-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-forest-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          {isSearching ? (
            <div className="p-8 text-center">
              <div className="inline-block w-6 h-6 border-2 border-forest-200 border-t-forest-600 rounded-full animate-spin"></div>
              <p className="text-forest-600 mt-3">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-3 border-b border-forest-100">
                <p className="text-sm text-forest-600">
                  Found {results.length} {results.length === 1 ? 'article' : 'articles'}
                </p>
              </div>
              {results.map((result) => (
                <Link
                  key={result.slug}
                  href={`/blog/${result.slug}`}
                  onClick={clearSearch}
                  className="block p-4 hover:bg-forest-50 border-b border-forest-50 last:border-0 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-forest-900 pr-4">{result.title}</h4>
                    <span className="flex-shrink-0 text-xs px-2 py-1 bg-gold-100 text-forest-700 rounded-full">
                      {result.category}
                    </span>
                  </div>
                  <p className="text-sm text-forest-600 line-clamp-2">{result.excerpt}</p>
                </Link>
              ))}
            </>
          ) : query.length > 2 ? (
            <div className="p-8 text-center">
              <p className="text-forest-600">No articles found for "{query}"</p>
              <p className="text-sm text-forest-500 mt-2">Try a different search term</p>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-forest-500 text-sm">Type at least 3 characters to search</p>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
