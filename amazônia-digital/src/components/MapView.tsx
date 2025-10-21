import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  status?: 'conforme' | 'analise' | 'irregular' | 'bloqueado';
  onClick?: () => void;
}

interface MapViewProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showTrails?: boolean;
}

export const MapView = ({
  points,
  center = [-3.4653, -62.2159], // Centro da Amazônia
  zoom = 5,
  height = '500px',
  showTrails = false,
}: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });

    // Add markers
    const markers: L.Marker[] = [];
    points.forEach((point) => {
      const getMarkerColor = (status?: string) => {
        switch (status) {
          case 'conforme': return '#16a34a';
          case 'analise': return '#eab308';
          case 'irregular': return '#f97316';
          case 'bloqueado': return '#dc2626';
          default: return '#3b82f6';
        }
      };

      const color = getMarkerColor(point.status);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([point.latitude, point.longitude], { icon: customIcon })
        .addTo(mapRef.current!)
        .bindPopup(point.title);

      if (point.onClick) {
        marker.on('click', point.onClick);
      }

      markers.push(marker);
    });

    // Draw trails if enabled
    if (showTrails && points.length > 1) {
      const coords: [number, number][] = points.map(p => [p.latitude, p.longitude]);
      L.polyline(coords, {
        color: '#16a34a',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 5',
      }).addTo(mapRef.current!);
    }

    // Fit bounds if there are points
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.latitude, p.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points, showTrails]);

  return <div ref={containerRef} style={{ height, width: '100%', borderRadius: '0.5rem' }} />;
};
