import { interpretQuery } from '../services/ai.service.js';
import { findNearbyPlaces } from '../services/places.service.js';

function score(place, intent) {
  const text = `${place.name} ${(place.tags || []).join(' ')} ${place.description || ''}`.toLowerCase();
  let value = 0;
  for (const keyword of intent.keywords || []) if (text.includes(keyword)) value += 8;
  for (const category of intent.categories || []) if (place.category === category) value += 15;
  if (place.isHiddenGem) value += 5;
  value += Math.max(0, 10 - (place.distanceKm || 10));
  if (typeof place.rating === 'number') value += place.rating * 3;
  return value;
}

export async function recommend(req, res, next) {
  try {
    const { query = '', lat, lng } = req.body;
    const latitude = Number(lat);
    const longitude = Number(lng);
    if (!query.trim()) return res.status(400).json({ message: 'Query is required.' });
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return res.status(400).json({ message: 'Valid location is required.' });
    const intent = await interpretQuery(query);
    const places = await findNearbyPlaces({ lat: latitude, lng: longitude, radius: 8000, category: 'all' });
    const ranked = places.map((place) => ({ ...place, recommendationScore: Number(score(place, intent).toFixed(1)) })).sort((a, b) => b.recommendationScore - a.recommendationScore).slice(0, 8);
    res.json({ intent, places: ranked });
  } catch (error) { next(error); }
}
