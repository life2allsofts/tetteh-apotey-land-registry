import { Plot, BoundaryPoint } from '../types';
import { gridToGeo, calculatePolygonArea, calculateCentroid } from './ghanaGrid';

function createBoundaryPoints(
  rawPoints: { pointId: string; easting: number; northing: number }[]
): BoundaryPoint[] {
  return rawPoints.map((pt, idx) => {
    const geo = gridToGeo(pt.easting, pt.northing, 'auto');
    return {
      id: `pt-${idx + 1}`,
      pointId: pt.pointId,
      easting: pt.easting,
      northing: pt.northing,
      eastingM: geo.eastingM,
      northingM: geo.northingM,
      lat: geo.lat,
      lng: geo.lng,
      order: idx + 1
    };
  });
}

// Raw Ghana Grid Coordinates from Ghana Lands Commission & Surveying records
const plot1Points = createBoundaryPoints([
  { pointId: 'SGGA6/90/68', easting: 1225462.16, northing: 439269.51 },
  { pointId: 'SGGA6/90/69', easting: 1226269.12, northing: 438990.16 },
  { pointId: 'SGGA6/90/70', easting: 1227471.58, northing: 437706.46 },
  { pointId: 'SGGA6/90/71', easting: 1227935.58, northing: 437397.02 }
]);

const plot2Points = createBoundaryPoints([
  { pointId: 'TP3', easting: 1196950.94, northing: 334275.43 },
  { pointId: 'SS 66', easting: 1197056.15, northing: 334151.61 },
  { pointId: 'SGSS 11/96/1', easting: 1196989.03, northing: 334302.06 },
  { pointId: 'SS 68', easting: 1197428.76, northing: 334527.53 },
  { pointId: 'SS 92', easting: 1196871.56, northing: 334509.50 }
]);

const plot3Points = createBoundaryPoints([
  { pointId: 'GA/EL/001', easting: 1220150.25, northing: 395420.80 },
  { pointId: 'GA/EL/002', easting: 1220850.50, northing: 395380.10 },
  { pointId: 'GA/EL/003', easting: 1220790.10, northing: 394710.30 },
  { pointId: 'GA/EL/004', easting: 1220110.80, northing: 394750.60 }
]);

const plot4Points = createBoundaryPoints([
  { pointId: 'ASH/KUM/12', easting: 1112450.00, northing: 654200.00 },
  { pointId: 'ASH/KUM/13', easting: 1113100.00, northing: 654150.00 },
  { pointId: 'ASH/KUM/14', easting: 1113050.00, northing: 653500.00 },
  { pointId: 'ASH/KUM/15', easting: 1112400.00, northing: 653550.00 }
]);

const plot5Points = createBoundaryPoints([
  { pointId: 'NOR/TAM/01', easting: 1150200.00, northing: 1120400.00 },
  { pointId: 'NOR/TAM/02', easting: 1151200.00, northing: 1120350.00 },
  { pointId: 'NOR/TAM/03', easting: 1151150.00, northing: 1119200.00 },
  { pointId: 'NOR/TAM/04', easting: 1150150.00, northing: 1119250.00 }
]);

export const initialPlots: Plot[] = [
  {
    id: 'plot-1',
    plotNumber: 'PLT-ACC-2026-001',
    titleNumber: 'GA-REG-10892/2026',
    nearestTown: 'East Legon',
    district: 'Ayawaso West Municipal',
    region: 'Greater Accra',
    landUse: 'Residential',
    tenureType: 'Leasehold',
    currentOwner: {
      name: 'Dr. Kwame Addo-Kufuor',
      idNumber: 'GHA-720194821-4',
      phone: '+233 24 412 3456',
      email: 'k.addokufuor@ghanalands.gov.gh',
      address: 'Plot 42, Lagos Avenue, East Legon, Accra',
      dateAcquired: '2021-04-15'
    },
    ownershipHistory: [
      {
        id: 'hist-1',
        ownerName: 'East Legon Stool / Customary Authority',
        idNumber: 'STOOL-GA-002',
        dateAcquired: '1975-01-01',
        dateSold: '2010-06-12',
        purchasePrice: 150000,
        documentReference: 'CAD/SITE-PLAN/1975-88'
      },
      {
        id: 'hist-2',
        ownerName: 'Alhaji Ibrahim Yakubu',
        idNumber: 'GHA-552019344-1',
        dateAcquired: '2010-06-12',
        dateSold: '2021-04-15',
        purchasePrice: 480000,
        documentReference: 'DEED-TRANSFER/GA/2010-449'
      }
    ],
    boundaryPoints: plot1Points,
    center: calculateCentroid(plot1Points),
    ...calculatePolygonArea(plot1Points),
    attachedFiles: [
      {
        id: 'f-1',
        filename: 'site_plan_PLT-001.pdf',
        originalName: 'Approved_Site_Plan_SGGA6.pdf',
        fileType: 'application/pdf',
        fileSize: '2.4 MB',
        uploadDate: '2026-01-10'
      },
      {
        id: 'f-2',
        filename: 'lands_commission_search.pdf',
        originalName: 'Official_Lands_Commission_Search_2026.pdf',
        fileType: 'application/pdf',
        fileSize: '1.1 MB',
        uploadDate: '2026-02-04'
      }
    ],
    notes: 'Primary residential plot with approved 99-year customary lease. Site plan verified against Survey and Mapping Division standards.',
    regionType: 'coastal',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-04T14:30:00Z'
  },
  {
    id: 'plot-2',
    plotNumber: 'PLT-ACC-2026-002',
    titleNumber: 'GA-REG-11045/2026',
    nearestTown: 'Airport Residential Area',
    district: 'Ayawaso Central Municipal',
    region: 'Greater Accra',
    landUse: 'Commercial',
    tenureType: 'Freehold',
    currentOwner: {
      name: 'Ghana Commercial Properties Ltd',
      idNumber: 'CS-84920192',
      phone: '+233 30 277 8899',
      email: 'info@gcproperties.com.gh',
      address: 'Suite 300, Heritage Tower, Ridge, Accra',
      dateAcquired: '2018-09-20'
    },
    ownershipHistory: [
      {
        id: 'hist-21',
        ownerName: 'Government of Ghana (State Lands)',
        idNumber: 'GOV-GHA-001',
        dateAcquired: '1962-03-10',
        dateSold: '2018-09-20',
        purchasePrice: 1200000,
        documentReference: 'GA/STATE-GRANT/1962/99'
      }
    ],
    boundaryPoints: plot2Points,
    center: calculateCentroid(plot2Points),
    ...calculatePolygonArea(plot2Points),
    attachedFiles: [
      {
        id: 'f-21',
        filename: 'commercial_title_deed.pdf',
        originalName: 'Freehold_Certificate_GA11045.pdf',
        fileType: 'application/pdf',
        fileSize: '3.8 MB',
        uploadDate: '2025-11-12'
      }
    ],
    notes: 'Prime commercial plot near Kotoka International Airport. Zoned for multi-storey office complex.',
    regionType: 'coastal',
    createdAt: '2026-01-12T11:15:00Z',
    updatedAt: '2026-01-12T11:15:00Z'
  },
  {
    id: 'plot-3',
    plotNumber: 'PLT-ACC-2026-003',
    titleNumber: 'GA-REG-11902/2026',
    nearestTown: 'Cantonments',
    district: 'La Dade Kotopon Municipal',
    region: 'Greater Accra',
    landUse: 'Mixed-Use',
    tenureType: 'Sublease',
    currentOwner: {
      name: 'Abena Mensah Osei',
      idNumber: 'GHA-882910394-8',
      phone: '+233 20 811 2233',
      email: 'abena.osei@gmail.com',
      address: '14 Circular Road, Cantonments, Accra',
      dateAcquired: '2022-11-05'
    },
    ownershipHistory: [],
    boundaryPoints: plot3Points,
    center: calculateCentroid(plot3Points),
    ...calculatePolygonArea(plot3Points),
    attachedFiles: [],
    notes: 'Sublease granted for boutique hotel and residential apartments.',
    regionType: 'coastal',
    createdAt: '2026-01-15T09:20:00Z',
    updatedAt: '2026-01-15T09:20:00Z'
  },
  {
    id: 'plot-4',
    plotNumber: 'PLT-ASH-2026-012',
    titleNumber: 'ASH-REG-04512/2026',
    nearestTown: 'Ahodwo',
    district: 'Kumasi Metropolitan Assembly',
    region: 'Ashanti',
    landUse: 'Residential',
    tenureType: 'Customary',
    currentOwner: {
      name: 'Nana Kofi Prempeh II',
      idNumber: 'GHA-110293847-5',
      phone: '+233 24 399 8811',
      email: 'prempeh.customary@asante.org',
      address: 'Ahodwo Roundabout, Kumasi',
      dateAcquired: '2019-02-18'
    },
    ownershipHistory: [
      {
        id: 'hist-41',
        ownerName: 'Golden Stool Land Secretariat',
        idNumber: 'ASANTE-STOOL-001',
        dateAcquired: '1900-01-01',
        dateSold: '2019-02-18',
        purchasePrice: 220000,
        documentReference: 'ASH/CUSTOMARY-ALLOC/2019'
      }
    ],
    boundaryPoints: plot4Points,
    center: calculateCentroid(plot4Points),
    ...calculatePolygonArea(plot4Points),
    attachedFiles: [],
    notes: 'Asantehene Customary Land Grant in Ahodwo, Kumasi. Validated with Kumasi Land Secretariat.',
    regionType: 'coastal',
    createdAt: '2026-01-20T14:00:00Z',
    updatedAt: '2026-01-20T14:00:00Z'
  },
  {
    id: 'plot-5',
    plotNumber: 'PLT-NOR-2026-005',
    titleNumber: 'NOR-REG-00188/2026',
    nearestTown: 'Lamashegu',
    district: 'Tamale Metropolitan Area',
    region: 'Northern',
    landUse: 'Agricultural',
    tenureType: 'Conveyance',
    currentOwner: {
      name: 'Northern Agricultural Cooperative Union',
      idNumber: 'GHA-990218273-0',
      phone: '+233 27 755 4433',
      email: 'contact@nacou-ghana.org',
      address: 'Lamashegu Industrial Area, Tamale',
      dateAcquired: '2023-05-14'
    },
    ownershipHistory: [],
    boundaryPoints: plot5Points,
    center: calculateCentroid(plot5Points),
    ...calculatePolygonArea(plot5Points),
    attachedFiles: [],
    notes: 'Inland Northern Region agricultural parcel. Calibrated using Isaac Tetteh-Apotey regional optimization framework.',
    regionType: 'inland',
    createdAt: '2026-01-25T16:45:00Z',
    updatedAt: '2026-01-25T16:45:00Z'
  }
];
