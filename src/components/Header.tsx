import React from 'react';
import {
  Menu,
  SlidersHorizontal,
  Sun,
  Moon,
  Search,
  Map,
  PlusCircle,
  Upload,
  Table,
  BarChart3,
  BookOpen,
  Compass,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleDarkMode,
    isLeftMenuOpen,
    setIsLeftMenuOpen,
    isRightMenuOpen,
    setIsRightMenuOpen,
    searchTerm,
    setSearchTerm,
    startUserGuide
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'map', label: 'GIS Map', icon: <Map className="w-4 h-4" /> },
    { id: 'manual-entry', label: 'Manual Entry', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'csv-kml', label: 'Import/Export', icon: <Upload className="w-4 h-4" /> },
    { id: 'registry', label: 'Registry Table', icon: <Table className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left Side: Hamburger 1 (Workspace Navigation) + Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLeftMenuOpen(!isLeftMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden transition-colors border border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 shadow-2xs"
            title="Open Workspace & Tools Menu (Left)"
            aria-label="Open Workspace Menu"
            id="left-hamburger-btn"
          >
            <Menu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Workspace
            </span>
          </button>

          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('map')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 via-emerald-600 to-amber-700 flex items-center justify-center text-white font-bold shadow-sm">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  GHANA LAND REGISTRY
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-300/50 dark:border-emerald-700/50">
                  GH-GRID
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Professional Land Administration Platform
              </p>
            </div>
          </div>
        </div>

        {/* Middle Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side: Quick Search, Dark Mode, Guide, Hamburger 2 (System & Profile) */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Plot # / Owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Interactive User Guide Button */}
          <button
            onClick={startUserGuide}
            className="p-2 rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80 transition-colors flex items-center gap-1 shadow-2xs"
            title="Start Interactive User Guide Tour"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="hidden sm:inline text-xs font-semibold">Guide</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Right Hamburger Menu Button (System, Developed By, Settings, Support) */}
          <button
            onClick={() => setIsRightMenuOpen(!isRightMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden transition-colors border border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5 shadow-2xs"
            title="Open System, Settings & Developer Profile Menu (Right)"
            aria-label="Open System Menu"
            id="right-hamburger-btn"
          >
            <span className="hidden md:inline text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              System
            </span>
            <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
