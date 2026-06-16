# WealthFlow AI County Scrapers

This directory contains Python scrapers for collecting tax lien and tax deed data from various county websites.

## Setup

```bash
cd scrapers
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Usage

### Run All Scrapers

```bash
python main.py
```

### Run Specific State

```bash
python main.py --state FL
```

### Run Specific County

```bash
python scrapers/florida/sarasota.py
```

## Adding New Scrapers

1. Create a new file in the appropriate state folder (e.g., `scrapers/florida/new_county.py`)
2. Inherit from `BaseScraper` class
3. Implement required methods:
   - `scrape_auction_data()`
   - `scrape_parcels()`
4. Register the scraper in `main.py`

## Scraper Architecture

Each scraper should:
- Extract county auction information (dates, registration, format)
- Collect available parcel data when possible
- Store results in Supabase
- Handle errors gracefully
- Respect rate limits and robots.txt
- Log all activities

## Environment Variables

Create a `.env` file in the scrapers directory:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
USER_AGENT=WealthFlowAI/1.0 (contact@wealthflow.ai)
```

## Counties Currently Supported

### Florida
- Sarasota
- St Johns
- Collier
- Lake
- Polk

### Arizona
- Maricopa
- Pima
- Yavapai

### Iowa
- Polk
- Linn
- Dallas

### Illinois
- Cook
- DuPage
- McLean

### Indiana
- Hamilton
- Hendricks

### Maryland
- Montgomery

### New Jersey
- Camden

### Ohio
- Hamilton
- Montgomery

## Data Schema

Scrapers should output data matching the Supabase schema:

**Counties Table:**
- state
- county_name
- auction_type
- next_auction_date
- auction_website
- auction_format
- max_interest_rate
- redemption_period_months
- median_home_value
- population
- crime_risk_score
- competition_level

**Opportunities Table:**
- county_id
- parcel_id
- address
- property_type
- assessed_value
- lien_amount
- opening_bid
- interest_rate
- ... and scoring fields

## Rate Limiting

All scrapers implement rate limiting:
- Maximum 1 request per second per domain
- Exponential backoff on errors
- Respect Retry-After headers

## Error Handling

Scrapers should:
- Log all errors to `logs/scraper.log`
- Continue processing other counties on individual failures
- Send alerts for critical failures
- Retry with exponential backoff

## Legal Compliance

- All scrapers must comply with website Terms of Service
- Respect robots.txt
- Do not overload county servers
- Only collect publicly available data
- Provide accurate User-Agent identification
