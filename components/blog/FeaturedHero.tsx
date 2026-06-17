/**
 * Featured Hero Section
 * Large featured post with image and headline
 */

'use client'

import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

interface FeaturedPost {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar?: string
  }
  publishedAt: string
  readTime: number
  category: string
  imageUrl: string
  slug: string
}

interface FeaturedHeroProps {
  post?: FeaturedPost
}

// Sample featured post
const defaultPost: FeaturedPost = {
  id: '1',
  title: 'Understanding Tax Lien Investing: A Comprehensive Guide for Beginners',
  excerpt: 'Tax lien investing offers a unique opportunity to earn substantial returns while contributing to local government revenue. This comprehensive guide covers everything from the fundamentals to advanced strategies.',
  author: {
    name: 'Dr. Sarah Mitchell'
  },
  publishedAt: '2026-06-15',
  readTime: 12,
  category: 'Education',
  imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop',
  slug: 'understanding-tax-lien-investing'
}

export default function FeaturedHero({ post = defaultPost }: FeaturedHeroProps) {
  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Category badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-slate-800 text-white text-sm font-medium rounded">
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="mb-4">
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                Featured Article
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-6 text-sm text-slate-500 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-slate-900">{post.author.name}</p>
                <p className="text-sm text-slate-500">Contributing Author</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
            >
              Read Full Article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
