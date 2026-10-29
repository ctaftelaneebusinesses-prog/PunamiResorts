import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import './offers.css';
import './footer.css';
import './explorer.css';
import './footer-lite.css';
import './mobile.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Brand from './pages/Brand';
import Destinations from './pages/Destinations';
import Location from './pages/Location';
import Dining from './pages/Dining';
import Celebrations from './pages/Celebrations';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Story from './pages/Story';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Admin from './pages/Admin';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/g-arena" element={<Brand id="garena" />} />
          <Route path="/le-comfort" element={<Brand id="lecomfort" />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<Location />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/celebrations" element={<Celebrations />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/our-story" element={<Story />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
