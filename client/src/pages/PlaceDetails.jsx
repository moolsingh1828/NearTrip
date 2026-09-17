import { Link, useLocation as useRouterLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import ShareButton from '../components/ShareButton.jsx';
import MapView from '../components/MapView.jsx';
import { api } from '../services/api.js';
import { useLocation } from '../hooks/useLocation.js';

export default function PlaceDetails() {
  const { id } = useParams();
  const routeState = useRouterLocation();
  const navigate = useNavigate();
  const [place, setPlace] = useState(() => {
    if (routeState.state?.place) return routeState.state.place;
    try { return JSON.parse(sessionStorage.getItem(`neartrip:place:${decodeURIComponent(id)}`) || 'null'); } catch { return null; }
  });
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const { location, detect } = useLocation();

  useEffect(() => { if (!location) detect(); }, [location, detect]);
  useEffect(() => {
    if (!place) api.nearby({ lat: 23.2599, lng: 77.4126, category: 'all', radius: 7000 }).then((d) => setPlace(d.places.find((p) => p.id === decodeURIComponent(id)) || d.places[0])).catch(() => {});
  }, [id, place]);

  async function getRoute() {
    if (!location || !place) return;
    setRouteLoading(true);
    try { setRoute(await api.route({ fromLat: location.lat, fromLng: location.lng, toLat: place.lat, toLng: place.lng })); }
    catch { setRoute(null); }
    finally { setRouteLoading(false); }
  }

  if (!place) return <><Navbar /><main className="container empty-page"><h1>Finding this place…</h1><p>If it doesn't load, go back to Explore and open it again.</p><button className="button primary" onClick={() => navigate('/explore')}>Back to explore</button></main></>;
  return <div className="app-shell"><Navbar /><main className="container detail-page">
    <Link to="/explore" className="back-link">← Back to explore</Link>
    <section className="detail-hero"><div className="detail-image"><span className="badge">{place.isHiddenGem ? '✨ Hidden Gem' : 'Nearby pick'}</span></div><div className="detail-copy"><span className="eyebrow">{place.category?.toUpperCase()}</span><h1>{place.name}</h1><div className="detail-stats"><span>★ {place.rating || 'New'}</span><span>📍 {place.distanceKm ?? '—'} km</span><span>💸 {place.estimatedCost || 'Varies'}</span></div><p>{place.description}</p><div className="detail-actions"><button className="button primary" onClick={getRoute}>{routeLoading ? 'Finding route…' : '🗺️ View route'}</button><ShareButton place={place} /></div></div></section>
    <section className="detail-grid"><div className="info-card"><h2>Before you go</h2><div className="info-row"><span>🕐 Best time</span><strong>{place.bestTime || 'Check locally'}</strong></div><div className="info-row"><span>🎯 Good for</span><strong>{(place.tags || []).filter(Boolean).join(' · ') || 'Exploring'}</strong></div><div className="info-row"><span>🌐 Source</span><strong>{place.source || 'nearTrip'}</strong></div></div><div className="route-card"><div className="route-head"><div><span className="eyebrow">ROUTE</span><h2>{route ? `${route.distanceKm} km · ${route.durationMin} min` : 'Ready when you are'}</h2></div></div>{location && <MapView location={location} places={[place]} selected={place} route={route} />}{route?.steps?.length > 0 && <div className="steps">{route.steps.slice(0, 5).map((s, i) => <div key={i}><span>{i + 1}</span>{s.instruction} · {s.distanceM}m</div>)}</div>}</div></section>
  </main></div>;
}
