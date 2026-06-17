/**
 * Related Posts
 * Show 3 related articles at bottom of post
 */
'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
}

interface RelatedPostsProps {
  currentSlug: string
  currentCategory: string
}

export default function RelatedPosts({ currentSlug, currentCategory }: RelatedPostsProps) {
  // Mock data - in production, fetch from API based on category
  const relatedPosts: Post[] = [
    {
      slug: 'due-diligence-checklist',
      title: 'The Ultimate Tax Lien Due Diligence Checklist',
      excerpt: 'A comprehensive 25-point checklist to evaluate every tax lien opportunity before you bid.',
      category: 'Guides',
      readTime: '12 min read',
      date: 'March 10, 2025',
      image: '🔍',
    },
    {
      slug: 'florida-tax-lien-guide',
      title: 'Complete Guide to Florida Tax Lien Investing',
      excerpt: 'State-specific rules, redemption periods, and strategies for investing in Florida tax liens.',
      category: 'Guides',
      readTime: '18 min read',
      date: 'March 5, 2025',
      image: '🌴',
    },
    {
      slug: 'first-auction-tips',
      title: '10 Things I Wish I Knew Before My First Auction',
      excerpt: 'Real lessons from a first-time investor who made mistakes so you don\'t have to.',
      category: 'Case Studies',
      readTime: '8 min read',
      date: 'February 28, 2025',
      image: '💡',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-cream-50 to-beige-50 border-t border-forest-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-forest-900 mb-3">
            Related Articles
          </h2>
          <p className="text-lg text-forest-700">
            Continue learning with these hand-picked resources
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {relatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg border border-forest-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image/Icon */}
              <div className="aspect-[16/9] bg-gradient-to-br from-forest-100 to-beige-100 flex items-center justify-center text-6xl">
                {post.image}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="inline-block px-3 py-1 bg-gold-100 border border-gold-300 rounded-full mb-3">
                  <span className="text-xs font-semibold text-forest-700">{post.category}</span>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl font-bold text-forest-900 mb-2 group-hover:text-forest-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-forest-600 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-forest-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-forest-600 hover:bg-forest-700 text-cream-50 rounded-lg font-semibold transition-colors"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
