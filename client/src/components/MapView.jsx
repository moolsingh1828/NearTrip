import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const icon = L.divIcon({ className: 'map-pin-wrap', html: '<span class="map-pin">●</span>', iconSize: [24, 24], iconAnchor: [12, 12] });
const userIcon = L.divIcon({ className: 'map-pin-wrap', html: '<span class="user-pin">●</span>', iconSize: [24, 24], iconAnchor: [12, 12] });

export default function MapView({ location, places = [], selected, route }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layers = useRef([]);
  const routeLayer = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([location?.lat || 23.2599, location?.lng || 77.4126], 13);
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance.current);
    return () => { mapInstance.current?.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !location) return;
    mapInstance.current.setView([location.lat, location.lng], Math.max(mapInstance.current.getZoom(), 13));
    layers.current.forEach((layer) => layer.remove());
    layers.current = [];
    layers.current.push(L.marker([location.lat, location.lng], { icon: userIcon }).addTo(mapInstance.current).bindPopup('<b>You are here</b>'));
    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], { icon }).addTo(mapInstance.current).bindPopup(`<b>${place.name}</b><br>${place.distanceKm ?? ''} km away`);
      marker.on('click', () => marker.openPopup());
      layers.current.push(marker);
    });
  }, [location, places]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (routeLayer.current) routeLayer.current.remove();
    if (route?.geometry?.coordinates?.length) {
      const points = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      routeLayer.current = L.polyline(points, { weight: 5, opacity: 0.9 }).addTo(mapInstance.current);
      mapInstance.current.fitBounds(routeLayer.current.getBounds(), { padding: [40, 40] });
    }
  }, [route]);

  useEffect(() => {
    if (mapInstance.current && selected) mapInstance.current.flyTo([selected.lat, selected.lng], 15, { duration: 0.6 });
  }, [selected]);

  return <div ref={mapRef} className="map" aria-label="Interactive map" />;
}
