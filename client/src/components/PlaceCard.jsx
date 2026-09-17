import { Link } from 'react-router-dom';

export default function PlaceCard({ place, onSelect }) {
  const image = `https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80`;
  return (
    <article className="place-card" onClick={() => { sessionStorage.setItem(`roamly:place:${place.id}`, JSON.stringify(place)); onSelect?.(place); }}>
      <div className="place-image" style={{ backgroundImage: `url(${image})` }}>
        {place.isHiddenGem && <span className="badge">✨ Hidden Gem</span>}
      </div>
      <div className="place-body">
        <div className="row-between"><h3>{place.name}</h3><span className="rating">{place.rating ? `★ ${place.rating}` : 'New'}</span></div>
        <p className="muted">{place.distanceKm ?? '—'} km away · {place.category}</p>
        <p>{place.description}</p>
        <Link className="text-link" to={`/places/${encodeURIComponent(place.id)}`} state={{ place }}>Explore →</Link>
      </div>
    </article>
  );
}
