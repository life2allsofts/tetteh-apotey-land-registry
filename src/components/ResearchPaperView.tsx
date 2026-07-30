import React from 'react';
import { BookOpen, ExternalLink, Award, CheckCircle2, Globe, Shield, ArrowRight } from 'lucide-react';

export const ResearchPaperView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="bg-gradient-to-br from-amber-900 via-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl space-y-4 border border-amber-500/30">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-amber-500 text-slate-900 text-xs font-black rounded-full uppercase tracking-wider">
            Peer-Reviewed Research
          </span>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/40">
            Zenodo DOI: 10.5281/zenodo.18133088
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-display leading-tight text-amber-100">
          Bridging the Desktop-Mobile Divide: Regional Optimization of Ghana's National Grid for Mobile and Web Applications
        </h1>

        <div className="flex items-center gap-3 pt-2 text-xs text-amber-200/80">
          <span>Author: <strong>Isaac Tetteh-Apotey</strong></span>
          <span>•</span>
          <span>Geomatics Engineer & Software Engineer</span>
          <span>•</span>
          <span>GhIS Member</span>
        </div>

        <div className="pt-2">
          <a
            href="https://zenodo.org/doi/10.5281/zenodo.18133088"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-slate-900 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
          >
            <span>Read Full Research Paper on Zenodo</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Key Research Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            False Easting Discrepancy Discovery
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Identified critical transformation mismatch between legacy desktop GIS software using 900,000m false easting vs modern mobile/web spatial engines using 274,291.3m (or 274,286.8m) War Office projection origin parameters.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Coastal-Inland Accuracy Divide
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Uncovered significant accuracy variations across Ghana: 1.3m RMS accuracy in Western & Greater Accra coastal regions vs 61.7m RMS degradation in Upper East & Northern inland zones if uncalibrated.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            70% Accuracy Improvement
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Engineered regional empirical transformation parameters, achieving a 70% RMS accuracy improvement in Greater Accra (reducing error from 6.9m down to 2.1m RMS).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            04
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Validation with 490 Control Points
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Empirically validated across 490 official Ghana Lands Commission survey control pillars, cutting site plan verification times from 2-3 hours down to 30 seconds!
          </p>
        </div>

      </div>

    </div>
  );
};
