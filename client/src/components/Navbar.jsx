import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="nav-shell">
      <div className="nav">
        <Link to="/" className="brand" aria-label="Roamly home">
          <span className="brand-mark">✦</span>
          <span className="brand-name">roamly</span>
          <span className="brand-badge">nearby</span>
        </Link>
        <nav aria-label="Primary navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/hidden-gems">Hidden Gems</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <Link to="/explore" className="nav-cta">Explore now <span>↗</span></Link>
      </div>
    </header>
  );
}
