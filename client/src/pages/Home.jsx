import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  return <div className="app-shell"><Navbar /><main>
    <section className="hero container">
      <div className="hero-copy">
        <span className="eyebrow">DISCOVER • SHARE • GO</span>
        <h1>Stop asking<br /><em>“where should we go?”</em></h1>
        <p>Find interesting places around you, uncover hidden gems, check the route, and send the idea straight to your friends.</p>
        <div className="hero-actions"><Link to="/explore" className="button primary">Explore nearby <span>→</span></Link><Link to="/hidden-gems" className="button ghost">Find hidden gems</Link></div>
        <div className="trust-row"><span>📍 Location-aware</span><span>🗺️ Route-ready</span><span>↗ Easy sharing</span></div>
      </div>
      <div className="hero-visual"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-card hero-main"><span className="mini-label">NEAR YOU</span><h3>Hidden Lake View</h3><p>🌅 Sunset · 📸 Photos · 🌿 Quiet</p><div className="hero-meta"><strong>4.7 ★</strong><span>4.2 km</span><span>18 min</span></div></div><div className="floating-card fc-one">✨ Hidden Gem<br /><strong>Worth sharing</strong></div><div className="floating-card fc-two">🚗 18 min<br /><strong>Easy route</strong></div></div>
    </section>
    <section className="container feature-strip"><div><span>01</span><h3>Discover nearby</h3><p>Use your location to find places that are actually close enough to visit.</p></div><div><span>02</span><h3>Know before you go</h3><p>See distance, ratings, tags, cost hints, best time and route details.</p></div><div><span>03</span><h3>Share the idea</h3><p>Send a clean place link to your friends. No group setup. No polls.</p></div></section>
  </main></div>;
}
