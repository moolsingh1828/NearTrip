import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Explore from './pages/Explore.jsx';
import PlaceDetails from './pages/PlaceDetails.jsx';
import HiddenGems from './pages/HiddenGems.jsx';
import SharedPlace from './pages/SharedPlace.jsx';
import About from './pages/About.jsx';
import './styles.css';

export default function App() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/explore" element={<Explore />} />
    <Route path="/places/:id" element={<PlaceDetails />} />
    <Route path="/hidden-gems" element={<HiddenGems />} />
    <Route path="/shared/:slug" element={<SharedPlace />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<Home />} />
  </Routes></BrowserRouter>;
}
