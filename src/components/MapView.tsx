import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { Plot, BoundaryPoint, LandUse } from '../types';
import {
  Layers,
  Compass,
  Maximize2,
  ChevronRight,
  ChevronDown,
  Ruler,
  Info,
  MapPin,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const LAND_USE_COLORS: Record<LandUse, { fill: string; stroke: string }> = {
  Residential: { fill: '#10B981', stroke: '#047857' },
  Commercial: { fill: '#3B82F6', stroke: '#1D4ED8' },
  Agricultural: { fill: '#F59E0B', stroke: '#B45309' },
  Industrial: { fill: '#8B5CF6', stroke: '#6D28D9' },
  'Mixed-Use': { fill: '#F43F5E', stroke: '#BE123C' },
  Civic: { fill: '#06B6D4', stroke: '#0E7490' },
  Other: { fill: '#64748B', stroke: '#334155' }
};

export const MapView: React.FC = () => {
  const {
    plots,
    selectedPlotId,
    setSelectedPlotId,
    highlightedPlotId,
    setHighlightedPlotId,
    previewPoints,
    mapCenter,
    mapZoom,
    settings,
    updateSettings,
    setActiveTab,
    selectedLandUse,
    selectedTenure,
    selectedRegion
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const plotLayersRef = useRef<Record<string, L.Polygon>>({});
  const previewLayerRef = useRef<L.LayerGroup | null>(null);

  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);
  const [activeMeasure, setActiveMeasure] = useState<boolean>(false);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Filter plots according to active workspace filters
  const filteredPlots = plots.filter((plot) => {
    if (selectedLandUse !== 'All' && plot.landUse !== selectedLandUse) return false;
    if (selectedTenure !== 'All' && plot.tenureType !== selectedTenure) return false;
    if (selectedRegion !== 'All' && plot.region !== selectedRegion) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet Map instance
    const map = L.map(mapContainerRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    previewLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer based on Settings
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors | Ghana Lands Commission';

    if (settings.basemap === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Esri, Maxar, Earthstar Geographics | Ghana Grid GIS';
    } else if (settings.basemap === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '&copy; CARTO &copy; OpenStreetMap';
    } else if (settings.basemap === 'terrain') {
      tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap, SRTM';
    } else if (settings.basemap === 'high-contrast') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';
    }

    L.tileLayer(tileUrl, { attribution, maxZoom: 19 }).addTo(map);
  }, [settings.basemap]);

  // Render Land Plot Polygons
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old plot layers
    Object.values(plotLayersRef.current).forEach((layer: L.Polygon) => layer.remove());
    plotLayersRef.current = {};

    filteredPlots.forEach((plot) => {
      const latLngs: [number, number][] = (plot.boundaryPoints || [])
        .filter((p) => p && typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng) && isFinite(p.lat) && isFinite(p.lng))
        .map((p) => [p.lat, p.lng]);

      if (latLngs.length < 3) return;

      const colorScheme = LAND_USE_COLORS[plot.landUse] || LAND_USE_COLORS.Other;
      const isSelected = selectedPlotId === plot.id;
      const isHighlighted = highlightedPlotId === plot.id;

      const polygon = L.polygon(latLngs, {
        color: isHighlighted ? '#F59E0B' : colorScheme.stroke,
        weight: isHighlighted ? 4 : isSelected ? 3 : 2,
        fillColor: colorScheme.fill,
        fillOpacity: isSelected || isHighlighted ? 0.65 : 0.4,
        className: isHighlighted ? 'highlighted-plot-path' : ''
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="padding: 12px; min-width: 220px; font-family: sans-serif;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; background: #FEF3C7; color: #92400E; padding: 2px 6px; border-radius: 4px;">
              ${plot.tenureType}
            </span>
            <span style="font-size: 11px; color: #64748B; font-weight: 600;">${plot.region}</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 2px 0;">${plot.plotNumber}</h4>
          <p style="font-size: 11px; color: #047857; font-weight: 700; margin: 0 0 8px 0;">Title: ${plot.titleNumber}</p>
          
          <div style="background: #F8FAFC; padding: 8px; border-radius: 6px; border: 1px solid #E2E8F0; margin-bottom: 8px; font-size: 11px;">
            <div style="margin-bottom: 3px;"><strong>Owner:</strong> ${plot.currentOwner.name}</div>
            <div style="margin-bottom: 3px;"><strong>Town:</strong> ${plot.nearestTown}</div>
            <div><strong>Area:</strong> ${plot.areaAcres} Acres (${plot.areaSqFt ? plot.areaSqFt.toLocaleString() : 0} sq ft)</div>
          </div>

          <div style="font-size: 10px; color: #475569; margin-bottom: 8px;">
            <strong>Ghana Grid Centroid:</strong> ${plot.boundaryPoints[0]?.easting ? plot.boundaryPoints[0].easting.toLocaleString() : 0} ft E, ${plot.boundaryPoints[0]?.northing ? plot.boundaryPoints[0].northing.toLocaleString() : 0} ft N
          </div>

          <button id="btn-select-plot-${plot.id}" style="width: 100%; background: #F59E0B; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;">
            View Full Plot & Owner History
          </button>
        </div>
      `;

      polygon.bindPopup(popupHtml);

      polygon.on('click', () => {
        setSelectedPlotId(plot.id);
        setHighlightedPlotId(plot.id);
      });

      polygon.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-plot-${plot.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedPlotId(plot.id);
            setActiveTab('registry');
          };
        }
      });

      plotLayersRef.current[plot.id] = polygon;
    });
  }, [filteredPlots, selectedPlotId, highlightedPlotId]);

  // Center & Zoom map when selected plot changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlotId) return;

    const plot = plots.find((p) => p.id === selectedPlotId);
    if (plot && plot.center && Array.isArray(plot.center) && plot.center.length === 2) {
      const [cLat, cLng] = plot.center;
      if (typeof cLat === 'number' && typeof cLng === 'number' && !isNaN(cLat) && !isNaN(cLng) && isFinite(cLat) && isFinite(cLng)) {
        map.flyTo([cLat, cLng], 16, { animate: true, duration: 1.2 });
        const layer = plotLayersRef.current[plot.id];
        if (layer) {
          layer.openPopup();
        }
      }
    }
  }, [selectedPlotId]);

  // Render Real-Time Manual Entry Live Preview Points
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = previewLayerRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (!previewPoints || previewPoints.length === 0) return;

    const latLngs: [number, number][] = previewPoints
      .filter((pt) => pt && typeof pt.lat === 'number' && typeof pt.lng === 'number' && !isNaN(pt.lat) && !isNaN(pt.lng) && isFinite(pt.lat) && isFinite(pt.lng))
      .map((pt) => [pt.lat, pt.lng]);

    // Draw markers
    previewPoints.forEach((pt, index) => {
      if (!pt || typeof pt.lat !== 'number' || typeof pt.lng !== 'number' || isNaN(pt.lat) || isNaN(pt.lng) || !isFinite(pt.lat) || !isFinite(pt.lng)) {
        return;
      }

      const marker = L.circleMarker([pt.lat, pt.lng], {
        radius: 8,
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.9,
        weight: 3
      });

      marker.bindTooltip(`Point #${index + 1}: ${pt.pointId}<br/>E: ${pt.easting} ft, N: ${pt.northing} ft`, {
        permanent: true,
        direction: 'top'
      });

      layerGroup.addLayer(marker);
    });

    // Draw connecting polyline or polygon
    if (latLngs.length >= 2) {
      const polyline = L.polyline(latLngs, {
        color: '#DC2626',
        dashArray: '6, 6',
        weight: 3
      });
      layerGroup.addLayer(polyline);
    }

    if (latLngs.length >= 3) {
      const polygon = L.polygon(latLngs, {
        color: '#DC2626',
        fillColor: '#FCA5A5',
        fillOpacity: 0.3,
        weight: 2
      });
      layerGroup.addLayer(polygon);
    }

    // Auto-fit preview points
    if (latLngs.length > 0) {
      try {
        const bounds = L.latLngBounds(latLngs);
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 17 });
        }
      } catch (err) {
        console.warn('Invalid bounds for preview points:', err);
      }
    }
  }, [previewPoints]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-900 overflow-hidden flex flex-col">
      
      {/* Top Banner Status */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800 z-10 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-emerald-400">GHANA GRID ACTIVE:</span>
          <span className="text-slate-300 hidden sm:inline">War Office Transverse Mercator (Feet)</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-300">
          <span>{filteredPlots.length} Parcels Loaded</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Optimization: <strong className="text-amber-400 uppercase">{settings.regionalOptimization}</strong></span>
        </div>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Basemap Switcher Toolbar (Top Right Overlay) */}
      <div className="absolute top-12 right-3 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1">
        <button
          onClick={() => updateSettings({ basemap: 'streets' })}
          className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            settings.basemap === 'streets'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="OpenStreetMap Streets"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden md:inline">Streets</span>
        </button>
        <button
          onClick={() => updateSettings({ basemap: 'satellite' })}
          className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            settings.basemap === 'satellite'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Esri Satellite Imagery"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden md:inline">Satellite</span>
        </button>
        <button
          onClick={() => updateSettings({ basemap: 'dark' })}
          className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            settings.basemap === 'dark'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="CartoDB Dark Vector"
        >
          <Compass className="w-4 h-4" />
          <span className="hidden md:inline">Dark</span>
        </button>
      </div>

      {/* Live Preview Indicator Banner if previewPoints exist */}
      {previewPoints.length > 0 && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-red-400 flex items-center gap-2 animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>Live Coordinate Preview: {previewPoints.length} Point(s) Projected</span>
          <button
            onClick={() => setActiveTab('manual-entry')}
            className="underline ml-2 hover:text-red-200 font-extrabold"
          >
            Edit Points
          </button>
        </div>
      )}

      {/* Collapsible Legend Control (Bottom Left Overlay) */}
      <div className="absolute bottom-6 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-all max-w-xs">
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          className="w-full p-2.5 px-3 flex items-center justify-between text-xs font-extrabold text-slate-800 dark:text-slate-200 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Land Use Legend</span>
          </div>
          {isLegendOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isLegendOpen && (
          <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            {Object.entries(LAND_USE_COLORS).map(([use, colors]) => (
              <div key={use} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-md border"
                    style={{ backgroundColor: colors.fill, borderColor: colors.stroke }}
                  />
                  <span className="text-[11px] font-medium">{use}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {plots.filter((p) => p.landUse === use).length}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
