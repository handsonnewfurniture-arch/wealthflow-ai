"""
Base scraper class for tax lien county scrapers.
All county-specific scrapers should inherit from this class.
"""

import os
import time
import logging
from abc import ABC, abstractmethod
from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass, asdict
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client, Client


@dataclass
class TaxLien:
    """Data class representing a tax lien opportunity."""
    county: str
    state: str
    parcel_id: str
    property_address: str
    property_type: str
    assessed_value: float
    lien_amount: float
    interest_rate: float
    auction_date: datetime
    redemption_period_months: int
    status: str
    latitude: float
    longitude: float
    last_updated: datetime
    data_source: str
    neighborhood: Optional[str] = None
    year_built: Optional[int] = None
    lot_size_sqft: Optional[int] = None
    zoning: Optional[str] = None
    flood_zone: Optional[str] = None
    market_value: Optional[float] = None
    prior_year_taxes: Optional[float] = None
    school_district: Optional[str] = None
    notes: Optional[str] = None
    opportunity_score: float = 0.0

    def to_dict(self) -> dict:
        """Convert to dictionary with datetime objects as ISO strings."""
        d = asdict(self)
        d['auction_date'] = self.auction_date.isoformat() if isinstance(self.auction_date, datetime) else self.auction_date
        d['last_updated'] = self.last_updated.isoformat() if isinstance(self.last_updated, datetime) else self.last_updated
        return d

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scraper.log'),
        logging.StreamHandler()
    ]
)

class BaseScraper(ABC):
    """Base class for county tax lien scrapers."""

    def __init__(self, county_name: str = None, state: str = None, base_url: str = None):
        """
        Initialize the scraper.

        Args:
            county_name: County name (e.g., 'Sarasota')
            state: Two-letter state code (e.g., 'FL')
            base_url: Base URL for the county website
        """
        self.state = state
        self.county = county_name or ""
        self.county_name = county_name or ""
        self.base_url = base_url or ""
        self.logger = logging.getLogger(f"{state}.{county_name}" if state and county_name else __name__)

        # Initialize Supabase client (optional - for production use)
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        if supabase_url and supabase_key:
            try:
                self.supabase: Client = create_client(supabase_url, supabase_key)
            except Exception as e:
                self.logger.warning(f"Could not initialize Supabase client: {e}")
                self.supabase = None
        else:
            self.logger.debug("Supabase credentials not provided - running in standalone mode")
            self.supabase = None

        # HTTP session with rate limiting
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': os.getenv('USER_AGENT', 'WealthFlowAI/1.0')
        })

        self.last_request_time = 0
        self.min_request_interval = 1.0  # seconds between requests

    def rate_limited_get(self, url: str, **kwargs) -> requests.Response:
        """
        Make a rate-limited HTTP GET request.

        Args:
            url: URL to fetch
            **kwargs: Additional arguments for requests.get

        Returns:
            Response object
        """
        # Ensure minimum interval between requests
        elapsed = time.time() - self.last_request_time
        if elapsed < self.min_request_interval:
            time.sleep(self.min_request_interval - elapsed)

        try:
            response = self.session.get(url, **kwargs)
            response.raise_for_status()
            self.last_request_time = time.time()
            return response
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request failed for {url}: {e}")
            raise

    def get_soup(self, url: str) -> BeautifulSoup:
        """
        Fetch URL and return BeautifulSoup object.

        Args:
            url: URL to fetch

        Returns:
            BeautifulSoup object
        """
        response = self.rate_limited_get(url)
        return BeautifulSoup(response.content, 'lxml')

    def upsert_county(self, county_data: Dict) -> Optional[str]:
        """
        Insert or update county data in Supabase.

        Args:
            county_data: Dictionary containing county information

        Returns:
            County ID if successful, None otherwise
        """
        try:
            # Add required fields
            county_data['state'] = self.state
            county_data['county_name'] = self.county
            county_data['last_scraped_at'] = datetime.utcnow().isoformat()

            result = self.supabase.table('counties').upsert(
                county_data,
                on_conflict='state,county_name'
            ).execute()

            if result.data:
                county_id = result.data[0]['id']
                self.logger.info(f"Successfully upserted county: {self.county}, {self.state}")
                return county_id
            else:
                self.logger.error(f"Failed to upsert county: {self.county}, {self.state}")
                return None

        except Exception as e:
            self.logger.error(f"Error upserting county data: {e}")
            return None

    def insert_opportunities(self, opportunities: List[Dict]) -> int:
        """
        Insert opportunities into Supabase.

        Args:
            opportunities: List of opportunity dictionaries

        Returns:
            Number of opportunities inserted
        """
        if not opportunities:
            return 0

        try:
            result = self.supabase.table('opportunities').insert(opportunities).execute()
            count = len(result.data) if result.data else 0
            self.logger.info(f"Inserted {count} opportunities for {self.county}, {self.state}")
            return count
        except Exception as e:
            self.logger.error(f"Error inserting opportunities: {e}")
            return 0

    async def scrape(self) -> List[TaxLien]:
        """
        Scrape tax liens from this county (async version for new scrapers).

        Returns:
            List of TaxLien objects
        """
        # Default implementation - subclasses should override
        self.logger.warning("scrape() method not implemented")
        return []

    def scrape_auction_data(self) -> Dict:
        """
        Scrape auction information for this county (legacy method).
        New scrapers should override async scrape() instead.

        Returns:
            Dictionary containing auction data
        """
        return {}

    def scrape_parcels(self, county_id: str) -> List[Dict]:
        """
        Scrape parcel/opportunity data for this county (legacy method).
        New scrapers should override async scrape() instead.

        Args:
            county_id: UUID of the county in the database

        Returns:
            List of opportunity dictionaries
        """
        return []

    def run(self) -> None:
        """
        Execute the scraper workflow.
        """
        self.logger.info(f"Starting scraper for {self.county}, {self.state}")

        try:
            # Step 1: Scrape county/auction data
            county_data = self.scrape_auction_data()

            # Step 2: Upsert county data
            county_id = self.upsert_county(county_data)

            if not county_id:
                self.logger.error("Failed to get county ID, skipping parcel scraping")
                return

            # Step 3: Scrape parcels/opportunities
            opportunities = self.scrape_parcels(county_id)

            # Step 4: Insert opportunities
            if opportunities:
                self.insert_opportunities(opportunities)

            self.logger.info(f"Completed scraper for {self.county}, {self.state}")

        except Exception as e:
            self.logger.error(f"Scraper failed for {self.county}, {self.state}: {e}")
            raise
