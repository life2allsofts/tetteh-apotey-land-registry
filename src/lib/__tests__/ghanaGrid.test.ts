import { describe, it, expect } from 'vitest';
import {
  ghanaGridToWGS84,
  wgs84ToGhanaGrid,
  calculatePolygonArea,
  exportPlotToKML,
  exportMultiplePlotsToKML
} from '../ghanaGrid';
import { BoundaryPoint } from '../../types';

describe('Ghana Grid Conversion Engine', () => {
  it('should convert Ghana Grid Easting/Northing to WGS84 Lat/Lng accurately', () => {
    // Reference point: E=1,180,500 ft, N=233,400 ft
    const result = ghanaGridToWGS84(1180500, 233400);

    expect(result.lat).toBeGreaterThan(5.0);
    expect(result.lat).toBeLessThan(6.0);
    expect(result.lng).toBeGreaterThan(-0.5);
    expect(result.lng).toBeLessThan(0.5);
  });

  it('should perform inverse conversion from WGS84 Lat/Lng back to Ghana Grid', () => {
    const originalEasting = 1180500;
    const originalNorthing = 233400;

    const { lat, lng } = ghanaGridToWGS84(originalEasting, originalNorthing);
    const convertedGrid = wgs84ToGhanaGrid(lat, lng);

    // Difference should be within 5 feet due to rounding & float precision
    expect(Math.abs(convertedGrid.eastingFt - originalEasting)).toBeLessThan(5);
    expect(Math.abs(convertedGrid.northingFt - originalNorthing)).toBeLessThan(5);
  });

  it('should calculate polygon area correctly using Shoelace formula', () => {
    // 100ft x 100ft square = 10,000 sq ft = 0.2295 acres
    const points: BoundaryPoint[] = [
      { id: '1', pointId: 'P1', easting: 1000, northing: 1000, lat: 5.5, lng: -0.2, order: 1 },
      { id: '2', pointId: 'P2', easting: 1100, northing: 1000, lat: 5.5, lng: -0.2, order: 2 },
      { id: '3', pointId: 'P3', easting: 1100, northing: 1100, lat: 5.5, lng: -0.2, order: 3 },
      { id: '4', pointId: 'P4', easting: 1000, northing: 1100, lat: 5.5, lng: -0.2, order: 4 }
    ];

    const area = calculatePolygonArea(points);

    expect(area.areaSqFt).toBe(10000);
    expect(area.areaAcres).toBeCloseTo(0.23, 2);
    expect(area.areaSqMeters).toBeGreaterThan(900);
    expect(area.areaHectares).toBeGreaterThan(0.09);
  });

  it('should handle invalid or fewer than 3 boundary points gracefully', () => {
    const points: BoundaryPoint[] = [
      { id: '1', pointId: 'P1', easting: 1000, northing: 1000, lat: 5.5, lng: -0.2, order: 1 }
    ];

    const area = calculatePolygonArea(points);

    expect(area.areaSqFt).toBe(0);
    expect(area.areaAcres).toBe(0);
    expect(area.areaHectares).toBe(0);
    expect(area.areaSqMeters).toBe(0);
  });

  it('should generate valid KML string for an individual plot', () => {
    const points: BoundaryPoint[] = [
      { id: '1', pointId: 'P1', easting: 1180500, northing: 233400, lat: 5.5612, lng: -0.1789, order: 1 },
      { id: '2', pointId: 'P2', easting: 1180700, northing: 233400, lat: 5.5612, lng: -0.1783, order: 2 },
      { id: '3', pointId: 'P3', easting: 1180700, northing: 233600, lat: 5.5628, lng: -0.1783, order: 3 },
      { id: '4', pointId: 'P4', easting: 1180500, northing: 233600, lat: 5.5628, lng: -0.1789, order: 4 }
    ];

    const kml = exportPlotToKML('PLT-CANTONMENTS-001', points, {
      titleNumber: 'GA-10294-2024',
      owner: 'Kofi Mensah',
      landUse: 'Residential',
      tenureType: 'Freehold',
      areaAcres: '0.918'
    });

    expect(kml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(kml).toContain('<kml xmlns="http://www.opengis.net/kml/2.2">');
    expect(kml).toContain('PLT-CANTONMENTS-001');
    expect(kml).toContain('Kofi Mensah');
    expect(kml).toContain('<Polygon>');
    expect(kml).toContain('<coordinates>');
  });

  it('should generate multi-plot KML for batch export', () => {
    const samplePlot = {
      id: 'p1',
      plotNumber: 'PLT-001',
      titleNumber: 'GA-001',
      currentOwner: { id: 'o1', name: 'Kwame Nkrumah', phone: '0240000000', idNumber: 'GHA-1' },
      nearestTown: 'Accra',
      district: 'AMA',
      region: 'Greater Accra',
      landUse: 'Residential' as const,
      tenureType: 'Freehold' as const,
      areaAcres: 1.5,
      areaHectares: 0.6,
      areaSqFt: 65340,
      areaSqMeters: 6070,
      boundaryPoints: [
        { id: '1', pointId: 'P1', easting: 1180500, northing: 233400, lat: 5.5612, lng: -0.1789, order: 1 },
        { id: '2', pointId: 'P2', easting: 1180700, northing: 233400, lat: 5.5612, lng: -0.1783, order: 2 },
        { id: '3', pointId: 'P3', easting: 1180700, northing: 233600, lat: 5.5628, lng: -0.1783, order: 3 }
      ],
      center: [5.5615, -0.1785] as [number, number],
      ownershipHistory: [],
      notes: 'Test plot'
    };

    const kml = exportMultiplePlotsToKML([samplePlot]);

    expect(kml).toContain('PLT-001');
    expect(kml).toContain('Kwame Nkrumah');
    expect(kml).toContain('<Folder>');
  });
});
