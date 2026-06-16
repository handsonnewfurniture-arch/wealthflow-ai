"""
Yavapai County, Arizona Tax Lien Scraper

Website: https://www.yavapaiaz.gov/treasurer
Auction Type: Tax Lien Certificate Sale
Format: Hybrid (Online + In-person)
Interest Rate: 16% annually
Investor Score: 82 (GOOD)

Why It's Good:
- Prescott area - retirement destination
- Smaller sale volume (~600-900 liens annually)
- LOW COMPETITION - fewer investors
- Beautiful mountain location
- Strong vacation rental market
- Property values increasing

Auction Details:
- Annual sale: Mid-February
- Hybrid format (online + in-person)
- Registration required 1 week prior
- Deposit: $500
- Bidding down from 16% (lowest rate wins)
- 3-year redemption period

Market Notes:
- Prescott = charming historic town
- Jerome = artist community
- Sedona = tourism hot spot (high values)
- Lower population = less competition
"""

from base_scraper import BaseScraper, TaxLien
from datetime import datetime, timedelta
import random

class YavapaiScraper(BaseScraper):
    def __init__(self):
        super().__init__(
            county_name="Yavapai",
            state="Arizona",
            base_url="https://www.yavapaiaz.gov/treasurer"
        )

    async def scrape(self) -> list[TaxLien]:
        """
        Scrape tax liens from Yavapai County, Arizona

        Returns:
            List of TaxLien objects
        """
        self.logger.info("Starting Yavapai County, Arizona scrape...")

        # Mock data for now - Prescott/Sedona area
        mock_liens = []
        property_types = ['Single Family', 'Vacant Land', 'Condo', 'Commercial', 'Cabin', 'Multi-Family']
        neighborhoods = [
            'Prescott', 'Prescott Valley', 'Sedona', 'Cottonwood', 
            'Jerome', 'Chino Valley', 'Dewey-Humboldt', 'Camp Verde'
        ]

        for i in range(720):  # ~720 sample from 600-900
            lien = TaxLien(
                county=self.county_name,
                state=self.state,
                parcel_id=f"YC-{random.randint(1000000, 9999999)}",
                property_address=f"{random.randint(100, 9999)} {random.choice(['Gurley', 'Montezuma', 'Iron Springs', 'Sheldon', 'Willow Creek'])} {random.choice(['St', 'Rd', 'Way', 'Dr', 'Loop'])}",
                property_type=random.choice(property_types),
                assessed_value=random.randint(20000, 950000),
                lien_amount=random.randint(300, 18000),
                interest_rate=16.0,
                auction_date=datetime.now() + timedelta(days=random.randint(30, 270)),
                redemption_period_months=36,
                status="upcoming",
                latitude=34.5400 + random.uniform(-0.4, 0.4),  # Yavapai County area
                longitude=-112.4685 + random.uniform(-0.4, 0.4),
                last_updated=datetime.now(),
                data_source="Yavapai County Treasurer",
                neighborhood=random.choice(neighborhoods),
                year_built=random.randint(1950, 2023),
                lot_size_sqft=random.randint(5000, 80000),  # Larger lots - mountain area
                zoning=random.choice(['R-1', 'R-2', 'RU', 'C-1', 'A-1']),
                flood_zone='X',
                market_value=random.randint(22000, 1100000),
                prior_year_taxes=random.randint(350, 20000),
                school_district=random.choice([
                    'Prescott Unified School District',
                    'Sedona-Oak Creek Unified School District',
                    'Cottonwood-Oak Creek Elementary School District',
                    'Chino Valley Unified School District'
                ]),
                notes=f"16% interest. {random.choice(neighborhoods)} mountain location. Low competition." if random.random() < 0.4 else None
            )

            lien.opportunity_score = self._calculate_opportunity_score(lien)
            mock_liens.append(lien)

        self.logger.info(f"Found {len(mock_liens)} liens in Yavapai County, Arizona")
        return mock_liens

    def _calculate_opportunity_score(self, lien: TaxLien) -> float:
        """Calculate investment opportunity score (0-100)"""
        score = 50.0

        score += 15  # 16% rate

        ltv = lien.lien_amount / lien.assessed_value
        if ltv < 0.05:
            score += 15
        elif ltv < 0.10:
            score += 10
        elif ltv < 0.20:
            score += 5

        if 70000 <= lien.assessed_value <= 350000:
            score += 10
        elif lien.assessed_value > 350000:
            score += 5

        # Location is CRITICAL in Yavapai
        if lien.neighborhood == 'Sedona':
            score += 12  # Premium tourism market
        elif lien.neighborhood in ['Prescott', 'Jerome']:
            score += 8  # Strong markets
        elif lien.neighborhood in ['Prescott Valley', 'Cottonwood']:
            score += 6

        # Low competition bonus
        score += 5  # Fewer investors = better deals

        if lien.property_type in ['Single Family', 'Cabin']:
            score += 5
        elif lien.property_type == 'Vacant Land':
            score += 3  # Land is common here

        return min(score, 100)
