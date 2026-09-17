import { env } from '../config/env.js';

export async function getRoute({ fromLat, fromLng, toLat, toLng, profile = 'driving' }) {
  const mode = profile === 'walking' ? 'foot' : profile === 'cycling' ? 'bike' : 'car';
  const url = `${env.osrmUrl}/route/v1/${mode}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson&steps=true`;
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Roamly/1.0 (hackathon project)' } });
    if (!response.ok) throw new Error(`OSRM returned ${response.status}`);
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes?.[0]) throw new Error(data.code || 'No route');
    const route = data.routes[0];
    return {
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMin: Math.max(1, Math.round(route.duration / 60)),
      geometry: route.geometry,
      steps: (route.legs?.[0]?.steps || []).slice(0, 12).map((step) => ({
        instruction: step.name ? `${step.maneuver?.type || 'Continue'} on ${step.name}` : `${step.maneuver?.type || 'Continue'}`,
        distanceM: Math.round(step.distance)
      }))
    };
  } catch (error) {
    console.warn('[route] provider failed:', error.message);
    return null;
  }
}
