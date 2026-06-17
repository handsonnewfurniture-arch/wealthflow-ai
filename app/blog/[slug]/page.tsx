/**
 * Single Blog Post Page
 * Full article view with sticky TOC and progress bar
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/Navbar'
import SocialShare from '@/components/blog/SocialShare'
import BookmarkButton from '@/components/blog/BookmarkButton'
import CommentSection from '@/components/blog/CommentSection'
import RelatedPosts from '@/components/blog/RelatedPosts'

interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

// Sample TOC data
const tableOfContents: TableOfContentsItem[] = [
  { id: 'introduction', title: 'Introduction', level: 1 },
  { id: 'what-are-tax-liens', title: 'What Are Tax Liens?', level: 1 },
  { id: 'how-they-work', title: 'How They Work', level: 2 },
  { id: 'types-of-liens', title: 'Types of Tax Liens', level: 2 },
  { id: 'why-invest', title: 'Why Invest in Tax Liens?', level: 1 },
  { id: 'potential-returns', title: 'Potential Returns', level: 2 },
  { id: 'risk-factors', title: 'Risk Factors to Consider', level: 2 },
  { id: 'getting-started', title: 'Getting Started', level: 1 },
  { id: 'research-phase', title: 'Research Phase', level: 2 },
  { id: 'first-investment', title: 'Making Your First Investment', level: 2 },
  { id: 'due-diligence', title: 'Due Diligence Checklist', level: 1 },
  { id: 'conclusion', title: 'Conclusion', level: 1 }
]

// Sample article data
const article = {
  title: 'Understanding Tax Lien Investing: A Comprehensive Guide for Beginners',
  author: {
    name: 'Dr. Sarah Mitchell',
    bio: 'Tax lien investment specialist with 15+ years of experience',
    avatar: ''
  },
  publishedAt: '2026-06-15',
  readTime: 12,
  category: 'Education',
  imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop'
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('introduction')

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      const totalDocumentHeight = documentHeight - windowHeight
      const progress = (scrollTop / totalDocumentHeight) * 100

      setReadingProgress(Math.min(100, Math.max(0, progress)))

      // Update active section based on scroll position
      const sections = tableOfContents.map(item => document.getElementById(item.id)).filter(Boolean)
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.getBoundingClientRect().top <= 150) {
          setActiveSection(section.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 z-50">
        <div
          className="h-full bg-orange-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Back Button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-12">
              {/* Category */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-slate-900 text-white text-sm font-semibold rounded">
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Meta info */}
              <div className="flex items-center gap-6 text-sm text-slate-500 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between pb-8 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-slate-600 font-semibold">
                      {article.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{article.author.name}</p>
                    <p className="text-sm text-slate-500">{article.author.bio}</p>
                  </div>
                </div>

                {/* Share & Bookmark */}
                <div className="flex items-center space-x-2">
                  <BookmarkButton postSlug={params.slug} />
                  <SocialShare title={article.title} url={`/blog/${params.slug}`} />
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="mb-12">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-slate prose-lg max-w-none">
              <div id="introduction">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Introduction</h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Tax lien investing represents one of the most misunderstood yet potentially lucrative investment strategies available to individual investors. While Wall Street focuses on stocks and bonds, savvy investors are quietly earning consistent returns by purchasing tax lien certificates at county auctions across America.
                </p>
                <p className="text-slate-700 leading-relaxed mb-6">
                  This comprehensive guide will walk you through everything you need to know to get started with tax lien investing, from understanding the basic mechanics to making your first successful investment.
                </p>
              </div>

              <div id="what-are-tax-liens" className="mt-12">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">What Are Tax Liens?</h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  When property owners fail to pay their real estate taxes, local governments place a lien on the property. These liens take priority over almost all other debts, including mortgages. To recover the unpaid taxes quickly, many counties sell these tax lien certificates to investors.
                </p>

                <div id="how-they-work" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">How They Work</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    The process is straightforward: you pay the delinquent taxes on behalf of the property owner, and in return, you receive a tax lien certificate. The property owner must repay you the original amount plus interest (set by state law) within a redemption period, typically 1-3 years.
                  </p>
                </div>

                <div id="types-of-liens" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Types of Tax Liens</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Tax liens come in several varieties, including residential, commercial, and agricultural. Each type carries different risk profiles and potential returns. Understanding these distinctions is crucial for building a balanced portfolio.
                  </p>
                </div>
              </div>

              <div id="why-invest" className="mt-12">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Why Invest in Tax Liens?</h2>

                <div id="potential-returns" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Potential Returns</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Interest rates on tax liens vary by state but typically range from 8% to 36% annually. These returns are guaranteed by state law and backed by real estate, making them relatively secure compared to other high-yield investments.
                  </p>
                </div>

                <div id="risk-factors" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Risk Factors to Consider</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    While tax liens offer attractive returns, they're not without risks. Properties may be worthless, redemption can be delayed, and foreclosure processes can be complex and expensive. Thorough due diligence is essential.
                  </p>
                </div>
              </div>

              <div id="getting-started" className="mt-12">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Getting Started</h2>

                <div id="research-phase" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Research Phase</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Begin by researching counties in your state that offer tax lien certificates. Attend auctions as an observer before bidding. Study successful investors' strategies and learn your state's specific laws governing tax liens.
                  </p>
                </div>

                <div id="first-investment" className="mt-8">
                  <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">Making Your First Investment</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">
                    Start small with your first investment. Choose properties in areas you understand, with clear title histories and reasonable redemption prospects. Consider working with a mentor or joining an investment group for guidance.
                  </p>
                </div>
              </div>

              <div id="due-diligence" className="mt-12">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Due Diligence Checklist</h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Before purchasing any tax lien, complete these essential steps: verify the property exists and its condition, research the title for other liens, confirm the property value exceeds your investment, check local zoning and environmental issues, and understand the redemption timeline.
                </p>
              </div>

              <div id="conclusion" className="mt-12">
                <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">Conclusion</h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  Tax lien investing offers a unique opportunity to earn above-market returns backed by real estate. While it requires education, research, and careful execution, the rewards can be substantial for patient, diligent investors.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Start your journey by attending a local tax sale, connecting with experienced investors, and building your knowledge base. With the right approach, tax lien investing can become a valuable component of your investment portfolio.
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection postSlug={params.slug} />
          </article>

          {/* Sidebar with TOC */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-6">Table of Contents</h3>
                <nav>
                  <ul className="space-y-3">
                    {tableOfContents.map((item) => (
                      <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 16}px` }}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`
                            text-left w-full text-sm transition-colors
                            ${activeSection === item.id
                              ? 'text-orange-600 font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                            }
                          `}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      <RelatedPosts currentSlug={params.slug} currentCategory={article.category} />
    </div>
  )
}
