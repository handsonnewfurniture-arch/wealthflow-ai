-- WealthFlow AI Seed Data
-- Sample counties, auctions, opportunities, lessons, and badges

-- =====================================================
-- SEED COUNTIES
-- =====================================================

INSERT INTO counties (state, county_name, auction_type, next_auction_date, auction_website, auction_format, max_interest_rate, redemption_period_months, median_home_value, population, crime_risk_score, population_trend, competition_level, treasurer_url, assessor_url, notes) VALUES

-- Arizona
('Arizona', 'Maricopa', 'tax_lien', '2026-08-15', 'https://treasurer.maricopa.gov', 'online', 16.00, 36, 425000, 4485000, 45, 'growing', 'high', 'https://treasurer.maricopa.gov', 'https://mcassessor.maricopa.gov', 'Largest county in AZ, very competitive'),
('Arizona', 'Pima', 'tax_lien', '2026-08-20', 'https://www.auctionnetwork.com', 'online', 16.00, 36, 315000, 1043000, 50, 'stable', 'medium', 'https://www.auctionnetwork.com', 'https://www.pima.gov/assessor', 'Tucson metro area'),
('Arizona', 'Yavapai', 'tax_lien', '2026-09-10', 'https://www.yavapai.us', 'in_person', 16.00, 36, 385000, 234000, 25, 'growing', 'low', 'https://www.yavapai.us', 'https://www.yavapai.us/assessor', 'Low crime, growing retirement area'),

-- Florida
('Florida', 'Sarasota', 'tax_lien', '2026-07-25', 'https://www.sarasotataxcollector.com', 'online', 18.00, 24, 465000, 434000, 30, 'growing', 'medium', 'https://www.sarasotataxcollector.com', 'https://www.sc-pa.com', 'High yields, strong market'),
('Florida', 'St Johns', 'tax_lien', '2026-07-28', 'https://www.sjctax.us', 'online', 18.00, 24, 425000, 273000, 18, 'growing', 'medium', 'https://www.sjctax.us', 'https://www.sjcpa.us', 'Extremely low crime, high quality'),
('Florida', 'Collier', 'tax_lien', '2026-08-05', 'https://www.colliertax.com', 'online', 18.00, 24, 520000, 384000, 25, 'growing', 'high', 'https://www.colliertax.com', 'https://www.collierappraiser.com', 'Naples area, wealthy'),
('Florida', 'Lake', 'tax_lien', '2026-07-18', 'https://www.laketax.com', 'online', 18.00, 24, 285000, 367000, 35, 'growing', 'low', 'https://www.laketax.com', 'https://www.lakepa.com', 'Good value, moderate crime'),
('Florida', 'Polk', 'tax_lien', '2026-07-22', 'https://www.polktaxes.com', 'online', 18.00, 24, 265000, 724000, 42, 'growing', 'low', 'https://www.polktaxes.com', 'https://www.polkpa.org', 'Affordable market, high population'),

-- Iowa
('Iowa', 'Polk', 'tax_deed', '2026-10-15', 'https://www.polkcountyiowa.gov', 'in_person', 24.00, 18, 245000, 490000, 38, 'growing', 'medium', 'https://www.polkcountyiowa.gov', 'https://www.polkcountyiowa.gov/assessor', 'Des Moines, 24% interest!'),
('Iowa', 'Linn', 'tax_deed', '2026-10-20', 'https://www.linncountyiowa.gov', 'in_person', 24.00, 18, 225000, 230000, 32, 'stable', 'low', 'https://www.linncountyiowa.gov', 'https://www.linncountyiowa.gov/assessor', 'Cedar Rapids, low competition'),
('Iowa', 'Dallas', 'tax_deed', '2026-10-18', 'https://www.dallascountyiowa.gov', 'in_person', 24.00, 18, 285000, 99000, 22, 'growing', 'low', 'https://www.dallascountyiowa.gov', 'https://www.dallascountyiowa.gov/assessor', 'Fastest growing in Iowa'),

-- Illinois
('Illinois', 'Cook', 'tax_deed', '2026-11-08', 'https://www.cookcountytreasurer.com', 'online', 18.00, 30, 285000, 5150000, 65, 'declining', 'high', 'https://www.cookcountytreasurer.com', 'https://www.cookcountyassessor.com', 'Chicago - high crime, avoid most'),
('Illinois', 'DuPage', 'tax_lien', '2026-09-15', 'https://www.dupageco.org', 'online', 18.00, 30, 425000, 922000, 28, 'stable', 'medium', 'https://www.dupageco.org', 'https://www.dupageco.org/assessor', 'Suburban Chicago, much safer'),
('Illinois', 'McLean', 'tax_lien', '2026-09-20', 'https://www.mcleancountyil.gov', 'in_person', 18.00, 30, 215000, 170000, 35, 'stable', 'low', 'https://www.mcleancountyil.gov', 'https://www.mcleancountyil.gov/assessor', 'Bloomington, college town'),

-- Indiana
('Indiana', 'Hamilton', 'tax_lien', '2026-10-05', 'https://www.hamiltoncounty.in.gov', 'online', 15.00, 12, 395000, 347000, 15, 'growing', 'medium', 'https://www.hamiltoncounty.in.gov', 'https://www.hamiltoncounty.in.gov/assessor', 'Carmel/Fishers - extremely safe'),
('Indiana', 'Hendricks', 'tax_lien', '2026-10-08', 'https://www.hendrickscountytreasurer.org', 'online', 15.00, 12, 315000, 170000, 20, 'growing', 'low', 'https://www.hendrickscountytreasurer.org', 'https://www.hendrickscountyassessor.org', 'West of Indianapolis, growing'),

-- Maryland
('Maryland', 'Montgomery', 'tax_lien', '2026-08-12', 'https://www.montgomerycountymd.gov', 'online', 12.00, 6, 625000, 1062000, 32, 'stable', 'high', 'https://www.montgomerycountymd.gov', 'https://www.montgomerycountymd.gov/assessor', 'Wealthy DC suburb, short redemption'),

-- New Jersey
('New Jersey', 'Camden', 'tax_lien', '2026-09-25', 'https://www.camdencounty.com', 'online', 18.00, 24, 285000, 523000, 58, 'stable', 'medium', 'https://www.camdencounty.com', 'https://www.camdencounty.com/assessor', 'Mixed market, some high crime areas'),

-- Ohio
('Ohio', 'Hamilton', 'tax_lien', '2026-10-12', 'https://www.hamiltoncountyohio.gov', 'online', 18.00, 12, 245000, 830000, 48, 'stable', 'medium', 'https://www.hamiltoncountyohio.gov', 'https://www.hamiltoncountyohio.gov/assessor', 'Cincinnati area'),
('Ohio', 'Montgomery', 'tax_lien', '2026-10-15', 'https://www.mcohio.org', 'online', 18.00, 12, 185000, 537000, 52, 'declining', 'low', 'https://www.mcohio.org', 'https://www.mcohio.org/assessor', 'Dayton area, lower competition');

-- Update investor scores
UPDATE counties SET investor_score = calculate_county_score(
  max_interest_rate,
  median_home_value,
  crime_risk_score,
  competition_level
);

-- =====================================================
-- SEED LESSONS
-- =====================================================

INSERT INTO lessons (title, slug, description, category, difficulty, xp_reward, order_index, content, duration_minutes, tier_required) VALUES

-- Basics
('What is a Tax Lien?', 'what-is-tax-lien', 'Learn the fundamentals of tax lien investing and how it differs from traditional real estate.', 'basics', 'beginner', 50, 1, '# What is a Tax Lien?\n\nA tax lien is a legal claim placed by a government entity on a property when the owner fails to pay property taxes...', 10, 'free'),

('Tax Lien vs Tax Deed', 'tax-lien-vs-deed', 'Understand the critical differences between tax lien and tax deed states.', 'basics', 'beginner', 50, 2, '# Tax Lien vs Tax Deed\n\nDifferent states handle delinquent property taxes in different ways...', 12, 'free'),

('How Redemption Works', 'how-redemption-works', 'Learn the redemption process and how you earn returns.', 'basics', 'beginner', 50, 3, '# How Redemption Works\n\nWhen you purchase a tax lien, you are essentially paying someone''s delinquent taxes...', 15, 'free'),

('Understanding Interest Rates', 'understanding-interest-rates', 'Learn how statutory interest rates work and how they compound.', 'basics', 'beginner', 75, 4, '# Understanding Interest Rates\n\nDifferent states offer different maximum interest rates on tax liens...', 18, 'starter'),

-- Research
('How to Research County Auctions', 'research-county-auctions', 'Step-by-step guide to finding and evaluating county tax sales.', 'research', 'intermediate', 100, 5, '# How to Research County Auctions\n\nEvery county handles tax sales differently. Here''s how to research them...', 25, 'starter'),

('Avoiding Junk Liens', 'avoiding-junk-liens', 'Learn red flags that signal worthless or problematic properties.', 'research', 'intermediate', 100, 6, '# Avoiding Junk Liens\n\nNot all tax liens are worth buying. Here are the red flags...', 20, 'pro'),

('Crime Risk Analysis', 'crime-risk-analysis', 'How to evaluate crime risk and avoid high-risk areas.', 'research', 'intermediate', 100, 7, '# Crime Risk Analysis\n\nInvesting in high-crime areas increases foreclosure risk...', 22, 'pro'),

-- Strategy
('Building a Watchlist', 'building-watchlist', 'How to create and maintain a strong pipeline of opportunities.', 'strategy', 'intermediate', 150, 8, '# Building a Watchlist\n\nSuccessful investors maintain a watchlist 3-5x larger than their available capital...', 30, 'pro'),

('Capital Velocity Strategy', 'capital-velocity', 'Maximize returns by keeping your capital constantly deployed.', 'strategy', 'advanced', 200, 9, '# Capital Velocity Strategy\n\nThe secret to building wealth with tax liens is reinvestment speed...', 35, 'elite'),

('$50k to $1M Roadmap', '50k-to-1m-roadmap', 'The complete strategy to scale from your first $50k to a 7-figure portfolio.', 'strategy', 'advanced', 250, 10, '# $50k to $1M Roadmap\n\nThis is the institutional playbook for scaling tax lien portfolios...', 45, 'elite');

-- =====================================================
-- SEED BADGES
-- =====================================================

INSERT INTO badges (name, slug, description, icon, xp_required, tier, criteria) VALUES

('First County Saved', 'first-county-saved', 'Saved your first county to your watchlist', '🏛️', 0, 'bronze', '{"action": "save_county", "count": 1}'),

('County Scout', 'county-scout', 'Researched 10 different counties', '🔍', 100, 'bronze', '{"action": "research_county", "count": 10}'),

('Opportunity Hunter', 'opportunity-hunter', 'Saved 25 opportunities to watchlist', '🎯', 250, 'silver', '{"action": "save_opportunity", "count": 25}'),

('First Lesson Complete', 'first-lesson', 'Completed your first Wealth Academy lesson', '📚', 0, 'bronze', '{"action": "complete_lesson", "count": 1}'),

('Knowledge Seeker', 'knowledge-seeker', 'Completed 5 Wealth Academy lessons', '🎓', 250, 'silver', '{"action": "complete_lesson", "count": 5}'),

('Tax Lien Scholar', 'tax-lien-scholar', 'Completed all Wealth Academy lessons', '👨‍🎓', 1000, 'gold', '{"action": "complete_lesson", "count": 10}'),

('First $10k Deployed', 'first-10k', 'Deployed your first $10,000 in liens', '💰', 500, 'silver', '{"action": "deploy_capital", "amount": 10000}'),

('$100k Portfolio', '100k-portfolio', 'Built a $100,000+ portfolio', '💎', 2000, 'gold', '{"action": "portfolio_value", "amount": 100000}'),

('First Redemption', 'first-redemption', 'Received your first lien redemption', '✅', 250, 'silver', '{"action": "redemption", "count": 1}'),

('Redemption Master', 'redemption-master', 'Completed 10 successful redemptions', '🏆', 2500, 'gold', '{"action": "redemption", "count": 10}'),

('Capital Velocity Master', 'capital-velocity-master', 'Reinvested redemption within 48 hours 5 times', '⚡', 1500, 'gold', '{"action": "fast_reinvest", "count": 5}'),

('Property Acquired', 'property-acquired', 'Successfully foreclosed and acquired a property', '🏠', 1000, 'platinum', '{"action": "acquire_property", "count": 1}');

-- =====================================================
-- SAMPLE OPPORTUNITIES (for demo)
-- =====================================================

-- Get county IDs for reference
DO $$
DECLARE
  sarasota_id UUID;
  stjohns_id UUID;
  yavapai_id UUID;
  polk_ia_id UUID;
BEGIN
  SELECT id INTO sarasota_id FROM counties WHERE state = 'Florida' AND county_name = 'Sarasota';
  SELECT id INTO stjohns_id FROM counties WHERE state = 'Florida' AND county_name = 'St Johns';
  SELECT id INTO yavapai_id FROM counties WHERE state = 'Arizona' AND county_name = 'Yavapai';
  SELECT id INTO polk_ia_id FROM counties WHERE state = 'Iowa' AND county_name = 'Polk';

  -- Sarasota opportunities
  INSERT INTO opportunities (county_id, parcel_id, address, property_type, assessed_value, lien_amount, opening_bid, interest_rate, property_condition, flood_zone, environmental_risk, is_rural, is_vacant_land, is_high_crime, lien_to_value_ratio, yield_score, value_score, crime_score, redemption_score, competition_score, accessibility_score, total_score, status) VALUES

  (sarasota_id, 'SR-2024-1234', '123 Palm Ave, Sarasota, FL 34231', 'residential', 385000, 8500, 8500, 18.00, 'owner_occupied', false, false, false, false, false, 0.022, 25, 20, 20, 15, 8, 10, 98, 'available'),

  (sarasota_id, 'SR-2024-1235', '456 Gulf Blvd, Sarasota, FL 34242', 'residential', 525000, 12000, 12000, 18.00, 'owner_occupied', false, false, false, false, false, 0.023, 25, 20, 20, 15, 8, 10, 98, 'available'),

  (sarasota_id, 'SR-2024-1236', 'Lot 15 County Road 780', 'land', 45000, 2500, 2500, 18.00, 'vacant', false, false, true, true, false, 0.056, 15, 5, 20, 8, 8, 10, 66, 'available'),

  -- St Johns opportunities
  (stjohns_id, 'SJ-2024-9876', '789 Ocean View Dr, St Augustine, FL 32080', 'residential', 465000, 9200, 9200, 18.00, 'owner_occupied', false, false, false, false, false, 0.020, 25, 20, 20, 15, 8, 10, 98, 'available'),

  (stjohns_id, 'SJ-2024-9877', '321 Historic District, St Augustine, FL 32084', 'residential', 395000, 7800, 7800, 18.00, 'owner_occupied', false, false, false, false, false, 0.020, 25, 20, 20, 15, 8, 10, 98, 'available'),

  -- Yavapai opportunities
  (yavapai_id, 'YV-2024-5551', '555 Prescott Valley Pkwy, Prescott Valley, AZ 86314', 'residential', 385000, 6500, 6500, 16.00, 'owner_occupied', false, false, false, false, false, 0.017, 23, 20, 20, 15, 10, 10, 98, 'available'),

  -- Polk IA opportunities (24% interest!)
  (polk_ia_id, 'PK-IA-2024-3333', '1234 Oak St, Des Moines, IA 50310', 'residential', 245000, 5200, 5200, 24.00, 'owner_occupied', false, false, false, false, false, 0.021, 25, 15, 18, 15, 10, 8, 91, 'available'),

  (polk_ia_id, 'PK-IA-2024-3334', '5678 Elm Ave, West Des Moines, IA 50266', 'residential', 315000, 6800, 6800, 24.00, 'owner_occupied', false, false, false, false, false, 0.022, 25, 18, 18, 15, 10, 8, 94, 'available');

END $$;
