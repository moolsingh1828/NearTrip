import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import CategoryChips from '../components/CategoryChips.jsx';
import SearchBox from '../components/SearchBox.jsx';
import MapView from '../components/MapView.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import { api } from '../services/api.js';
import { useLocation } from '../hooks/useLocation.js';

export default function Explore() {
  const { location, loading: locating, error: locationError, detect } = useLocation();
  const [category, setCategory] = useState('all');
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMode, setAiMode] = useState(false);

  async function loadPlaces(nextCategory = category) {
    if (!location) return;
    setLoading(true); setError('');
    try { const data = await api.nearby({ lat: location.lat, lng: location.lng, category: nextCategory, radius: 7000 }); setPlaces(data.places); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { detect(); }, [detect]);
  useEffect(() => { if (location) loadPlaces(); }, [location]);

  async function search(query) {
    if (!location) return;
    setLoading(true); setError(''); setAiMode(true);
    try { const data = await api.recommend({ query, lat: location.lat, lng: location.lng }); setPlaces(data.places); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const hiddenCount = useMemo(() => places.filter((p) => p.isHiddenGem).length, [places]);

  return <div className="app-shell"><Navbar /><main className="container explore-page">
    <div className="page-heading"><div><span className="eyebrow">EXPLORE AROUND YOU</span><h1>Find somewhere worth going.</h1><p>{location?.label || 'Locating you…'} · {location?.isFallback ? 'Demo mode' : 'Live location'}</p></div><button className="button secondary" onClick={detect} disabled={locating}>⌖ {locating ? 'Locating…' : 'Refresh location'}</button></div>
    {locationError && <div className="notice">{locationError}</div>}
    <SearchBox onSearch={search} loading={loading && aiMode} />
    <CategoryChips value={category} onChange={(value) => { setCategory(value); setAiMode(false); loadPlaces(value); }} />
    <div className="explore-layout"><section className="results-panel"><div className="section-head"><div><h2>{aiMode ? '✨ Recommendations' : category === 'hidden' ? '✨ Hidden gems' : 'Places near you'}</h2><p>{places.length} places found{hiddenCount ? ` · ${hiddenCount} hidden gems` : ''}</p></div>{loading && <span className="loader">Loading…</span>}</div>{error && <div className="error-box">{error}</div>}{!loading && !places.length && <div className="empty"><strong>No places found.</strong><p>Try another category or move the map/search area.</p></div>}<div className="place-grid">{places.map((place) => <PlaceCard key={place.id} place={place} onSelect={setSelected} />)}</div></section><aside className="map-panel"><MapView location={location} places={places} selected={selected} /><div className="map-note">© OpenStreetMap contributors</div></aside></div>
  </main></div>;
}
