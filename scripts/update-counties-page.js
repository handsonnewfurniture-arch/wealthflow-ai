const fs = require('fs');

// Read the current counties page
const currentPage = fs.readFileSync('app/counties/page.tsx', 'utf8');

// Read the transformed counties data
const transformedData = fs.readFileSync('scripts/transformed-counties.json', 'utf8');

// Extract just the JSON array from transformed data
const arrayMatch = transformedData.match(/const counties = (\[[\s\S]*\])/);
if (!arrayMatch) {
  console.error('Could not extract counties array');
  process.exit(1);
}

const countiesArray = arrayMatch[1];

// Find the start and end of the counties array in the current page
const startMatch = currentPage.match(/([\s\S]*?)(  \/\/ Counties data.*?\n  const counties = \[)/);
const endMatch = currentPage.match(/\n  \]([\s\S]*)/);

if (!startMatch || !endMatch) {
  console.error('Could not find counties array boundaries');
  process.exit(1);
}

// Build the new page content
const beforeArray = startMatch[1] + startMatch[2];
const afterArray = ']' + endMatch[1];

// Clean up the counties array indentation
const formattedCounties = countiesArray
  .slice(1, -1) // Remove outer brackets
  .split('\n')
  .map(line => '  ' + line) // Add proper indentation
  .join('\n');

const newPageContent = beforeArray + '\n' + formattedCounties + '\n  ' + afterArray;

// Write the updated page
fs.writeFileSync('app/counties/page.tsx', newPageContent);

console.log('✓ Successfully updated counties page with 106 counties!');
