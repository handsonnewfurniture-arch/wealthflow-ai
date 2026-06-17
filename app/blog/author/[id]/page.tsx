/**
 * Author Profile Page
 * Shows author bio, social links, and all their articles
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ArticleCard from '@/components/blog/ArticleCard'
import { Twitter, Linkedin, Globe, Mail, MapPin, Award } from 'lucide-react'

interface AuthorPageProps {
  params: {
    id: string
  }
}

export default function AuthorPage({ params }: AuthorPageProps) {
  const { id } = params

  // Mock author data - in production, fetch from API
  const author = {
    id: 'ted-thomas',
    name: 'Ted Thomas',
    role: 'Tax Lien Investment Expert',
    avatar: 'TT',
    bio: 'Ted Thomas is a renowned tax lien and tax deed investing expert with over 30 years of experience. He has taught thousands of students how to build wealth through strategic tax lien investments and has personally completed hundreds of successful transactions across multiple states.',
    location: 'Florida, USA',
    joinDate: 'January 2020',
    stats: {
      articles: 47,
      followers: '12.4k',
      views: '285k',
    },
    social: {
      twitter: 'https://twitter.com/tedthomas',
      linkedin: 'https://linkedin.com/in/tedthomas',
      website: 'https://tedthomas.com',
      email: 'ted@tedthomas.com',
    },
    expertise: [
      'Tax Lien Investing',
      'Tax Deed Sales',
      'Real Estate Strategy',
      'Due Diligence',
      'Property Research',
    ],
  }

  // Mock articles by this author
  const articles = [
    {
      slug: 'understanding-tax-lien-investing',
      title: 'Understanding Tax Lien Investing: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of tax lien investing, from how it works to potential returns and risks to watch out for.',
      category: 'Education',
      readTime: '15 min read',
      date: 'March 15, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '📚',
    },
    {
      slug: 'due-diligence-checklist',
      title: 'The Ultimate Tax Lien Due Diligence Checklist',
      excerpt: 'A comprehensive 25-point checklist to evaluate every tax lien opportunity before you bid.',
      category: 'Guides',
      readTime: '12 min read',
      date: 'March 10, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '✅',
    },
    {
      slug: 'florida-tax-lien-guide',
      title: 'Complete Guide to Florida Tax Lien Investing',
      excerpt: 'State-specific rules, redemption periods, and strategies for investing in Florida tax liens.',
      category: 'Guides',
      readTime: '18 min read',
      date: 'March 5, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '🌴',
    },
    {
      slug: 'interest-rates-comparison',
      title: 'Tax Lien Interest Rates by State: 2025 Comparison',
      excerpt: 'A data-driven analysis of tax lien interest rates across all 50 states to help you find the best opportunities.',
      category: 'Market Analysis',
      readTime: '10 min read',
      date: 'February 28, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '📊',
    },
    {
      slug: 'avoiding-title-issues',
      title: 'How to Avoid Common Title Issues in Tax Lien Investing',
      excerpt: 'Protect your investments by understanding and preventing the most common title complications.',
      category: 'Legal',
      readTime: '14 min read',
      date: 'February 20, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '⚖️',
    },
    {
      slug: 'first-investment-success',
      title: 'My First $50k Tax Lien Investment: A Complete Breakdown',
      excerpt: 'A transparent case study of how I turned a $5,000 tax lien into a $50,000 property.',
      category: 'Case Studies',
      readTime: '16 min read',
      date: 'February 15, 2025',
      author: 'Ted Thomas',
      authorAvatar: 'TT',
      image: '💰',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Author Header */}
        <section className="bg-gradient-to-br from-forest-700 to-forest-900 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-forest-900 font-bold text-4xl shadow-2xl">
                  {author.avatar}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream-50 mb-2">
                  {author.name}
                </h1>
                <p className="text-xl text-cream-200 mb-4">{author.role}</p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-cream-300 mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{author.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>Joined {author.joinDate}</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-3">
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-cream-50/10 hover:bg-cream-50/20 border border-cream-50/20 rounded-lg transition-colors"
                  >
                    <Twitter className="w-5 h-5 text-cream-100" />
                  </a>
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-cream-50/10 hover:bg-cream-50/20 border border-cream-50/20 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-cream-100" />
                  </a>
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-cream-50/10 hover:bg-cream-50/20 border border-cream-50/20 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5 text-cream-100" />
                  </a>
                  <a
                    href={`mailto:${author.social.email}`}
                    className="w-10 h-10 flex items-center justify-center bg-cream-50/10 hover:bg-cream-50/20 border border-cream-50/20 rounded-lg transition-colors"
                  >
                    <Mail className="w-5 h-5 text-cream-100" />
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="flex md:flex-col gap-8 md:gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-cream-50">{author.stats.articles}</div>
                  <div className="text-sm text-cream-300">Articles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cream-50">{author.stats.followers}</div>
                  <div className="text-sm text-cream-300">Followers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cream-50">{author.stats.views}</div>
                  <div className="text-sm text-cream-300">Total Views</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Author Bio & Content */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-forest-100 p-6 sticky top-24">
                  <h3 className="font-serif text-xl font-bold text-forest-900 mb-4">About</h3>
                  <p className="text-forest-700 leading-relaxed mb-6">{author.bio}</p>

                  <h4 className="font-semibold text-forest-900 mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {author.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-forest-50 border border-forest-200 text-forest-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Articles */}
              <div className="lg:col-span-2">
                <h2 className="font-serif text-3xl font-bold text-forest-900 mb-8">
                  Articles by {author.name}
                </h2>
                <div className="grid gap-8">
                  {articles.map((article) => (
                    <ArticleCard key={article.slug} {...article} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
