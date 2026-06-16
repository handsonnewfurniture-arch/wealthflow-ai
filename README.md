# WealthFlow AI 💎

> **Tax Lien Investment Intelligence Platform**

Find hidden real estate opportunities before other investors. Track tax lien auctions, analyze counties, discover undervalued properties, and build a portfolio that compounds year after year.

![WealthFlow AI](https://via.placeholder.com/1200x630/0a1929/10b981?text=WealthFlow+AI)

---

## 🚀 Features

### 🗺️ County Intelligence
- Track 20+ high-yield counties across 8 states
- Auction dates, interest rates, redemption periods
- Competition levels and crime risk analysis
- 0-100 investor scoring system

### 🎯 Opportunity Scoring
- AI-powered deal evaluation
- Automatic risk flagging (high-crime, junk land, flood zones)
- Property value analysis
- Redemption probability scoring

### 📊 Portfolio Tracking
- Monitor active liens and redemptions
- Calculate returns and capital velocity
- Track reinvestment timelines
- Portfolio performance analytics

### ⚡ Capital Velocity Engine
- 48-hour reinvestment alerts
- Keep capital constantly deployed
- Maximize compounding returns

### 🎓 Wealth Academy
- Gamified learning system
- XP points and achievement badges
- Lessons from basics to advanced strategies
- $50k to $1M scaling roadmap

### 💳 Subscription Tiers
- **Starter**: $29/mo - County database & basic lessons
- **Pro**: $79/mo - Investor scores, portfolio tracking, advanced lessons
- **Elite**: $199/mo - AI opportunity finder, capital deployment tools, priority support

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Stripe for subscriptions
- Next.js API Routes

**Scrapers:**
- Python 3.11+
- BeautifulSoup4 + Selenium
- Supabase Python SDK

---

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+ (for scrapers)
- Supabase account
- Stripe account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/wealthflow-ai.git
cd wealthflow-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create these in Stripe Dashboard)
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ELITE=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### 4. Set Up Supabase Database

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor
3. Run the schema file:

```bash
# Copy the contents of supabase/schema.sql and paste into SQL Editor
# Then run the seed data:
# Copy the contents of supabase/seed.sql and paste into SQL Editor
```

Alternatively, use the Supabase CLI:

```bash
npx supabase db push
```

### 5. Set Up Stripe

1. Create products in Stripe Dashboard:
   - Starter Plan: $29/month
   - Pro Plan: $79/month
   - Elite Plan: $199/month

2. Copy the Price IDs and add them to `.env.local`

3. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`

4. Copy webhook signing secret to `.env.local`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🐍 Setting Up Scrapers

### 1. Navigate to Scrapers Directory

```bash
cd scrapers
```

### 2. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create a `.env` file in the `scrapers` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
USER_AGENT=WealthFlowAI/1.0 (contact@yourdomain.com)
```

### 5. Run Scrapers

```bash
# Run all scrapers
python main.py

# Run specific state
python main.py --state FL

# List available scrapers
python main.py --list
```

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables

Make sure to set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & deploy → Environment

---

## 📊 Database Schema

### Core Tables

- **users** - User accounts, XP levels, subscription status
- **subscriptions** - Stripe subscription management
- **counties** - County auction data and investor scores
- **auctions** - Upcoming auction events
- **opportunities** - Individual tax lien opportunities with scoring
- **watchlists** - User-saved opportunities
- **portfolios** - User's active liens and investments
- **redemptions** - Redeemed liens and profit tracking
- **lessons** - Wealth Academy educational content
- **xp_events** - Gamification XP tracking
- **badges** - Achievement badges
- **user_badges** - User badge awards
- **user_lessons** - User lesson progress

---

## 🎨 Design System

### Colors

- **Navy**: Primary background (`#0a1929`)
- **Emerald**: Success, primary actions (`#10b981`)
- **Gold**: Premium features, profits (`#eab308`)
- **Red**: Warnings, high risk (`#ef4444`)

### Components

- **Glass Cards**: Glassmorphism effect with backdrop blur
- **Gradient Text**: Emerald to gold gradients
- **Badges**: Color-coded status indicators
- **Buttons**: Primary (emerald), Secondary (navy), Gold (premium)

---

## 🎯 Scoring Algorithm

### County Investor Score (0-100)

- **Yield Potential** (35 points): Statutory interest rate
- **Property Value** (25 points): Median home value strength
- **Crime Score** (25 points): Lower crime = higher score
- **Competition** (15 points): Low competition preferred

### Opportunity Score (0-100)

- **Yield Score** (25 points): Interest rate potential
- **Value Score** (20 points): Property value strength
- **Crime Score** (20 points): Neighborhood safety
- **Redemption Score** (15 points): Likelihood of redemption
- **Competition Score** (10 points): Auction competition level
- **Accessibility Score** (10 points): Online vs in-person

### Red Flags (Auto-Avoid)

- High-crime areas (score > 70)
- Vacant worthless land
- Lien amount > 10% of assessed value
- Flood zones
- Environmental risks
- Extremely rural/low liquidity

---

## 🧪 Testing

```bash
# Run ESLint
npm run lint

# Type checking
npx tsc --noEmit

# Run tests (if configured)
npm test
```

---

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Landing page
- ✅ County database
- ✅ Dashboard
- ✅ Portfolio tracking
- ✅ Pricing & subscriptions
- ✅ Wealth Academy
- ✅ Scraper framework

### Phase 2: Advanced Features
- [ ] AI opportunity finder (Elite tier)
- [ ] Real-time auction alerts
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboards
- [ ] Automated bidding system
- [ ] Property due diligence reports

### Phase 3: Scale
- [ ] Expand to all 50 states
- [ ] Institutional investor tools
- [ ] API access for partners
- [ ] White-label platform option

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⚖️ Legal Disclaimer

**IMPORTANT:** WealthFlow AI provides research, education, and data tools only. It is not financial, legal, tax, or investment advice. Users must perform their own due diligence and consult licensed professionals before making any investment decisions.

Tax lien investing involves risk. Past performance does not guarantee future results. Property values can decline, liens may not redeem, and competition can reduce returns. Always invest responsibly and within your means.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

- **Documentation**: [docs.wealthflow.ai](https://docs.wealthflow.ai)
- **Email**: support@wealthflow.ai
- **Discord**: [Join our community](https://discord.gg/wealthflow)
- **Twitter**: [@WealthFlowAI](https://twitter.com/wealthflowai)

---

## 🙏 Acknowledgments

- Tax lien data provided by county treasurers and tax collectors
- Built with [Next.js](https://nextjs.org/)
- Database by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)
- Maps by [Mapbox](https://www.mapbox.com/)

---

**Built with ❤️ for real estate investors**

*Turn $50k into a scalable tax lien portfolio. Start today.* 💎
