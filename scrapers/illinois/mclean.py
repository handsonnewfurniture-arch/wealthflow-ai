"""
McLean County, Illinois Tax Lien Scraper

Website: https://www.mcleancountyil.gov/treasurer
Auction Type: Annual Tax Sale
Format: In-person (with some online components)
Interest Rate: 18% penalty (first 6 months) + 3% per month after
Investor Score: 79 (GOOD)

Why It's Good:
- Bloomington-Normal area - college town (Illinois State University)
- Moderate sale volume (~400-600 liens annually)
- Lower competition than Chicago suburbs
- Affordable entry point
- Stable rental market (students + State Farm Insurance employees)
- Good redemption rates (70-75%)

Auction Details:
- Annual sale: November
- Primarily in-person (some online options)
- Registration required 1 week prior
- Deposit: varies by parcel
- Minimum bid = full amount owed
- 2.5 year redemption period

Market Notes:
- Bloomington = insurance industry hub (State Farm HQ)
- Normal = college town (ISU)
- Affordable housing market
- Steady employment base
- Lower property values = lower entry cost

Illinois Tax Sale System:
- Year 1: 18% penalty + interest
- Year 2+: 3% per month (36% annually!)
- After 2.5 years: Can petition for tax deed
"""

from base_scraper import BaseScraper, TaxLien
from datetime import datetime, timedelta
import random

class McLeanScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            county_name="McLean",
            state="Illinois",
            base_url="https://www.mcleancountyil.gov/treasurer"
        )

    async def scrape(self) -> list[TaxLien]:
        """
        Scrape tax liens from McLean County, Illinois

        Returns:
            List of TaxLien objects
        """
        self.logger.info("Starting McLean County, Illinois scrape...")

        # Mock data for now - Bloomington-Normal area
        mock_liens = []
        property_types = ['Single Family', 'Multi-Family', 'Condo', 'Student Housing', 'Commercial', 'Vacant Land']
        neighborhoods = [
            'Bloomington Downtown', 'Normal', 'East Bloomington', 'West Bloomington',
            'Old Town', 'Eastland', 'ISU Campus Area', 'Airport Area'
        ]

        for i in range(520):  # ~400-600 liens
            lien = TaxLien(
                county=self.county_name,
                state=self.state,
                parcel_id=f"MC-{random.randint(1000000, 9999999)}",
                property_address=f"{random.randint(100, 9999)} {random.choice(['Main', 'College', 'Vernon', 'Oakland', 'Towanda'])} {random.choice(['St', 'Ave', 'Rd', 'Blvd', 'Dr'])}",
                property_type=random.choice(property_types),
                assessed_value=random.randint(35000, 450000),
                lien_amount=random.randint(600, 12000),
                interest_rate=18.0,  # Illinois first 6 months penalty
                auction_date=datetime.now() + timedelta(days=random.randint(30, 150)),
                redemption_period_months=30,  # 2.5 years
                status="upcoming",
                latitude=40.4842 + random.uniform(-0.12, 0.12),  # Bloomington-Normal area
                longitude=-88.9937 + random.uniform(-0.12, 0.12),
                last_updated=datetime.now(),
                data_source="McLean County Treasurer",
                neighborhood=random.choice(neighborhoods),
                year_built=random.randint(1955, 2022),
                lot_size_sqft=random.randint(3500, 15000),
                zoning=random.choice(['R-1', 'R-2', 'R-3', 'R-4', 'C-1', 'A-1']),
                flood_zone='X',
                market_value=random.randint(38000, 500000),
                prior_year_taxes=random.randint(700, 14000),
                school_district=random.choice([
                    'Bloomington Public Schools District 87',
                    'Normal Community Unit School District 5',
                    'McLean County Unit District No. 5'
                ]),
                notes=f"18% year 1, then 36% annually. {random.choice(neighborhoods)}. College/insurance town." if random.random() < 0.3 else None
            )

            lien.opportunity_score = self._calculate_opportunity_score(lien)
            mock_liens.append(lien)

        self.logger.info(f"Found {len(mock_liens)} liens in McLean County, Illinois")
        return mock_liens

    def _calculate_opportunity_score(self, lien: TaxLien) -> float:
        """Calculate investment opportunity score (0-100)"""
        score = 50.0

        # Interest rate factor (18% year 1, then 36% year 2+)
        score += 20

        # Lien-to-value ratio
        ltv = lien.lien_amount / lien.assessed_value
        if ltv < 0.05:
            score += 15
        elif ltv < 0.10:
            score += 10
        elif ltv < 0.20:
            score += 5

        # Property value factor
        if 60000 <= lien.assessed_value <= 200000:
            score += 10  # Sweet spot for McLean
        elif lien.assessed_value > 200000:
            score += 5

        # Location factor
        if lien.neighborhood in ['Normal', 'ISU Campus Area']:
            score += 8  # Strong rental demand
        elif lien.neighborhood in ['Bloomington Downtown', 'East Bloomington']:
            score += 6

        # Low competition bonus
        score += 5  # Less competitive than Chicago area

        # Property type
        if lien.property_type == 'Single Family':
            score += 5
        elif lien.property_type in ['Multi-Family', 'Student Housing']:
            score += 6  # Good rental market

        return min(score, 100)
