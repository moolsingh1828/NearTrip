import { useCallback, useState } from 'react';

const fallback = {
  lat: Number(import.meta.env.VITE_DEFAULT_LAT || 23.2599),
  lng: Number(import.meta.env.VITE_DEFAULT_LNG || 77.4126),
  label: import.meta.env.VITE_DEFAULT_CITY || 'Bhopal',
  isFallback: true
};

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const detect = useCallback(() => {
    setLoading(true); setError('');
    if (!navigator.geolocation) {
      setLocation(fallback);
      setError('Geolocation is not supported. Showing demo location.');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lng: coords.longitude, label: 'Your location', isFallback: false });
        setLoading(false);
      },
      () => {
        setLocation(fallback);
        setError('Location permission was not available. Showing Bhopal demo mode.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { location, loading, error, detect };
}
