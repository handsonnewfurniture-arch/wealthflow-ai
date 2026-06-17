const fs = require('fs');

// Read the top 100 counties file
const fileContent = fs.readFileSync('/Users/tigermcbride/Desktop/Projects/wealthflow-ai/top-100-tax-counties-2026.js', 'utf8');

// Extract the array
const arrayMatch = fileContent.match(/const top100TaxCounties = \[([\s\S]*?)\];/);
if (!arrayMatch) {
  console.error('Could not parse counties array');
  process.exit(1);
}

// Evaluate the array
const top100TaxCounties = eval('[' + arrayMatch[1] + ']');

console.log(`✓ Parsed ${top100TaxCounties.length} counties`);
console.log(`✓ States: ${new Set(top100TaxCounties.map(c => c.state)).size}`);

// Transform to match counties page format
const transformed = top100TaxCounties.map((county, index) => {
  // Parse interest rate
  const interestRate = parseFloat(county.interestRate.replace('%', '')) || 18;

  // Calculate investor score based on interest rate, crime score, and competition
  const competitionScore = county.competitionLevel === 'low' ? 30 : (county.competitionLevel === 'medium' ? 20 : 10);
  const rateScore = Math.min(30, interestRate);
  const crimeBonus = Math.max(0, 40 - county.crimeScore);
  const investorScore = Math.min(100, Math.round(competitionScore + rateScore + crimeBonus));

  return {
    id: index + 1,
    state: county.state,
    county: county.county,
    auctionType: county.type,
    auctionDate: '2026-07-01', // Default - would need actual dates
    auctionFormat: county.auctionFormat,
    maxInterestRate: interestRate,
    redemptionMonths: county.redemptionPeriod || 24,
    medianHomeValue: county.medianHomeValue,
    population: null, // Not in source data
    crimeScore: county.crimeScore,
    competitionLevel: county.competitionLevel,
    investorScore: investorScore,
    auctionWebsite: county.auctionWebsite,
    notes: county.notes || ''
  };
});

// Output as formatted array
console.log('\n✓ Transformation complete\n');
console.log('const counties = ' + JSON.stringify(transformed, null, 2));
