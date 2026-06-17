/**
 * Article Card
 * Individual article preview for grid layout
 */

'use client'

import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

export interface Article {
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
  imageUrl?: string
  slug: string
}

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-semibold rounded">
              {article.category}
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-slate-700 transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime} min</span>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-slate-600 text-xs font-semibold">
              {article.author.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{article.author.name}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
