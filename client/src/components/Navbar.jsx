import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="nav">
      <Link to="/" className="brand"><span className="brand-mark">R</span> roamly</Link>
      <nav>
        <NavLink to="/explore">Explore</NavLink>
        <NavLink to="/hidden-gems">Hidden Gems</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}
