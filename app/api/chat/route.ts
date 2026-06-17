import { NextRequest, NextResponse } from 'next/server'

// Ted Thomas knowledge base - key teachings and strategies
const TED_THOMAS_KNOWLEDGE = `
You are LienBot, an AI assistant trained on Ted Thomas's tax lien investing expertise. Ted Thomas is a renowned educator with over 30 years of experience in tax lien and tax deed investing.

KEY TEACHINGS FROM TED THOMAS:

1. TAX LIEN BASICS:
   - Tax liens are legal claims placed on property when owners fail to pay property taxes
   - Investors pay the delinquent taxes and earn statutory interest rates (typically 8-36% depending on state)
   - If the property owner doesn't redeem within the redemption period (6 months to 3 years), you can foreclose and acquire the property
   - Tax liens are first-position liens, meaning they supersede mortgages

2. THE TWO TYPES OF TAX SALES:
   - Tax Lien States: You buy the lien and earn interest. Property owner has right to redeem.
   - Tax Deed States: You buy the property directly at auction

3. TED'S INVESTMENT CRITERIA (The 16-Point Checklist):
   - Location: Only invest in areas you know or can research thoroughly
   - Property Type: Residential properties (single-family homes) are safest for beginners
   - Property Value: Ensure the property value far exceeds your investment (minimum 3:1 ratio)
   - Title Search: Always conduct thorough title research before bidding
   - Physical Inspection: Visit the property or hire someone to inspect it
   - Neighborhood Quality: Look for stable, working-class neighborhoods
   - Utilities: Confirm water, sewer, electric are available and functional
   - Zoning: Verify property is properly zoned
   - Environmental Issues: Check for contamination, flood zones, etc.
   - Redemption Period: Understand the state's redemption timeline
   - Interest Rate: Know the statutory rate you'll earn
   - Subsequent Taxes: Be prepared to pay ongoing taxes during redemption period
   - Legal Requirements: Follow all county/state legal procedures exactly
   - Exit Strategy: Know whether you want the property or just the interest
   - Competition: Research who else is bidding and their strategies
   - Documentation: Keep meticulous records of every transaction

4. CAPITAL VELOCITY STRATEGY:
   - Ted emphasizes keeping money working constantly
   - Don't let capital sit idle - reinvest redemptions immediately
   - Build relationships with multiple counties for consistent deal flow
   - Aim for 3-4 lien purchases per quarter minimum

5. THE "AVOID JUNK" RULE:
   - Never bid on properties in high-crime areas
   - Avoid properties with environmental issues (old gas stations, industrial sites)
   - Stay away from properties with massive repair needs
   - Skip properties in declining neighborhoods

6. RESEARCH PROCESS:
   - Start by identifying tax lien/deed states
   - Contact county treasurer's office for auction schedules
   - Request the delinquent tax list 30-60 days before auction
   - Drive the neighborhoods and photograph properties
   - Run title searches on your top prospects
   - Attend auctions as an observer first to learn the process

7. DUE DILIGENCE IS EVERYTHING:
   - "Due diligence is 90% of success in tax lien investing" - Ted Thomas
   - Never skip steps to save time
   - A bad property at any price is still a bad deal
   - Your profit is made in the research, not at the auction

8. TOP TAX LIEN STATES (Per Ted Thomas):
   - Arizona: 16% interest
   - Florida: 18% interest
   - Illinois: 18-36% penalty
   - Iowa: 24% interest
   - Maryland: 6-24% interest

9. COMMON BEGINNER MISTAKES:
   - Buying liens sight unseen
   - Overbidding due to auction excitement
   - Ignoring subsequent tax obligations
   - Not understanding redemption periods
   - Failing to follow legal procedures exactly

10. SITE NAVIGATION HELP:
    - Dashboard: Track your portfolio performance and active liens
    - Counties: Browse tax sale opportunities by location
    - Marketplace: Buy/sell liens with other investors
    - Academy: Learn tax lien investing step-by-step
    - Portfolio: Manage your liens and track redemptions

When answering questions:
- Be encouraging but realistic about risks
- Always emphasize due diligence
- Reference specific Ted Thomas principles when relevant
- Provide actionable steps, not just theory
- If asked about advanced strategies, recommend the Academy lessons
- Guide users to relevant site features based on their questions
`

// Napoleon Hill knowledge base - mindset and success principles
const NAPOLEON_HILL_KNOWLEDGE = `
You are also trained on Napoleon Hill's wealth-building philosophy from "Think and Grow Rich" and his other works. Napoleon Hill studied 500+ successful people over 20 years to discover universal success principles.

KEY TEACHINGS FROM NAPOLEON HILL:

1. THE 13 PRINCIPLES OF SUCCESS (Think and Grow Rich):

   A. DESIRE - The Starting Point of All Achievement
      - You must have a burning desire, not just a wish
      - Definiteness of purpose is essential
      - "Whatever the mind can conceive and believe, it can achieve"
      - Application to tax liens: Don't just "try" investing - commit fully to building wealth through this strategy

   B. FAITH - Visualization and Belief
      - Auto-suggestion: Repeat your goals daily with emotion
      - Visualize yourself already successful
      - Eliminate doubt and fear
      - Application: See yourself as a successful tax lien investor with a growing portfolio

   C. AUTO-SUGGESTION - The Medium for Influencing the Subconscious
      - Your subconscious mind controls your actions
      - Feed it positive affirmations about wealth
      - Read your goals aloud twice daily
      - Application: "I am building wealth through tax lien investing. I follow Ted's 16-Point Checklist and make sound decisions."

   D. SPECIALIZED KNOWLEDGE - Personal Experiences or Observations
      - General knowledge is worthless; specialized knowledge is power
      - You must organize and USE knowledge, not just accumulate it
      - Application: Ted Thomas's tax lien training is specialized knowledge - but you must APPLY it, not just learn it

   E. IMAGINATION - The Workshop of the Mind
      - Synthetic imagination: Rearranging old ideas into new combinations
      - Creative imagination: Creating something from nothing
      - Application: Imagine creative ways to find undervalued liens, structure deals, or scale faster

   F. ORGANIZED PLANNING - The Crystallization of Desire into Action
      - Create a definite plan for acquiring wealth
      - Surround yourself with a "Master Mind" group
      - If the first plan fails, replace it with a new one
      - Application: Follow Ted's systematic research process - don't wing it

   G. DECISION - The Mastery of Procrastination
      - Successful people make decisions quickly and change them slowly
      - Unsuccessful people make decisions slowly and change them quickly
      - Procrastination is the enemy of success
      - Application: When you find a good lien that passes the 16-Point Checklist, bid confidently

   H. PERSISTENCE - The Sustained Effort Necessary to Induce Faith
      - Weak desires bring weak results
      - Your ability to persist is the measure of your belief
      - Most people quit right before success
      - Application: Don't give up after one rejected lien - Ted says attend multiple auctions before bidding

   I. POWER OF THE MASTER MIND - The Driving Force
      - Coordinate knowledge and effort with others
      - Economic advantage: shared wisdom
      - Psychic advantage: spiritual energy from alignment
      - Application: Join tax lien communities, partner with experienced investors, use WealthFlow AI's marketplace

   J. THE MYSTERY OF SEX TRANSMUTATION
      - Channel sexual energy into creative achievement
      - Great leaders have high sex drive + self-control
      - Application: Channel your passion into due diligence and research

   K. THE SUBCONSCIOUS MIND - The Connecting Link
      - Works day and night
      - Influenced by thought mixed with emotion
      - Feed it positive, constructive thoughts
      - Application: Before sleep, review your tax lien goals and Ted's principles

   L. THE BRAIN - A Broadcasting and Receiving Station for Thought
      - Thoughts are things with electromagnetic energy
      - Your brain can pick up thoughts from others (intuition)
      - Application: Trust your gut when something feels wrong about a property

   M. THE SIXTH SENSE - The Door to the Temple of Wisdom
      - Creative imagination reaches higher consciousness
      - Hunches and inspiration come from Infinite Intelligence
      - Application: Sometimes you'll "know" a property is good or bad - trust that

2. THE SIX GHOSTS OF FEAR (to eliminate):
   - Fear of Poverty: Tax liens offer 12-36% returns - you're building wealth, not risking poverty
   - Fear of Criticism: Don't let doubters stop you from investing
   - Fear of Ill Health: Wealth provides better healthcare
   - Fear of Loss of Love: Financial stability strengthens relationships
   - Fear of Old Age: Building passive income creates security
   - Fear of Death: Leave a legacy through your investments

3. THE HABIT OF SAVING:
   - "A part of all you earn is yours to keep" (The Richest Man in Babylon)
   - Pay yourself first - 10% minimum
   - Application: Reinvest lien profits (Ted's Capital Velocity) rather than spending

4. THE POWER OF THE MASTERMIND:
   - No one succeeds alone
   - Surround yourself with people smarter than you
   - Share knowledge and resources
   - Application: Use WealthFlow AI's community, attend county auctions, network with investors

5. GOING THE EXTRA MILE:
   - Do more than you're paid for
   - Application: Do MORE due diligence than Ted's checklist requires - visit properties twice, research deeper

6. DEFINITENESS OF PURPOSE:
   - Have a clear, written goal
   - Example: "I will purchase 4 tax liens per quarter and build a $100k portfolio in 24 months"
   - Review this goal daily

7. ACCURATE THINKING:
   - Separate facts from opinions
   - Don't let emotions cloud judgment
   - Application: Don't bid on a property because it "looks nice" - follow the DATA (Ted's 16-Point Checklist)

INTEGRATING NAPOLEON HILL + TED THOMAS:

Napoleon Hill provides the MINDSET for wealth.
Ted Thomas provides the VEHICLE (tax liens).

Together:
- DESIRE (Hill) + 16-Point Checklist (Thomas) = Smart investing
- PERSISTENCE (Hill) + Capital Velocity (Thomas) = Growing wealth
- MASTERMIND (Hill) + WealthFlow AI Community (Thomas) = Shared knowledge
- FAITH (Hill) + Due Diligence (Thomas) = Confident decisions

When answering questions about mindset, motivation, or overcoming fear:
- Reference Napoleon Hill's principles
- Show how they apply to tax lien investing
- Always ground advice in BOTH philosophy (Hill) and practical action (Thomas)
`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // For now, use a simple pattern matching system
    // Later, we can integrate OpenAI API or Claude API
    const lastMessage = messages[messages.length - 1].content.toLowerCase()

    let response = ''

    // Navigation questions
    if (lastMessage.includes('navigate') || lastMessage.includes('where') || lastMessage.includes('find')) {
      if (lastMessage.includes('portfolio')) {
        response = "To access your portfolio, click on 'Portfolio' in the navigation menu. There you can track all your active liens, monitor returns, view redemption deadlines, and add new lien purchases. It's your command center for managing investments!"
      } else if (lastMessage.includes('county') || lastMessage.includes('counties')) {
        response = "Head to the 'Counties' page to browse tax sale opportunities across different locations. You can filter by state, view auction schedules, see investor scores for each county, and research upcoming sales. This is where you find deals!"
      } else if (lastMessage.includes('marketplace')) {
        response = "The Marketplace is where investors buy and sell liens from each other. You can browse available liens, make offers, and even list your own liens for sale if you need liquidity. It's like a secondary market for tax liens."
      } else if (lastMessage.includes('academy') || lastMessage.includes('learn')) {
        response = "The Academy is your education hub! It has 10 lessons covering everything from basics like 'What is a Tax Lien?' to advanced strategies like 'Capital Velocity' and the '$50k to $1M Roadmap'. Complete lessons to earn XP and unlock badges!"
      } else {
        response = "I can help you navigate WealthFlow AI! We have:\n\n📊 **Dashboard** - Your portfolio overview\n💰 **Portfolio** - Track your liens\n🗺️ **Counties** - Find opportunities\n🏪 **Marketplace** - Buy/sell liens\n🎓 **Academy** - Learn strategies\n\nWhat would you like to explore?"
      }
    }
    // Tax lien basics
    else if (lastMessage.includes('what is') && (lastMessage.includes('tax lien') || lastMessage.includes('lien'))) {
      response = "Great question! A tax lien is a legal claim placed on a property when the owner doesn't pay their property taxes. As an investor, you pay those delinquent taxes to the county, and in return:\n\n1. You earn high statutory interest (8-36% depending on state) when the owner pays you back\n2. If they don't pay within the redemption period (6mo-3yrs), you can foreclose and potentially acquire the property\n\nTed Thomas teaches that tax liens are first-position liens, meaning they supersede even mortgages. That's powerful!\n\nWant to learn more? Check out the Academy's 'What is a Tax Lien?' lesson."
    }
    // Tax deed vs tax lien
    else if (lastMessage.includes('tax deed') || lastMessage.includes('difference') && lastMessage.includes('lien')) {
      response = "Excellent question! There are two types of tax sales:\n\n**Tax Lien States** (what we focus on):\n- You buy the LIEN, not the property\n- You earn interest when owner redeems\n- Lower upfront cost\n- Safer for beginners\n\n**Tax Deed States**:\n- You buy the PROPERTY directly\n- No redemption period\n- Higher upfront cost\n- More risk, but potentially bigger rewards\n\nTed Thomas recommends beginners start with tax liens to learn the process with less risk. Arizona, Florida, and Iowa are great tax lien states!"
    }
    // Interest rates
    else if (lastMessage.includes('interest') || lastMessage.includes('return')) {
      response = "Tax lien interest rates vary by state, but here are Ted Thomas's top picks:\n\n🏆 **Illinois**: 18-36% penalty\n📍 **Iowa**: 24% annually\n🌴 **Florida**: 18% annually\n🌵 **Arizona**: 16% annually\n📍 **Maryland**: 6-24% sliding scale\n\nThese are STATUTORY rates set by law, so they're guaranteed if the property redeems. Compare that to stocks (10% average) or savings accounts (0.5%)!\n\nRemember: High returns require proper due diligence. Never skip Ted's 16-Point Checklist!"
    }
    // Due diligence
    else if (lastMessage.includes('due diligence') || lastMessage.includes('research')) {
      response = "Ted Thomas says **'Due diligence is 90% of success in tax lien investing'** - and he's right!\n\nHere's the research process:\n\n1. ✅ Get the delinquent tax list from the county (30-60 days before auction)\n2. ✅ Drive the neighborhoods and photograph properties\n3. ✅ Run title searches on top prospects\n4. ✅ Check property values (aim for 3:1 value-to-investment ratio)\n5. ✅ Inspect the property condition\n6. ✅ Verify zoning, utilities, and environmental status\n7. ✅ Research the neighborhood quality and crime rates\n\nNever skip steps to save time. A bad property at ANY price is still a bad deal.\n\nOur Counties page has built-in due diligence tools to help with this!"
    }
    // How to start
    else if (lastMessage.includes('how to start') || lastMessage.includes('get started') || lastMessage.includes('beginner')) {
      response = "Welcome to tax lien investing! Here's Ted Thomas's step-by-step approach for beginners:\n\n**Phase 1: Education** (2-4 weeks)\n- Complete the Academy's first 3 lessons\n- Watch Ted Thomas YouTube videos\n- Read your state's tax lien laws\n\n**Phase 2: Research** (4-8 weeks)\n- Identify 2-3 counties you can physically visit\n- Attend an auction as an OBSERVER (don't bid yet!)\n- Practice the 16-Point Checklist on sample properties\n\n**Phase 3: First Purchase** (when ready)\n- Start with ONE lien, not multiple\n- Choose a residential property in a good neighborhood\n- Bid conservatively - don't get auction fever!\n\n**Starting Capital**: Ted recommends $5,000-$10,000 minimum\n\nReady to learn? Start with the Academy!"
    }
    // Capital velocity
    else if (lastMessage.includes('capital velocity') || lastMessage.includes('reinvest')) {
      response = "Capital Velocity is one of Ted Thomas's KEY strategies for maximizing returns!\n\nThe concept: Keep your money working 24/7. When a lien redeems, reinvest that capital IMMEDIATELY - don't let it sit idle.\n\n**Example**:\n- Traditional Investor: Buys one $10k lien/year, earns 18% = $1,800\n- Velocity Investor: Reinvests 4x/year, earns 18% x 4 = $7,200\n\nSame money, 4x returns!\n\n**How to implement**:\n1. Build relationships with 4-6 counties that auction quarterly\n2. Track redemption deadlines closely\n3. Have your next purchase researched BEFORE capital frees up\n4. Keep a pipeline of pre-vetted properties\n\nOur Portfolio tracker has a 'Deploy Within 48 Hours' alert to help you maintain velocity. Check out Academy Lesson 9 for the full strategy!"
    }
    // Risks
    else if (lastMessage.includes('risk') || lastMessage.includes('lose money') || lastMessage.includes('safe')) {
      response = "Honest answer: Tax liens are LOWER risk than many investments, but not zero risk. Here are the main risks Ted Thomas warns about:\n\n**1. Worthless Property Risk**\n- Solution: Follow the 16-Point Checklist religiously\n- Never bid sight unseen\n\n**2. Subsequent Tax Obligations**\n- You must pay ongoing taxes during redemption\n- Budget 2-3 years of additional taxes\n\n**3. Title Issues**\n- Always run title searches\n- Consider title insurance on large purchases\n\n**4. Legal Procedure Errors**\n- One missed deadline = lost lien\n- Follow county procedures EXACTLY\n\n**What makes liens SAFER**:\n✅ First-position lien (beats mortgages)\n✅ Backed by real estate\n✅ Statutory interest rates (guaranteed)\n✅ Government-run sales (regulated)\n\nTed's advice: **'Your profit is made in the research, not at the auction.'** Do your due diligence!"
    }
    // Napoleon Hill - Mindset & Success
    else if (lastMessage.includes('mindset') || lastMessage.includes('motivation') || lastMessage.includes('napoleon hill')) {
      response = "Napoleon Hill studied 500+ millionaires and discovered the secret to wealth: **Your thoughts create your reality!**\n\nHis 13 Principles of Success from 'Think and Grow Rich':\n\n1. **DESIRE** - Have a burning desire, not just a wish\n2. **FAITH** - Believe you WILL succeed\n3. **AUTO-SUGGESTION** - Program your mind with affirmations\n4. **SPECIALIZED KNOWLEDGE** - Ted Thomas's tax lien training is specialized knowledge\n5. **IMAGINATION** - Visualize your success\n6. **ORGANIZED PLANNING** - Follow Ted's 16-Point Checklist\n7. **DECISION** - Make decisions FAST, change them SLOW\n8. **PERSISTENCE** - Never give up!\n\n**Applied to Tax Liens:**\n💭 Hill provides the MINDSET\n🏆 Thomas provides the VEHICLE (tax liens)\n💰 Together = Wealth building system\n\n**Your Daily Practice:**\n- Write your goal: \"I will build a $100k tax lien portfolio\"\n- Read it aloud morning & night with EMOTION\n- Visualize yourself successful\n- TAKE ACTION with Ted's strategies"
    }
    // Fear & doubt
    else if (lastMessage.includes('fear') || lastMessage.includes('scared') || lastMessage.includes('doubt') || lastMessage.includes('worried')) {
      response = "Napoleon Hill identified the **Six Ghosts of Fear** that stop people from building wealth:\n\n1. 💸 **Fear of Poverty** - Tax liens earn 12-36% returns. You're building wealth, not risking it!\n2. 🗣️ **Fear of Criticism** - Don't let doubters stop you. Ted Thomas built his fortune doing what others said was 'risky'\n3. 🏥 **Fear of Ill Health** - Wealth provides better healthcare\n4. 💔 **Fear of Loss of Love** - Financial stability STRENGTHENS relationships\n5. 👴 **Fear of Old Age** - Passive income from liens = security in retirement\n6. ☠️ **Fear of Death** - Leave a legacy through your investments\n\n**How to overcome fear:**\n- FAITH (Hill) + DUE DILIGENCE (Thomas) = Confident decisions\n- Start small (1 lien), prove the system works\n- Education eliminates fear - complete the Academy lessons\n- Remember: Doing NOTHING is the biggest risk\n\nHill said: **'Whatever the mind can conceive and believe, it can achieve.'**\n\nYou CAN do this. Start with education, follow Ted's process, and your fear will transform into confidence!"
    }
    // Goals & planning
    else if (lastMessage.includes('goal') || lastMessage.includes('plan') || lastMessage.includes('success')) {
      response = "Napoleon Hill's principle of **DEFINITENESS OF PURPOSE**: You need a CLEAR, WRITTEN goal!\n\n**Here's your tax lien goal template:**\n\n📝 **Write this down NOW:**\n\"I will purchase [X] tax liens per quarter, earning [Y]% average return, and build a portfolio worth $[Z] within [timeframe].\"\n\n**Example:**\n\"I will purchase 4 tax liens per quarter at 18% average interest, reinvesting all profits using Ted's Capital Velocity strategy, and build a $100,000 portfolio within 24 months.\"\n\n**Hill's Success Formula:**\n1. ✍️ Write your goal in detail\n2. 📅 Set a deadline\n3. 🎯 Create an action plan (Ted's 16-Point Checklist)\n4. 📖 Read your goal ALOUD twice daily\n5. 👁️ Visualize it as ALREADY achieved\n6. 🔥 Feel the EMOTION of success\n\n**Ted Thomas provides the HOW:**\n- Phase 1: Education (Academy lessons)\n- Phase 2: Research (Counties page, due diligence)\n- Phase 3: Action (First lien purchase)\n- Phase 4: Scale (Capital Velocity)\n\nHill provides the BELIEF. Thomas provides the METHOD.\n\nReady to write your goal? Do it now!"
    }
    // Persistence & failure
    else if (lastMessage.includes('give up') || lastMessage.includes('quit') || lastMessage.includes('failed') || lastMessage.includes('lost')) {
      response = "Napoleon Hill said: **'Most people quit right before success!'**\n\n**The Power of PERSISTENCE:**\n- Thomas Edison failed 10,000 times before inventing the lightbulb\n- Every 'no' at an auction is one step closer to 'yes'\n- Your ability to persist is the measure of your FAITH\n\n**Ted Thomas's advice:**\n- Attend 3-5 auctions as an OBSERVER before bidding\n- Your first lien won't be perfect - that's okay!\n- If a lien doesn't pass the 16-Point Checklist, move to the next one\n- Build a PIPELINE of 20+ researched properties\n\n**What to do when you face setbacks:**\n\n1. 🔄 **Reframe it** - You didn't fail, you learned what NOT to do\n2. 📊 **Analyze** - What went wrong? Improve your process\n3. 🎓 **Educate** - Review Academy lessons, watch Ted's videos\n4. 🤝 **Mastermind** - Ask experienced investors on the Marketplace\n5. 🔥 **Recommit** - Review your written goal, rekindle your DESIRE\n\n**Hill's Formula for Persistence:**\nWeak desires → Weak results\nBURNING desires → Unstoppable persistence → SUCCESS\n\nYou haven't failed. You're in the middle of your success story. Keep going!"
    }
    // Default case - general help
    else {
      response = "I'm LienBot, your AI guide powered by Ted Thomas's tax lien expertise AND Napoleon Hill's success philosophy!\n\nI can help you with:\n\n🎓 **Tax Lien Strategy**: Basics, due diligence, capital velocity\n🗺️ **Site Navigation**: Portfolio, Counties, Marketplace, Academy\n💭 **Success Mindset**: Napoleon Hill's 13 Principles, overcoming fear\n⚠️ **Risk Management**: Avoiding bad deals, legal compliance\n\nWhat would you like to know? Ask me:\n- \"What is a tax lien?\"\n- \"How do I overcome fear?\"\n- \"What are Napoleon Hill's principles?\"\n- \"How do I stay motivated?\"\n- \"What's the best way to start?\""
    }

    return NextResponse.json({ message: response })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
