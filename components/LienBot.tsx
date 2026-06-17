'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Sparkles, Lightbulb } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const TIPS_BY_PAGE = {
  '/': [
    "💡 Did you know? Tax liens can earn 12-36% returns - that's 3-6x better than the stock market!",
    "🎯 Pro Tip: Ted Thomas recommends starting with just ONE lien to learn the process.",
    "🏆 Florida offers 18% interest on tax liens - one of Ted's top recommended states!",
    "⚡ Capital Velocity: Reinvest your redemptions within 48 hours to maximize returns.",
    "📚 New to tax liens? Start with the Academy - Lesson 1 takes just 10 minutes!"
  ],
  '/academy': [
    "🎓 Complete all 10 lessons to become a tax lien expert!",
    "⭐ Earn XP for each lesson - unlock exclusive badges!",
    "📖 Lesson 6 'Avoiding Junk Liens' could save you thousands - don't skip it!",
    "🚀 Advanced Tip: The '$50k to $1M Roadmap' lesson reveals Ted's scaling strategy.",
    "💪 Take notes! These lessons are based on 30+ years of Ted Thomas's real experience."
  ],
  '/counties': [
    "🗺️ Focus on 2-3 counties you can physically visit for inspections.",
    "📊 High Investor Scores mean competitive auctions - beginners should start with medium-scored counties.",
    "📅 Counties auction quarterly - mark your calendar for upcoming sales!",
    "🔍 Always research the county's redemption period before bidding.",
    "💰 Look for counties with 18%+ interest rates for maximum returns."
  ],
  '/portfolio': [
    "⚡ Capital Velocity Alert: Redeploy freed capital within 48 hours!",
    "📈 Track your redemption deadlines closely - set calendar reminders!",
    "💵 Budget for subsequent taxes - you'll need to pay them during redemption period.",
    "✅ Pro Tip: When a lien redeems, have your next purchase already researched!",
    "📊 Aim for 3-4 lien purchases per quarter to maintain velocity."
  ],
  '/dashboard': [
    "👋 Welcome back! Check your opportunities feed for fresh deals.",
    "🎯 Ted's advice: Review your portfolio weekly, not daily. Tax liens are long-term.",
    "📈 Your portfolio performance compounds over time - patience pays!",
    "🔔 Enable notifications to never miss a redemption deadline.",
    "💡 Diversify across multiple counties to reduce risk."
  ],
  '/marketplace': [
    "🏪 The marketplace lets you buy liens from other investors - great for getting started!",
    "💰 Pre-vetted liens = less due diligence work for you!",
    "🤝 You can sell your liens here too if you need quick liquidity.",
    "⚖️ Compare marketplace prices to auction prices - sometimes auctions are better deals!",
    "✅ Marketplace liens often come with completed due diligence reports."
  ],
  '/pricing': [
    "💎 All plans include Ted Thomas's training materials!",
    "🎁 14-day free trial - cancel anytime, no questions asked.",
    "📊 Pro Plan includes investor scores - a huge time-saver for research!",
    "🏆 Elite tier gets AI-powered property analysis - like having Ted's brain on demand!",
    "💪 Start with Starter tier, upgrade as your portfolio grows."
  ]
}

export default function LienBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm LienBot, your AI assistant powered by Ted Thomas's tax lien expertise. Ask me anything about tax liens, investment strategies, or navigating this site!"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTip, setShowTip] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const [position, setPosition] = useState({ bottom: 24, right: 24 })
  const [isAnimating, setIsAnimating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const tipTimeoutRef = useRef<NodeJS.Timeout>()
  const moveTimeoutRef = useRef<NodeJS.Timeout>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Get tips for current page
  const getTipsForPage = () => {
    const tips = TIPS_BY_PAGE[pathname as keyof typeof TIPS_BY_PAGE] || TIPS_BY_PAGE['/']
    return tips
  }

  // Show random tip
  const showRandomTip = () => {
    if (isOpen) return // Don't show tips when chat is open

    const tips = getTipsForPage()
    const randomTip = tips[Math.floor(Math.random() * tips.length)]
    setCurrentTip(randomTip)
    setShowTip(true)

    // Bounce animation to get attention
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)

    // Hide tip after 8 seconds
    setTimeout(() => setShowTip(false), 8000)
  }

  // Move bot to random position
  const moveBot = () => {
    if (isOpen) return // Don't move when chat is open

    const positions = [
      { bottom: 24, right: 24 },    // Bottom right
      { bottom: 24, right: 400 },   // Bottom center-right
      { bottom: 200, right: 24 },   // Middle right
      { bottom: 400, right: 24 },   // Upper right
    ]

    const randomPosition = positions[Math.floor(Math.random() * positions.length)]
    setPosition(randomPosition)
  }

  // Proactive tips system
  useEffect(() => {
    // Show first tip after 10 seconds
    const initialTipTimeout = setTimeout(() => {
      showRandomTip()
    }, 10000)

    // Then show tips every 40-60 seconds
    const scheduleNextTip = () => {
      const delay = 40000 + Math.random() * 20000 // 40-60 seconds
      tipTimeoutRef.current = setTimeout(() => {
        showRandomTip()
        scheduleNextTip()
      }, delay)
    }

    scheduleNextTip()

    return () => {
      clearTimeout(initialTipTimeout)
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current)
    }
  }, [isOpen, pathname])

  // Movement system
  useEffect(() => {
    // Move bot every 60-90 seconds
    const scheduleBotMovement = () => {
      const delay = 60000 + Math.random() * 30000 // 60-90 seconds
      moveTimeoutRef.current = setTimeout(() => {
        moveBot()
        scheduleBotMovement()
      }, delay)
    }

    scheduleBotMovement()

    return () => {
      if (moveTimeoutRef.current) clearTimeout(moveTimeoutRef.current)
    }
  }, [isOpen])

  // Reset position when opening chat
  useEffect(() => {
    if (isOpen) {
      setPosition({ bottom: 24, right: 24 })
      setShowTip(false)
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      const data = await response.json()

      if (data.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message
        }])
      } else {
        throw new Error('No response from bot')
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          className="fixed z-50 transition-all duration-1000 ease-in-out"
          style={{ bottom: `${position.bottom}px`, right: `${position.right}px` }}
        >
          {/* Tip Bubble */}
          {showTip && (
            <div className="absolute bottom-full right-0 mb-4 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-4 py-3 rounded-2xl shadow-2xl border border-orange-400/30 relative">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5 animate-pulse" />
                  <p className="text-sm font-medium">{currentTip}</p>
                </div>
                {/* Arrow */}
                <div className="absolute top-full right-6 -mt-2">
                  <div className="w-4 h-4 bg-orange-600 transform rotate-45"></div>
                </div>
              </div>
            </div>
          )}

          {/* Bot Button */}
          <button
            onClick={() => setIsOpen(true)}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-4 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-110 group ${
              isAnimating ? 'animate-bounce' : ''
            }`}
          >
            {showTip ? (
              <Lightbulb className="w-6 h-6 animate-pulse" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {showTip ? 'Click for more tips!' : 'Ask LienBot anything!'}
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gradient-to-br from-navy-950 to-navy-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="Hands On Tax Liens"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-orange-600"></div>
              </div>
              <div>
                <h3 className="font-bold text-white">LienBot</h3>
                <p className="text-xs text-orange-100">Powered by Ted Thomas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about tax liens..."
                disabled={isLoading}
                className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all duration-300 hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Trained on Ted Thomas's tax lien expertise
            </p>
          </div>
        </div>
      )}
    </>
  )
}
