'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Award, Play, Lock, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function Academy() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Lessons', count: 10 },
    { id: 'basics', name: 'Basics', count: 4 },
    { id: 'research', name: 'Research', count: 3 },
    { id: 'strategy', name: 'Strategy', count: 3 }
  ]

  const lessons = [
    {
      id: 1,
      title: 'What is a Tax Lien?',
      category: 'basics',
      difficulty: 'beginner',
      duration: 10,
      xpReward: 50,
      tierRequired: 'free',
      completed: true,
      description: 'Learn the fundamentals of tax lien investing and how it differs from traditional real estate.'
    },
    {
      id: 2,
      title: 'Tax Lien vs Tax Deed',
      category: 'basics',
      difficulty: 'beginner',
      duration: 12,
      xpReward: 50,
      tierRequired: 'free',
      completed: true,
      description: 'Understand the critical differences between tax lien and tax deed states.'
    },
    {
      id: 3,
      title: 'How Redemption Works',
      category: 'basics',
      difficulty: 'beginner',
      duration: 15,
      xpReward: 50,
      tierRequired: 'free',
      completed: false,
      description: 'Learn the redemption process and how you earn returns.'
    },
    {
      id: 4,
      title: 'Understanding Interest Rates',
      category: 'basics',
      difficulty: 'beginner',
      duration: 18,
      xpReward: 75,
      tierRequired: 'starter',
      completed: false,
      description: 'Learn how statutory interest rates work and how they compound.'
    },
    {
      id: 5,
      title: 'How to Research County Auctions',
      category: 'research',
      difficulty: 'intermediate',
      duration: 25,
      xpReward: 100,
      tierRequired: 'starter',
      completed: false,
      description: 'Step-by-step guide to finding and evaluating county tax sales.'
    },
    {
      id: 6,
      title: 'Avoiding Junk Liens',
      category: 'research',
      difficulty: 'intermediate',
      duration: 20,
      xpReward: 100,
      tierRequired: 'pro',
      completed: false,
      description: 'Learn red flags that signal worthless or problematic properties.'
    },
    {
      id: 7,
      title: 'Crime Risk Analysis',
      category: 'research',
      difficulty: 'intermediate',
      duration: 22,
      xpReward: 100,
      tierRequired: 'pro',
      completed: false,
      description: 'How to evaluate crime risk and avoid high-risk areas.'
    },
    {
      id: 8,
      title: 'Building a Watchlist',
      category: 'strategy',
      difficulty: 'intermediate',
      duration: 30,
      xpReward: 150,
      tierRequired: 'pro',
      completed: false,
      description: 'How to create and maintain a strong pipeline of opportunities.'
    },
    {
      id: 9,
      title: 'Capital Velocity Strategy',
      category: 'strategy',
      difficulty: 'advanced',
      duration: 35,
      xpReward: 200,
      tierRequired: 'elite',
      completed: false,
      description: 'Maximize returns by keeping your capital constantly deployed.'
    },
    {
      id: 10,
      title: '$50k to $1M Roadmap',
      category: 'strategy',
      difficulty: 'advanced',
      duration: 45,
      xpReward: 250,
      tierRequired: 'elite',
      completed: false,
      description: 'The complete strategy to scale from your first $50k to a 7-figure portfolio.'
    }
  ]

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return 'emerald'
    if (difficulty === 'intermediate') return 'gold'
    return 'red'
  }

  const getTierBadgeVariant = (tier: string) => {
    if (tier === 'free') return 'emerald'
    if (tier === 'starter') return 'blue'
    if (tier === 'pro') return 'gold'
    return 'red'
  }

  const userTier = 'pro' // Mock - would come from user context

  const canAccessLesson = (lessonTier: string) => {
    const tiers = ['free', 'starter', 'pro', 'elite']
    return tiers.indexOf(userTier) >= tiers.indexOf(lessonTier)
  }

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-32 pb-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-semibold text-gold-400">Learn & Earn XP</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Wealth <span className="gradient-text">Academy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Master tax lien investing from basics to advanced strategies. Earn XP and unlock badges.
            </p>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/20 p-3 rounded-xl shadow-lg shadow-emerald-500/10">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">2/10</div>
                  <div className="text-sm text-gray-400">Lessons Complete</div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="bg-gold-500/20 p-3 rounded-xl shadow-lg shadow-gold-500/10">
                  <Award className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">100 XP</div>
                  <div className="text-sm text-gray-400">Total XP Earned</div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/20 p-3 rounded-xl shadow-lg shadow-emerald-500/10">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">22 min</div>
                  <div className="text-sm text-gray-400">Learning Time</div>
                </div>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-gold-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="bg-gold-500/20 p-3 rounded-xl shadow-lg shadow-gold-500/10">
                  <TrendingUp className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold">20%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pb-24">
        {/* Category Filters */}
        <div className="flex items-center space-x-3 mb-12 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 font-semibold ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
            >
              {category.name}
              <Badge variant="gray" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredLessons.map((lesson) => {
              const hasAccess = canAccessLesson(lesson.tierRequired)
              const isLocked = !hasAccess

              return (
                <Card
                  key={lesson.id}
                  hover={!isLocked}
                  className={`p-6 space-y-4 relative ${isLocked ? 'opacity-60' : ''}`}
                >
                  {isLocked && (
                    <div className="absolute top-4 right-4">
                      <Lock className="w-5 h-5 text-gray-500" />
                    </div>
                  )}

                  {lesson.completed && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{lesson.title}</h3>
                    <p className="text-sm text-gray-400">{lesson.description}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getDifficultyColor(lesson.difficulty)} className="text-xs capitalize">
                      {lesson.difficulty}
                    </Badge>
                    <Badge variant={getTierBadgeVariant(lesson.tierRequired)} className="text-xs uppercase">
                      {lesson.tierRequired}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {lesson.duration} min
                    </div>
                    <div className="flex items-center text-gold-400">
                      <Award className="w-4 h-4 mr-1" />
                      +{lesson.xpReward} XP
                    </div>
                  </div>

                  {isLocked ? (
                    <Link href="/pricing" className="w-full">
                      <Button
                        variant="secondary"
                        className="w-full"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade to Access
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/academy/lessons/${lesson.id}`} className="w-full">
                      <Button
                        variant={lesson.completed ? 'secondary' : 'primary'}
                        className="w-full"
                      >
                        {lesson.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Review Lesson
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Lesson
                          </>
                        )}
                      </Button>
                    </Link>
                  )}
                </Card>
              )
            })}
          </div>

          {/* Badges Section */}
          <div>
            <h2 className="section-title mb-6">Your Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'First Lesson', icon: '📚', earned: true, tier: 'bronze' },
                { name: 'Knowledge Seeker', icon: '🎓', earned: true, tier: 'bronze' },
                { name: 'Tax Lien Scholar', icon: '👨‍🎓', earned: false, tier: 'gold' },
                { name: 'County Scout', icon: '🔍', earned: false, tier: 'bronze' },
                { name: 'Opportunity Hunter', icon: '🎯', earned: false, tier: 'silver' },
                { name: 'Portfolio Master', icon: '💼', earned: false, tier: 'gold' }
              ].map((badge, index) => (
                <Card
                  key={index}
                  className={`p-4 text-center space-y-2 ${
                    badge.earned ? '' : 'opacity-40'
                  }`}
                >
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="text-sm font-semibold">{badge.name}</div>
                  <Badge
                    variant={badge.earned ? (badge.tier === 'gold' ? 'gold' : 'emerald') : 'gray'}
                    className="text-xs capitalize"
                  >
                    {badge.tier}
                  </Badge>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want Access to All Lessons?
            </h2>
            <p className="text-gray-300 mb-6">
              Upgrade to Elite for complete access to advanced strategies and exclusive content.
            </p>
            <Link href="/pricing">
              <Button variant="gold">
                Upgrade to Elite
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
