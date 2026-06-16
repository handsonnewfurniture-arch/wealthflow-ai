# WealthFlow AI - Real Data Source Strategy

**Created:** 2026-06-16  
**Last Updated:** 2026-06-16  
**Status:** Research Complete, Implementation Pending

---

## Executive Summary

After researching 15 counties across 5 states, we've identified three tiers of data accessibility for tax lien scraping. This document outlines the strategy for connecting our scrapers to real county data sources.

---

## County Data Availability Tiers

### 🟢 Tier 1: Publicly Available Data (FREE - Best for MVP)

These counties provide free, downloadable tax lien data in machine-readable formats:

| County | State | Data Format | Access Method | Cost | Quality |
|--------|-------|-------------|---------------|------|---------|
| **St Johns** | FL | CSV | Direct download | FREE | ⭐⭐⭐⭐⭐ |
| **Maricopa** | AZ | CSV/Fixed | FTP/Purchase | $25 | ⭐⭐⭐⭐ |

**St Johns County (BEST OPTION):**
- URL: https://sjctax.us/download-data-files/
- Files: "All Unpaid County & Individual Certificates" (CSV)
- Data includes: Certificate details, property info, delinquent amounts
- FTP access available for automated downloads
- Layout documentation provided (PDF)
- **Status:** Ready to implement ✅

**Maricopa County:**
- URL: https://maricopa.arizonataxsale.com
- Online auction platform
- Research materials: $25 (CSV/fixed-length format)
- FTP download available (from January)
- Contains: Parcel info, lien amounts, auction details
- **Status:** Requires $25 purchase for bulk data

### 🟡 Tier 2: Registered Buyer Data ($250-$500)

These counties require registration as a tax buyer and charge fees for bulk data:

| County | State | Data Format | Registration | Cost | Sale Date |
|--------|-------|-------------|--------------|------|-----------|
| **DuPage** | IL | Excel | Required | $250 | Nov 19, 2026 |
| **Hamilton** | IN | TBD | Required | TBD | Sept/Oct 2026 |
| **Hendricks** | IN | TBD | Required | TBD | Sept/Oct 2026 |

**DuPage County:**
- URL: https://www.dupagecounty.gov/elected_officials/treasurer/tax_sale_information.php
- Electronic list: $250 (only for registered buyers)
- Registration period: October 1-30, 2026
- Format: Excel download
- Fields: Parcel number, assessed name, delinquent amount, SEV, buyer code column
- **Status:** Requires registration + $250 fee

**Indiana Counties:**
- Data format/availability unclear from website
- Likely require registration as tax buyer
- Need direct contact with County Treasurer offices
- **Status:** Requires further research

### 🔴 Tier 3: Web Scraping Required (No Bulk Data)

These counties don't provide bulk downloads and require scraping public websites:

| County | State | Approach | Difficulty | Legal Risk |
|--------|-------|----------|------------|------------|
| Lake | FL | Screen scrape | Medium | Low |
| Polk (FL) | FL | Screen scrape | Medium | Low |
| Collier | FL | Screen scrape | Medium | Low |
| Polk (IA) | IA | Screen scrape | High | Low |
| Linn | IA | Screen scrape | High | Low |
| Dallas | IA | Screen scrape | High | Low |
| McLean | IL | Screen scrape | Medium | Low |
| Pima | AZ | Online platform | Medium | Low |
| Yavapai | AZ | Online platform | Medium | Low |

---

## Recommended Implementation Strategy

### Phase 1: Free Data MVP (Weeks 1-2)

**Goal:** Prove concept with real data at zero cost

1. **Implement St Johns County Scraper** ✅ Top Priority
   - Download CSV from https://sjctax.us/download-data-files/
   - Parse "All Unpaid County & Individual Certificates"
   - Map fields to TaxLien data model
   - Test opportunity scoring with real data
   - **Deliverable:** 1,000+ real tax liens in database

2. **Purchase Maricopa County Data** ($25)
   - Order research materials from Treasurer
   - Parse CSV/fixed-length format
   - Integrate with database
   - **Deliverable:** 20,000+ real tax liens from #1 volume county

**Expected Results:**
- 21,000+ real tax lien opportunities
- 2 elite counties covered (St Johns #1 ranked, Maricopa #6)
- Proof of concept for investors
- Zero legal/access issues

---

### Phase 2: Paid Registration (Month 2-3)

**Goal:** Expand to highest-ROI counties with premium data

1. **Register for DuPage County Sale** ($250)
   - Register October 1-30, 2026
   - Purchase electronic list
   - Import Excel data
   - **Deliverable:** 600-800 high-quality liens (98.6 avg score)

2. **Research Indiana Data Access**
   - Contact Hamilton County Treasurer
   - Contact Hendricks County Treasurer
   - Determine registration requirements
   - **Deliverable:** Access to 90%+ redemption rate liens

**Expected Results:**
- Access to 4 ELITE counties
- Premium-quality data (affluent suburbs)
- Legitimate buyer status

---

### Phase 3: Automated Web Scraping (Month 3-6)

**Goal:** Scale to all 15 counties with automation

1. **Build Screen Scrapers**
   - Focus on Florida counties (good online data)
   - Iowa counties (24% interest)
   - Use Playwright/Puppeteer for dynamic content
   - Implement rate limiting (respectful scraping)

2. **Set Up Automation**
   - Daily/weekly scraping schedule
   - Change detection monitoring
   - Error alerting
   - Data quality validation

**Expected Results:**
- All 15 counties covered
- Automated data pipeline
- 50,000+ total tax liens

---

## Data Field Mapping

### St Johns County CSV Fields → TaxLien Model

Based on Florida standard tax certificate format:

| CSV Field | TaxLien Field | Notes |
|-----------|---------------|-------|
| Certificate_Number | parcel_id | Unique identifier |
| Parcel_ID | property_address | Needs geocoding |
| Owner_Name | - | Not stored (privacy) |
| Face_Amount | lien_amount | Total owed |
| Property_Address | property_address | Direct mapping |
| Year | - | Tax year |
| Interest_Rate | interest_rate | 18% Florida max |
| Certificate_Date | auction_date | Sale date |
| Status | status | Available/Sold/Redeemed |
| Assessed_Value | assessed_value | From property appraiser |

**Additional enrichment needed:**
- Geocoding for lat/long
- Property type lookup (from property appraiser)
- Market value (from Zillow/Redfin APIs)
- Neighborhood data (from Census)

---

## Legal & Ethical Considerations

### ✅ Safe Practices

1. **Public Data Only**
   - Only scrape publicly accessible information
   - No authentication bypass
   - No personal data harvesting

2. **Respectful Scraping**
   - Honor robots.txt
   - Rate limiting (max 1 req/second)
   - User-agent identification
   - Cache aggressively

3. **Data Usage**
   - Investment research only
   - No redistribution of bulk data
   - Comply with county terms of service

### ⚠️ Risks to Avoid

1. **DO NOT:**
   - Scrape login-protected areas
   - Bypass CAPTCHAs
   - Overwhelm county servers
   - Violate CFAA (Computer Fraud & Abuse Act)
   - Resell raw county data

2. **County Relationships:**
   - Consider reaching out to IT departments
   - Request API access if available
   - Offer to credit data sources
   - Potentially white-label solution for counties

---

## Technical Implementation

### Recommended Tools

**For CSV Downloads (St Johns, Maricopa):**
```python
import pandas as pd
import requests
from io import StringIO

def scrape_st_johns():
    # Download CSV
    url = "https://sjctax.us/path/to/certificates.csv"
    response = requests.get(url)
    
    # Parse with pandas
    df = pd.read_csv(StringIO(response.text))
    
    # Transform to TaxLien objects
    liens = []
    for _, row in df.iterrows():
        lien = TaxLien(
            county="St Johns",
            state="Florida",
            parcel_id=row['Certificate_Number'],
            # ... map fields
        )
        liens.append(lien)
    
    return liens
```

**For Web Scraping (Other Counties):**
```python
from playwright.async_api import async_playwright

async def scrape_county_website(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        await page.goto(url)
        await page.wait_for_selector('.property-list')
        
        # Extract data
        properties = await page.query_selector_all('.property')
        # ...
```

---

## Cost-Benefit Analysis

### Year 1 Costs (15 Counties)

| Item | Cost | Benefit |
|------|------|---------|
| St Johns CSV | FREE | 1,000+ liens, #1 county |
| Maricopa Research | $25 | 20,000+ liens, massive volume |
| DuPage Registration + Data | $250 | 650 liens, 99.0 avg score |
| Hamilton/Hendricks (IN) | $500 est | 1,060 liens, 97.1 avg score |
| Development Time | 40 hours | Automated pipeline |
| **Total** | **$775** | **22,710+ real liens** |

**ROI for WealthFlow AI:**
- $775 investment
- 22,710 tax lien opportunities
- $0.034 per opportunity
- If 1% convert to paid users → $450/month revenue potential (at $15/month subscription)
- **Break-even:** 2 months

---

## Next Steps (Prioritized)

1. ✅ **IMMEDIATE:** Implement St Johns County scraper (FREE data)
   - Download CSV from sjctax.us
   - Parse and load into database
   - Test with real frontend

2. ⏳ **WEEK 2:** Purchase Maricopa data ($25)
   - Order research materials
   - Integrate 20,000+ liens

3. ⏳ **MONTH 2:** Register for DuPage sale ($250)
   - Complete registration (Oct 1-30)
   - Purchase electronic list
   - Import premium data

4. ⏳ **MONTH 3:** Build web scrapers
   - Florida counties (Lake, Polk, Collier)
   - Test automation pipeline

5. ⏳ **ONGOING:** Monitor data quality
   - Validate opportunity scores
   - Track redemption rates
   - Update county research

---

## Success Metrics

**MVP Success (Phase 1):**
- ✅ 1,000+ real St Johns liens in database
- ✅ Frontend displaying live data
- ✅ Opportunity scores validated against market

**Full Launch (Phase 3):**
- ✅ 50,000+ total liens across 15 counties
- ✅ Daily automated updates
- ✅ 90%+ data quality score
- ✅ <5% scraper failure rate

---

## References & Sources

### Maricopa County Resources
- [Tax Lien Information](https://www.treasurer.maricopa.gov/Pages/LoadPage?page=FAQTaxLiens&page=FAQTaxLiens)
- [Online Auction Platform](https://maricopa.arizonataxsale.com)
- [Data Downloads](https://www.mcassessor.maricopa.gov/page/data_sales/)

### DuPage County Resources
- [Tax Sale Information](https://www.dupagecounty.gov/elected_officials/treasurer/tax_sale_information.php)
- [Recent Tax Sales](https://www.dupagecounty.gov/elected_officials/treasurer/tax_sale/recent_tax_sales.php)

### St Johns County Resources
- [Tax Certificate Sales](https://sjctax.us/tax-certificate-sales/)
- [Download Data Files](https://sjctax.us/download-data-files/)

---

**Status:** Ready to proceed with St Johns County implementation
**Next Action:** Build real CSV scraper for St Johns County
**Timeline:** 2-4 hours for MVP scraper
