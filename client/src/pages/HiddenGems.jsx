import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import PlaceCard from '../components/PlaceCard.jsx';
import { api } from '../services/api.js';
import { useLocation } from '../hooks/useLocation.js';

export default function HiddenGems() {
  const { location, detect } = useLocation();
  const [places, setPlaces] = useState([]);
  useEffect(() => { detect(); }, [detect]);
  useEffect(() => { if (location) api.nearby({ lat: location.lat, lng: location.lng, category: 'hidden', radius: 8000 }).then((d) => setPlaces(d.places.filter((p) => p.isHiddenGem || p.category === 'nature'))).catch(() => {}); }, [location]);
  return <div className="app-shell"><Navbar /><main className="container listing-page"><div className="page-heading"><div><span className="eyebrow">OFF THE OBVIOUS PATH</span><h1>Hidden gems.</h1><p>Less obvious places that can turn a normal evening into a story.</p></div></div><div className="place-grid wide">{places.map((p) => <PlaceCard key={p.id} place={p} />)}</div>{!places.length && <div className="empty">Finding hidden gems around you…</div>}</main></div>;
}
