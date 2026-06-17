/**
 * EXIF Data Extraction for Field Verification
 * Extracts GPS coordinates and timestamp from photos to verify location
 */

import ExifReader from 'exifreader'

export interface ExifData {
  latitude: number | null
  longitude: number | null
  timestamp: Date | null
  hasGPS: boolean
  hasTimestamp: boolean
  cameraMake?: string
  cameraModel?: string
}

export interface LocationVerification {
  isValid: boolean
  distanceFeet: number | null
  error?: string
}

/**
 * Extract EXIF data from image file
 */
export async function extractExifData(file: File): Promise<ExifData> {
  try {
    const buffer = await file.arrayBuffer()
    const tags = await ExifReader.load(buffer)

    // Extract GPS coordinates
    let latitude: number | null = null
    let longitude: number | null = null
    let hasGPS = false

    if (tags.GPSLatitude && tags.GPSLongitude) {
      hasGPS = true

      // Convert GPS coordinates from degrees/minutes/seconds to decimal
      const latDegrees = tags.GPSLatitude.description
      const lonDegrees = tags.GPSLongitude.description

      if (latDegrees && lonDegrees) {
        latitude = parseFloat(latDegrees)
        longitude = parseFloat(lonDegrees)

        // Apply direction (N/S, E/W)
        if (tags.GPSLatitudeRef?.value?.[0] === 'S') {
          latitude = -latitude
        }
        if (tags.GPSLongitudeRef?.value?.[0] === 'W') {
          longitude = -longitude
        }
      }
    }

    // Extract timestamp
    let timestamp: Date | null = null
    let hasTimestamp = false

    // Try DateTimeOriginal first (when photo was actually taken)
    if (tags.DateTimeOriginal?.description) {
      hasTimestamp = true
      timestamp = parseExifDate(tags.DateTimeOriginal.description)
    } else if (tags.DateTime?.description) {
      hasTimestamp = true
      timestamp = parseExifDate(tags.DateTime.description)
    }

    // Extract camera info
    const cameraMake = tags.Make?.description
    const cameraModel = tags.Model?.description

    return {
      latitude,
      longitude,
      timestamp,
      hasGPS,
      hasTimestamp,
      cameraMake,
      cameraModel
    }
  } catch (error) {
    console.error('EXIF extraction error:', error)
    return {
      latitude: null,
      longitude: null,
      timestamp: null,
      hasGPS: false,
      hasTimestamp: false
    }
  }
}

/**
 * Parse EXIF date format (YYYY:MM:DD HH:MM:SS) to JavaScript Date
 */
function parseExifDate(exifDate: string): Date | null {
  try {
    // EXIF format: "2024:06:17 14:30:25"
    const [datePart, timePart] = exifDate.split(' ')
    const [year, month, day] = datePart.split(':').map(Number)
    const [hour, minute, second] = timePart.split(':').map(Number)

    return new Date(year, month - 1, day, hour, minute, second)
  } catch {
    return null
  }
}

/**
 * Calculate distance between two GPS coordinates in feet
 * Uses Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000 // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lon2 - lon1) * Math.PI / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const meters = R * c
  const feet = meters * 3.28084 // Convert to feet

  return Math.round(feet)
}

/**
 * Verify if photo location matches property location
 */
export function verifyLocation(
  photoLat: number,
  photoLon: number,
  propertyLat: number,
  propertyLon: number,
  maxDistanceFeet: number = 100
): LocationVerification {
  const distanceFeet = calculateDistance(photoLat, photoLon, propertyLat, propertyLon)

  if (distanceFeet <= maxDistanceFeet) {
    return {
      isValid: true,
      distanceFeet
    }
  }

  return {
    isValid: false,
    distanceFeet,
    error: `Photo taken ${distanceFeet}ft from property (max ${maxDistanceFeet}ft allowed)`
  }
}

/**
 * Verify if photo timestamp is recent enough
 */
export function verifyTimestamp(
  photoTimestamp: Date,
  maxDaysOld: number = 30
): { isValid: boolean; daysOld: number; error?: string } {
  const now = new Date()
  const diffMs = now.getTime() - photoTimestamp.getTime()
  const daysOld = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (daysOld <= maxDaysOld) {
    return {
      isValid: true,
      daysOld
    }
  }

  return {
    isValid: false,
    daysOld,
    error: `Photo is ${daysOld} days old (max ${maxDaysOld} days allowed)`
  }
}

/**
 * Geocode property address to get GPS coordinates
 * Uses browser Geocoding API (requires HTTPS)
 */
export async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  try {
    // Use a geocoding service (you can use Google Maps, Mapbox, or OpenStreetMap)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(address)}&format=json&limit=1`
    )

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }
    }

    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}
