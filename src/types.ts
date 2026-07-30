export type LandUse = 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial' | 'Mixed-Use' | 'Civic' | 'Other';

export type TenureType = 'Freehold' | 'Leasehold' | 'Customary' | 'Sublease' | 'Conveyance';

export type CoordinateFormat = 'ghana-grid-ft' | 'ghana-grid-m' | 'wgs84';

export type RegionType = 'coastal' | 'inland';

export type ThemeMode = 'light' | 'dark' | 'satellite' | 'emerald' | 'high-contrast';

export interface BoundaryPoint {
  id: string;
  pointId: string;
  easting: number; // Ghana Grid Easting in feet
  northing: number; // Ghana Grid Northing in feet
  eastingM?: number; // Ghana Grid Easting in meters
  northingM?: number; // Ghana Grid Northing in meters
  lat: number; // WGS84 latitude
  lng: number; // WGS84 longitude
  order: number;
}

export interface OwnerHistoryItem {
  id: string;
  ownerName: string;
  idNumber: string;
  dateAcquired: string;
  dateSold?: string;
  purchasePrice?: number;
  documentReference: string;
}

export interface AttachedFile {
  id: string;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  url?: string;
}

export interface Plot {
  id: string;
  plotNumber: string;
  titleNumber: string;
  nearestTown: string;
  district: string;
  region: string;
  landUse: LandUse;
  tenureType: TenureType;
  currentOwner: {
    name: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    dateAcquired: string;
  };
  ownershipHistory: OwnerHistoryItem[];
  boundaryPoints: BoundaryPoint[];
  center: [number, number]; // [lat, lng]
  areaSqFt: number;
  areaAcres: number;
  areaHectares: number;
  attachedFiles: AttachedFile[];
  notes: string;
  regionType: RegionType;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  coordinateUnit: 'feet' | 'meters';
  regionalOptimization: 'auto' | 'coastal' | 'inland';
  coastalThreshold: number; // Default 6.0 deg N latitude
  defaultMapCenter: [number, number];
  defaultMapZoom: number;
  highPrecisionMode: boolean;
  basemap: 'streets' | 'satellite' | 'dark' | 'terrain' | 'high-contrast';
  showGridGridlines: boolean;
  showPointLabels: boolean;
  autoZoomOnSelect: boolean;
}

export type ActiveTab = 'map' | 'manual-entry' | 'csv-kml' | 'registry' | 'analytics' | 'research';

export interface UserGuideStep {
  step: number;
  title: string;
  description: string;
  targetKey: string;
  badgeText: string;
}
