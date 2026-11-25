import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdvancedMarker,
  AltitudeMode,
  Map as GoogleMap,
  Pin,
  useApiIsLoaded,
} from '@vis.gl/react-google-maps';
import {
  GestureHandling,
  Map3D,
  MapMode,
  Marker3D,
  type Map3DClickEvent,
  type Map3DRef,
} from '@vis.gl/react-google-maps/3d';
import {
  ArrowRight,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  Crosshair,
  Globe2,
  Layers,
  MapPin,
  Mountain,
  Orbit,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Destination, RegionType } from '../../types';

interface PickedCoords {
  lat: number;
  lng: number;
  altitude?: number;
}

interface Pakistan3DMapProps {
  locations?: Destination[];
  focusedSlug?: string;
  compact?: boolean;
  heightClass?: string;
  pickMode?: boolean;
  pickedCoordinates?: PickedCoords;
  onPickCoordinates?: (coords: PickedCoords) => void;
  onSelectLocation?: (dest: Destination) => void;
}

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
const HAS_VALID_MAPS_KEY = Boolean(MAPS_API_KEY && MAPS_API_KEY !== 'MY_GOOGLE_MAPS_API_KEY');
const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

const PAKISTAN_OVERVIEW_CAMERA = {
  center: { lat: 33.45, lng: 72.8, altitude: 1200 },
  range: 1450000,
  tilt: 38,
  heading: 8,
};

function detectWebGL2(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

export const Pakistan3DMap: React.FC<Pakistan3DMapProps> = ({
  locations,
  focusedSlug,
  compact = false,
  heightClass,
  pickMode = false,
  pickedCoordinates,
  onPickCoordinates,
  onSelectLocation,
}) => {
  const { destinations } = useApp();
  const list = locations && locations.length > 0 ? locations : destinations;

  const [regionFilter, setRegionFilter] = useState<'All' | RegionType>('All');
  const filteredList = useMemo(() => {
    if (regionFilter === 'All') return list;
    const sub = list.filter((d) => d.region === regionFilter);
    return sub.length > 0 ? sub : list;
  }, [list, regionFilter]);

  const initialActive = useMemo(() => {
    if (focusedSlug) {
      return list.find((d) => d.slug === focusedSlug) || list[0];
    }
    return list[0];
  }, [list, focusedSlug]);

  const [activeId, setActiveId] = useState<string>(initialActive?.id || '');
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'hybrid'>(() => (detectWebGL2() ? '3d' : 'hybrid'));
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [mapError, setMapError] = useState(false);

  const map3dRef = useRef<Map3DRef | null>(null);
  const apiLoaded = useApiIsLoaded();

  useEffect(() => {
    if (focusedSlug) {
      const target = list.find((d) => d.slug === focusedSlug);
      if (target) {
        setActiveId(target.id);
        setPhotoIndex(0);
      }
    }
  }, [focusedSlug, list]);

  useEffect(() => {
    const handleQuota = () => setMapError(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const activeDest = useMemo(() => {
    return (
      filteredList.find((d) => d.id === activeId) ||
      list.find((d) => d.id === activeId) ||
      filteredList[0] ||
      list[0]
    );
  }, [filteredList, list, activeId]);

  const photos = useMemo(() => {
    if (!activeDest) return [];
    const merged = [activeDest.image, ...(activeDest.gallery || [])].filter(Boolean);
    return Array.from(new Set(merged));
  }, [activeDest]);

  const handleSelectDest = (dest: Destination) => {
    setActiveId(dest.id);
    setPhotoIndex(0);
    setIsOrbiting(false);
    onSelectLocation?.(dest);

    if (map3dRef.current && viewMode === '3d') {
      map3dRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: dest.coordinates.lat,
            lng: dest.coordinates.lng,
            altitude: dest.coordinates.altitude ?? 800,
          },
          range: dest.mapCamera?.range ?? (dest.region === 'Northern Pakistan' ? 9500 : 12000),
          tilt: dest.mapCamera?.tilt ?? 62,
          heading: dest.mapCamera?.heading ?? 18,
        },
        durationMillis: 1500,
      });
    }
  };

  // Fly to focused location on initial 3D load when focusedSlug or pickMode coordinates exist
  useEffect(() => {
    if (!apiLoaded || viewMode !== '3d' || !map3dRef.current) return;

    if (pickMode && pickedCoordinates) {
      map3dRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: pickedCoordinates.lat,
            lng: pickedCoordinates.lng,
            altitude: pickedCoordinates.altitude ?? 1000,
          },
          range: 9000,
          tilt: 58,
          heading: 12,
        },
        durationMillis: 900,
      });
      return;
    }

    if (focusedSlug && activeDest) {
      map3dRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: activeDest.coordinates.lat,
            lng: activeDest.coordinates.lng,
            altitude: activeDest.coordinates.altitude ?? 800,
          },
          range: activeDest.mapCamera?.range ?? 9500,
          tilt: activeDest.mapCamera?.tilt ?? 62,
          heading: activeDest.mapCamera?.heading ?? 18,
        },
        durationMillis: 1100,
      });
    }
  }, [apiLoaded, viewMode, focusedSlug, pickMode]);

  const handleResetOverview = () => {
    setIsOrbiting(false);
    map3dRef.current?.stopCameraAnimation();
    map3dRef.current?.flyCameraTo({
      endCamera: PAKISTAN_OVERVIEW_CAMERA,
      durationMillis: 1400,
    });
  };

  const handleToggleOrbit = () => {
    if (!map3dRef.current || !activeDest) return;
    if (isOrbiting) {
      map3dRef.current.stopCameraAnimation();
      setIsOrbiting(false);
    } else {
      setIsOrbiting(true);
      map3dRef.current.flyCameraAround({
        camera: {
          center: {
            lat: activeDest.coordinates.lat,
            lng: activeDest.coordinates.lng,
            altitude: activeDest.coordinates.altitude ?? 800,
          },
          range: activeDest.mapCamera?.range ?? 8500,
          tilt: 64,
          heading: 0,
        },
        durationMillis: 24000,
        rounds: 1,
      });
    }
  };

  const handleMap3DClick = (event: Map3DClickEvent) => {
    if (!pickMode || !onPickCoordinates) return;
    const pos = event.detail.position;
    if (!pos) return;
    onPickCoordinates({
      lat: Number(pos.lat.toFixed(6)),
      lng: Number(pos.lng.toFixed(6)),
      altitude: Math.max(0, Math.round(pos.altitude || 0)),
    });
  };

  const handleHybridClick = (event: { detail: { latLng?: { lat: number; lng: number } | null } }) => {
    if (!pickMode || !onPickCoordinates || !event.detail.latLng) return;
    onPickCoordinates({
      lat: Number(event.detail.latLng.lat.toFixed(6)),
      lng: Number(event.detail.latLng.lng.toFixed(6)),
      altitude: pickedCoordinates?.altitude ?? 500,
    });
  };

  const canvasHeight =
    heightClass || (pickMode ? 'h-[320px]' : compact ? 'h-[360px] lg:h-[420px]' : 'h-[480px] lg:h-[580px]');

  const canRenderGoogleMaps = HAS_VALID_MAPS_KEY && !mapError && apiLoaded;

  // Fallback coordinate map plot (bounds covering all of Pakistan: Lat 23.5..37.5, Lng 60.8..77.8)
  const toFallbackPercent = (lat: number, lng: number) => {
    const x = Math.min(94, Math.max(6, ((lng - 60.8) / (77.8 - 60.8)) * 100));
    const y = Math.min(92, Math.max(8, 100 - ((lat - 23.5) / (37.5 - 23.5)) * 100));
    return { x, y };
  };

  const defaultMapCenter = useMemo(() => {
    if (pickMode && pickedCoordinates) {
      return {
        lat: pickedCoordinates.lat,
        lng: pickedCoordinates.lng,
        altitude: pickedCoordinates.altitude ?? 1000,
      };
    }
    if (focusedSlug && activeDest) {
      return {
        lat: activeDest.coordinates.lat,
        lng: activeDest.coordinates.lng,
        altitude: activeDest.coordinates.altitude ?? 800,
      };
    }
    return PAKISTAN_OVERVIEW_CAMERA.center;
  }, [pickMode, pickedCoordinates, focusedSlug, activeDest]);

  const mapViewport = (
    <div className="space-y-3">
      {/* Map Controls Strip (outside map canvas so attribution stays unobstructed) */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#102A43]/95 text-white px-4 py-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 text-xs font-medium text-white/85">
          <Globe2 className="w-4 h-4 text-[#E5AD50]" />
          {pickMode ? (
            <span>Click directly on terrain to pick exact GPS &amp; elevation</span>
          ) : (
            <span>
              Pakistan Live 3D Map · <strong className="text-white">{filteredList.length}</strong> Admin Locations
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {!pickMode && !compact && (
            <div className="hidden sm:flex items-center gap-1 mr-2 bg-white/10 p-0.5 rounded-lg text-[11px]">
              {(['All', 'Northern Pakistan', 'Pakistan Heritage & Coast'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegionFilter(r)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    regionFilter === r ? 'bg-[#E5AD50] text-[#102A43]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {r === 'All' ? 'All Pakistan' : r === 'Northern Pakistan' ? 'North & Peaks' : 'Heritage & Coast'}
                </button>
              ))}
            </div>
          )}

          {canRenderGoogleMaps && (
            <>
              <button
                type="button"
                onClick={() => {
                  setViewMode('3d');
                  setIsOrbiting(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === '3d'
                    ? 'bg-[#168AAD] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" /> 3D Terrain
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('hybrid');
                  setIsOrbiting(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'hybrid'
                    ? 'bg-[#168AAD] text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Satellite
              </button>
              {viewMode === '3d' && !pickMode && activeDest && (
                <button
                  type="button"
                  onClick={handleToggleOrbit}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                    isOrbiting
                      ? 'bg-[#E5AD50] text-[#102A43]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <Orbit className="w-3.5 h-3.5" /> {isOrbiting ? 'Stop Orbit' : 'Orbit'}
                </button>
              )}
              {viewMode === '3d' && !pickMode && (
                <button
                  type="button"
                  onClick={handleResetOverview}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/10 text-white/85 hover:bg-white/20 flex items-center gap-1 transition-colors"
                  title="Reset Pakistan Panorama"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Actual Interactive Map Surface (clean canvas, zero floating blur overlays covering map attribution) */}
      <div className={`relative w-full ${canvasHeight} rounded-2xl overflow-hidden border border-slate-200 bg-[#0B1E32] shadow-lg`}>
        {canRenderGoogleMaps ? (
          viewMode === '3d' ? (
            <Map3D
              ref={map3dRef}
              id={pickMode ? 'admin-picker-3d' : compact ? 'detail-3d-map' : 'pakistan-3d-explorer'}
              mode={MapMode.SATELLITE}
              gestureHandling={GestureHandling.GREEDY}
              defaultCenter={defaultMapCenter}
              defaultRange={pickMode ? 9000 : focusedSlug ? activeDest?.mapCamera?.range ?? 9500 : PAKISTAN_OVERVIEW_CAMERA.range}
              defaultTilt={pickMode ? 58 : focusedSlug ? activeDest?.mapCamera?.tilt ?? 62 : PAKISTAN_OVERVIEW_CAMERA.tilt}
              defaultHeading={pickMode ? 12 : focusedSlug ? activeDest?.mapCamera?.heading ?? 18 : PAKISTAN_OVERVIEW_CAMERA.heading}
              internalUsageAttributionIds={ATTRIBUTION_IDS}
              onClick={handleMap3DClick}
              onError={() => setMapError(true)}
              style={{ width: '100%', height: '100%' }}
            >
              {pickMode && pickedCoordinates && (
                <Marker3D
                  position={{
                    lat: pickedCoordinates.lat,
                    lng: pickedCoordinates.lng,
                    altitude: 180,
                  }}
                  altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
                  extruded
                  drawsWhenOccluded
                  label="Selected Pin"
                  title={`Picked Coordinates: ${pickedCoordinates.lat}, ${pickedCoordinates.lng}`}
                />
              )}

              {filteredList.map((dest) => {
                const isSelected = !pickMode && activeDest?.id === dest.id;
                return (
                  <Marker3D
                    key={dest.id}
                    position={{
                      lat: dest.coordinates.lat,
                      lng: dest.coordinates.lng,
                      altitude: isSelected ? 360 : 140,
                    }}
                    altitudeMode={AltitudeMode.RELATIVE_TO_GROUND}
                    extruded
                    drawsWhenOccluded
                    zIndex={isSelected ? 100 : dest.featured ? 20 : 5}
                    label={dest.name}
                    title={`${dest.name} · ${dest.elevationOrClimate}`}
                    onClick={() => {
                      if (pickMode && onPickCoordinates) {
                        onPickCoordinates({
                          lat: dest.coordinates.lat,
                          lng: dest.coordinates.lng,
                          altitude: dest.coordinates.altitude ?? 500,
                        });
                      } else {
                        handleSelectDest(dest);
                      }
                    }}
                  />
                );
              })}
            </Map3D>
          ) : (
            <GoogleMap
              defaultCenter={defaultMapCenter}
              center={
                pickMode && pickedCoordinates
                  ? { lat: pickedCoordinates.lat, lng: pickedCoordinates.lng }
                  : activeDest && focusedSlug
                  ? { lat: activeDest.coordinates.lat, lng: activeDest.coordinates.lng }
                  : undefined
              }
              defaultZoom={pickMode || focusedSlug ? 11 : 6}
              mapId="DEMO_MAP_ID"
              mapTypeId="hybrid"
              tilt={45}
              gestureHandling="greedy"
              internalUsageAttributionIds={ATTRIBUTION_IDS}
              onClick={handleHybridClick}
              style={{ width: '100%', height: '100%' }}
            >
              {pickMode && pickedCoordinates && (
                <AdvancedMarker
                  position={{ lat: pickedCoordinates.lat, lng: pickedCoordinates.lng }}
                  title="Picked Location"
                >
                  <Pin background="#E5AD50" borderColor="#102A43" glyphColor="#102A43" scale={1.2} />
                </AdvancedMarker>
              )}

              {filteredList.map((dest) => {
                const isSelected = !pickMode && activeDest?.id === dest.id;
                return (
                  <AdvancedMarker
                    key={dest.id}
                    position={{ lat: dest.coordinates.lat, lng: dest.coordinates.lng }}
                    title={`${dest.name} (${dest.availableTours} tours)`}
                    onClick={() => {
                      if (pickMode && onPickCoordinates) {
                        onPickCoordinates({
                          lat: dest.coordinates.lat,
                          lng: dest.coordinates.lng,
                          altitude: dest.coordinates.altitude ?? 500,
                        });
                      } else {
                        handleSelectDest(dest);
                      }
                    }}
                  >
                    <Pin
                      background={isSelected ? '#E5AD50' : '#168AAD'}
                      borderColor="#FFFFFF"
                      glyphColor={isSelected ? '#102A43' : '#FFFFFF'}
                      scale={isSelected ? 1.2 : 0.95}
                    />
                  </AdvancedMarker>
                );
              })}
            </GoogleMap>
          )
        ) : (
          /* Interactive Offline/Fallback Pakistan Coordinate Canvas */
          <div
            className="w-full h-full relative bg-[radial-gradient(circle_at_55%_25%,rgba(22,138,173,0.32),rgba(11,30,50,0.96))] p-4 cursor-crosshair select-none"
            onClick={(e) => {
              if (!pickMode || !onPickCoordinates) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const xRatio = (e.clientX - rect.left) / rect.width;
              const yRatio = (e.clientY - rect.top) / rect.height;
              const lng = Number((60.8 + xRatio * (77.8 - 60.8)).toFixed(4));
              const lat = Number((23.5 + (1 - yRatio) * (37.5 - 23.5)).toFixed(4));
              onPickCoordinates({ lat, lng, altitude: pickedCoordinates?.altitude ?? 1200 });
            }}
          >
            {/* Subtle Latitude / Longitude Gridlines */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:48px_48px]" />
            <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#102A43]/90 border border-white/15 text-[11px] text-white/85">
              <Compass className="w-3.5 h-3.5 text-[#E5AD50]" />
              {HAS_VALID_MAPS_KEY && !apiLoaded
                ? 'Loading Google Maps 3D Terrain...'
                : 'Interactive Pakistan Coordinate Grid (24°N–37°N · 61°E–77°E)'}
            </div>

            {filteredList.map((dest) => {
              const { x, y } = toFallbackPercent(dest.coordinates.lat, dest.coordinates.lng);
              const isSelected = activeDest?.id === dest.id;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    handleSelectDest(dest);
                  }}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 ${
                    isSelected ? 'scale-110 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold shadow-md border ${
                      isSelected
                        ? 'bg-[#E5AD50] text-[#102A43] border-white'
                        : 'bg-[#102A43]/90 text-white border-white/30 hover:bg-[#168AAD]'
                    }`}
                  >
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="whitespace-nowrap">{dest.name}</span>
                  </div>
                </button>
              );
            })}

            {pickMode && pickedCoordinates && (
              <div
                style={{
                  left: `${toFallbackPercent(pickedCoordinates.lat, pickedCoordinates.lng).x}%`,
                  top: `${toFallbackPercent(pickedCoordinates.lat, pickedCoordinates.lng).y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
              >
                <div className="w-7 h-7 rounded-full bg-[#E5AD50] border-2 border-white shadow-lg flex items-center justify-center text-[#102A43]">
                  <Crosshair className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scrollable Quick Jump Strip across Admin-Managed Locations */}
      {!pickMode && !compact && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {filteredList.map((dest) => {
            const active = activeDest?.id === dest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => handleSelectDest(dest)}
                className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  active
                    ? 'bg-[#102A43] text-white border-[#102A43] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#168AAD] hover:text-[#168AAD]'
                }`}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
                <span>{dest.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  if (pickMode) {
    return mapViewport;
  }

  return (
    <div className={`grid gap-6 ${compact ? 'grid-cols-1' : 'lg:grid-cols-12 items-start'}`}>
      <div className={compact ? '' : 'lg:col-span-7 xl:col-span-8'}>{mapViewport}</div>

      {/* Synced Location Photos, Exact GPS, Elevation & Expedition Details Card */}
      {activeDest && (
        <div
          className={`${
            compact ? '' : 'lg:col-span-5 xl:col-span-4'
          } bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden`}
        >
          {/* Photo Gallery Viewer */}
          <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden group">
            <img
              src={photos[photoIndex] || activeDest.image}
              alt={`${activeDest.name} view ${photoIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#102A43]/85 text-white text-[11px] font-semibold">
                {activeDest.region}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#E5AD50] text-[#102A43] text-[11px] font-bold flex items-center gap-1">
                <Camera className="w-3 h-3" /> {photoIndex + 1} / {photos.length}
              </span>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)}
                  aria-label="Previous photo"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)}
                  aria-label="Next photo"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
              <div className="text-[11px] uppercase tracking-wider text-[#E5AD50] font-semibold">
                {activeDest.category} · Pakistan
              </div>
              <h3 className="text-xl font-bold leading-tight">{activeDest.name}</h3>
            </div>
          </div>

          {/* Clickable Gallery Thumbnails */}
          {photos.length > 1 && (
            <div className="px-4 pt-3 flex items-center gap-2 overflow-x-auto">
              {photos.map((imgUrl, idx) => (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={() => setPhotoIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === photoIndex ? 'border-[#168AAD] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Coordinates + Info Grid */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Exact GPS</div>
                <div className="font-mono font-semibold text-[#102A43] mt-0.5">
                  {activeDest.coordinates.lat.toFixed(4)}°N, {activeDest.coordinates.lng.toFixed(4)}°E
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Elevation</div>
                <div className="font-semibold text-[#102A43] mt-0.5">
                  {activeDest.coordinates.altitude
                    ? `${activeDest.coordinates.altitude.toLocaleString()} m ASL`
                    : activeDest.elevationOrClimate}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#168AAD]" /> Best Season
                </div>
                <div className="font-semibold text-[#102A43] mt-0.5">{activeDest.bestSeason}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E5AD50]" /> Tours Available
                </div>
                <div className="font-semibold text-[#168AAD] mt-0.5">
                  {activeDest.availableTours} Active Packages
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
              {activeDest.shortDescription}
            </p>

            {activeDest.attractions && activeDest.attractions.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Top Landmarks on Map
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeDest.attractions.slice(0, 4).map((attr) => (
                    <span
                      key={attr.name}
                      className="px-2.5 py-1 rounded-lg bg-[#168AAD]/10 text-[#102A43] text-xs font-medium"
                    >
                      {attr.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-1 flex items-center gap-2.5">
              <Link
                to={`/destinations/${activeDest.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#168AAD] text-white text-xs font-semibold transition-colors"
              >
                Explore Guide <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/packages?destination=${activeDest.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E5AD50]/20 hover:bg-[#E5AD50]/35 text-[#102A43] text-xs font-semibold transition-colors"
              >
                View Tours
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
