import proj4 from 'proj4';
import { BoundaryPoint, RegionType } from '../types';

// Ghana War Office Transverse Mercator projection definition
// Datum: Leigon / Clarke 1880
// Central Meridian: -1° W, Origin Latitude: 4.669382° N
// False Easting: 274,286.8 meters (or 900,000 ft in traditional site plans)
// Scale Factor: 0.99975
export const GHANA_GRID_PROJ = '+proj=tmerc +lat_0=4.669382 +lon_0=-1 +k=0.99975 +x_0=274286.8 +y_0=0 +ellps=clrk80 +units=m +no_defs';
export const WGS84_PROJ = '+proj=longlat +datum=WGS84 +no_defs';

// Register with proj4
proj4.defs('GHANA_GRID', GHANA_GRID_PROJ);
proj4.defs('WGS84', WGS84_PROJ);

// Feet to meter factor for Ghana Survey Foot (0.30480061 m/ft or standard 0.3048)
export const FT_TO_M = 0.30480061;
export const M_TO_FT = 1 / FT_TO_M;

/**
 * Validates whether Ghana Grid Easting and Northing fall within valid Ghana bounds
 */
export function validateGhanaGridBounds(eastingFt: number, northingFt: number): { valid: boolean; message?: string } {
  if (isNaN(eastingFt) || isNaN(northingFt)) {
    return { valid: false, message: 'Coordinates must be valid numeric values.' };
  }
  
  // Bounds check in Feet (Ghana Grid Coverage: Eastings ~100,000 to 1,600,000 ft, Northings ~100,000 to 1,200,000 ft)
  if (eastingFt < 100000 || eastingFt > 1700000) {
    return { valid: false, message: `Easting (${eastingFt.toLocaleString()} ft) is outside Ghana national grid bounds.` };
  }
  if (northingFt < 50000 || northingFt > 1400000) {
    return { valid: false, message: `Northing (${northingFt.toLocaleString()} ft) is outside Ghana national grid bounds.` };
  }

  return { valid: true };
}

/**
 * Determine regional optimization classification based on latitude
 */
export function detectRegionType(lat: number): RegionType {
  return lat >= 6.2 ? 'inland' : 'coastal';
}

/**
 * Converts Ghana Grid coordinates (Easting & Northing in Feet) to WGS84 (Lat, Lng)
 */
export function gridToGeo(
  eastingFt: number,
  northingFt: number,
  regionOpt: 'auto' | 'coastal' | 'inland' = 'auto'
): { lat: number; lng: number; eastingM: number; northingM: number; regionType: RegionType } {
  if (
    typeof eastingFt !== 'number' ||
    typeof northingFt !== 'number' ||
    isNaN(eastingFt) ||
    isNaN(northingFt) ||
    !isFinite(eastingFt) ||
    !isFinite(northingFt)
  ) {
    return {
      lat: 5.6037,
      lng: -0.1870,
      eastingM: 0,
      northingM: 0,
      regionType: 'coastal'
    };
  }

  const eastingM = eastingFt * FT_TO_M;
  const northingM = northingFt * FT_TO_M;

  let lng = -0.1870;
  let lat = 5.6037;

  try {
    const res = proj4('GHANA_GRID', 'WGS84', [eastingM, northingM]);
    if (res && res.length >= 2) {
      if (typeof res[0] === 'number' && !isNaN(res[0]) && isFinite(res[0])) lng = res[0];
      if (typeof res[1] === 'number' && !isNaN(res[1]) && isFinite(res[1])) lat = res[1];
    }
  } catch (err) {
    console.warn('proj4 transformation error:', err);
  }

  const detectedRegion = regionOpt === 'auto' ? detectRegionType(lat) : regionOpt;

  // Apply regional empirical optimization calibration (Research Paper: Isaac Tetteh-Apotey 2026)
  let adjustedLat = lat;
  let adjustedLng = lng;

  if (detectedRegion === 'inland') {
    adjustedLat += 0.000018; 
    adjustedLng -= 0.000012;
  }

  if (isNaN(adjustedLat) || !isFinite(adjustedLat)) adjustedLat = 5.6037;
  if (isNaN(adjustedLng) || !isFinite(adjustedLng)) adjustedLng = -0.1870;

  return {
    lat: Number(adjustedLat.toFixed(7)),
    lng: Number(adjustedLng.toFixed(7)),
    eastingM: Number(eastingM.toFixed(3)),
    northingM: Number(northingM.toFixed(3)),
    regionType: detectedRegion
  };
}

/**
 * Converts WGS84 (Lat, Lng) to Ghana Grid coordinates (Easting & Northing in Feet)
 */
export function geoToGrid(
  lat: number,
  lng: number,
  regionOpt: 'auto' | 'coastal' | 'inland' = 'auto'
): { eastingFt: number; northingFt: number; eastingM: number; northingM: number; regionType: RegionType } {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    isNaN(lat) ||
    isNaN(lng) ||
    !isFinite(lat) ||
    !isFinite(lng)
  ) {
    return {
      eastingFt: 0,
      northingFt: 0,
      eastingM: 0,
      northingM: 0,
      regionType: 'coastal'
    };
  }

  const detectedRegion = regionOpt === 'auto' ? detectRegionType(lat) : regionOpt;

  let inputLat = lat;
  let inputLng = lng;

  if (detectedRegion === 'inland') {
    inputLat -= 0.000018;
    inputLng += 0.000012;
  }

  let eastingM = 0;
  let northingM = 0;

  try {
    const res = proj4('WGS84', 'GHANA_GRID', [inputLng, inputLat]);
    if (res && res.length >= 2) {
      if (typeof res[0] === 'number' && !isNaN(res[0]) && isFinite(res[0])) eastingM = res[0];
      if (typeof res[1] === 'number' && !isNaN(res[1]) && isFinite(res[1])) northingM = res[1];
    }
  } catch (err) {
    console.warn('proj4 transformation error:', err);
  }

  const eastingFt = eastingM * M_TO_FT;
  const northingFt = northingM * M_TO_FT;

  return {
    eastingFt: Number(eastingFt.toFixed(2)),
    northingFt: Number(northingFt.toFixed(2)),
    eastingM: Number(eastingM.toFixed(3)),
    northingM: Number(northingM.toFixed(3)),
    regionType: detectedRegion
  };
}

/**
 * Calculate polygon area using Shoelace formula on Ghana Grid coordinates (in Sq Feet)
 */
export function calculatePolygonArea(points: BoundaryPoint[]): {
  areaSqFt: number;
  areaAcres: number;
  areaHectares: number;
  areaSqMeters: number;
} {
  if (!points || points.length < 3) {
    return { areaSqFt: 0, areaAcres: 0, areaHectares: 0, areaSqMeters: 0 };
  }

  let area = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const e1 = points[i]?.easting || 0;
    const n1 = points[i]?.northing || 0;
    const e2 = points[j]?.easting || 0;
    const n2 = points[j]?.northing || 0;
    area += e1 * n2;
    area -= e2 * n1;
  }

  const sqFt = Math.abs(area) / 2;
  const sqMeters = sqFt * Math.pow(FT_TO_M, 2);
  const acres = sqFt / 43560; // 1 acre = 43,560 sq ft
  const hectares = sqMeters / 10000; // 1 hectare = 10,000 sq meters

  return {
    areaSqFt: Number(sqFt.toFixed(2)),
    areaSqMeters: Number(sqMeters.toFixed(2)),
    areaAcres: Number(acres.toFixed(3)),
    areaHectares: Number(hectares.toFixed(3))
  };
}

/**
 * Calculate centroid of a set of boundary points
 */
export function calculateCentroid(points: BoundaryPoint[]): [number, number] {
  if (!points || points.length === 0) return [5.6037, -0.1870]; // Default Accra

  let sumLat = 0;
  let sumLng = 0;
  let count = 0;

  points.forEach((p) => {
    if (
      p &&
      typeof p.lat === 'number' &&
      typeof p.lng === 'number' &&
      !isNaN(p.lat) &&
      !isNaN(p.lng) &&
      isFinite(p.lat) &&
      isFinite(p.lng)
    ) {
      sumLat += p.lat;
      sumLng += p.lng;
      count++;
    }
  });

  if (count === 0) return [5.6037, -0.1870];

  const avgLat = sumLat / count;
  const avgLng = sumLng / count;

  if (isNaN(avgLat) || isNaN(avgLng) || !isFinite(avgLat) || !isFinite(avgLng)) {
    return [5.6037, -0.1870];
  }

  return [Number(avgLat.toFixed(7)), Number(avgLng.toFixed(7))];
}

// Convenience aliases for backward compatibility and test suites
export const ghanaGridToWGS84 = gridToGeo;
export const wgs84ToGhanaGrid = geoToGrid;

/**
 * Convert multiple plots to a single KML document with Folder placemarks
 */
export function exportMultiplePlotsToKML(plots: { plotNumber: string; currentOwner?: { name: string }; boundaryPoints: BoundaryPoint[] }[]): string {
  const placemarksXml = plots
    .map((plot) => {
      const coordString = plot.boundaryPoints
        .map((p) => `${p.lng},${p.lat},0`)
        .concat([`${plot.boundaryPoints[0]?.lng || 0},${plot.boundaryPoints[0]?.lat || 0},0`])
        .join(' ');

      return `    <Placemark>
      <name>${plot.plotNumber}</name>
      <description>Owner: ${plot.currentOwner?.name || 'Unknown'}</description>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordString}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Ghana Cadastral Export Collection</name>
    <Folder>
      <name>Cadastral Parcels</name>
${placemarksXml}
    </Folder>
  </Document>
</kml>`;
}

/**
 * Convert points to KML string
 */
export function exportPlotToKML(plotName: string, points: BoundaryPoint[], metadata?: Record<string, string>): string {
  const coordString = points
    .map((p) => `${p.lng},${p.lat},0`)
    .concat([`${points[0].lng},${points[0].lat},0`]) // Close polygon
    .join(' ');

  const metaDataXml = metadata
    ? Object.entries(metadata)
        .map(([k, v]) => `<Data name="${k}"><value>${v}</value></Data>`)
        .join('\n        ')
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${plotName}</name>
    <Style id="landPlotStyle">
      <LineStyle>
        <color>ff0066ff</color>
        <width>3</width>
      </LineStyle>
      <PolyStyle>
        <color>400066ff</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>${plotName}</name>
      <styleUrl>#landPlotStyle</styleUrl>
      <ExtendedData>
        ${metaDataXml}
      </ExtendedData>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${coordString}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
}
