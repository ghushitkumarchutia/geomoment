import { useEffect, useRef } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import HeatmapOverlay from './HeatmapOverlay';
import useMapBounds from '../../hooks/useMapBounds';
import useHeatmapData from '../../hooks/useHeatmapData';
import useGeolocation from '../../hooks/useGeolocation';
import useMapStore from '../../store/mapStore';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';

const MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined;
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.209 };
const DEFAULT_ZOOM = 14;

function GeolocationPanner() {
  const map = useMap();
  const { position, requestPosition } = useGeolocation();
  const hasPannedRef = useRef(false);

  useEffect(() => {
    requestPosition();
  }, [requestPosition]);

  useEffect(() => {
    if (!position || !map || hasPannedRef.current) return;
    hasPannedRef.current = true;
    map.panTo({ lat: position.lat, lng: position.lng });
  }, [position, map]);

  return null;
}

function LocateMeButton() {
  const map = useMap();
  const { position, isLoading, requestPosition } = useGeolocation();

  const handleClick = () => {
    requestPosition();
  };

  useEffect(() => {
    if (position && map) {
      map.panTo({ lat: position.lat, lng: position.lng });
      map.setZoom(15);
    }
  }, [position, map]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label="Go to my location"
      className="size-11 bg-black/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black transition-all duration-200 cursor-pointer"
    >
      {isLoading ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="animate-spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.15" />
          <path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      )}
    </button>
  );
}

export default function MapCanvas() {
  useMapBounds();
  useHeatmapData();

  const setClickedCoords = useMapStore((s) => s.setClickedCoords);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const openTagSubmitModal = useUiStore((s) => s.openTagSubmitModal);

  const handleMapClick = (e) => {
    const latLng = e.detail?.latLng;
    if (!latLng) return;

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setClickedCoords({ lat: latLng.lat, lng: latLng.lng });
    openTagSubmitModal();
  };

  return (
    <Map
      mapId={MAP_ID}
      defaultCenter={DEFAULT_CENTER}
      defaultZoom={DEFAULT_ZOOM}
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      clickableIcons={false}
      onClick={handleMapClick}
      className="w-full h-full"
    >
      <HeatmapOverlay />
      <GeolocationPanner />
    </Map>
  );
}

export { LocateMeButton };
