# Auction Data Auto-Refresh

The auction listings automatically refresh from county sources to ensure up-to-date property data.

## How It Works

### Automated Schedule (Vercel Cron)
- **Frequency:** 1st of every month at 2:00 AM UTC
- **Configured in:** `vercel.json`
- **Process:**
  1. Downloads latest PDF from St Johns County
  2. Parses PDF to extract property data
  3. Deletes old auction listings
  4. Imports new listings to database

### Manual Refresh
Visit: `/admin/auctions`

**Steps:**
1. Click "Refresh Auction Data Now"
2. Enter admin token when prompted
3. Wait 2-3 minutes for process to complete
4. View refresh statistics

## API Endpoint

**POST** `/api/admin/refresh-auctions`

### Headers:
```bash
Authorization: Bearer YOUR_ADMIN_TOKEN
```

### Response:
```json
{
  "success": true,
  "message": "Auction data refreshed successfully",
  "stats": {
    "deleted": 1000,
    "imported": 1000,
    "total": 1000,
    "timestamp": "2026-06-18T12:00:00.000Z",
    "source": "St Johns County 2025 Delinquent Tax List",
    "auction_date": "2026-05-29"
  }
}
```

## Environment Variables

Add to `.env.local` or Vercel environment variables:

```env
# Admin token for manual refresh
ADMIN_REFRESH_TOKEN=your-secure-token-here
```

## Vercel Cron Configuration

In `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/refresh-auctions",
      "schedule": "0 2 1 * *"
    }
  ]
}
```

**Cron Expression:** `0 2 1 * *`
- `0` = minute 0
- `2` = hour 2 (2 AM UTC)
- `1` = 1st day of month
- `*` = every month
- `*` = every day of week

## Data Source

**St Johns County, Florida**
- PDF: https://sjctax.us/downloads/2025%20DELQ%20REAL%20ESTATE.pdf
- Contains: ~4,535 delinquent properties
- Auction Date: May 29, 2026 @ 9:00 AM
- Platform: www.zeusauction.com

## Adding More Counties

To add auto-refresh for additional counties:

1. Create PDF parser in `scrapers/{state}/{county}_upcoming.py`
2. Update API route to support multiple counties
3. Add county-specific cron jobs in `vercel.json`

## Troubleshooting

### Cron Job Not Running
- Verify `vercel.json` is committed to repo
- Check Vercel dashboard → Settings → Crons
- Review Vercel function logs for errors

### Manual Refresh Fails
- Check admin token is correct
- Verify Python 3 and PyPDF2 are installed
- Check Vercel function timeout (max 5 min on Pro)

### No New Data
- Verify PDF URL is still valid
- Check if county has published updated list
- Review parser logs for errors

## Monitoring

Check last refresh time:

**GET** `/api/admin/refresh-auctions`

```bash
curl https://your-domain.com/api/admin/refresh-auctions
```

Response:
```json
{
  "county": "St Johns",
  "state": "FL",
  "last_refreshed": "2026-06-18T02:00:00.000Z",
  "auction_date": "2026-05-29",
  "data_source": "2025 Delinquent Real Estate Tax List"
}
```
