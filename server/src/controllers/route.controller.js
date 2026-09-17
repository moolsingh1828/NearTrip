import { getRoute } from '../services/route.service.js';

export async function route(req, res, next) {
  try {
    const { fromLat, fromLng, toLat, toLng, profile = 'driving' } = req.query;
    const values = [fromLat, fromLng, toLat, toLng].map(Number);
    if (values.some((v) => !Number.isFinite(v))) return res.status(400).json({ message: 'Valid origin and destination coordinates are required.' });
    const result = await getRoute({ fromLat: values[0], fromLng: values[1], toLat: values[2], toLng: values[3], profile });
    if (!result) return res.status(502).json({ message: 'Routing service is temporarily unavailable.' });
    res.json(result);
  } catch (error) { next(error); }
}
