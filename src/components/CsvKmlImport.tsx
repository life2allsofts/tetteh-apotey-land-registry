import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Upload,
  FileSpreadsheet,
  Download,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gridToGeo, validateGhanaGridBounds, calculatePolygonArea, calculateCentroid, exportPlotToKML } from '../lib/ghanaGrid';
import { Plot, BoundaryPoint, LandUse, TenureType } from '../types';

interface ParsedCsvRow {
  PointID: string;
  Easting: string;
  Northing: string;
  PlotNumber: string;
  TitleNumber?: string;
  NearestTown?: string;
  District?: string;
  Region?: string;
  OwnerName: string;
  OwnerID?: string;
  OwnerContact?: string;
  LandUse?: string;
  TenureType?: string;
}

export const CsvKmlImport: React.FC = () => {
  const { importPlots, plots, setActiveTab } = useApp();

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [parsedRows, setParsedRows] = useState<ParsedCsvRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleDownloadCsvTemplate = () => {
    const csvHeader = 'PointID,Easting,Northing,PlotNumber,TitleNumber,NearestTown,District,Region,OwnerName,OwnerID,OwnerContact,LandUse,TenureType\n';
    const sampleRows = [
      'SGGA6/90/68,1225462.16,439269.51,PLT-CSV-101,GA-REG-8821,East Legon,Ayawaso West,Greater Accra,John Kwesi Mensah,GHA-9901827-2,+233 24 111 2233,Residential,Freehold',
      'SGGA6/90/69,1226269.12,438990.16,PLT-CSV-101,GA-REG-8821,East Legon,Ayawaso West,Greater Accra,John Kwesi Mensah,GHA-9901827-2,+233 24 111 2233,Residential,Freehold',
      'SGGA6/90/70,1227471.58,437706.46,PLT-CSV-101,GA-REG-8821,East Legon,Ayawaso West,Greater Accra,John Kwesi Mensah,GHA-9901827-2,+233 24 111 2233,Residential,Freehold',
      'SGGA6/90/71,1227935.58,437397.02,PLT-CSV-101,GA-REG-8821,East Legon,Ayawaso West,Greater Accra,John Kwesi Mensah,GHA-9901827-2,+233 24 111 2233,Residential,Freehold'
    ].join('\n');

    const blob = new Blob([csvHeader + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ghana_Grid_Land_Registry_Template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const processFile = (file: File) => {
    setValidationErrors([]);
    setSuccessCount(null);

    if (file.name.endsWith('.csv')) {
      Papa.parse<ParsedCsvRow>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setParsedRows(results.data);
          } else {
            setValidationErrors(['CSV file is empty or formatted incorrectly.']);
          }
        },
        error: (err) => {
          setValidationErrors([`CSV Parse Error: ${err.message}`]);
        }
      });
    } else if (file.name.endsWith('.kml')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        parseKMLFile(text, file.name);
      };
      reader.readAsText(file);
    } else {
      setValidationErrors(['Please upload a valid .csv or .kml file.']);
    }
  };

  const parseKMLFile = (kmlText: string, filename: string) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
      const placemarks = xmlDoc.getElementsByTagName('Placemark');

      const newPlots: Plot[] = [];

      for (let i = 0; i < placemarks.length; i++) {
        const pm = placemarks[i];
        const name = pm.getElementsByTagName('name')[0]?.textContent || `KML-Plot-${i + 1}`;
        const coordNode = pm.getElementsByTagName('coordinates')[0];

        if (coordNode && coordNode.textContent) {
          const rawCoords = coordNode.textContent.trim().split(/\s+/);
          const pts: BoundaryPoint[] = [];

          rawCoords.forEach((cStr, idx) => {
            const parts = cStr.split(',').map((v) => parseFloat(v));
            if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              const lng = parts[0];
              const lat = parts[1];
              pts.push({
                id: `kml-pt-${i}-${idx}`,
                pointId: `KML-PT-${idx + 1}`,
                easting: Math.round(lng * 100000), // Approximate for display if pure geographic
                northing: Math.round(lat * 100000),
                lat,
                lng,
                order: idx + 1
              });
            }
          });

          if (pts.length >= 3) {
            const centroid = calculateCentroid(pts);
            const area = calculatePolygonArea(pts);

            newPlots.push({
              id: `kml-plot-${Date.now()}-${i}`,
              plotNumber: name,
              titleNumber: `KML-TIT-${Math.floor(1000 + Math.random() * 9000)}`,
              nearestTown: 'Imported Location',
              district: 'KML Import District',
              region: 'Greater Accra',
              landUse: 'Residential',
              tenureType: 'Leasehold',
              currentOwner: {
                name: 'Imported KML Holder',
                idNumber: 'GHA-KML-001',
                phone: '+233 24 000 0000',
                email: 'imported@kml.ghana',
                address: 'KML Import Address',
                dateAcquired: new Date().toISOString().split('T')[0]
              },
              ownershipHistory: [],
              boundaryPoints: pts,
              center: centroid,
              ...area,
              attachedFiles: [
                {
                  id: `kml-f-${i}`,
                  filename: filename,
                  originalName: filename,
                  fileType: 'application/vnd.google-earth.kml+xml',
                  fileSize: '15 KB',
                  uploadDate: new Date().toISOString().split('T')[0]
                }
              ],
              notes: 'Imported via KML Google Earth file.',
              regionType: 'coastal',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      if (newPlots.length > 0) {
        importPlots(newPlots);
        setSuccessCount(newPlots.length);
        setTimeout(() => setActiveTab('map'), 1500);
      } else {
        setValidationErrors(['No valid polygon coordinates found in KML file.']);
      }
    } catch (err: any) {
      setValidationErrors([`KML Parse Error: ${err.message}`]);
    }
  };

  const handleConfirmCsvImport = () => {
    // Group CSV rows by PlotNumber
    const groupedPlots: Record<string, ParsedCsvRow[]> = {};

    parsedRows.forEach((row) => {
      const pNum = row.PlotNumber?.trim() || 'UNNAMED-PLOT';
      if (!groupedPlots[pNum]) groupedPlots[pNum] = [];
      groupedPlots[pNum].push(row);
    });

    const newPlots: Plot[] = [];
    const errors: string[] = [];

    Object.entries(groupedPlots).forEach(([pNum, rows], idx) => {
      const pts: BoundaryPoint[] = [];

      rows.forEach((r, rIdx) => {
        const eFt = parseFloat(r.Easting);
        const nFt = parseFloat(r.Northing);

        const val = validateGhanaGridBounds(eFt, nFt);
        if (!val.valid) {
          errors.push(`Row ${rIdx + 1} (${r.PointID}): ${val.message}`);
          return;
        }

        const geo = gridToGeo(eFt, nFt, 'auto');
        pts.push({
          id: `csv-pt-${idx}-${rIdx}`,
          pointId: r.PointID || `PT-${rIdx + 1}`,
          easting: eFt,
          northing: nFt,
          eastingM: geo.eastingM,
          northingM: geo.northingM,
          lat: geo.lat,
          lng: geo.lng,
          order: rIdx + 1
        });
      });

      if (pts.length >= 3) {
        const sampleRow = rows[0];
        const area = calculatePolygonArea(pts);
        const centroid = calculateCentroid(pts);

        newPlots.push({
          id: `csv-plot-${Date.now()}-${idx}`,
          plotNumber: pNum,
          titleNumber: sampleRow.TitleNumber || `GA-CSV-${Math.floor(1000 + Math.random() * 9000)}`,
          nearestTown: sampleRow.NearestTown || 'Ghana Town',
          district: sampleRow.District || 'Municipal District',
          region: sampleRow.Region || 'Greater Accra',
          landUse: (sampleRow.LandUse as LandUse) || 'Residential',
          tenureType: (sampleRow.TenureType as TenureType) || 'Freehold',
          currentOwner: {
            name: sampleRow.OwnerName || 'Unknown Owner',
            idNumber: sampleRow.OwnerID || 'GHA-000',
            phone: sampleRow.OwnerContact || '+233 20 000 0000',
            email: 'owner@ghanalands.gov.gh',
            address: 'Accra, Ghana',
            dateAcquired: new Date().toISOString().split('T')[0]
          },
          ownershipHistory: [],
          boundaryPoints: pts,
          center: centroid,
          ...area,
          attachedFiles: [],
          notes: 'Batch imported from CSV Ghana Grid file.',
          regionType: 'coastal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        errors.push(`Plot ${pNum} has fewer than 3 valid control points.`);
      }
    });

    if (newPlots.length > 0) {
      importPlots(newPlots);
      setSuccessCount(newPlots.length);
      setParsedRows([]);
      setTimeout(() => setActiveTab('map'), 1500);
    } else {
      setValidationErrors(errors);
    }
  };

  const handleExportAllToKML = () => {
    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Ghana Land Registry Database Export</name>
    ${plots
      .map((p) => {
        const coords = p.boundaryPoints.map((pt) => `${pt.lng},${pt.lat},0`).concat([`${p.boundaryPoints[0].lng},${p.boundaryPoints[0].lat},0`]).join(' ');
        return `
    <Placemark>
      <name>${p.plotNumber} - ${p.currentOwner.name}</name>
      <ExtendedData>
        <Data name="titleNumber"><value>${p.titleNumber}</value></Data>
        <Data name="landUse"><value>${p.landUse}</value></Data>
        <Data name="tenureType"><value>${p.tenureType}</value></Data>
        <Data name="areaAcres"><value>${p.areaAcres}</value></Data>
      </ExtendedData>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coords}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
      })
      .join('')}
  </Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ghana_Land_Registry_Full_Export_${new Date().toISOString().split('T')[0]}.kml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded-md uppercase">
            Batch Data Engine
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            CSV & KML Import / Export
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Bulk upload land parcels with Ghana Grid site plan coordinates or Google Earth KML files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsvTemplate}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Download CSV Template</span>
          </button>
          <button
            onClick={handleExportAllToKML}
            className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Export All ({plots.length}) to KML</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl space-y-1">
          <p className="text-xs font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Import Errors Detected:</span>
          </p>
          <ul className="list-disc list-inside text-xs text-rose-700 dark:text-rose-300 space-y-0.5 font-mono">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {successCount !== null && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Successfully imported {successCount} land parcel(s)! Redirecting to map...</span>
        </div>
      )}

      {/* File Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
          }
        }}
        className={`p-10 border-2 border-dashed rounded-2xl text-center transition-all ${
          dragActive
            ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/30'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900'
        }`}
      >
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 shadow-inner">
          <Upload className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Drag & Drop CSV or KML File Here
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Supports Ghana Grid coordinate CSV files (PointID, Easting, Northing) or Google Earth KML polygon layers.
        </p>

        <div className="mt-4">
          <label className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5 shadow-sm">
            <span>Browse Computer Files</span>
            <input
              type="file"
              accept=".csv,.kml"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Pre-Import Validation Table (if CSV parsed) */}
      {parsedRows.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Parsed CSV Preview ({parsedRows.length} Rows)
              </h3>
              <p className="text-xs text-slate-500">
                Review parsed Ghana Grid coordinates before saving into database.
              </p>
            </div>

            <button
              onClick={handleConfirmCsvImport}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Database className="w-4 h-4" />
              <span>Confirm & Save to Registry</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">Plot Number</th>
                  <th className="p-2.5">Point ID</th>
                  <th className="p-2.5">Easting (ft)</th>
                  <th className="p-2.5">Northing (ft)</th>
                  <th className="p-2.5">Owner</th>
                  <th className="p-2.5">Land Use</th>
                  <th className="p-2.5">Tenure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {parsedRows.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-2.5 text-slate-400">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{row.PlotNumber}</td>
                    <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">{row.PointID}</td>
                    <td className="p-2.5">{parseFloat(row.Easting).toLocaleString()}</td>
                    <td className="p-2.5">{parseFloat(row.Northing).toLocaleString()}</td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300 font-sans">{row.OwnerName}</td>
                    <td className="p-2.5">{row.LandUse || 'Residential'}</td>
                    <td className="p-2.5">{row.TenureType || 'Freehold'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {parsedRows.length > 10 && (
            <p className="text-[11px] text-slate-400 text-center italic">
              Showing first 10 of {parsedRows.length} rows...
            </p>
          )}
        </div>
      )}

    </div>
  );
};
