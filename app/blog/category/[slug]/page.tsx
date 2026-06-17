/**
 * Category Landing Page
 * Shows all articles in a specific category
 */
'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ArticleCard from '@/components/blog/ArticleCard'
import SearchBar from '@/components/blog/SearchBar'
import PopularPosts from '@/components/blog/PopularPosts'
import { Folder, ArrowLeft } from 'lucide-react'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params

  // Mock category data - in production, fetch from API
  const categories = {
    education: {
      name: 'Education',
      description: 'Fundamental concepts and learning resources for tax lien investors',
      icon: '📚',
      color: 'blue',
    },
    guides: {
      name: 'Guides',
      description: 'Step-by-step tutorials and comprehensive how-to guides',
      icon: '📖',
      color: 'green',
    },
    'market-analysis': {
      name: 'Market Analysis',
      description: 'Data-driven insights into tax lien markets and trends',
      icon: '📊',
      color: 'purple',
    },
    legal: {
      name: 'Legal',
      description: 'Legal considerations, compliance, and regulatory updates',
      icon: '⚖️',
      color: 'red',
    },
    strategies: {
      name: 'Strategies',
      description: 'Advanced investment strategies and tactics',
      icon: '🎯',
      color: 'orange',
    },
    'case-studies': {
      name: 'Case Studies',
      description: 'Real-world examples and investor success stories',
      icon: '💡',
      color: 'yellow',
    },
  }

  const category = categories[slug as keyof typeof categories] || categories.education

  // Mock articles for this category
  const articles = [
    {
      slug: 'understanding-tax-lien-investing',
      title: 'Understanding Tax Lien Investing: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of tax lien investing, from how it works to potential returns and risks to watch out for.',
      category: category.name,
      readTime: '15 min read',
      date: 'March 15, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: category.icon,
    },
    {
      slug: 'redemption-periods-explained',
      title: 'Understanding Redemption Periods: State-by-State Guide',
      excerpt: 'Everything you need to know about redemption periods, why they matter, and how they vary by state.',
      category: category.name,
      readTime: '12 min read',
      date: 'March 12, 2025',
      author: 'Sarah Johnson',
      authorAvatar: 'SJ',
      image: category.icon,
    },
    {
      slug: 'getting-started-basics',
      title: 'Getting Started with Tax Liens: 10 Essential Steps',
      excerpt: 'A beginner-friendly roadmap to your first tax lien investment, from research to purchase.',
      category: category.name,
      readTime: '10 min read',
      date: 'March 8, 2025',
      author: 'Michael Chen',
      authorAvatar: 'MC',
      image: category.icon,
    },
    {
      slug: 'risk-management-101',
      title: 'Tax Lien Risk Management 101',
      excerpt: 'Learn how to identify, assess, and mitigate risks in tax lien investing.',
      category: category.name,
      readTime: '14 min read',
      date: 'March 5, 2025',
      author: 'Emily Parker',
      authorAvatar: 'EP',
      image: category.icon,
    },
    {
      slug: 'calculating-returns',
      title: 'How to Calculate Your Tax Lien Returns',
      excerpt: 'A practical guide to understanding and calculating your potential returns on tax lien investments.',
      category: category.name,
      readTime: '11 min read',
      date: 'March 1, 2025',
      author: 'David Rodriguez',
      authorAvatar: 'DR',
      image: category.icon,
    },
    {
      slug: 'common-mistakes',
      title: '7 Common Mistakes New Tax Lien Investors Make',
      excerpt: 'Avoid these pitfalls and start your tax lien journey on the right foot.',
      category: category.name,
      readTime: '9 min read',
      date: 'February 28, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: category.icon,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Category Header */}
        <section className="bg-gradient-to-br from-forest-700 to-forest-900 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-cream-200 hover:text-cream-50 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center text-4xl shadow-lg">
                {category.icon}
              </div>
              <div>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-50 mb-2">
                  {category.name}
                </h1>
                <p className="text-xl text-cream-200">{category.description}</p>
              </div>
            </div>

            <p className="text-cream-300">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-8 bg-white border-b border-forest-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBar />
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Articles */}
              <div className="lg:col-span-2">
                <div className="grid gap-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <button className="px-8 py-3 bg-forest-600 hover:bg-forest-700 text-cream-50 rounded-xl font-semibold transition-colors">
                    Load More Articles
                  </button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <PopularPosts />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
