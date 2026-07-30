import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../context/AppContext';
import { BarChart3, PieChart as PieIcon, TrendingUp, Layers, MapPin } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#F43F5E', '#06B6D4', '#64748B'];

export const AnalyticsDashboard: React.FC = () => {
  const { plots } = useApp();

  // Aggregate Land Use
  const landUseCounts: Record<string, number> = {};
  plots.forEach((p) => {
    landUseCounts[p.landUse] = (landUseCounts[p.landUse] || 0) + 1;
  });
  const landUseData = Object.entries(landUseCounts).map(([name, value]) => ({ name, value }));

  // Aggregate Tenure Type
  const tenureCounts: Record<string, number> = {};
  plots.forEach((p) => {
    tenureCounts[p.tenureType] = (tenureCounts[p.tenureType] || 0) + 1;
  });
  const tenureData = Object.entries(tenureCounts).map(([name, value]) => ({ name, value }));

  // Aggregate Region
  const regionCounts: Record<string, number> = {};
  plots.forEach((p) => {
    regionCounts[p.region] = (regionCounts[p.region] || 0) + 1;
  });
  const regionData = Object.entries(regionCounts).map(([name, value]) => ({ name, value }));

  // Totals
  const totalAcres = plots.reduce((sum, p) => sum + p.areaAcres, 0);
  const avgAcres = plots.length > 0 ? (totalAcres / plots.length).toFixed(2) : '0';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 rounded-md uppercase">
            GIS Intelligence
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Land Administration Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            High-level distribution metrics across tenure types, zoning categories, and administrative regions in Ghana.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Registered Parcels</span>
            <Layers className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{plots.length}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">100% Ghana Grid Validated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Total Acreage</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalAcres.toFixed(2)} ac</p>
          <span className="text-[11px] text-slate-400 font-medium font-mono">{(totalAcres * 0.404686).toFixed(2)} Hectares</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Avg Parcel Size</span>
            <PieIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{avgAcres} ac</p>
          <span className="text-[11px] text-slate-400 font-medium font-mono">~{(parseFloat(avgAcres) * 43560).toLocaleString()} sq ft</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Active Regions</span>
            <MapPin className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{Object.keys(regionCounts).length}</p>
          <span className="text-[11px] text-slate-400 font-medium">Coastal & Inland Coverage</span>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Land Use Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-500" />
            <span>Land Use Category Distribution</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={landUseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tenure Type Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            <span>Land Tenure Type Breakdown</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenureData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis allowDecimals={false} stroke="#888888" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
