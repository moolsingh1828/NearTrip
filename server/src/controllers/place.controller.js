import { findNearbyPlaces, getFallbackPlace } from '../services/places.service.js';

export async function nearby(req, res, next) {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return res.status(400).json({ message: 'Valid lat and lng are required.' });
    const places = await findNearbyPlaces({ lat, lng, radius: req.query.radius, category: req.query.category || 'all' });
    res.json({ places, count: places.length });
  } catch (error) { next(error); }
}

export async function details(req, res, next) {
  try {
    const place = getFallbackPlace(req.params.id);
    if (place) return res.json({ place });
    return res.status(404).json({ message: 'Place details are not stored by Roamly. Open it from a discovery result.' });
  } catch (error) { next(error); }
}
