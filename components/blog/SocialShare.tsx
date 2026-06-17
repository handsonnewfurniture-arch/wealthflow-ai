/**
 * Social Share Buttons
 * Share article on Twitter, LinkedIn, Facebook, email, and copy link
 */
'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Facebook, Mail, Link as LinkIcon, Check } from 'lucide-react'

interface SocialShareProps {
  title: string
  url: string
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.origin + url : url
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Twitter */}
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-blue-50 border border-forest-200 hover:border-blue-400 rounded-lg transition-all group"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4 text-forest-600 group-hover:text-blue-500 transition-colors" />
      </a>

      {/* LinkedIn */}
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-blue-50 border border-forest-200 hover:border-blue-600 rounded-lg transition-all group"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4 text-forest-600 group-hover:text-blue-700 transition-colors" />
      </a>

      {/* Facebook */}
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-blue-50 border border-forest-200 hover:border-blue-600 rounded-lg transition-all group"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4 text-forest-600 group-hover:text-blue-600 transition-colors" />
      </a>

      {/* Email */}
      <a
        href={shareLinks.email}
        className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-orange-50 border border-forest-200 hover:border-orange-400 rounded-lg transition-all group"
        title="Share via Email"
      >
        <Mail className="w-4 h-4 text-forest-600 group-hover:text-orange-600 transition-colors" />
      </a>

      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        className="w-10 h-10 flex items-center justify-center bg-cream-50 hover:bg-green-50 border border-forest-200 hover:border-green-400 rounded-lg transition-all group"
        title="Copy Link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <LinkIcon className="w-4 h-4 text-forest-600 group-hover:text-green-600 transition-colors" />
        )}
      </button>
    </div>
  )
}
