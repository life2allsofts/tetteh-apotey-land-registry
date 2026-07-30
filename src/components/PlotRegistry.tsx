import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Eye,
  History,
  Download,
  Trash2,
  X,
  FileText,
  User,
  Calendar,
  Building,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Plot, OwnerHistoryItem } from '../types';
import { exportPlotToKML } from '../lib/ghanaGrid';

export const PlotRegistry: React.FC = () => {
  const {
    plots,
    deletePlot,
    setSelectedPlotId,
    setHighlightedPlotId,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    selectedLandUse,
    setSelectedLandUse,
    selectedTenure,
    setSelectedTenure,
    selectedRegion,
    setSelectedRegion
  } = useApp();

  const [selectedPlotForModal, setSelectedPlotForModal] = useState<Plot | null>(null);

  const filteredPlots = plots.filter((plot) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchPlot = plot.plotNumber.toLowerCase().includes(q);
      const matchTitle = plot.titleNumber.toLowerCase().includes(q);
      const matchOwner = plot.currentOwner.name.toLowerCase().includes(q);
      const matchTown = plot.nearestTown.toLowerCase().includes(q);
      if (!matchPlot && !matchTitle && !matchOwner && !matchTown) return false;
    }

    if (selectedLandUse !== 'All' && plot.landUse !== selectedLandUse) return false;
    if (selectedTenure !== 'All' && plot.tenureType !== selectedTenure) return false;
    if (selectedRegion !== 'All' && plot.region !== selectedRegion) return false;

    return true;
  });

  const handleViewOnMap = (plot: Plot) => {
    setSelectedPlotId(plot.id);
    setHighlightedPlotId(plot.id);
    setActiveTab('map');
  };

  const handleExportIndividualKML = (plot: Plot) => {
    const kml = exportPlotToKML(plot.plotNumber, plot.boundaryPoints, {
      titleNumber: plot.titleNumber,
      owner: plot.currentOwner.name,
      landUse: plot.landUse,
      tenureType: plot.tenureType,
      areaAcres: plot.areaAcres.toString()
    });

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SitePlan_${plot.plotNumber}.kml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 rounded-md uppercase">
            Cadastral Archive
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Land Parcel Registry Database
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, and audit title deeds, Ghana Grid boundary points, and tenure history across Ghana.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Total Parcels: <strong>{plots.length}</strong>
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Plot #, Title #, Owner Name, Town..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-medium"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedLandUse}
            onChange={(e) => setSelectedLandUse(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Land Uses</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Industrial">Industrial</option>
            <option value="Mixed-Use">Mixed-Use</option>
          </select>

          <select
            value={selectedTenure}
            onChange={(e) => setSelectedTenure(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Tenure Types</option>
            <option value="Freehold">Freehold</option>
            <option value="Leasehold">Leasehold</option>
            <option value="Customary">Customary</option>
            <option value="Sublease">Sublease</option>
            <option value="Conveyance">Conveyance</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
          >
            <option value="All">All Regions</option>
            <option value="Greater Accra">Greater Accra</option>
            <option value="Ashanti">Ashanti</option>
            <option value="Northern">Northern</option>
            <option value="Western">Western</option>
          </select>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Plot & Title #</th>
                <th className="p-3.5">Current Owner</th>
                <th className="p-3.5">Town & Region</th>
                <th className="p-3.5">Land Use</th>
                <th className="p-3.5">Tenure</th>
                <th className="p-3.5">Area (Acres)</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPlots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    No land parcel records found matching search filters.
                  </td>
                </tr>
              ) : (
                filteredPlots.map((plot) => (
                  <tr
                    key={plot.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{plot.plotNumber}</div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium font-mono">
                        {plot.titleNumber}
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                      <div>{plot.currentOwner.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{plot.currentOwner.phone}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{plot.nearestTown}</div>
                      <div className="text-[10px] text-slate-400">{plot.region}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {plot.landUse}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                        {plot.tenureType}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {plot.areaAcres} ac
                    </td>

                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleViewOnMap(plot)}
                        className="px-2.5 py-1 bg-amber-500 text-white font-bold text-[11px] rounded-lg hover:bg-amber-600 transition-colors inline-flex items-center gap-1 shadow-2xs"
                        title="Highlight & Zoom on Map"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View on Map</span>
                      </button>

                      <button
                        onClick={() => setSelectedPlotForModal(plot)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                        title="View Ownership History & Attachments"
                      >
                        <History className="w-3.5 h-3.5 text-purple-500" />
                        <span>History</span>
                      </button>

                      <button
                        onClick={() => handleExportIndividualKML(plot)}
                        className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
                        title="Export KML File"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete parcel ${plot.plotNumber}?`)) {
                            deletePlot(plot.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete Parcel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Owner History & Documents Modal */}
      {selectedPlotForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
                  {selectedPlotForModal.tenureType} Tenure Audit
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedPlotForModal.plotNumber} — {selectedPlotForModal.currentOwner.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlotForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              
              {/* Parcel Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Title #</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{selectedPlotForModal.titleNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Area</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedPlotForModal.areaAcres} Acres</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Town / District</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedPlotForModal.nearestTown}</p>
                </div>
              </div>

              {/* Ownership Chain Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-purple-500" />
                  <span>Ownership History Chain</span>
                </h4>

                <div className="space-y-2 border-l-2 border-purple-200 dark:border-purple-900 pl-4 ml-2">
                  <div className="relative">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[21px] top-1 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      <div className="flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                        <span>Current Owner: {selectedPlotForModal.currentOwner.name}</span>
                        <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-md font-mono">
                          Acquired {selectedPlotForModal.currentOwner.dateAcquired}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        ID: {selectedPlotForModal.currentOwner.idNumber} | Phone: {selectedPlotForModal.currentOwner.phone}
                      </p>
                    </div>
                  </div>

                  {selectedPlotForModal.ownershipHistory.map((item) => (
                    <div key={item.id} className="relative">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 absolute -left-[21px] top-1" />
                      <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
                          <span>Previous: {item.ownerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.dateAcquired} - {item.dateSold || 'Transfer'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                          Deed Ref: {item.documentReference}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boundary Control Points */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>Ghana Grid Boundary Control Points ({selectedPlotForModal.boundaryPoints.length})</span>
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500">
                      <tr>
                        <th className="p-2">Point ID</th>
                        <th className="p-2">Easting (ft)</th>
                        <th className="p-2">Northing (ft)</th>
                        <th className="p-2">WGS84 Lat/Lng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedPlotForModal.boundaryPoints.map((pt) => (
                        <tr key={pt.id}>
                          <td className="p-2 font-bold text-amber-600">{pt.pointId}</td>
                          <td className="p-2">{pt.easting.toLocaleString()}</td>
                          <td className="p-2">{pt.northing.toLocaleString()}</td>
                          <td className="p-2 text-slate-500">{pt.lat}, {pt.lng}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => handleViewOnMap(selectedPlotForModal)}
                className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Focus on Map</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
