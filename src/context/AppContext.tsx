import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Plot,
  BoundaryPoint,
  ThemeMode,
  AppSettings,
  ActiveTab,
  UserGuideStep
} from '../types';
import { initialPlots } from '../lib/sampleData';

const USER_GUIDE_STEPS: UserGuideStep[] = [
  {
    step: 1,
    title: '🇬🇭 Welcome to Ghana Land Registry',
    description: 'A professional land administration platform natively supporting Ghana Grid coordinates (War Office Transverse Mercator) and regional optimization.',
    targetKey: 'header',
    badgeText: 'Overview'
  },
  {
    step: 2,
    title: '🍔 Dual Hamburger Menus',
    description: 'We keep the main workspace clean! The Left Menu contains GIS tools and navigation tabs. The Right Menu holds Version details, Developer profile, System Settings, and Support.',
    targetKey: 'hamburger-menus',
    badgeText: 'Navigation'
  },
  {
    step: 3,
    title: '📍 Manual Entry & Live Preview',
    description: 'Enter site plan coordinates in feet (Easting/Northing) and watch points project onto the map in real time as you type before saving!',
    targetKey: 'tab-manual-entry',
    badgeText: 'Coordinate Engine'
  },
  {
    step: 4,
    title: '🗺️ Interactive GIS Map & Basemaps',
    description: 'Switch between Street, Satellite Cadastral, Dark Mode, Terrain, and High Contrast basemaps. Click any polygon to view title details and tenure history.',
    targetKey: 'tab-map',
    badgeText: 'GIS Mapping'
  },
  {
    step: 5,
    title: '📁 CSV & KML Batch Import/Export',
    description: 'Import site plan coordinates via bulk CSV upload or Google Earth KML files. Export any plot to standard KML instantly.',
    targetKey: 'tab-csv-kml',
    badgeText: 'Import & Export'
  },
  {
    step: 6,
    title: '🔍 Registry Search & Map Highlight',
    description: 'Filter land parcels by owner name, plot number, or region. Click "View on Map" to highlight and zoom smoothly to the exact plot.',
    targetKey: 'tab-registry',
    badgeText: 'Search Engine'
  },
  {
    step: 7,
    title: '🔬 Research & Regional Optimization',
    description: 'Powered by Isaac Tetteh-Apotey\'s published research paper "Bridging the Desktop-Mobile Divide", optimizing accuracy across Coastal and Inland Ghana.',
    targetKey: 'research-info',
    badgeText: 'Research'
  }
];

interface AppContextType {
  // Theme & Settings
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Drawers / Menus
  isLeftMenuOpen: boolean;
  setIsLeftMenuOpen: (open: boolean) => void;
  isRightMenuOpen: boolean;
  setIsRightMenuOpen: (open: boolean) => void;

  // Plots Data
  plots: Plot[];
  addPlot: (plot: Plot) => void;
  updatePlot: (plot: Plot) => void;
  deletePlot: (id: string) => void;
  importPlots: (newPlots: Plot[]) => void;

  // Map State & Selection
  selectedPlotId: string | null;
  setSelectedPlotId: (id: string | null) => void;
  highlightedPlotId: string | null;
  setHighlightedPlotId: (id: string | null) => void;
  previewPoints: BoundaryPoint[];
  setPreviewPoints: React.Dispatch<React.SetStateAction<BoundaryPoint[]>>;
  clearPreviewPoints: () => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  mapZoom: number;
  setMapZoom: (zoom: number) => void;

  // Search & Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedLandUse: string;
  setSelectedLandUse: (lu: string) => void;
  selectedTenure: string;
  setSelectedTenure: (t: string) => void;
  selectedRegion: string;
  setSelectedRegion: (r: string) => void;

  // User Guide Walkthrough
  isUserGuideOpen: boolean;
  currentGuideStep: number;
  startUserGuide: () => void;
  nextUserGuideStep: () => void;
  prevUserGuideStep: () => void;
  closeUserGuide: () => void;
  userGuideSteps: UserGuideStep[];

  // Modals
  isDevModalOpen: boolean;
  setIsDevModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    coordinateUnit: 'feet',
    regionalOptimization: 'auto',
    coastalThreshold: 6.0,
    defaultMapCenter: [7.9465, -1.0232], // Center of Ghana
    defaultMapZoom: 7,
    highPrecisionMode: true,
    basemap: 'streets',
    showGridGridlines: true,
    showPointLabels: true,
    autoZoomOnSelect: true
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState<boolean>(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState<boolean>(false);

  const [plots, setPlots] = useState<Plot[]>(initialPlots);
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>('plot-1');
  const [highlightedPlotId, setHighlightedPlotId] = useState<string | null>('plot-1');
  const [previewPoints, setPreviewPoints] = useState<BoundaryPoint[]>([]);

  const [mapCenter, setMapCenter] = useState<[number, number]>([5.6037, -0.1870]); // Default Accra
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLandUse, setSelectedLandUse] = useState<string>('All');
  const [selectedTenure, setSelectedTenure] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  // Interactive User Guide
  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [currentGuideStep, setCurrentGuideStep] = useState<number>(1);

  // Modals
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState<boolean>(false);

  // Synchronize Dark Mode CSS classes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next && theme === 'light') setTheme('dark');
      if (!next && theme === 'dark') setTheme('light');
      return next;
    });
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addPlot = (newPlot: Plot) => {
    setPlots((prev) => [newPlot, ...prev]);
    setSelectedPlotId(newPlot.id);
    setHighlightedPlotId(newPlot.id);
    setMapCenter(newPlot.center);
    setMapZoom(16);
  };

  const updatePlot = (updatedPlot: Plot) => {
    setPlots((prev) => prev.map((p) => (p.id === updatedPlot.id ? updatedPlot : p)));
  };

  const deletePlot = (id: string) => {
    setPlots((prev) => prev.filter((p) => p.id !== id));
    if (selectedPlotId === id) setSelectedPlotId(null);
    if (highlightedPlotId === id) setHighlightedPlotId(null);
  };

  const importPlots = (newPlots: Plot[]) => {
    setPlots((prev) => [...newPlots, ...prev]);
    if (newPlots.length > 0) {
      setSelectedPlotId(newPlots[0].id);
      setHighlightedPlotId(newPlots[0].id);
      setMapCenter(newPlots[0].center);
      setMapZoom(14);
    }
  };

  const clearPreviewPoints = () => {
    setPreviewPoints([]);
  };

  // User Guide Actions
  const startUserGuide = () => {
    setCurrentGuideStep(1);
    setIsUserGuideOpen(true);
    setIsRightMenuOpen(false);
  };

  const nextUserGuideStep = () => {
    if (currentGuideStep < USER_GUIDE_STEPS.length) {
      setCurrentGuideStep((prev) => prev + 1);
    } else {
      setIsUserGuideOpen(false);
    }
  };

  const prevUserGuideStep = () => {
    if (currentGuideStep > 1) {
      setCurrentGuideStep((prev) => prev - 1);
    }
  };

  const closeUserGuide = () => {
    setIsUserGuideOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        toggleDarkMode,
        settings,
        updateSettings,
        activeTab,
        setActiveTab,
        isLeftMenuOpen,
        setIsLeftMenuOpen,
        isRightMenuOpen,
        setIsRightMenuOpen,
        plots,
        addPlot,
        updatePlot,
        deletePlot,
        importPlots,
        selectedPlotId,
        setSelectedPlotId,
        highlightedPlotId,
        setHighlightedPlotId,
        previewPoints,
        setPreviewPoints,
        clearPreviewPoints,
        mapCenter,
        setMapCenter,
        mapZoom,
        setMapZoom,
        searchTerm,
        setSearchTerm,
        selectedLandUse,
        setSelectedLandUse,
        selectedTenure,
        setSelectedTenure,
        selectedRegion,
        setSelectedRegion,
        isUserGuideOpen,
        currentGuideStep,
        startUserGuide,
        nextUserGuideStep,
        prevUserGuideStep,
        closeUserGuide,
        userGuideSteps: USER_GUIDE_STEPS,
        isDevModalOpen,
        setIsDevModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isSupportModalOpen,
        setIsSupportModalOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
