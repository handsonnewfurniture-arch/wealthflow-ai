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
  },
  '4': {
    title: 'Understanding Interest Rates',
    category: 'basics',
    duration: 18,
    xpReward: 75,
    sections: [
      {
        title: 'Statutory Interest Rates',
        content: `Unlike traditional investments where rates fluctuate, tax lien interest rates are set by state law. These are called "statutory rates."

**What makes them powerful:**
• Guaranteed by law - not subject to market changes
• Consistently high - typically 8-24% annually
• Compounded - grows exponentially over time
• Government-backed security`
      },
      {
        title: 'Interest Rate by State',
        content: `Different states offer different maximum rates:

**High-Yield States:**
• Iowa: 24% annually
• Illinois: 18% for first 6 months, then 12%
• Arizona: 16% annually
• Florida: 18% annually

**Moderate States:**
• Indiana: 10-15%
• Maryland: 6-24% (varies by county)

**Key Insight:** Higher rates mean faster wealth building, but may have more competition.`
      },
      {
        title: 'How Interest Compounds',
        content: `Most states use simple interest, but the frequency matters:

**Example Investment: $10,000 at 18%**

Year 1: $10,000 + $1,800 = $11,800
Year 2: If still unredeemed, continues accruing

**Penalty Interest:**
Some states add penalty interest on top of statutory rates. In Florida, this can push effective rates even higher.

**The Math:** $10,000 × 18% = $1,800 per year = $150/month passive income`
      },
      {
        title: 'Bidding Down Interest',
        content: `In competitive markets, investors bid DOWN the interest rate to win liens:

**Auction Example:**
• Starting rate: 18%
• Bidder 1: "I'll take 16%"
• Bidder 2: "I'll take 14%"
• You: "I'll take 12%" ← You win at 12%

**Strategy:** Only bid down in prime areas. Stick to full statutory rates in less competitive counties for maximum returns.`
      }
    ],
    quiz: [
      {
        question: 'What is a statutory interest rate?',
        options: [
          'A rate set by the bank',
          'A rate set by state law',
          'A rate you negotiate',
          'A variable market rate'
        ],
        correctAnswer: 1
      },
      {
        question: 'If you invest $5,000 at 18% annual interest and it redeems after 1 year, how much interest do you earn?',
        options: [
          '$500',
          '$900',
          '$1,800',
          '$5,900'
        ],
        correctAnswer: 1
      }
    ]
  },
  '5': {
    title: 'How to Research County Auctions',
    category: 'research',
    duration: 25,
    xpReward: 100,
    sections: [
      {
        title: 'Finding Tax Sales',
        content: `Counties announce tax sales on their websites, usually months in advance.

**Where to Look:**
• County Treasurer website
• County Tax Collector website
• Legal newspaper advertisements
• State tax sale aggregator sites

**When to Look:**
Most tax sales happen:
• Spring: March - May
• Fall: September - November

Set calendar reminders for your target counties.`
      },
      {
        title: 'Understanding the Auction List',
        content: `Counties publish a list of properties going to auction:

**What You'll See:**
• Parcel number (APN)
• Property address
• Assessed value
• Amount owed in back taxes
• Legal description

**Red Flags on the List:**
• Properties with $0 assessed value
• "Landlocked" parcels (no road access)
• Unbuildable lots
• Liens exceeding property value by 3x+`
      },
      {
        title: 'Researching Individual Properties',
        content: `For each property that interests you:

**Step 1: County Assessor Website**
• Look up parcel number
• Check property photos
• Review tax history
• Verify square footage and year built

**Step 2: Google Maps / Street View**
• Drive-by virtually
• Check neighborhood condition
• Assess nearby development

**Step 3: Crime Data**
• Use NeighborhoodScout.com
• Check police department crime maps
• Look for trends (improving vs. declining areas)`
      },
      {
        title: 'Auction Registration',
        content: `Most counties require pre-registration:

**Common Requirements:**
• Valid government ID
• Deposit (typically $500-5,000)
• Proof of funds or cashier's check
• Registration form (online or in-person)

**Online vs. In-Person:**
• Online auctions: More accessible, highly competitive
• In-person: Less competition, requires travel

**Pro Tip:** Register 1-2 weeks early. Some counties have deadlines.`
      }
    ],
    quiz: [
      {
        question: 'Where do counties typically announce tax sales?',
        options: [
          'Only through mail',
          'County Treasurer/Tax Collector website',
          'Private auction houses',
          'Real estate agents'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is a red flag when reviewing an auction list?',
        options: [
          'High assessed value',
          'Recent construction',
          'Property with $0 assessed value',
          'Properties in nice neighborhoods'
        ],
        correctAnswer: 2
      }
    ]
  },
  '6': {
    title: 'Avoiding Junk Liens',
    category: 'research',
    duration: 20,
    xpReward: 100,
    sections: [
      {
        title: 'What Are Junk Liens?',
        content: `Junk liens are tax liens on properties with little to no value - essentially worthless certificates.

**Examples:**
• Unbuildable swampland
• Landlocked parcels (no legal road access)
• Contaminated industrial sites
• Properties in severe disrepair
• HOA assessments exceeding property value

**The Danger:** You pay the back taxes but the property will never redeem AND you can't sell it if you foreclose.`
      },
      {
        title: 'Common Junk Lien Scenarios',
        content: `**1. The "$50 Lot" Scam**
Tiny lots in the middle of nowhere, often shown as "land" but actually unusable.

**2. Environmental Hazards**
Former gas stations, dry cleaners, or industrial sites with cleanup costs exceeding value.

**3. The Clouded Title**
Properties with multiple liens, code violations, or legal disputes that make them impossible to clear.

**4. The Phantom Property**
Parcels that exist on paper but not in reality (surveying errors, consolidations).`
      },
      {
        title: 'Due Diligence Checklist',
        content: `Before bidding, ALWAYS verify:

**✓ Property Access**
• Is there a legal road to the property?
• Check GIS maps for access points

**✓ Buildability**
• Is it in a floodplain?
• Are there wetland restrictions?
• What's the zoning?

**✓ True Market Value**
• Recent sales of comparable properties
• Is assessed value realistic?

**✓ Existing Liens**
• Are there IRS liens? (You can't beat these)
• Massive code violations?
• Outstanding HOA fees?`
      },
      {
        title: 'The 3x Rule',
        content: `**Only bid if the property is worth at LEAST 3x what you're paying.**

**Example:**
• Back taxes owed: $3,000
• Property market value: $9,000 minimum
• Ideal scenario: $15,000+ value

**Why 3x?**
• Covers your risk
• Accounts for holding costs
• Ensures profit even if you have to foreclose and sell

**Golden Rule:** When in doubt, sit it out. There's always another auction.`
      }
    ],
    quiz: [
      {
        question: 'What is a junk lien?',
        options: [
          'A lien with high interest rates',
          'A tax lien on a worthless property',
          'A lien from the IRS',
          'A lien on commercial property'
        ],
        correctAnswer: 1
      },
      {
        question: 'What is the 3x rule?',
        options: [
          'Bid 3 times the interest rate',
          'Only invest if property value is 3x what you pay',
          'Visit property 3 times',
          'Wait 3 years before foreclosing'
        ],
        correctAnswer: 1
      }
    ]
  },
  '7': {
    title: 'Crime Risk Analysis',
    category: 'research',
    duration: 22,
    xpReward: 100,
    sections: [
      {
        title: 'Why Crime Risk Matters',
        content: `Crime directly impacts property values and redemption likelihood:

**High-Crime Areas:**
• Lower redemption rates (owners abandon properties)
• Harder to sell if you foreclose
• Properties deteriorate faster
• Lower resale values

**Low-Crime Areas:**
• 95%+ redemption rates
• Properties maintain value
• Easy to sell if needed
• Stable, appreciating markets`
      },
      {
        title: 'Reading Crime Data',
        content: `**Crime Score Scale (per 100,000 residents):**

**0-25: EXCELLENT** ✅
Safe suburbs, family neighborhoods
→ Target these areas

**26-40: GOOD** ✅
Average safety, stable areas
→ Still acceptable

**41-60: MODERATE** ⚠️
Mixed areas, declining neighborhoods
→ Proceed with extreme caution

**61+: HIGH RISK** ❌
Avoid entirely for tax liens

**Where to Check:**
• NeighborhoodScout.com
• Local police department crime maps
• FBI Uniform Crime Report`
      },
      {
        title: 'Neighborhood Assessment',
        content: `Drive or virtually tour the area:

**Good Signs:**
• Well-maintained homes
• Active businesses
• New construction nearby
• Good schools
• Parks and amenities

**Warning Signs:**
• Boarded-up buildings
• Lots of "For Sale" signs
• Graffiti
• Abandoned vehicles
• Overgrown vacant lots

**The Eye Test:** Would YOU feel comfortable owning property here? If not, don't bid.`
      },
      {
        title: 'Building Your Target List',
        content: `Focus on counties with crime scores under 30:

**Top Low-Crime Counties:**
• Hamilton County, IN (Score: 15)
• Williamson County, TX (Score: 25)
• Collier County, FL (Score: 9)
• Warren County, OH (Score: 8)

**Strategy:**
Build a watchlist of 5-10 low-crime counties. Track their auction dates. Focus your research energy on quality areas rather than chasing every auction.

**ROI Impact:** Low-crime liens redeem 10-15% more often than high-crime areas.`
      }
    ],
    quiz: [
      {
        question: 'What crime score indicates an excellent area for tax lien investing?',
        options: [
          '0-25',
          '26-40',
          '41-60',
          '61+'
        ],
        correctAnswer: 0
      },
      {
        question: 'Why are low-crime areas better for tax liens?',
        options: [
          'They have higher interest rates',
          'They have higher redemption rates',
          'They have cheaper properties',
          'They have shorter redemption periods'
        ],
        correctAnswer: 1
      }
    ]
  },
  '8': {
    title: 'Building a Watchlist',
    category: 'strategy',
    duration: 30,
    xpReward: 150,
    sections: [
      {
        title: 'What is a Watchlist?',
        content: `A watchlist is your personalized pipeline of target counties and properties you're tracking for upcoming auctions.

**Why You Need One:**
• Auctions happen fast - no time for last-minute research
• Best opportunities go to prepared investors
• Helps you track multiple counties simultaneously
• Builds your expertise in specific markets

**What to Track:**
• County auction dates
• Interest rates
• Redemption periods
• Historical redemption data
• Competition levels`
      },
      {
        title: 'Selecting Your Counties',
        content: `Start with 5-10 counties maximum. Quality over quantity.

**Selection Criteria:**

**1. Interest Rate** (15%+ ideal)
**2. Crime Score** (Under 30)
**3. Redemption Period** (1-2 years optimal)
**4. Auction Format** (Online = easier to participate)
**5. Competition** (Low to medium)

**Example Starter Watchlist:**
• St. Johns County, FL (18%, Score: 18, Online)
• Johnson County, IA (24%, Score: 22, In-person)
• Hamilton County, IN (15%, Score: 15, Online)
• Sarasota County, FL (18%, Score: 30, Online)
• Warren County, OH (18%, Score: 8, Online)`
      },
      {
        title: 'Tracking Properties',
        content: `For each county on your watchlist, pre-identify 10-20 target properties before the auction:

**Your Spreadsheet Should Include:**
• Parcel number
• Address
• Assessed value
• Back taxes owed
• Your max bid
• Property type (residential/commercial/land)
• Crime score
• Notes (condition, comps, etc.)

**Set Budget Limits:**
• Never bid more than your pre-researched max
• Emotions run high at auctions
• Stick to your numbers`
      },
      {
        title: 'Monitoring and Updating',
        content: `Your watchlist is a living document:

**Monthly Tasks:**
• Check for new auction announcements
• Update auction dates on calendar
• Review property values (market changes)
• Add new counties/remove underperformers

**Weekly Tasks (auction season):**
• Download updated auction lists
• Research new properties
• Verify registration deadlines
• Confirm fund availability

**Pro Tip:** Set up Google Alerts for "[County Name] tax sale" to catch announcements early.`
      }
    ],
    quiz: [
      {
        question: 'How many counties should a beginner start tracking?',
        options: [
          '1-2',
          '5-10',
          '20-30',
          'As many as possible'
        ],
        correctAnswer: 1
      },
      {
        question: 'What should you do before bidding at an auction?',
        options: [
          'Bid on every property',
          'Pre-research properties and set max bids',
          'Wait to see what others bid',
          'Only look at the auction day'
        ],
        correctAnswer: 1
      }
    ]
  },
  '9': {
    title: 'Capital Velocity Strategy',
    category: 'strategy',
    duration: 35,
    xpReward: 200,
    sections: [
      {
        title: 'What is Capital Velocity?',
        content: `Capital velocity is how quickly you can redeploy your money. The faster your liens redeem, the more times you can reinvest per year.

**Traditional Investing:**
$50,000 in stocks → 8% annual return = $4,000/year

**High-Velocity Tax Liens:**
$50,000 → 18% liens that redeem in 6 months = $4,500
Reinvest → Another 6 months at 18% = $4,860
**Annual return: $9,360 (18.7% effective)**

**The Secret:** Short redemption periods + high rates = exponential growth`
      },
      {
        title: 'Maximizing Velocity',
        content: `**Target Short-Redemption States:**

**Fastest Redemption:**
• Indiana: 1 year
• Ohio: 1 year
• Some Georgia counties: 6 months

**Still Fast:**
• Florida: 2 years
• Illinois: 2-3 years

**Avoid for Velocity:**
• Iowa: 2-3 years
• Arizona: 3 years

**Strategy:** Build a portfolio balanced between high rates (Iowa 24%) and fast redemption (Indiana 15%). This keeps capital flowing.`
      },
      {
        title: 'The Staircase Method',
        content: `Stagger your investments so liens redeem at different times:

**Year 1:**
• Jan: $10k in Indiana (1yr redemption)
• Apr: $10k in Ohio (1yr redemption)
• Jul: $10k in Indiana (1yr redemption)
• Oct: $10k in Ohio (1yr redemption)

**Year 2:**
• Money returns every quarter
• Immediately reinvest in new liens
• Build a predictable income stream

**Result:** Constant cash flow instead of lump sums once a year.`
      },
      {
        title: 'Compounding Your Returns',
        content: `**Year 1: $50,000 Start**
Invest in 18% liens (average 18-month redemption)
Return: $63,500

**Year 2: Reinvest $63,500**
Same strategy
Return: $80,635

**Year 3: Reinvest $80,635**
Return: $102,406

**Year 5: $166,204**

**The Math:** 18% compounded 2x per year (short redemptions) = 39.24% effective annual return

**Key:** Never let capital sit idle. As soon as a lien redeems, deploy it immediately into the next auction.`
      }
    ],
    quiz: [
      {
        question: 'What is capital velocity?',
        options: [
          'How fast property values increase',
          'How quickly you can redeploy investment capital',
          'The speed of an auction',
          'Interest rate growth'
        ],
        correctAnswer: 1
      },
      {
        question: 'Which strategy maximizes capital velocity?',
        options: [
          'Buying properties in 3-year redemption states only',
          'Waiting for perfect opportunities',
          'Staggering investments across different redemption periods',
          'Investing everything at once'
        ],
        correctAnswer: 2
      }
    ]
  },
  '10': {
    title: '$50k to $1M Roadmap',
    category: 'strategy',
    duration: 45,
    xpReward: 250,
    sections: [
      {
        title: 'The Complete Strategy',
        content: `This is the proven path from $50,000 to $1,000,000+ in 5-7 years using tax liens.

**The Foundation:**
• Start with $50k minimum capital
• Target 15-18% average returns
• Reinvest 100% of returns (no withdrawals)
• Mix of high-rate and fast-redemption liens
• Diversify across 5-10 counties

**Your goal:** Double your money every 4 years through compounding.`
      },
      {
        title: 'Year-by-Year Breakdown',
        content: `**Year 1: $50,000 → $68,000**
• Learn the process with 10-15 small liens
• Focus on low-crime, high-redemption counties
• Track everything in spreadsheets
• Build your watchlist and expertise

**Year 2-3: $68,000 → $115,000**
• Increase deal flow
• Add tax deed auctions for property acquisition
• Refinance any foreclosed properties for more capital
• Scale to 20-30 active liens

**Year 4-5: $115,000 → $230,000**
• You're now experienced - larger positions
• Mix of liens ($200k total) + deed properties
• Some properties held as rentals
• Compounding accelerates

**Year 6-7: $230,000 → $1,000,000+**
• Elite investor status
• Portfolio of liens + income properties
• Network with other investors
• Teaching/consulting opportunities`
      },
      {
        title: 'Critical Success Factors',
        content: `**What Makes or Breaks This Plan:**

**✓ Discipline**
Never withdraw profits early. Compound everything.

**✓ Education**
Complete all lessons. Read books. Join forums.

**✓ Diversification**
Never put all capital in one county/auction.

**✓ Research**
Spend 10 hours researching per $1,000 invested.

**✓ Network**
Connect with other investors. Share insights.

**✗ Common Failures:**
• Taking profits too early
• Chasing junk liens for yield
• Emotional bidding
• Lack of due diligence
• Giving up after first year`
      },
      {
        title: 'Your Action Plan',
        content: `**This Week:**
• Complete all academy lessons
• Set up your county watchlist
• Join 2-3 tax lien forums/groups

**This Month:**
• Research your first 3 target counties
• Register for an upcoming auction
• Build property research spreadsheet

**First 3 Months:**
• Purchase your first 3-5 tax liens
• Document everything you learn
• Adjust strategy based on results

**First Year Goal:**
Deploy your full starting capital across 10-15 liens with average 16%+ returns.

**Remember:** This is a marathon, not a sprint. Stay consistent, keep learning, and trust the compound interest curve.

You've got this! 🚀`
      }
    ],
    quiz: [
      {
        question: 'What is the most important factor in reaching $1M from $50k?',
        options: [
          'Finding the single best deal',
          'Withdrawing profits regularly',
          'Reinvesting 100% of returns for compounding',
          'Investing in only one county'
        ],
        correctAnswer: 2
      },
      {
        question: 'How long does the roadmap typically take?',
        options: [
          '1-2 years',
          '3-4 years',
          '5-7 years',
          '10+ years'
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
