import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ShareButton from '../components/ShareButton.jsx';
import { api } from '../services/api.js';

export default function SharedPlace() {
  const { slug } = useParams();
  const [place, setPlace] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.getShared(slug).then((d) => setPlace(d.place)).catch((e) => setError(e.message)); }, [slug]);
  return <div className="app-shell"><Navbar /><main className="container shared-page">{place ? <section className="shared-card"><span className="eyebrow">A FRIEND SHARED THIS WITH YOU</span><h1>{place.name}</h1><p className="shared-rating">★ {place.rating || 'New'} · {place.distanceKm || '—'} km away</p><p>{place.description}</p><div className="shared-meta"><span>💸 {place.estimatedCost || 'Varies'}</span><span>🕐 {place.bestTime || 'Check locally'}</span></div><div className="shared-actions"><Link to={`/places/${encodeURIComponent(place.id)}`} state={{ place }} className="button primary">View place</Link><ShareButton place={place} /></div></section> : <section className="empty-page"><h1>Shared place not found</h1><p>{error || 'This link may have expired or was created without persistence.'}</p><Link to="/explore" className="button primary">Explore nearby</Link></section>}</main></div>;
}
