import { Link } from 'react-router-dom';

const categoryMeta = {
  nature: { icon: '🌿', label: 'Nature' },
  food: { icon: '🍜', label: 'Food' },
  cafe: { icon: '☕', label: 'Café' },
  adventure: { icon: '🧗', label: 'Adventure' },
  attractions: { icon: '🏛️', label: 'Attraction' },
  other: { icon: '📍', label: 'Nearby place' }
};

export default function PlaceCard({ place, onSelect }) {
  const meta = categoryMeta[place.category] || categoryMeta.other;
  const tags = [...new Set([...(place.tags || []), place.category])].filter(Boolean).slice(0, 3);

  return (
    <article className="place-card" onClick={() => { sessionStorage.setItem(`neartrip:place:${place.id}`, JSON.stringify(place)); onSelect?.(place); }}>
      <div className={`place-image place-image-${place.category || 'other'}`}>
        <div className="place-image-pattern" />
        <span className="place-category-icon">{meta.icon}</span>
        {place.isHiddenGem && <span className="badge">✨ Hidden Gem</span>}
        <span className="distance-badge">{place.distanceKm ?? '—'} km</span>
      </div>
      <div className="place-body">
        <div className="place-card-topline"><span className="category-label">{meta.label}</span><span className="rating">{place.rating ? `★ ${place.rating}` : 'New find'}</span></div>
        <h3>{place.name}</h3>
        <p className="place-description">{place.description}</p>
        {tags.length > 0 && <div className="place-tags">{tags.map((tag) => <span key={tag}>{String(tag).replaceAll('_', ' ')}</span>)}</div>}
        <div className="place-card-footer">
          <Link className="text-link" to={`/places/${encodeURIComponent(place.id)}`} state={{ place }}>View details <span>→</span></Link>
          <span className="source-pill">{place.source?.includes('demo') ? 'Demo' : 'Map data'}</span>
        </div>
      </div>
    </article>
  );
}
