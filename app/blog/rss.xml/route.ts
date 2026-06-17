/**
 * RSS Feed
 * Generate XML feed for blog articles
 */

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://wealthflow-ai-sigma.vercel.app'

  // Mock articles - in production, fetch from database
  const articles = [
    {
      slug: 'understanding-tax-lien-investing',
      title: 'Understanding Tax Lien Investing: A Complete Beginner\'s Guide',
      excerpt: 'Learn the fundamentals of tax lien investing, from how it works to potential returns and risks to watch out for.',
      author: 'Ted Thomas',
      date: '2025-03-15T10:00:00Z',
    },
    {
      slug: 'due-diligence-checklist',
      title: 'The Ultimate Tax Lien Due Diligence Checklist',
      excerpt: 'A comprehensive 25-point checklist to evaluate every tax lien opportunity before you bid.',
      author: 'Ted Thomas',
      date: '2025-03-10T10:00:00Z',
    },
    {
      slug: 'florida-tax-lien-guide',
      title: 'Complete Guide to Florida Tax Lien Investing',
      excerpt: 'State-specific rules, redemption periods, and strategies for investing in Florida tax liens.',
      author: 'Sarah Johnson',
      date: '2025-03-05T10:00:00Z',
    },
  ]

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hands On Tax Liens - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Educational content, strategies, and insights for tax lien and tax deed investors</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${articles
      .map(
        (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <description><![CDATA[${article.excerpt}]]></description>
      <author>${article.author}</author>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${article.slug}</guid>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}
