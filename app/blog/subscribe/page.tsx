/**
 * Email Subscription Management Page
 * Subscribe, unsubscribe, and manage email preferences
 */
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { Mail, Check, ArrowLeft, Bell, TrendingUp, BookOpen, AlertCircle } from 'lucide-react'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Email preferences
  const [preferences, setPreferences] = useState({
    weeklyDigest: true,
    newArticles: true,
    marketUpdates: false,
    caseStudies: true,
    exclusiveOffers: false,
  })

  const handleSubscribe = async () => {
    if (!email) return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setIsLoading(false)
    }, 1000)
  }

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center space-x-2 text-forest-600 hover:text-forest-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-forest-900 mb-4">
              Stay Updated on Tax Lien Investing
            </h1>
            <p className="text-xl text-forest-700 max-w-2xl mx-auto">
              Get the latest articles, market insights, and exclusive strategies delivered to your inbox
            </p>
          </div>

          {/* Subscribe Form */}
          {!isSubscribed ? (
            <div className="bg-white rounded-2xl shadow-lg border border-forest-100 p-8 md:p-12 mb-12">
              <h2 className="font-serif text-2xl font-bold text-forest-900 mb-6">
                Join 12,000+ Investors
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-forest-200 rounded-lg focus:outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-100"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={!email || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold shadow-lg transition-all"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe Free'}
                </button>
              </div>

              <p className="text-sm text-forest-600 mb-8">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-1">Weekly Digest</h3>
                    <p className="text-sm text-forest-600">Top articles & insights every Monday</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-1">Market Updates</h3>
                    <p className="text-sm text-forest-600">Latest trends & opportunities</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-forest-900 mb-1">Exclusive Content</h3>
                    <p className="text-sm text-forest-600">Subscriber-only strategies</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-8 md:p-12 mb-12 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-forest-900 mb-3">
                You're Subscribed!
              </h2>
              <p className="text-lg text-forest-700 mb-4">
                Welcome to the community. Check your inbox to confirm your subscription.
              </p>
              <p className="text-sm text-forest-600">
                We've sent a confirmation email to <strong>{email}</strong>
              </p>
            </div>
          )}

          {/* Email Preferences */}
          {isSubscribed && (
            <div className="bg-white rounded-2xl shadow-lg border border-forest-100 p-8 md:p-12">
              <h2 className="font-serif text-2xl font-bold text-forest-900 mb-6">
                Email Preferences
              </h2>

              <p className="text-forest-700 mb-8">
                Choose what you'd like to receive from us. You can change these anytime.
              </p>

              <div className="space-y-4">
                {[
                  {
                    key: 'weeklyDigest',
                    title: 'Weekly Digest',
                    description: 'Curated roundup of top articles every Monday morning',
                  },
                  {
                    key: 'newArticles',
                    title: 'New Articles',
                    description: 'Instant notification when we publish new content',
                  },
                  {
                    key: 'marketUpdates',
                    title: 'Market Updates',
                    description: 'Monthly analysis of tax lien market trends and data',
                  },
                  {
                    key: 'caseStudies',
                    title: 'Case Studies',
                    description: 'Real investor stories and deal breakdowns',
                  },
                  {
                    key: 'exclusiveOffers',
                    title: 'Exclusive Offers',
                    description: 'Special promotions and partner offers (occasional)',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-start justify-between p-4 border border-forest-100 rounded-lg hover:bg-forest-50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="font-semibold text-forest-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-forest-600">{item.description}</p>
                    </div>
                    <button
                      onClick={() => togglePreference(item.key as keyof typeof preferences)}
                      className={`flex-shrink-0 w-12 h-6 rounded-full transition-colors ${
                        preferences[item.key as keyof typeof preferences]
                          ? 'bg-orange-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          preferences[item.key as keyof typeof preferences]
                            ? 'translate-x-6'
                            : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-forest-100">
                <button className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-cream-50 rounded-lg font-semibold transition-colors">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Unsubscribe Section */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-forest-900 mb-2">
                  Want to unsubscribe?
                </h3>
                <p className="text-sm text-forest-700 mb-4">
                  We're sorry to see you go. You can unsubscribe from all emails at any time.
                </p>
                <button className="text-sm text-red-600 hover:text-red-700 font-semibold underline">
                  Unsubscribe from all emails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
