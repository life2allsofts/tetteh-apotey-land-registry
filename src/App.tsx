import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LeftMenu } from './components/LeftMenu';
import { RightMenu } from './components/RightMenu';
import { MapView } from './components/MapView';
import { CoordinateEntry } from './components/CoordinateEntry';
import { CsvKmlImport } from './components/CsvKmlImport';
import { PlotRegistry } from './components/PlotRegistry';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ResearchPaperView } from './components/ResearchPaperView';
import { UserGuideModal } from './components/UserGuideModal';
import { SupportModal } from './components/SupportModal';

const AppContent: React.FC = () => {
  const { activeTab, theme } = useApp();

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors theme-${theme}`}>
      {/* Header bar with dual hamburger menu triggers */}
      <Header />

      {/* Left Hamburger Drawer (Workspace Tools & Navigation) */}
      <LeftMenu />

      {/* Right Hamburger Drawer (Version, Developer Profile, Settings, Support) */}
      <RightMenu />

      {/* Main Active Tab Body */}
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'manual-entry' && <CoordinateEntry />}
        {activeTab === 'csv-kml' && <CsvKmlImport />}
        {activeTab === 'registry' && <PlotRegistry />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'research' && <ResearchPaperView />}
      </main>

      {/* Interactive User Guide Modal */}
      <UserGuideModal />

      {/* Ghana Surveying Standards Support Modal */}
      <SupportModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
