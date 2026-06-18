/**
 * Legal Duo - AI Legal Assistants
 * Harvey (Senior Partner) & Mike (Associate) for tax lien legal work
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, FileText, Scale, Briefcase, CheckSquare } from 'lucide-react'

interface Message {
  id: string
  role: 'harvey' | 'mike' | 'user'
  content: string
  timestamp: Date
  attachments?: {
    name: string
    type: 'document' | 'checklist' | 'form'
  }[]
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'harvey',
    content: "Good to see you. I'm Harvey - I'll handle the strategy and complex legal issues. Mike here will draft your documents and keep you organized. What legal matter can we assist with today?",
    timestamp: new Date(Date.now() - 2000)
  },
  {
    id: '2',
    role: 'mike',
    content: "Hi! I'm Mike. I've already pulled your recent tax lien purchases and identified 3 properties approaching redemption deadlines. I can help you prepare foreclosure paperwork, file county notices, or draft redemption demand letters. What would you like to work on first?",
    timestamp: new Date(Date.now() - 1000)
  }
]

export default function LegalDuo() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          role: 'harvey' as const,
          responses: [
            "I've reviewed the case law on this. Here's the strategic approach you should take...",
            "That's a critical question. The legal precedent in your jurisdiction states...",
            "Let me handle this. I'll walk you through the legal framework...",
            "Good instinct. Here's what the statutes say about your situation..."
          ]
        },
        {
          role: 'mike' as const,
          responses: [
            "I can draft that document for you right now. I'll need a few details first...",
            "I've prepared a template for this exact scenario. Let me customize it for you...",
            "I'll pull up the county filing requirements and prepare the paperwork...",
            "I can have those forms ready in 2 minutes. Here's what I'll need from you..."
          ]
        }
      ]

      const assistant = Math.random() > 0.5 ? responses[0] : responses[1]
      const responseText = assistant.responses[Math.floor(Math.random() * assistant.responses.length)]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: assistant.role,
        content: responseText,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getAvatar = (role: 'harvey' | 'mike' | 'user') => {
    const avatars = {
      harvey: {
        bg: 'bg-slate-900',
        text: 'text-white',
        initials: 'HS',
        label: 'Harvey Specter'
      },
      mike: {
        bg: 'bg-blue-600',
        text: 'text-white',
        initials: 'MR',
        label: 'Mike Ross'
      },
      user: {
        bg: 'bg-emerald-500',
        text: 'text-white',
        initials: 'YO',
        label: 'You'
      }
    }

    const avatar = avatars[role]

    return (
      <div className={`w-10 h-10 rounded-full ${avatar.bg} flex items-center justify-center flex-shrink-0`}>
        <span className={`text-sm font-bold ${avatar.text}`}>{avatar.initials}</span>
      </div>
    )
  }

  const quickActions = [
    { icon: FileText, label: 'Draft Foreclosure Notice', color: 'text-orange-600' },
    { icon: Scale, label: 'Review Legal Compliance', color: 'text-purple-600' },
    { icon: Briefcase, label: 'Prepare County Filing', color: 'text-blue-600' },
    { icon: CheckSquare, label: 'Due Diligence Checklist', color: 'text-emerald-600' }
  ]

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Legal Duo</h3>
            <p className="text-slate-300 text-sm">Harvey Specter & Mike Ross - Your AI Legal Team</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left"
              >
                <Icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {getAvatar(message.role)}

            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-emerald-500 text-white'
                    : message.role === 'harvey'
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-blue-50 text-slate-900'
                }`}
              >
                {message.role !== 'user' && (
                  <p className="font-semibold text-sm mb-1">
                    {message.role === 'harvey' ? 'Harvey Specter' : 'Mike Ross'}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>

                {message.attachments && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg text-xs"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="bg-slate-100 rounded-2xl px-4 py-3">
              <p className="text-sm text-slate-600">Analyzing your request...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Harvey & Mike about foreclosure paperwork, county filings, legal compliance..."
            className="flex-1 px-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
