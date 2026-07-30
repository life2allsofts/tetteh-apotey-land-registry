import React from 'react';
import {
  X,
  Code2,
  Sliders,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Award,
  Globe,
  Mail,
  Linkedin,
  Github,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';

export const RightMenu: React.FC = () => {
  const {
    isRightMenuOpen,
    setIsRightMenuOpen,
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    settings,
    updateSettings,
    startUserGuide,
    setIsDevModalOpen,
    setIsSettingsModalOpen,
    setIsSupportModalOpen
  } = useApp();

  if (!isRightMenuOpen) return null;

  const themes: { id: ThemeMode; label: string; bg: string }[] = [
    { id: 'light', label: 'Office Light', bg: 'bg-slate-100 border-slate-300' },
    { id: 'dark', label: 'OLED Dark', bg: 'bg-slate-900 border-slate-700 text-white' },
    { id: 'satellite', label: 'Cadastral Satellite', bg: 'bg-slate-800 border-amber-500 text-amber-300' },
    { id: 'emerald', label: 'Ghana Earth', bg: 'bg-emerald-900 border-emerald-600 text-emerald-200' },
    { id: 'high-contrast', label: 'High Contrast', bg: 'bg-black border-yellow-400 text-yellow-300 font-bold' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsRightMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div className="relative w-80 sm:w-96 max-w-full bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto z-10 transition-transform">
        
        <div>
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    System & Profile
                  </h2>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-md border border-amber-300 dark:border-amber-700">
                    v1.0.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Settings, Developer & Support
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRightMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Developer Profile */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-amber-50/50 to-transparent dark:from-slate-800/40 dark:to-transparent">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Developed By
              </span>
              <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold px-2 py-0.5 rounded-full">
                GhIS Member
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-emerald-600 to-amber-700 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                ITA
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Isaac Tetteh-Apotey
                </h3>
                <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 leading-tight">
                  Geomatics Engineer → Software Engineer | AI & Flutter Developer
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1 leading-snug">
                  "From surveyor to software engineer — building tools for the industry I know best."
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <a
                href="https://tetteh-apotey.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1 shadow-2xs"
              >
                <Globe className="w-3 h-3 text-amber-500" /> Portfolio
              </a>
              <a
                href="https://github.com/life2allsofts"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1 shadow-2xs"
              >
                <Github className="w-3 h-3 text-slate-700 dark:text-slate-300" /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/isaac-tetteh-apotey-67408b89"
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1 shadow-2xs"
              >
                <Linkedin className="w-3 h-3 text-blue-500" /> LinkedIn
              </a>
              <a
                href="mailto:life2allsofts@gmail.com"
                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 flex items-center gap-1 shadow-2xs"
              >
                <Mail className="w-3 h-3 text-rose-500" /> Email
              </a>
            </div>
          </div>

          {/* Section 2: Themes & Accessibility */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> Themes & Accessibility
              </span>
              <button
                onClick={toggleDarkMode}
                className="p-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDarkMode ? 'Dark' : 'Light'} Toggle</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    if (t.id === 'dark') {
                      if (!isDarkMode) toggleDarkMode();
                    } else if (t.id === 'light') {
                      if (isDarkMode) toggleDarkMode();
                    }
                  }}
                  className={`p-2 rounded-xl text-left border text-xs font-semibold transition-all flex items-center justify-between ${t.bg} ${
                    theme === t.id ? 'ring-2 ring-amber-500 shadow-sm' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{t.label}</span>
                  {theme === t.id && <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: System Settings */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" /> Projection Settings
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Coordinate Unit:</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => updateSettings({ coordinateUnit: 'feet' })}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      settings.coordinateUnit === 'feet'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Feet (ft)
                  </button>
                  <button
                    onClick={() => updateSettings({ coordinateUnit: 'meters' })}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      settings.coordinateUnit === 'meters'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Meters (m)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Regional Optimization:</span>
                <select
                  value={settings.regionalOptimization}
                  onChange={(e) =>
                    updateSettings({
                      regionalOptimization: e.target.value as 'auto' | 'coastal' | 'inland'
                    })
                  }
                  className="px-2 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="auto">Auto-Detect Region</option>
                  <option value="coastal">Coastal (Accra/Western)</option>
                  <option value="inland">Inland (Northern/Upper)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Default Basemap:</span>
                <select
                  value={settings.basemap}
                  onChange={(e) =>
                    updateSettings({
                      basemap: e.target.value as 'streets' | 'satellite' | 'dark' | 'terrain' | 'high-contrast'
                    })
                  }
                  className="px-2 py-1 text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="streets">OpenStreetMap</option>
                  <option value="satellite">Satellite Cadastral</option>
                  <option value="dark">CartoDB Dark</option>
                  <option value="terrain">Topographic Terrain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Support & Research Links */}
          <div className="p-4 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Support & Standards
            </span>

            <div className="space-y-1.5">
              <button
                onClick={startUserGuide}
                className="w-full p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Interactive User Guide</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </button>

              <a
                href="https://zenodo.org/doi/10.5281/zenodo.18133088"
                target="_blank"
                rel="noreferrer"
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Research Paper (Zenodo DOI)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>

              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Ghana Surveying Standards Guide</span>
                </div>
                <Info className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        </div>

        {/* System Version Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>System Active</span>
          </div>
          <span className="font-mono font-medium">Build v1.0.0</span>
        </div>

      </div>
    </div>
  );
};
