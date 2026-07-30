import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Menu,
  Sliders,
  Upload,
  Search,
  BookOpen,
  Minimize2,
  Maximize2,
  Globe,
  Map
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const UserGuideModal: React.FC = () => {
  const {
    isUserGuideOpen,
    closeUserGuide,
    currentGuideStep,
    nextUserGuideStep,
    prevUserGuideStep,
    userGuideSteps,
    setActiveTab
  } = useApp();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const activeStepObj = userGuideSteps.find((s) => s.step === currentGuideStep) || userGuideSteps[0];

  // Auto-switch active tab when step changes so user can see relevant UI
  useEffect(() => {
    if (isUserGuideOpen && activeStepObj?.targetKey) {
      const tabMap: Record<string, ActiveTab> = {
        'tab-manual-entry': 'manual-entry',
        'tab-map': 'map',
        'tab-csv-kml': 'csv-kml',
        'tab-registry': 'registry',
        'research-info': 'research',
        'header': 'map',
        'hamburger-menus': 'map'
      };
      const targetTab = tabMap[activeStepObj.targetKey];
      if (targetTab) {
        setActiveTab(targetTab);
      }
    }
  }, [isUserGuideOpen, currentGuideStep, activeStepObj]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isUserGuideOpen) {
        closeUserGuide();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isUserGuideOpen]);

  if (!isUserGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-end justify-end p-3 sm:p-5">
      
      {/* Minimized Floating Bubble */}
      {isMinimized ? (
        <div className="pointer-events-auto bg-slate-900/95 text-white dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsMinimized(false)}>
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-300">
              Guide (Step {currentGuideStep}/{userGuideSteps.length})
            </span>
          </div>
          <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
              title="Expand Guide Window"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={closeUserGuide}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
              title="Close Guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Compact Floating Window */
        <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md w-full max-w-sm sm:max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Step {currentGuideStep} of {userGuideSteps.length}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300/40">
                    {activeStepObj.badgeText}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Interactive User Guide
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Minimize window"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeUserGuide}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 text-xs">
            
            {/* Step Illustration Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-amber-950/90 to-slate-900 text-white border border-amber-500/20 text-center space-y-1 relative overflow-hidden">
              {currentGuideStep === 1 && (
                <div>
                  <span className="text-2xl block">🇬🇭</span>
                  <h4 className="text-xs font-bold text-amber-300">Ghana Grid Native Support</h4>
                  <p className="text-[11px] text-slate-300">War Office Transverse Mercator Engine</p>
                </div>
              )}
              {currentGuideStep === 2 && (
                <div className="flex justify-center items-center gap-2">
                  <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <Menu className="w-3 h-3" /> Left Workspace
                  </div>
                  <div className="p-1.5 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> Right System
                  </div>
                </div>
              )}
              {currentGuideStep === 3 && (
                <div>
                  <MapPin className="w-6 h-6 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="text-xs font-bold text-amber-300">Live Coordinate Preview</h4>
                  <p className="text-[11px] text-slate-300">Watch points project in real time!</p>
                </div>
              )}
              {currentGuideStep === 4 && (
                <div>
                  <Map className="w-6 h-6 text-emerald-400 mx-auto" />
                  <h4 className="text-xs font-bold text-amber-300">Interactive GIS Basemaps</h4>
                  <p className="text-[11px] text-slate-300">Streets, Satellite, Dark Canvas, Terrain</p>
                </div>
              )}
              {currentGuideStep === 5 && (
                <div>
                  <Upload className="w-6 h-6 text-blue-400 mx-auto" />
                  <h4 className="text-xs font-bold text-amber-300">CSV & KML Batch Engine</h4>
                  <p className="text-[11px] text-slate-300">Import bulk surveys & export KML</p>
                </div>
              )}
              {currentGuideStep === 6 && (
                <div>
                  <Search className="w-6 h-6 text-purple-400 mx-auto" />
                  <h4 className="text-xs font-bold text-amber-300">Registry Title Deed Audit</h4>
                  <p className="text-[11px] text-slate-300">Search owners, deed refs & zoom on map</p>
                </div>
              )}
              {currentGuideStep === 7 && (
                <div>
                  <BookOpen className="w-6 h-6 text-rose-400 mx-auto" />
                  <h4 className="text-xs font-bold text-amber-300">Geomatics Research Paper</h4>
                  <p className="text-[11px] text-slate-300">Zenodo DOI: 10.5281/zenodo.18133088</p>
                </div>
              )}
            </div>

            {/* Title & Description */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {activeStepObj.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {activeStepObj.description}
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {userGuideSteps.map((s) => (
                <span
                  key={s.step}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s.step === currentGuideStep
                      ? 'w-5 bg-amber-500 shadow-xs'
                      : s.step < currentGuideStep
                      ? 'w-1.5 bg-emerald-500'
                      : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 italic">
              ✨ You can interact with the live map or form behind this window anytime!
            </p>

          </div>

          {/* Footer Controls */}
          <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <button
              onClick={prevUserGuideStep}
              disabled={currentGuideStep === 1}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                currentGuideStep === 1
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={closeUserGuide}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 px-2 py-1 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={nextUserGuideStep}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm"
              >
                <span>{currentGuideStep === userGuideSteps.length ? 'Finish' : 'Next'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

