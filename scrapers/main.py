"""
Main scraper orchestrator for WealthFlow AI.

This script runs all county scrapers or filters by state/county.

Usage:
    python main.py                    # Run all scrapers
    python main.py --state FL         # Run all Florida scrapers
    python main.py --county Sarasota  # Run specific county
"""

import argparse
import logging
import os
from typing import List

# Ensure logs directory exists
os.makedirs('logs', exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/scraper.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Import scrapers
import asyncio
import sys
from pathlib import Path

# Add scrapers directory to path to allow imports
sys.path.insert(0, str(Path(__file__).parent))

from florida.sarasota import SarasotaScraper
from florida.st_johns import StJohnsScraper
from florida.lake import LakeScraper
from florida.polk import PolkScraper
from florida.collier import CollierScraper
from arizona.maricopa import MaricopaScraper
from arizona.pima import PimaScraper
from arizona.yavapai import YavapaiScraper
from iowa.polk import PolkIAScraper
from iowa.linn import LinnScraper
from iowa.dallas import DallasScraper
from illinois.dupage import DuPageScraper
from illinois.mclean import McLeanScraper
from indiana.hamilton import HamiltonScraper
from indiana.hendricks import HendricksScraper

SCRAPERS = {
    'FL': {
        'Sarasota': SarasotaScraper,
        'St Johns': StJohnsScraper,
        'Lake': LakeScraper,
        'Polk': PolkScraper,
        'Collier': CollierScraper,
    },
    'AZ': {
        'Maricopa': MaricopaScraper,
        'Pima': PimaScraper,
        'Yavapai': YavapaiScraper,
    },
    'IA': {
        'Polk': PolkIAScraper,
        'Linn': LinnScraper,
        'Dallas': DallasScraper,
    },
    'IL': {
        'DuPage': DuPageScraper,
        'McLean': McLeanScraper,
    },
    'IN': {
        'Hamilton': HamiltonScraper,
        'Hendricks': HendricksScraper,
    }
}

def get_scrapers_to_run(state: str = None, county: str = None) -> List[tuple]:
    """
    Get list of scrapers to run based on filters.

    Args:
        state: Optional state filter
        county: Optional county filter

    Returns:
        List of (state, county, scraper_class) tuples
    """
    scrapers_to_run = []

    for s, counties in SCRAPERS.items():
        if state and s != state:
            continue

        for c, scraper_class in counties.items():
            if county and c != county:
                continue

            scrapers_to_run.append((s, c, scraper_class))

    return scrapers_to_run

async def run_scrapers(state: str = None, county: str = None, save_results: bool = False):
    """
    Run scrapers with optional filters.

    Args:
        state: Optional state filter
        county: Optional county filter
        save_results: Whether to save results to JSON files
    """
    scrapers = get_scrapers_to_run(state, county)

    if not scrapers:
        logger.warning("No scrapers found matching the criteria")
        return

    logger.info(f"Running {len(scrapers)} scraper(s)")

    successes = 0
    failures = 0
    total_liens = 0

    for state_code, county_name, scraper_class in scrapers:
        try:
            logger.info(f"Starting scraper: {county_name}, {state_code}")

            # Instantiate and run the scraper
            scraper = scraper_class()
            liens = await scraper.scrape()

            logger.info(f"✓ {county_name}, {state_code}: Found {len(liens)} liens")

            # Calculate stats
            if liens:
                avg_score = sum(lien.opportunity_score for lien in liens) / len(liens)
                high_value = [l for l in liens if l.opportunity_score >= 80]
                logger.info(f"  Average opportunity score: {avg_score:.1f}")
                logger.info(f"  High-value opportunities (80+): {len(high_value)}")

            total_liens += len(liens)

            # Optionally save results
            if save_results and liens:
                import json
                output_dir = f"data/{state_code.lower()}"
                os.makedirs(output_dir, exist_ok=True)
                output_file = f"{output_dir}/{county_name.lower().replace(' ', '_')}.json"

                with open(output_file, 'w') as f:
                    json.dump([lien.__dict__ for lien in liens], f, indent=2, default=str)
                logger.info(f"  Saved to: {output_file}")

            successes += 1

        except Exception as e:
            logger.error(f"✗ Scraper failed for {county_name}, {state_code}: {e}")
            import traceback
            logger.error(traceback.format_exc())
            failures += 1

    logger.info(f"\n{'='*60}")
    logger.info(f"Scraping complete!")
    logger.info(f"Successes: {successes}/{len(scrapers)}")
    logger.info(f"Failures: {failures}/{len(scrapers)}")
    logger.info(f"Total liens found: {total_liens:,}")
    logger.info(f"{'='*60}")

def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Run WealthFlow AI county scrapers'
    )
    parser.add_argument(
        '--state',
        help='Filter by state (e.g., FL, AZ, IA)',
        type=str
    )
    parser.add_argument(
        '--county',
        help='Filter by county name',
        type=str
    )
    parser.add_argument(
        '--list',
        help='List all available scrapers',
        action='store_true'
    )
    parser.add_argument(
        '--save',
        help='Save results to JSON files in data/ directory',
        action='store_true'
    )

    args = parser.parse_args()

    if args.list:
        print("\n" + "="*60)
        print("WEALTHFLOW AI - Available County Scrapers")
        print("="*60)
        total = 0
        for state, counties in SCRAPERS.items():
            print(f"\n{state} ({len(counties)} counties):")
            for county in counties.keys():
                print(f"  ✓ {county}")
                total += 1
        print(f"\nTotal: {total} scrapers across {len(SCRAPERS)} states")
        print("="*60)
        return

    asyncio.run(run_scrapers(state=args.state, county=args.county, save_results=args.save))

if __name__ == '__main__':
    main()
