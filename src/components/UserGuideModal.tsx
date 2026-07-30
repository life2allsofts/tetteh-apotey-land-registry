import React from 'react';
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
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

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

  if (!isUserGuideOpen) return null;

  const activeStepObj = userGuideSteps.find((s) => s.step === currentGuideStep) || userGuideSteps[0];

  const handleStepJump = (targetTab?: string) => {
    if (targetTab === 'tab-manual-entry') setActiveTab('manual-entry');
    if (targetTab === 'tab-map') setActiveTab('map');
    if (targetTab === 'tab-csv-kml') setActiveTab('csv-kml');
    if (targetTab === 'tab-registry') setActiveTab('registry');
    if (targetTab === 'research-info') setActiveTab('research');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Step {currentGuideStep} of {userGuideSteps.length} • {activeStepObj.badgeText}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Interactive User Walkthrough
              </h3>
            </div>
          </div>

          <button
            onClick={closeUserGuide}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          
          {/* Visual Illustration Banner per Step */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-amber-950 text-white border border-amber-500/20 text-center space-y-2">
            {currentGuideStep === 1 && (
              <div className="space-y-1">
                <span className="text-3xl">🇬🇭</span>
                <h4 className="text-sm font-bold text-amber-300">Ghana Grid Native Support</h4>
                <p className="text-xs text-slate-300">War Office Transverse Mercator Projection Engine</p>
              </div>
            )}
            {currentGuideStep === 2 && (
              <div className="flex justify-center items-center gap-6">
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5">
                  <Menu className="w-4 h-4" /> Left Menu (Workspace)
                </div>
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> Right Menu (System)
                </div>
              </div>
            )}
            {currentGuideStep === 3 && (
              <div className="space-y-1">
                <MapPin className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-amber-300">Real-Time Live Map Preview</h4>
                <p className="text-xs text-slate-300">Watch coordinates project on the map as you type!</p>
              </div>
            )}
            {currentGuideStep === 4 && (
              <div className="space-y-1">
                <span className="text-3xl">🗺️</span>
                <h4 className="text-sm font-bold text-amber-300">Multiple GIS Basemap Layers</h4>
                <p className="text-xs text-slate-300">Streets, Satellite Cadastral, Dark Mode, Topo Terrain</p>
              </div>
            )}
            {currentGuideStep === 5 && (
              <div className="space-y-1">
                <Upload className="w-8 h-8 text-blue-400 mx-auto" />
                <h4 className="text-sm font-bold text-amber-300">CSV & KML Google Earth Loader</h4>
                <p className="text-xs text-slate-300">Import site plan coordinates or export KML</p>
              </div>
            )}
            {currentGuideStep === 6 && (
              <div className="space-y-1">
                <Search className="w-8 h-8 text-purple-400 mx-auto" />
                <h4 className="text-sm font-bold text-amber-300">Title & Tenure Search Engine</h4>
                <p className="text-xs text-slate-300">Click "View on Map" to highlight and zoom</p>
              </div>
            )}
            {currentGuideStep === 7 && (
              <div className="space-y-1">
                <BookOpen className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="text-sm font-bold text-amber-300">Isaac Tetteh-Apotey Research</h4>
                <p className="text-xs text-slate-300">Zenodo DOI: 10.5281/zenodo.18133088</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeStepObj.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
              {activeStepObj.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {userGuideSteps.map((s) => (
              <span
                key={s.step}
                className={`h-2 rounded-full transition-all ${
                  s.step === currentGuideStep
                    ? 'w-6 bg-amber-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={prevUserGuideStep}
            disabled={currentGuideStep === 1}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 ${
              currentGuideStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              handleStepJump(activeStepObj.targetKey);
              nextUserGuideStep();
            }}
            className="px-4 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>{currentGuideStep === userGuideSteps.length ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
