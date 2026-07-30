import React from 'react';
import { X, ShieldCheck, FileText, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportModal: React.FC = () => {
  const { isSupportModalOpen, setIsSupportModalOpen } = useApp();

  if (!isSupportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ghana Surveying & Land Standards
            </h3>
          </div>
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              Ghana Lands Commission & GhIS Compliance
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              This system strictly adheres to the Surveying Instructions Manual of Ghana and Ghana Institution of Surveyors (GhIS) cadastral mapping guidelines.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] text-slate-400 tracking-wider">
              Technical Guidelines Summary
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
              <li><strong>Datum:</strong> Gold Coast / Leigon (Clarke 1880 Ellipsoid).</li>
              <li><strong>Projection:</strong> War Office Transverse Mercator (Central Meridian: 1° W, Origin Lat: 4.669382° N).</li>
              <li><strong>Units:</strong> Ghana Survey Feet (1 ft = 0.30480061 m) or standard feet.</li>
              <li><strong>Site Plan Bounds:</strong> Eastings 100,000 ft to 1,600,000 ft, Northings 50,000 ft to 1,200,000 ft.</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-rose-500" />
              <span>Contact Technical Support</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              For support with site plan conversions or custom GIS deployment in Ghana:
            </p>
            <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              life2allsofts@gmail.com
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={() => setIsSupportModalOpen(false)}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
          >
            Close Standards Guide
          </button>
        </div>

      </div>
    </div>
  );
};
