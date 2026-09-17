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
    <div className="page-heading explore-heading">
      <div>
        <span className="eyebrow">EXPLORE AROUND YOU</span>
        <h1>Find somewhere worth going.</h1>
        <div className="location-status"><span className={location?.isFallback ? 'status-dot fallback' : 'status-dot'} />{location?.label || 'Locating you…'}<span className="status-divider">•</span>{location?.isFallback ? 'Demo location' : 'Live location'}</div>
      </div>
      <button className="button secondary locate-button" onClick={detect} disabled={locating}><span>⌖</span>{locating ? 'Locating…' : 'Refresh location'}</button>
    </div>

    {locationError && <div className="notice">{locationError}</div>}

    <section className="discover-controls">
      <div className="controls-copy"><span>SMART SEARCH</span><strong>What kind of place are you in the mood for?</strong></div>
      <SearchBox onSearch={search} loading={loading && aiMode} />
      <CategoryChips value={category} onChange={(value) => { setCategory(value); setAiMode(false); loadPlaces(value); }} />
    </section>

    <div className="explore-layout">
      <section className="results-panel">
        <div className="section-head">
          <div><span className="results-kicker">DISCOVERIES</span><h2>{aiMode ? '✨ Recommendations' : category === 'hidden' ? '✨ Hidden gems' : 'Places near you'}</h2><p>{places.length} places found{hiddenCount ? ` · ${hiddenCount} hidden gems` : ''}</p></div>
          {loading && <span className="loader"><i /> Loading places…</span>}
        </div>
        {error && <div className="error-box">{error}</div>}
        {!loading && !places.length && <div className="empty"><span>⌖</span><strong>No places found.</strong><p>Try another category or refresh your location.</p></div>}
        <div className="place-grid">{places.map((place) => <PlaceCard key={place.id} place={place} onSelect={setSelected} />)}</div>
      </section>
      <aside className="map-panel">
        <div className="map-panel-label"><span>LIVE MAP</span><strong>{selected ? selected.name : 'Tap a place to focus it'}</strong></div>
        <MapView location={location} places={places} selected={selected} />
        <div className="map-note">© OpenStreetMap contributors</div>
      </aside>
    </div>
  </main></div>;
}
