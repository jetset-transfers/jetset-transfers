/**
 * Zone detection utilities
 * Detects which transfer zone a geographic point falls into
 */

interface Coordinate {
  lat: number;
  lng: number;
}

interface TransferZone {
  id: string;
  zone_number: number;
  name_es: string;
  name_en: string;
  color: string;
  is_active: boolean;
  boundaries: number[][]; // [[lat, lng], [lat, lng], ...]
}

interface ZonePricing {
  id: string;
  origin_zone_id: string;
  destination_zone_id: string;
  vehicle_pricing: VehiclePricing[];
  duration_minutes: number | null;
  distance_km: number | null;
  is_active: boolean;
}

interface VehiclePricing {
  vehicle_name: string;
  max_passengers: number;
  price_usd: number;
}

/**
 * Ray casting algorithm to determine if a point is inside a polygon
 * @param point - The point to check {lat, lng}
 * @param polygon - Array of polygon vertices [[lat, lng], ...]
 * @returns true if point is inside the polygon
 */
export function isPointInPolygon(point: Coordinate, polygon: number[][]): boolean {
  if (!polygon || polygon.length < 3) return false;

  const { lat, lng } = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0]; // lat
    const yi = polygon[i][1]; // lng
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Find which zone a point falls into
 * @param point - The point to check {lat, lng}
 * @param zones - Array of transfer zones with boundaries
 * @returns The zone the point is in, or null if not in any zone
 */
export function findZoneForPoint(point: Coordinate, zones: TransferZone[]): TransferZone | null {
  if (!point || !point.lat || !point.lng) return null;

  for (const zone of zones) {
    if (!zone.is_active) continue;
    if (!zone.boundaries || zone.boundaries.length < 3) continue;

    if (isPointInPolygon(point, zone.boundaries)) {
      return zone;
    }
  }

  return null;
}

/**
 * Find pricing for a route between two zones
 * Searches bidirectionally - if A→B doesn't exist, will also check B→A
 * @param originZoneId - Origin zone ID
 * @param destinationZoneId - Destination zone ID
 * @param pricings - Array of zone pricings
 * @returns The pricing for this route, or null if not found
 */
export function findPricingForRoute(
  originZoneId: string,
  destinationZoneId: string,
  pricings: ZonePricing[]
): ZonePricing | null {
  // First, try to find the exact route (origin → destination)
  const directRoute = pricings.find(
    p => p.origin_zone_id === originZoneId &&
         p.destination_zone_id === destinationZoneId &&
         p.is_active
  );

  if (directRoute) return directRoute;

  // If not found, try the reverse route (destination → origin)
  // This allows bidirectional pricing with a single configuration
  const reverseRoute = pricings.find(
    p => p.origin_zone_id === destinationZoneId &&
         p.destination_zone_id === originZoneId &&
         p.is_active
  );

  return reverseRoute || null;
}

/**
 * Result of zone detection for a transfer
 */
export interface ZoneDetectionResult {
  originZone: TransferZone | null;
  destinationZone: TransferZone | null;
  pricing: ZonePricing | null;
  hasValidRoute: boolean;
  error?: 'origin_outside_zones' | 'destination_outside_zones' | 'no_pricing_configured';
}

/**
 * Detect zones and pricing for a transfer route
 * @param origin - Origin point {lat, lng}
 * @param destination - Destination point {lat, lng}
 * @param zones - Array of transfer zones
 * @param pricings - Array of zone pricings
 * @returns Detection result with zones, pricing, and validity
 */
export function detectZonesForTransfer(
  origin: Coordinate,
  destination: Coordinate,
  zones: TransferZone[],
  pricings: ZonePricing[]
): ZoneDetectionResult {
  const originZone = findZoneForPoint(origin, zones);
  const destinationZone = findZoneForPoint(destination, zones);

  if (!originZone) {
    return {
      originZone: null,
      destinationZone,
      pricing: null,
      hasValidRoute: false,
      error: 'origin_outside_zones',
    };
  }

  if (!destinationZone) {
    return {
      originZone,
      destinationZone: null,
      pricing: null,
      hasValidRoute: false,
      error: 'destination_outside_zones',
    };
  }

  const pricing = findPricingForRoute(originZone.id, destinationZone.id, pricings);

  if (!pricing) {
    return {
      originZone,
      destinationZone,
      pricing: null,
      hasValidRoute: false,
      error: 'no_pricing_configured',
    };
  }

  return {
    originZone,
    destinationZone,
    pricing,
    hasValidRoute: true,
  };
}
