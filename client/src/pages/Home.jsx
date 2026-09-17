import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function Home() {
  return <div className="app-shell"><Navbar /><main>
    <section className="hero container">
      <div className="hero-copy">
        <div className="hero-badge"><span className="live-dot" /> LOCAL DISCOVERY, SIMPLIFIED</div>
        <h1>Find your next <em>good plan</em> nearby.</h1>
        <p>Open nearTrip, share your location, and instantly discover nearby places worth visiting — from quiet lakes and cafés to attractions and hidden gems.</p>
        <div className="hero-actions">
          <Link to="/explore" className="button primary">Explore nearby <span>→</span></Link>
          <Link to="/hidden-gems" className="button ghost">Find hidden gems</Link>
        </div>
        <div className="hero-proof">
          <div><strong>7 km</strong><span>smart discovery radius</span></div>
          <div><strong>Live</strong><span>location-aware results</span></div>
          <div><strong>0</strong><span>sign-ups required</span></div>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="visual-glow" />
        <div className="mini-map-grid" />
        <div className="map-road road-a" />
        <div className="map-road road-b" />
        <span className="visual-pin pin-a">●</span>
        <span className="visual-pin pin-b">●</span>
        <span className="visual-pin pin-c">●</span>
        <div className="hero-card hero-main">
          <div className="hero-card-top"><span className="mini-label">CURATED NEAR YOU</span><span className="mini-distance">4.2 km</span></div>
          <div className="hero-place-icon">🌅</div>
          <h3>Hidden Lake View</h3>
          <p>Quiet sunset spot with an easy route and plenty of space to unwind.</p>
          <div className="place-tags hero-tags"><span>Sunset</span><span>Photos</span><span>Quiet</span></div>
          <div className="hero-meta"><strong>★ 4.7</strong><span>18 min drive</span><span>Free</span></div>
        </div>
        <div className="floating-card fc-one"><span>✨</span><div><small>DISCOVERY</small><strong>Hidden gem</strong></div></div>
        <div className="floating-card fc-two"><span>↗</span><div><small>ROUTE READY</small><strong>18 min away</strong></div></div>
      </div>
    </section>

    <section className="container feature-strip">
      <div><span className="feature-icon">⌖</span><span className="feature-number">01</span><h3>Discover nearby</h3><p>Use your live location to find places that are genuinely close enough to visit.</p></div>
      <div><span className="feature-icon">◎</span><span className="feature-number">02</span><h3>Know before you go</h3><p>See distance, category, cost hints, best time and route details in one place.</p></div>
      <div><span className="feature-icon">↗</span><span className="feature-number">03</span><h3>Share the plan</h3><p>Send a clean place link to your friends without creating groups or accounts.</p></div>
    </section>
  </main></div>;
}
