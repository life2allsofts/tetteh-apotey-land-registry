import React from 'react';
import {
  X,
  Map,
  PlusCircle,
  Upload,
  Table,
  BarChart3,
  BookOpen,
  Filter,
  Download,
  RotateCcw,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import { initialPlots } from '../lib/sampleData';

export const LeftMenu: React.FC = () => {
  const {
    isLeftMenuOpen,
    setIsLeftMenuOpen,
    activeTab,
    setActiveTab,
    selectedLandUse,
    setSelectedLandUse,
    selectedTenure,
    setSelectedTenure,
    selectedRegion,
    setSelectedRegion,
    plots,
    importPlots,
    startUserGuide
  } = useApp();

  if (!isLeftMenuOpen) return null;

  const navItems: { id: ActiveTab; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'map',
      label: 'GIS Map Canvas',
      desc: 'Interactive map visualization with Ghana Grid support',
      icon: <Map className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'manual-entry',
      label: 'Ghana Grid Manual Entry',
      desc: 'Direct Easting/Northing input with real-time live preview',
      icon: <PlusCircle className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'csv-kml',
      label: 'CSV & KML Import/Export',
      desc: 'Bulk dataset loader & Google Earth exporter',
      icon: <Upload className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'registry',
      label: 'Land Parcel Registry',
      desc: 'Searchable database table of titles & ownership',
      icon: <Table className="w-5 h-5 text-purple-500" />
    },
    {
      id: 'analytics',
      label: 'Land Administration Analytics',
      desc: 'Visual distribution breakdown charts',
      icon: <BarChart3 className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'research',
      label: 'Ghana Grid Research Paper',
      desc: 'Regional optimization methodology & findings',
      icon: <BookOpen className="w-5 h-5 text-rose-500" />
    }
  ];

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      features: plots.map((plot) => ({
        type: 'Feature',
        properties: {
          plotNumber: plot.plotNumber,
          titleNumber: plot.titleNumber,
          owner: plot.currentOwner.name,
          landUse: plot.landUse,
          tenureType: plot.tenureType,
          nearestTown: plot.nearestTown,
          areaAcres: plot.areaAcres
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            plot.boundaryPoints
              .map((p) => [p.lng, p.lat])
              .concat([[plot.boundaryPoints[0].lng, plot.boundaryPoints[0].lat]])
          ]
        }
      }))
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ghana_Land_Registry_Export_${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset the database to sample Ghana plots?')) {
      importPlots(initialPlots);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLeftMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div className="relative w-80 sm:w-96 max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto z-10 transition-transform">
        
        {/* Header */}
        <div>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Workspace Navigation
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  GIS Tools & Features
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsLeftMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Main Modules
            </p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsLeftMenuOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 border ${
                  activeTab === item.id
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 shadow-xs'
                    : 'bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                  {item.icon}
                </div>
                <div>
                  <h3 className={`text-xs font-bold ${activeTab === item.id ? 'text-amber-800 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Workspace Filters</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Land Use Category
                </label>
                <select
                  value={selectedLandUse}
                  onChange={(e) => setSelectedLandUse(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="All">All Land Uses</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Agricultural">Agricultural</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Tenure Type
                </label>
                <select
                  value={selectedTenure}
                  onChange={(e) => setSelectedTenure(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="All">All Tenure Types</option>
                  <option value="Freehold">Freehold</option>
                  <option value="Leasehold">Leasehold</option>
                  <option value="Customary">Customary</option>
                  <option value="Sublease">Sublease</option>
                  <option value="Conveyance">Conveyance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="All">All Ghana Regions</option>
                  <option value="Greater Accra">Greater Accra</option>
                  <option value="Ashanti">Ashanti</option>
                  <option value="Northern">Northern</option>
                  <option value="Western">Western</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Data Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 space-y-2">
          <button
            onClick={startUserGuide}
            className="w-full py-2 px-3 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Interactive User Guide</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleExportGeoJSON}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-blue-500" />
              <span>Export GeoJSON</span>
            </button>
            <button
              onClick={handleResetData}
              className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span>Reset Samples</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
