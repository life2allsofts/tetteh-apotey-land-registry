import { describe, it, expect } from 'vitest';
import { SAMPLE_PLOTS } from '../sampleData';

describe('Sample Cadastral Data Integrity', () => {
  it('should load initial sample plots array', () => {
    expect(SAMPLE_PLOTS).toBeDefined();
    expect(Array.isArray(SAMPLE_PLOTS)).toBe(true);
    expect(SAMPLE_PLOTS.length).toBeGreaterThan(0);
  });

  it('should verify each sample plot contains mandatory cadastral fields', () => {
    SAMPLE_PLOTS.forEach((plot) => {
      expect(plot.id).toBeDefined();
      expect(plot.plotNumber).toBeTruthy();
      expect(plot.titleNumber).toBeTruthy();
      expect(plot.currentOwner).toBeDefined();
      expect(plot.currentOwner.name).toBeTruthy();
      expect(plot.nearestTown).toBeTruthy();
      expect(plot.region).toBeTruthy();
      expect(plot.landUse).toBeTruthy();
      expect(plot.tenureType).toBeTruthy();
      expect(plot.areaAcres).toBeGreaterThan(0);
      expect(plot.boundaryPoints.length).toBeGreaterThanOrEqual(3);
      expect(plot.center).toHaveLength(2);
    });
  });

  it('should verify boundary points have valid Ghana Grid Easting/Northing values', () => {
    SAMPLE_PLOTS.forEach((plot) => {
      plot.boundaryPoints.forEach((pt) => {
        expect(pt.easting).toBeGreaterThan(100000);
        expect(pt.northing).toBeGreaterThan(50000);
        expect(pt.lat).toBeGreaterThan(4.5);
        expect(pt.lat).toBeLessThan(11.5);
        expect(pt.lng).toBeGreaterThan(-3.5);
        expect(pt.lng).toBeLessThan(1.5);
      });
    });
  });
});
