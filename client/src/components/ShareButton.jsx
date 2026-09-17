import { useState } from 'react';
import { api } from '../services/api.js';

export default function ShareButton({ place }) {
  const [status, setStatus] = useState('');
  async function share() {
    try {
      setStatus('Preparing…');
      const { slug } = await api.share(place);
      const url = `${window.location.origin}/shared/${slug}`;
      if (navigator.share) await navigator.share({ title: place.name, text: `Check out ${place.name} on Roamly`, url });
      else { await navigator.clipboard.writeText(url); setStatus('Link copied'); }
      setStatus('Shared');
    } catch (e) { setStatus(e.message); }
  }
  return <button className="button secondary" onClick={share}>↗ Share {status && <small>{status}</small>}</button>;
}
