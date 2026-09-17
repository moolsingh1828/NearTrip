import { env } from '../config/env.js';

const TAG_FILTERS = {
  all: '[tourism][name];[leisure][name];[amenity][name];[shop][name]',
  hidden: '[tourism][name];[leisure][name];[amenity][name]',
  nature: '[leisure=park][name];[natural][name];[tourism=viewpoint][name];[tourism=picnic_site][name]',
  food: '[amenity=restaurant][name];[amenity=cafe][name];[amenity=fast_food][name]',
  adventure: '[sport][name];[tourism=theme_park][name];[tourism=attraction][name]',
  cafe: '[amenity=cafe][name]',
  attractions: '[tourism=attraction][name];[tourism=museum][name];[tourism=gallery][name]'
};

const FALLBACK_PLACES = [
  { id: 'demo-upper-lake', name: 'Upper Lake', category: 'nature', tags: ['lake', 'sunset', 'photography'], rating: 4.6, lat: 23.2397, lng: 77.3416, description: 'A scenic waterfront area that works well for an easy evening outing and sunset photos.', isHiddenGem: false, estimatedCost: 'Free', bestTime: '4:30 PM – 7:00 PM' },
  { id: 'demo-van-vihar', name: 'Van Vihar National Park', category: 'nature', tags: ['nature', 'wildlife', 'walk'], rating: 4.5, lat: 23.2394, lng: 77.3375, description: 'A large green space beside Upper Lake with walking routes and wildlife viewing.', isHiddenGem: false, estimatedCost: 'Low', bestTime: 'Morning or late afternoon' },
  { id: 'demo-shahpura', name: 'Shahpura Lake', category: 'nature', tags: ['lake', 'walk', 'sunset'], rating: 4.4, lat: 23.2065, lng: 77.3917, description: 'A relaxed lake-side spot suitable for a short outing and evening walk.', isHiddenGem: true, estimatedCost: 'Free', bestTime: '5:00 PM – 7:30 PM' },
  { id: 'demo-bhopal-old-city', name: 'Bhopal Old City', category: 'attractions', tags: ['heritage', 'food', 'photography'], rating: 4.5, lat: 23.2599, lng: 77.4126, description: 'A heritage-heavy part of the city with architecture, local food and photography opportunities.', isHiddenGem: true, estimatedCost: 'Varies', bestTime: 'Late afternoon / evening' }
];

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function classify(tags = {}) {
  if (tags.amenity === 'cafe') return 'cafe';
  if (['restaurant', 'fast_food', 'food_court'].includes(tags.amenity)) return 'food';
  if (['park', 'nature_reserve'].includes(tags.leisure) || tags.natural || tags.tourism === 'viewpoint' || tags.tourism === 'picnic_site') return 'nature';
  if (tags.sport || tags.tourism === 'theme_park') return 'adventure';
  if (['attraction', 'museum', 'gallery'].includes(tags.tourism)) return 'attractions';
  return 'other';
}

function normalizeElement(el, lat, lng) {
  const tags = el.tags || {};
  const pLat = el.lat ?? el.center?.lat;
  const pLng = el.lon ?? el.center?.lon;
  if (!pLat || !pLng || !tags.name) return null;
  const category = classify(tags);
  const distanceKm = haversineKm(lat, lng, pLat, pLng);
  const hiddenSignals = [tags.tourism === 'viewpoint', tags.tourism === 'picnic_site', tags.leisure === 'nature_reserve', tags.natural, tags.information === 'guidepost'].filter(Boolean).length;
  return {
    id: `osm-${el.type}-${el.id}`,
    name: tags.name,
    category,
    tags: [tags.tourism, tags.leisure, tags.natural, tags.amenity, tags.sport].filter(Boolean),
    rating: null,
    lat: pLat,
    lng: pLng,
    distanceKm: Number(distanceKm.toFixed(1)),
    description: tags.description || `Explore ${tags.name} and see whether it fits your plan.`,
    isHiddenGem: hiddenSignals > 0,
    estimatedCost: tags.fee === 'yes' ? 'Paid' : tags.fee === 'no' ? 'Free' : 'Varies',
    bestTime: tags.opening_hours || 'Check opening hours before visiting',
    website: tags.website || null,
    source: 'OpenStreetMap'
  };
}

export async function findNearbyPlaces({ lat, lng, radius = 6000, category = 'all' }) {
  const safeRadius = Math.min(Math.max(Number(radius) || 6000, 1000), 10000);
  const filter = TAG_FILTERS[category] || TAG_FILTERS.all;
  const clauses = filter.split(';').map((f) => `nwr(around:${safeRadius},${lat},${lng})${f};`);
  const query = `[out:json][timeout:20];(${clauses.join('')});out center tags;`;

  try {
    const response = await fetch(env.overpassUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Roamly/1.0 (hackathon project; contact: team-roamly@example.com)'
      },
      body: new URLSearchParams({ data: query })
    });
    if (!response.ok) throw new Error(`Overpass returned ${response.status}`);
    const data = await response.json();
    const places = data.elements.map((el) => normalizeElement(el, lat, lng)).filter(Boolean);
    const unique = [...new Map(places.map((p) => [p.id, p])).values()];
    return unique.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)).slice(0, 80);
  } catch (error) {
    console.warn('[places] external provider failed:', error.message);
    return FALLBACK_PLACES.map((p) => ({ ...p, distanceKm: Number(haversineKm(lat, lng, p.lat, p.lng).toFixed(1)), source: 'Roamly demo fallback' }))
      .filter((p) => category === 'all' || p.category === category || (category === 'hidden' && p.isHiddenGem));
  }
}

export function getFallbackPlace(id) {
  return FALLBACK_PLACES.find((p) => p.id === id) || null;
}
