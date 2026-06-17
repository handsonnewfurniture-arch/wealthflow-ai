/**
 * Blog Page
 * Community center and educational content hub
 */

'use client'

import { useState } from 'react'
import FeaturedHero from '@/components/blog/FeaturedHero'
import CategoryPills from '@/components/blog/CategoryPills'
import ArticleCard, { Article } from '@/components/blog/ArticleCard'
import SubscribeSection from '@/components/blog/SubscribeSection'
import SearchBar from '@/components/blog/SearchBar'
import PopularPosts from '@/components/blog/PopularPosts'

// Sample articles data
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'How to Evaluate Tax Lien Properties: A Step-by-Step Checklist',
    excerpt: 'Learn the essential due diligence steps before investing in tax lien certificates. This comprehensive checklist covers title research, property valuation, and risk assessment.',
    author: { name: 'Michael Chen' },
    publishedAt: '2026-06-12',
    readTime: 8,
    category: 'How-To Guides',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
    slug: 'evaluate-tax-lien-properties'
  },
  {
    id: '2',
    title: 'Arizona Tax Deed Auctions: 2026 Market Report',
    excerpt: 'Analysis of Q2 2026 auction results across Maricopa, Pinal, and Pima counties. Discover trends, average yields, and emerging opportunities.',
    author: { name: 'Jessica Torres' },
    publishedAt: '2026-06-10',
    readTime: 12,
    category: 'Market Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=600&fit=crop',
    slug: 'arizona-tax-deed-2026-report'
  },
  {
    id: '3',
    title: 'Case Study: Turning a $5,000 Tax Lien into $42,000',
    excerpt: 'Follow investor Maria Rodriguez through a real tax lien investment from purchase to profitable exit. Learn from her mistakes and successes.',
    author: { name: 'Dr. Sarah Mitchell' },
    publishedAt: '2026-06-08',
    readTime: 15,
    category: 'Case Studies',
    imageUrl: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=600&fit=crop',
    slug: 'case-study-5k-to-42k'
  },
  {
    id: '4',
    title: 'Understanding Redemption Rights: A Legal Primer',
    excerpt: 'Navigate the complex legal framework of tax lien redemption periods. State-by-state comparison and investor protection strategies.',
    author: { name: 'Attorney David Park' },
    publishedAt: '2026-06-05',
    readTime: 10,
    category: 'Legal & Compliance',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
    slug: 'redemption-rights-primer'
  },
  {
    id: '5',
    title: 'Portfolio Diversification Strategies for Tax Lien Investors',
    excerpt: 'Build a balanced tax lien portfolio across multiple states, property types, and risk profiles. Expert recommendations for 2026.',
    author: { name: 'Rachel Kim' },
    publishedAt: '2026-06-03',
    readTime: 11,
    category: 'Investment Strategies',
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
    slug: 'portfolio-diversification'
  },
  {
    id: '6',
    title: 'Online vs. In-Person Auctions: Pros and Cons',
    excerpt: 'Compare the advantages and challenges of virtual and traditional auction formats. Which is right for your investment strategy?',
    author: { name: 'Tom Anderson' },
    publishedAt: '2026-06-01',
    readTime: 7,
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop',
    slug: 'online-vs-in-person-auctions'
  },
  {
    id: '7',
    title: 'New SEC Guidelines for Tax Lien Funds Released',
    excerpt: 'Breaking down the latest regulatory changes affecting institutional tax lien investment vehicles and what it means for individual investors.',
    author: { name: 'Michael Chen' },
    publishedAt: '2026-05-28',
    readTime: 6,
    category: 'Industry News',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=600&fit=crop',
    slug: 'sec-guidelines-tax-lien-funds'
  },
  {
    id: '8',
    title: 'Researching County Records: Tools and Techniques',
    excerpt: 'Master the art of public records research with this guide to online databases, in-person courthouse visits, and FOIA requests.',
    author: { name: 'Jessica Torres' },
    publishedAt: '2026-05-25',
    readTime: 9,
    category: 'How-To Guides',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
    slug: 'researching-county-records'
  },
  {
    id: '9',
    title: 'Florida Tax Deed Market Heats Up in 2026',
    excerpt: 'Florida counties report record-breaking auction participation. Analysis of what is driving investor interest in the Sunshine State.',
    author: { name: 'Dr. Sarah Mitchell' },
    publishedAt: '2026-05-22',
    readTime: 8,
    category: 'Market Analysis',
    imageUrl: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=800&h=600&fit=crop',
    slug: 'florida-tax-deed-2026'
  }
]

export default function BlogPage() {
  const [filteredArticles, setFilteredArticles] = useState(sampleArticles)

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setFilteredArticles(sampleArticles)
    } else {
      // Filter by category (convert category ID to display name)
      const categoryMap: Record<string, string> = {
        'education': 'Education',
        'case-studies': 'Case Studies',
        'market-analysis': 'Market Analysis',
        'legal': 'Legal & Compliance',
        'strategies': 'Investment Strategies',
        'news': 'Industry News',
        'guides': 'How-To Guides'
      }

      const categoryName = categoryMap[categoryId]
      if (categoryName) {
        setFilteredArticles(sampleArticles.filter(article => article.category === categoryName))
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Featured Hero */}
      <FeaturedHero />

      {/* Category Pills */}
      <CategoryPills onCategoryChange={handleCategoryChange} />

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Articles Column */}
          <div className="lg:col-span-2">
            {/* Articles Grid */}
            <div className="grid gap-8 mb-12">
              {filteredArticles.slice(0, 3).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Subscribe Section (after first 3 articles) */}
            <div className="mb-12">
              <SubscribeSection />
            </div>

            {/* More Articles */}
            {filteredArticles.length > 3 && (
              <div className="grid gap-8">
                {filteredArticles.slice(3).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-500 text-lg">No articles found in this category.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <PopularPosts />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-slate-600 mb-4">
              © 2026 WealthFlow AI. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-500">
              <a href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</a>
              <a href="/contact" className="hover:text-slate-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
