import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  FileText,
  User,
  Building,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  gridToGeo,
  validateGhanaGridBounds,
  calculatePolygonArea,
  calculateCentroid
} from '../lib/ghanaGrid';
import { BoundaryPoint, LandUse, TenureType, Plot } from '../types';

export const CoordinateEntry: React.FC = () => {
  const { addPlot, previewPoints, setPreviewPoints, clearPreviewPoints, setActiveTab } = useApp();

  // Point Form Inputs
  const [pointId, setPointId] = useState<string>('SGGA6/90/72');
  const [eastingInput, setEastingInput] = useState<string>('1226000.00');
  const [northingInput, setNorthingInput] = useState<string>('439000.00');

  // Plot Metadata Inputs
  const [plotNumber, setPlotNumber] = useState<string>(`PLT-GA-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [titleNumber, setTitleNumber] = useState<string>(`GA-REG-${Math.floor(10000 + Math.random() * 90000)}/2026`);
  const [ownerName, setOwnerName] = useState<string>('Emmanuel Boakye Appiah');
  const [ownerId, setOwnerId] = useState<string>('GHA-441092834-9');
  const [ownerPhone, setOwnerPhone] = useState<string>('+233 24 555 0192');
  const [ownerEmail, setOwnerEmail] = useState<string>('emmanuel.boakye@gmail.com');
  const [ownerAddress, setOwnerAddress] = useState<string>('Plot 19, Spintex Road, Accra');
  
  const [nearestTown, setNearestTown] = useState<string>('Spintex');
  const [district, setDistrict] = useState<string>('Ledzokuku Municipal');
  const [region, setRegion] = useState<string>('Greater Accra');
  const [landUse, setLandUse] = useState<LandUse>('Residential');
  const [tenureType, setTenureType] = useState<TenureType>('Leasehold');
  const [notes, setNotes] = useState<string>('Approved cadastral site plan verified with Ghana Survey and Mapping Division.');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Calculated Area
  const areaCalc = calculatePolygonArea(previewPoints);

  const handleAddPoint = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    const eastingFt = parseFloat(eastingInput);
    const northingFt = parseFloat(northingInput);

    const valResult = validateGhanaGridBounds(eastingFt, northingFt);
    if (!valResult.valid) {
      setValidationError(valResult.message || 'Invalid Ghana Grid coordinates');
      return;
    }

    const geo = gridToGeo(eastingFt, northingFt, 'auto');

    const newPoint: BoundaryPoint = {
      id: `pt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      pointId: pointId.trim() || `PT-${previewPoints.length + 1}`,
      easting: eastingFt,
      northing: northingFt,
      eastingM: geo.eastingM,
      northingM: geo.northingM,
      lat: geo.lat,
      lng: geo.lng,
      order: previewPoints.length + 1
    };

    setPreviewPoints((prev) => [...prev, newPoint]);

    // Prepare next point input suggestion
    setPointId(`SGGA6/90/${73 + previewPoints.length}`);
    setEastingInput((eastingFt + (Math.random() > 0.5 ? 400 : -400)).toFixed(2));
    setNorthingInput((northingFt + (Math.random() > 0.5 ? 400 : -400)).toFixed(2));
  };

  const handleRemovePoint = (id: string) => {
    setPreviewPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLoadSampleSitePlan = () => {
    clearPreviewPoints();
    const samplePts = [
      { pointId: 'SGGA6/90/68', easting: 1225462.16, northing: 439269.51 },
      { pointId: 'SGGA6/90/69', easting: 1226269.12, northing: 438990.16 },
      { pointId: 'SGGA6/90/70', easting: 1227471.58, northing: 437706.46 },
      { pointId: 'SGGA6/90/71', easting: 1227935.58, northing: 437397.02 }
    ];

    const pts: BoundaryPoint[] = samplePts.map((pt, idx) => {
      const geo = gridToGeo(pt.easting, pt.northing, 'auto');
      return {
        id: `pt-sample-${idx + 1}`,
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

    setPreviewPoints(pts);
    setSuccessMsg('Loaded 4 approved site plan Ghana Grid control points!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSavePlot = () => {
    if (previewPoints.length < 3) {
      setValidationError('At least 3 boundary points are required to form a valid land parcel polygon.');
      return;
    }

    if (!plotNumber || !ownerName) {
      setValidationError('Plot Number and Owner Name are required.');
      return;
    }

    const centroid = calculateCentroid(previewPoints);

    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      plotNumber: plotNumber.trim(),
      titleNumber: titleNumber.trim() || `GA-REG-${Math.floor(10000 + Math.random() * 90000)}/2026`,
      nearestTown,
      district,
      region,
      landUse,
      tenureType,
      currentOwner: {
        name: ownerName.trim(),
        idNumber: ownerId.trim(),
        phone: ownerPhone.trim(),
        email: ownerEmail.trim(),
        address: ownerAddress.trim(),
        dateAcquired: new Date().toISOString().split('T')[0]
      },
      ownershipHistory: [
        {
          id: `hist-init-${Date.now()}`,
          ownerName: ownerName.trim(),
          idNumber: ownerId.trim(),
          dateAcquired: new Date().toISOString().split('T')[0],
          documentReference: titleNumber.trim()
        }
      ],
      boundaryPoints: previewPoints,
      center: centroid,
      ...areaCalc,
      attachedFiles: [],
      notes,
      regionType: 'coastal',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    addPlot(newPlot);
    clearPreviewPoints();
    setSuccessMsg(`Plot ${newPlot.plotNumber} successfully registered in database!`);
    setTimeout(() => {
      setActiveTab('map');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-md uppercase">
              Ghana Grid Engine
            </span>
            <span className="text-xs text-slate-500 font-medium">War Office Transverse Mercator</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manual Coordinate Entry & Live Map Preview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter site plan Eastings and Northings in feet. Coordinates are automatically transformed into WGS84 and projected on the live GIS map.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadSampleSitePlan}
            className="px-3 py-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/80 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Load Sample Site Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-4 h-4" />
            <span>Switch to Map</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      {validationError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 rounded-xl text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Coordinate Input Form & Points Table (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add Point Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>1. Enter Ghana Grid Site Plan Control Point</span>
            </h3>

            <form onSubmit={handleAddPoint} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Point ID (Site Plan)
                </label>
                <input
                  type="text"
                  value={pointId}
                  onChange={(e) => setPointId(e.target.value)}
                  placeholder="e.g. SGGA6/90/68"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Easting (Feet)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={eastingInput}
                  onChange={(e) => setEastingInput(e.target.value)}
                  placeholder="e.g. 1225462.16"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Northing (Feet)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={northingInput}
                  onChange={(e) => setNorthingInput(e.target.value)}
                  placeholder="e.g. 439269.51"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Project & Add Point</span>
                </button>
              </div>
            </form>
          </div>

          {/* Points Table & Real-Time Area Calculation */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  2. Boundary Control Points ({previewPoints.length})
                </h3>
              </div>
              {previewPoints.length > 0 && (
                <button
                  onClick={clearPreviewPoints}
                  className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Points
                </button>
              )}
            </div>

            {previewPoints.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  No boundary points projected yet.
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Enter Ghana Grid coordinates above or click "Load Sample Site Plan" to populate.
                </p>
              </div>
            ) : (
              <>
                {/* Live Area Meter */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Acres</span>
                    <p className="text-base font-extrabold text-amber-600 dark:text-amber-400">{areaCalc.areaAcres}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Hectares</span>
                    <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{areaCalc.areaHectares}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Sq Feet</span>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{areaCalc.areaSqFt.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Sq Meters</span>
                    <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{areaCalc.areaSqMeters.toLocaleString()}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Point ID</th>
                        <th className="p-2.5">Easting (ft)</th>
                        <th className="p-2.5">Northing (ft)</th>
                        <th className="p-2.5">Lat / Lng (WGS84)</th>
                        <th className="p-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {previewPoints.map((pt, idx) => (
                        <tr key={pt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">{pt.pointId}</td>
                          <td className="p-2.5 text-amber-600 dark:text-amber-400 font-bold">{pt.easting.toLocaleString()}</td>
                          <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{pt.northing.toLocaleString()}</td>
                          <td className="p-2.5 text-slate-500 dark:text-slate-400 text-[11px]">
                            {pt.lat}, {pt.lng}
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleRemovePoint(pt.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Plot Metadata & Save Button (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>3. Title & Owner Administration</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Plot Number *
                  </label>
                  <input
                    type="text"
                    value={plotNumber}
                    onChange={(e) => setPlotNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Title Certificate #
                  </label>
                  <input
                    type="text"
                    value={titleNumber}
                    onChange={(e) => setTitleNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Current Owner Full Name *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ghana Card / ID #
                  </label>
                  <input
                    type="text"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Contact
                  </label>
                  <input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Land Use
                  </label>
                  <select
                    value={landUse}
                    onChange={(e) => setLandUse(e.target.value as LandUse)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                    <option value="Civic">Civic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tenure Type
                  </label>
                  <select
                    value={tenureType}
                    onChange={(e) => setTenureType(e.target.value as TenureType)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                    <option value="Customary">Customary</option>
                    <option value="Sublease">Sublease</option>
                    <option value="Conveyance">Conveyance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Town
                  </label>
                  <input
                    type="text"
                    value={nearestTown}
                    onChange={(e) => setNearestTown(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Region
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Survey Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSavePlot}
                  disabled={previewPoints.length < 3}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md ${
                    previewPoints.length >= 3
                      ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white hover:opacity-95'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>Register Parcel in Ghana Registry Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
