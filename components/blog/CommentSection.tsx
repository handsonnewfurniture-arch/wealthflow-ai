/**
 * Comment Section
 * Threaded comments with replies and user avatars
 */
'use client'

import { useState } from 'react'
import { MessageCircle, ThumbsUp, Reply, Flag } from 'lucide-react'

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  replies?: Comment[]
}

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Sarah Johnson',
      avatar: 'SJ',
      content: 'This is incredibly helpful! I\'ve been researching tax liens for months and this clarifies so many questions I had about redemption periods.',
      timestamp: '2 days ago',
      likes: 12,
      replies: [
        {
          id: '1-1',
          author: 'Michael Chen',
          avatar: 'MC',
          content: 'Agreed! The section on due diligence was particularly useful. I almost made a mistake on my first purchase but this guide saved me.',
          timestamp: '1 day ago',
          likes: 5,
        },
      ],
    },
    {
      id: '2',
      author: 'David Rodriguez',
      avatar: 'DR',
      content: 'Question: What happens if the property has multiple liens? Do you have to pay off the senior liens before you can foreclose?',
      timestamp: '1 day ago',
      likes: 8,
    },
    {
      id: '3',
      author: 'Emily Parker',
      avatar: 'EP',
      content: 'I went to my first auction last week using the strategies from this article. Didn\'t win anything, but I learned SO much just by observing. Can\'t wait for the next one!',
      timestamp: '5 hours ago',
      likes: 15,
    },
  ])

  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'YU',
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
    }

    setComments([comment, ...comments])
    setNewComment('')
  }

  const handleSubmitReply = (commentId: string) => {
    if (!replyText.trim()) return

    const reply: Comment = {
      id: `${commentId}-${Date.now()}`,
      author: 'You',
      avatar: 'YU',
      content: replyText,
      timestamp: 'Just now',
      likes: 0,
    }

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }
      return comment
    }))

    setReplyText('')
    setReplyingTo(null)
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-12' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-full flex items-center justify-center text-cream-50 font-semibold text-sm">
            {comment.avatar}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-cream-50 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-forest-900">{comment.author}</div>
              <div className="text-xs text-forest-600">{comment.timestamp}</div>
            </div>
            <p className="text-forest-700 leading-relaxed">{comment.content}</p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 ml-4">
            <button className="flex items-center space-x-1 text-sm text-forest-600 hover:text-forest-900 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center space-x-1 text-sm text-forest-600 hover:text-forest-900 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
            <button className="flex items-center space-x-1 text-sm text-forest-600 hover:text-forest-900 transition-colors">
              <Flag className="w-4 h-4" />
              <span>Report</span>
            </button>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-4 ml-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-4 py-3 bg-white border border-forest-200 rounded-lg focus:outline-none focus:border-forest-600 resize-none"
                rows={3}
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleSubmitReply(comment.id)}
                  className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-cream-50 rounded-lg font-semibold transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyText('')
                  }}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-forest-900 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-12 border-t border-forest-200">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center space-x-3 mb-8">
          <MessageCircle className="w-6 h-6 text-forest-600" />
          <h2 className="font-serif text-3xl font-bold text-forest-900">
            Comments ({comments.length})
          </h2>
        </div>

        {/* New Comment Form */}
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            className="w-full px-4 py-3 bg-cream-50 border border-forest-200 rounded-lg focus:outline-none focus:border-forest-600 resize-none"
            rows={4}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-forest-600">
              Please keep comments respectful and on-topic.
            </p>
            <button
              onClick={handleSubmitComment}
              className="px-6 py-2 bg-forest-600 hover:bg-forest-700 text-cream-50 rounded-lg font-semibold transition-colors"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>

        {/* Load More */}
        {comments.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-cream-50 hover:bg-cream-100 border border-forest-200 text-forest-900 rounded-lg font-semibold transition-colors">
              Load More Comments
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
