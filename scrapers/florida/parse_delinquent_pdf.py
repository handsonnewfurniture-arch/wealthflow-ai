#!/usr/bin/env python3
"""
Parse St Johns County Delinquent Real Estate PDF
Extracts upcoming auction properties from the PDF into CSV format
"""

import PyPDF2
import re
import csv
import sys

def parse_pdf_to_csv(pdf_path, csv_path):
    """
    Parse the delinquent real estate PDF and extract property data.

    Format: Multi-line per property
    - Line number
    - Parcel ID
    - Code (HX, etc)
    - Amount
    - Owner name
    - Property description (multiple lines)
    """

    properties = []

    with open(pdf_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        print(f"Processing {len(pdf.pages)} pages...")

        for page_num in range(len(pdf.pages)):
            page = pdf.pages[page_num]
            text = page.extract_text()

            # Split into lines
            lines = [l.strip() for l in text.split('\n')]

            i = 0
            while i < len(lines):
                line = lines[i]

                # Check if this is a line number (start of new property)
                if re.match(r'^\d+$', line):
                    line_num = line
                    i += 1

                    # Skip blank lines
                    while i < len(lines) and not lines[i]:
                        i += 1

                    if i >= len(lines):
                        break

                    # Next should be parcel ID
                    parcel_id = lines[i]
                    if not re.match(r'^\d{6}-\d{4}$', parcel_id):
                        i += 1
                        continue

                    i += 1

                    # Next is code (HX, etc) - may be blank
                    code = lines[i] if i < len(lines) else ''
                    i += 1

                    # Next is amount
                    if i >= len(lines):
                        break
                    amount_str = lines[i].replace(',', '')
                    try:
                        amount = float(amount_str)
                    except ValueError:
                        i += 1
                        continue
                    i += 1

                    # Next is owner name
                    if i >= len(lines):
                        break
                    owner_name = lines[i]
                    i += 1

                    # Collect property description lines until we hit "OR" or next property
                    property_desc_lines = []
                    while i < len(lines):
                        if lines[i] == 'OR':
                            i += 1  # Skip "OR"
                            if i < len(lines):  # Get OR reference number
                                i += 1
                            break
                        elif re.match(r'^\d+$', lines[i]):  # Start of next property
                            break
                        elif lines[i]:  # Non-blank line
                            property_desc_lines.append(lines[i])
                        i += 1

                    property_desc = ' '.join(property_desc_lines)
                    address = extract_address(property_desc)

                    properties.append({
                        'parcel_id': parcel_id,
                        'owner_name': owner_name,
                        'delinquent_amount': amount,
                        'property_description': property_desc,
                        'address': address,
                        'homestead': 'HX' in code,
                        'line_number': line_num
                    })
                else:
                    i += 1

            if (page_num + 1) % 20 == 0:
                print(f"  Processed {page_num + 1} pages, found {len(properties)} properties")

    print(f"\nTotal properties found: {len(properties)}")

    # Write to CSV
    with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['parcel_id', 'owner_name', 'delinquent_amount', 'property_description',
                      'address', 'homestead', 'line_number']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for prop in properties:
            writer.writerow(prop)

    print(f"Wrote {len(properties)} properties to {csv_path}")

    # Print summary stats
    if len(properties) > 0:
        total_amount = sum(p['delinquent_amount'] for p in properties)
        homestead_count = sum(1 for p in properties if p['homestead'])

        print(f"\nSummary:")
        print(f"  Total delinquent amount: ${total_amount:,.2f}")
        print(f"  Average delinquent amount: ${total_amount/len(properties):,.2f}")
        print(f"  Homestead properties: {homestead_count} ({homestead_count/len(properties)*100:.1f}%)")
        print(f"  Non-homestead: {len(properties) - homestead_count}")
    else:
        print("\n⚠️  No properties found - check PDF format")

    return properties

def extract_address(property_desc):
    """
    Try to extract a readable address from property description.
    Examples:
    - "51/75-80  PORT ST JOHN LOT 19 OR 2627/449"
    - "29/11-18  RIVER OAKS PLANTATION UNIT 2 LOT 31 OR 1591/1276"
    """
    # Remove OR references at the end
    desc = re.sub(r'\s+OR\s+\d+/\d+.*$', '', property_desc)

    # Look for subdivision/development names (usually all caps with common keywords)
    subdivision_match = re.search(r'([A-Z][A-Z\s]+(?:PLANTATION|RANCH|SECTION|PHASE|DISTRICT|LOT|UNIT|PARCEL).*?)(?:LOT|BLOCK|UNIT|\d|$)', desc)

    if subdivision_match:
        return subdivision_match.group(1).strip()

    # Otherwise just clean up the description
    return desc.strip()

if __name__ == '__main__':
    pdf_path = '2025_DELQ_REAL_ESTATE.pdf'
    csv_path = '2025_delinquent_real_estate.csv'

    parse_pdf_to_csv(pdf_path, csv_path)

    print("\n✅ Parsing complete!")
    print(f"📄 Output: {csv_path}")
