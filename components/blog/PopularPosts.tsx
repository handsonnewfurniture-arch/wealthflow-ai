/**
 * Popular Posts Sidebar
 * Shows top 5 most-read articles
 */
'use client'

import Link from 'next/link'
import { TrendingUp, Eye } from 'lucide-react'

interface Post {
  slug: string
  title: string
  views: string
  readTime: string
}

export default function PopularPosts() {
  const popularPosts: Post[] = [
    {
      slug: 'understanding-tax-lien-investing',
      title: 'Understanding Tax Lien Investing: A Complete Beginner\'s Guide',
      views: '12.4k',
      readTime: '15 min',
    },
    {
      slug: 'due-diligence-checklist',
      title: 'The Ultimate Tax Lien Due Diligence Checklist',
      views: '9.2k',
      readTime: '12 min',
    },
    {
      slug: 'florida-tax-lien-guide',
      title: 'Complete Guide to Florida Tax Lien Investing',
      views: '8.7k',
      readTime: '18 min',
    },
    {
      slug: 'first-auction-tips',
      title: '10 Things I Wish I Knew Before My First Auction',
      views: '7.1k',
      readTime: '8 min',
    },
    {
      slug: 'title-research-guide',
      title: 'How to Research Property Titles Before Bidding',
      views: '6.5k',
      readTime: '14 min',
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-forest-100 p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-forest-100">
        <TrendingUp className="w-5 h-5 text-orange-600" />
        <h3 className="font-serif text-xl font-bold text-forest-900">Popular Articles</h3>
      </div>

      {/* Posts List */}
      <div className="space-y-5">
        {popularPosts.map((post, index) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <div className="flex items-start space-x-3">
              {/* Rank Number */}
              <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-gradient-to-br from-forest-100 to-beige-100 rounded-lg font-bold text-sm text-forest-700">
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-forest-900 group-hover:text-forest-600 transition-colors line-clamp-2 mb-2 leading-snug">
                  {post.title}
                </h4>
                <div className="flex items-center space-x-3 text-xs text-forest-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Link */}
      <div className="mt-6 pt-4 border-t border-forest-100">
        <Link
          href="/blog"
          className="block text-center py-2 px-4 bg-forest-50 hover:bg-forest-100 text-forest-900 rounded-lg font-semibold text-sm transition-colors"
        >
          View All Articles
        </Link>
      </div>
    </div>
  )
}
