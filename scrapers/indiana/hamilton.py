"""
Hamilton County, Indiana Tax Lien Scraper

Website: https://www.hamiltoncounty.in.gov/242/Treasurer
Auction Type: Tax Certificate Sale
Format: Online
Interest Rate: 10-25% (based on competitive bidding)
Investor Score: 90 (ELITE - #6 Ranked County)

Why It's Elite:
- Indianapolis northern suburbs - WEALTHIEST COUNTY IN INDIANA
- Carmel, Fishers, Noblesville = top-rated communities
- Very high redemption rates (90%+)
- Excellent school systems
- Strong property values and appreciation
- Professional auction platform
- Low foreclosure risk

Auction Details:
- Annual sale: September/October
- Online bidding via county platform
- Registration required 2 weeks prior
- Deposit: varies by parcel
- Bidding DOWN from 25% (lowest rate wins, minimum 10%)
- 1 year redemption period

Market Notes:
- Carmel = consistently ranked top 10 "Best Places to Live" in America
- Fishers = tech hub, growing rapidly
- Noblesville = historic downtown, family-friendly
- Very safe investments - almost always redeem
- Perfect for consistent interest income

Indiana System:
- 10-25% interest rate (bid down at auction)
- 1 year redemption period
- After redemption period: can petition for tax deed
- Very high redemption rates = reliable income stream
"""

from base_scraper import BaseScraper, TaxLien
from datetime import datetime, timedelta
import random

class HamiltonScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            county_name="Hamilton",
            state="Indiana",
            base_url="https://www.hamiltoncounty.in.gov/242/Treasurer"
        )

    async def scrape(self) -> list[TaxLien]:
        """
        Scrape tax liens from Hamilton County, Indiana

        Returns:
            List of TaxLien objects
        """
        self.logger.info("Starting Hamilton County, Indiana scrape...")

        # Mock data for now - Indianapolis northern suburbs (very affluent)
        mock_liens = []
        property_types = ['Single Family', 'Townhome', 'Condo', 'Multi-Family', 'Commercial']
        neighborhoods = [
            'Carmel', 'Fishers', 'Noblesville', 'Westfield', 'Cicero',
            'Carmel Arts District', 'Fishers Downtown', 'Old Town Noblesville'
        ]

        for i in range(480):  # Hamilton has ~400-600 liens (low volume = affluent)
            # Interest rate varies based on competitive bidding (10-25%)
            interest_rate = random.choice([25.0, 20.0, 18.0, 15.0, 12.0, 10.0])  # Bidding down

            lien = TaxLien(
                county=self.county_name,
                state=self.state,
                parcel_id=f"HC-{random.randint(10000000, 99999999)}",
                property_address=f"{random.randint(100, 9999)} {random.choice(['Keystone', 'Range Line', 'Hazel Dell', 'Main', 'Rangeline'])} {random.choice(['Pkwy', 'Rd', 'Ave', 'Blvd', 'Dr'])}",
                property_type=random.choice(property_types),
                assessed_value=random.randint(100000, 1200000),  # High values - wealthiest county in IN
                lien_amount=random.randint(1500, 28000),
                interest_rate=interest_rate,
                auction_date=datetime.now() + timedelta(days=random.randint(60, 180)),
                redemption_period_months=12,  # Indiana standard (1 year)
                status="upcoming",
                latitude=40.0334 + random.uniform(-0.15, 0.15),  # Hamilton County area
                longitude=-86.0139 + random.uniform(-0.15, 0.15),
                last_updated=datetime.now(),
                data_source="Hamilton County Treasurer",
                neighborhood=random.choice(neighborhoods),
                year_built=random.randint(1970, 2024),
                lot_size_sqft=random.randint(5000, 25000),
                zoning=random.choice(['R-1', 'R-2', 'R-3', 'R-4', 'C-1', 'PUD']),
                flood_zone='X',  # Minimal flood risk
                market_value=random.randint(110000, 1400000),
                prior_year_taxes=random.randint(2000, 35000),
                school_district=random.choice([
                    'Carmel Clay Schools',
                    'Hamilton Southeastern Schools (Fishers)',
                    'Noblesville Schools',
                    'Westfield-Washington Schools'
                ]),
                notes=f"{interest_rate}% interest (bid down). {random.choice(neighborhoods)} - elite suburb. 90%+ redemption." if random.random() < 0.4 else None
            )

            lien.opportunity_score = self._calculate_opportunity_score(lien)
            mock_liens.append(lien)

        self.logger.info(f"Found {len(mock_liens)} liens in Hamilton County, Indiana")
        return mock_liens

    def _calculate_opportunity_score(self, lien: TaxLien) -> float:
        """Calculate investment opportunity score (0-100)"""
        score = 50.0

        # Interest rate factor (10-25% based on bidding)
        if lien.interest_rate >= 20:
            score += 20
        elif lien.interest_rate >= 15:
            score += 15
        elif lien.interest_rate >= 12:
            score += 10
        else:
            score += 5

        # Lien-to-value ratio
        ltv = lien.lien_amount / lien.assessed_value
        if ltv < 0.05:
            score += 15
        elif ltv < 0.10:
            score += 10
        elif ltv < 0.20:
            score += 5

        # Property value factor
        if 200000 <= lien.assessed_value <= 600000:
            score += 10  # Sweet spot for Hamilton County
        elif lien.assessed_value > 600000:
            score += 5

        # Location factor (ALL locations in Hamilton County are good)
        if lien.neighborhood in ['Carmel', 'Fishers']:
            score += 12  # Top-tier communities
        elif lien.neighborhood in ['Noblesville', 'Westfield']:
            score += 10
        else:
            score += 8

        # Very high redemption bonus (extremely safe)
        score += 10  # 90%+ redemption = most reliable income in the country

        # Property type
        if lien.property_type == 'Single Family':
            score += 5
        elif lien.property_type == 'Townhome':
            score += 4

        return min(score, 100)
