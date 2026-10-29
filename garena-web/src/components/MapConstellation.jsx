import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { LOCATIONS, img } from '../data';

// Simple equirectangular projection of the Telangana / Andhra Pradesh region
const proj = ([lat, lon]) => [40 + (lon - 77.5) * 120, 40 + (19 - lat) * 76.5];
const LABEL_SIDE = { kuppam: 'l', palamaneru: 'l', nagari: 'b', dvsatram: 'r', mypadu: 'r', kamareddy: 'r', suryapet: 'r', revupolavaram: 'l' };

export default function MapConstellation() {
  const [active, setActive] = useState('suryapet');
  const loc = LOCATIONS.find(l => l.id === active);
  const pts = LOCATIONS.map(l => ({ ...l, p: proj(l.coords) }));
  const route = ['kamareddy', 'suryapet', 'revupolavaram', 'mypadu', 'dvsatram', 'nagari', 'palamaneru', 'kuppam']
    .map(id => pts.find(p => p.id === id).p);

  return (
    <div className="map-wrap on-dark">
      <div>
        <span className="eyebrow light">The map</span>
        <h2 className="display-m mt-24 split-words in" style={{ maxWidth: '12ch' }}>Two states. <em>Eight</em> escapes.</h2>
        <p className="lead mt-24 rv">From the farmlands of Telangana to the quiet coves of the Bay of Bengal — every destination is within a short drive of a major city.</p>
        <div className="map-card mt-32">
          <div className="frame"><img key={loc.id} src={img(loc.hero, 400)} alt="" /></div>
          <div>
            <div className="label" style={{ color: loc.brand === 'garena' ? 'var(--leaf)' : '#E0A877' }}>{loc.brand === 'garena' ? 'G Arena' : 'LE Comfort'} · {loc.state}</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 34, lineHeight: 1.05, margin: '6px 0' }}>{loc.name}</div>
            <div style={{ fontSize: 13.5, opacity: .7 }}>{loc.distance}</div>
            <Link to={`/destinations/${loc.id}`} className="link-line mt-16" style={{ color: 'var(--leaf-soft)' }}>Explore {loc.name} <Icon name="arrow" /></Link>
          </div>
        </div>
        <ul className="map-list">
          {LOCATIONS.map(l => (
            <li key={l.id}><a href="#" className={active === l.id ? 'active' : ''} onMouseEnter={() => setActive(l.id)} onClick={e => { e.preventDefault(); setActive(l.id); }}>
              <span>{l.no} · {l.name}</span><span style={{ opacity: .5 }}>{l.brand === 'garena' ? 'GA' : 'LC'}</span>
            </a></li>
          ))}
        </ul>
      </div>
      <div>
        <svg className="map-svg" viewBox="0 0 800 600" role="img" aria-label="Map of destinations">
          {Array.from({ length: 9 }, (_, i) => <line key={'v' + i} className="grid-line" x1={i * 100} y1="0" x2={i * 100} y2="600" />)}
          {Array.from({ length: 7 }, (_, i) => <line key={'h' + i} className="grid-line" x1="0" y1={i * 100} x2="800" y2={i * 100} />)}
          <text className="state-label" x="70" y="290">Telangana</text>
          <text className="state-label" x="110" y="380">Andhra Pradesh</text>
          <path className="coast" d="M790,95 C740,130 705,165 660,200 S565,255 520,290 S440,322 412,350 S385,405 388,445 S380,525 372,600" />
          <path className="coast" d="M790,105 C744,140 712,174 668,208 S572,264 528,298 S448,330 420,358 S394,410 396,448 S388,528 380,600" style={{ opacity: .4 }} />
          <text className="sea-label" x="520" y="470">BAY OF BENGAL</text>
          <polyline className="route" points={route.map(p => p.join(',')).join(' ')} />
          {pts.map(l => {
            const [x, y] = l.p; const side = LABEL_SIDE[l.id];
            const tx = side === 'l' ? x - 16 : side === 'b' ? x : x + 16;
            const ty = side === 'b' ? y + 30 : y + 4;
            const anchor = side === 'l' ? 'end' : side === 'b' ? 'middle' : 'start';
            return (
              <g key={l.id} className={`pin ${l.brand === 'lecomfort' ? 'lec' : ''} ${active === l.id ? 'active' : ''}`}
                onMouseEnter={() => setActive(l.id)} onClick={() => setActive(l.id)}>
                <circle className="halo" cx={x} cy={y} r="14" />
                <circle className="core" cx={x} cy={y} r="6" />
                <text x={tx} y={ty} textAnchor={anchor}>{l.name}</text>
                <text className="sub" x={tx} y={ty + 15} textAnchor={anchor}>{l.no}</text>
              </g>
            );
          })}
        </svg>
        <div className="map-legend">
          <span><i /> G Arena — leisure & celebrations</span>
          <span><i className="lec" /> LE Comfort — boutique stays</span>
        </div>
      </div>
    </div>
  );
}
