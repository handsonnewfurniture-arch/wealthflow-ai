'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Award, BookOpen, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

const lessonContent: Record<string, any> = {
  '1': {
    title: 'What is a Tax Lien?',
    category: 'basics',
    duration: 10,
    xpReward: 50,
    sections: [
      {
        title: 'Introduction',
        content: `A tax lien is a legal claim against a property when the owner fails to pay their property taxes. When taxes go unpaid, the county government places a lien on the property to recover the owed amount.`
      },
      {
        title: 'How Tax Liens Work',
        content: `Counties need immediate revenue, so they sell these tax liens to investors at auctions. You, as the investor, pay the back taxes on behalf of the property owner. In return, you receive a certificate that entitles you to:

• The original amount you paid
• Statutory interest (rates vary by state, typically 8-24% annually)
• Potential ownership of the property if not redeemed`
      },
      {
        title: 'The Investment Process',
        content: `1. **Purchase**: You buy a tax lien certificate at auction
2. **Waiting Period**: The property owner has a redemption period (6 months to 3 years depending on state)
3. **Redemption**: Most owners pay back the taxes plus your interest
4. **Foreclosure Option**: If unredeemed, you can foreclose and potentially acquire the property`
      },
      {
        title: 'Why It Works',
        content: `Tax liens are secured by real estate, making them one of the safest high-yield investments. The government guarantees your investment through the legal system. Historical redemption rates exceed 95%, meaning you'll almost always get your money back plus interest.`
      }
    ],
    quiz: [
      {
        question: 'What is a tax lien?',
        options: [
          'A loan for buying property',
          'A legal claim against property for unpaid taxes',
          'A type of mortgage',
          'A property deed'
        ],
        correctAnswer: 1
      },
      {
        question: 'What happens during the redemption period?',
        options: [
          'The property is demolished',
          'The investor loses their money',
          'The property owner can pay back taxes plus interest',
          'The property is automatically transferred'
        ],
        correctAnswer: 2
      }
    ]
  },
  '2': {
    title: 'Tax Lien vs Tax Deed',
    category: 'basics',
    duration: 12,
    xpReward: 50,
    sections: [
      {
        title: 'Two Different Investment Types',
        content: `Tax lien and tax deed states handle delinquent property taxes differently. Understanding this distinction is crucial for your investment strategy.`
      },
      {
        title: 'Tax Lien States',
        content: `In tax lien states, you purchase a lien certificate:

• **You buy**: The right to collect the debt
• **You receive**: Interest payments (8-24% annually)
• **Property owner**: Keeps ownership during redemption period
• **Best for**: Investors seeking passive income from interest

**Examples**: Florida, Arizona, Indiana, Iowa`
      },
      {
        title: 'Tax Deed States',
        content: `In tax deed states, you purchase the property itself:

• **You buy**: The actual property at auction
• **You receive**: Full property ownership immediately
• **Property owner**: Loses the property
• **Best for**: Investors wanting real estate at below-market prices

**Examples**: Texas, California, Georgia`
      },
      {
        title: 'Hybrid States',
        content: `Some states offer both options depending on the county or specific circumstances. Research your target state's laws carefully.

**Key Takeaway**: Tax liens = interest income. Tax deeds = property acquisition.`
      }
    ],
    quiz: [
      {
        question: 'In a tax lien state, what do you purchase?',
        options: [
          'The property itself',
          'A certificate for the right to collect the debt',
          'A mortgage',
          'Insurance on the property'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which is better for acquiring property below market value?',
        options: [
          'Tax lien',
          'Tax deed',
          'Both are equal',
          'Neither'
        ],
        correctAnswer: 1
      }
    ]
  },
  '3': {
    title: 'How Redemption Works',
    category: 'basics',
    duration: 15,
    xpReward: 50,
    sections: [
      {
        title: 'What is Redemption?',
        content: `Redemption is the period during which a property owner can pay back their delinquent taxes (plus interest and fees) to reclaim their property from a tax lien or deed sale.`
      },
      {
        title: 'Redemption Periods by State',
        content: `Redemption periods vary significantly:

• **6 months**: Some Georgia counties
• **1 year**: Indiana, Ohio
• **2 years**: Florida, Illinois
• **3 years**: Arizona, Iowa

**Pro Tip**: Shorter redemption periods mean faster returns on your investment.`
      },
      {
        title: 'How You Earn Returns',
        content: `During redemption, interest accumulates on your investment:

**Example Scenario**:
• You pay: $5,000 in back taxes
• State rate: 18% annual interest
• Owner redeems after 1 year
• You receive: $5,900 ($5,000 + $900 interest)

**That's an 18% return in one year!**`
      },
      {
        title: 'What If Property Isn\'t Redeemed?',
        content: `If the owner doesn't redeem within the statutory period:

1. **Tax Lien States**: You can foreclose and take ownership
2. **Tax Deed States**: You already own it

Either way, you can keep the property or sell it for profit. Properties are often worth 5-20x what you paid.`
      }
    ],
    quiz: [
      {
        question: 'What is the redemption period?',
        options: [
          'Time to find properties',
          'Period for owner to pay back taxes',
          'Time to sell the property',
          'Auction registration period'
        ],
        correctAnswer: 1
      },
      {
        question: 'If you invest $10,000 at 12% interest and the owner redeems after 1 year, how much do you receive?',
        options: [
          '$10,000',
          '$10,120',
          '$11,200',
          '$12,000'
        ],
        correctAnswer: 2
      }
    ]
  }
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const lesson = lessonContent[params.id]

  const [currentSection, setCurrentSection] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)

  if (!lesson) {
    return (
      <div className="min-h-screen bg-navy-950">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-400 mb-8">This lesson is not yet available.</p>
          <Link href="/academy">
            <Button variant="primary">Back to Academy</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleNextSection = () => {
    if (currentSection < lesson.sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      setShowQuiz(true)
    }
  }

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers]
    newAnswers[questionIndex] = answerIndex
    setQuizAnswers(newAnswers)
  }

  const handleCompleteQuiz = () => {
    let correctCount = 0
    lesson.quiz.forEach((question: any, index: number) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })
    setScore(correctCount)
    setQuizComplete(true)
  }

  const isPassing = score >= Math.ceil(lesson.quiz.length * 0.7)

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      <div className="pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/academy" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Academy
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{lesson.title}</h1>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {lesson.duration} min
                  </div>
                  <div className="flex items-center text-gold-400">
                    <Award className="w-4 h-4 mr-1" />
                    +{lesson.xpReward} XP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {!showQuiz && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Section {currentSection + 1} of {lesson.sections.length}
                </span>
                <span className="text-sm text-emerald-400">
                  {Math.round(((currentSection + 1) / lesson.sections.length) * 100)}% Complete
                </span>
              </div>
              <div className="h-2 bg-navy-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                  style={{ width: `${((currentSection + 1) / lesson.sections.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          {!showQuiz && !quizComplete && (
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                {lesson.sections[currentSection].title}
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {lesson.sections[currentSection].content}
                </p>
              </div>
            </Card>
          )}

          {/* Quiz */}
          {showQuiz && !quizComplete && (
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Knowledge Check</h2>
              <div className="space-y-8">
                {lesson.quiz.map((question: any, qIndex: number) => (
                  <div key={qIndex} className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option: string, oIndex: number) => (
                        <button
                          key={oIndex}
                          onClick={() => handleQuizAnswer(qIndex, oIndex)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            quizAnswers[qIndex] === oIndex
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : 'border-white/10 hover:border-white/30 bg-navy-900'
                          }`}
                        >
                          <span className="text-gray-300">{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Quiz Results */}
          {quizComplete && (
            <Card className="p-8 mb-6 text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isPassing ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                {isPassing ? (
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                ) : (
                  <Award className="w-10 h-10 text-red-400" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">
                {isPassing ? 'Lesson Complete!' : 'Keep Trying!'}
              </h2>

              <p className="text-xl text-gray-300 mb-6">
                You scored {score} out of {lesson.quiz.length}
              </p>

              {isPassing && (
                <div className="mb-6">
                  <Badge variant="gold" className="text-lg px-6 py-2">
                    +{lesson.xpReward} XP Earned
                  </Badge>
                </div>
              )}

              <div className="space-y-3">
                {isPassing ? (
                  <Link href="/academy">
                    <Button variant="primary" className="w-full">
                      Continue to Academy
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      setShowQuiz(false)
                      setQuizComplete(false)
                      setQuizAnswers([])
                      setCurrentSection(0)
                    }}
                  >
                    Retry Lesson
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Navigation */}
          {!showQuiz && !quizComplete && (
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={handlePreviousSection}
                disabled={currentSection === 0}
              >
                Previous
              </Button>

              <Button
                variant="primary"
                onClick={handleNextSection}
              >
                {currentSection === lesson.sections.length - 1 ? 'Take Quiz' : 'Next Section'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Quiz Submit Button */}
          {showQuiz && !quizComplete && (
            <div className="flex justify-center">
              <Button
                variant="primary"
                onClick={handleCompleteQuiz}
                disabled={quizAnswers.length !== lesson.quiz.length}
                className="px-12"
              >
                Complete Lesson
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
