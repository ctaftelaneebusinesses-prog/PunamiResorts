import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { PageHero, Eyebrow, Split } from '../components/ui';
import { DestCard, CtaBand } from '../components/Sections';
import MapConstellation from '../components/MapConstellation';
import { LOCATIONS, AMENITY_LABELS, VID, img } from '../data';

const OFFER_ICONS = [['pool', 'pool', 'Pool'], ['partyHall', 'cake', 'Events'], ['kids', 'kids', 'Kids'], ['spa', 'spa', 'Spa'], ['gym', 'gym', 'Gym'], ['pets', 'pet', 'Pets']];

/* Cinematic split explorer: hover a name, the stage re-themes to that destination. Auto-advances when idle. */
function Explorer({ items }) {
  const [a, setA] = useState(0);
  const [hold, setHold] = useState(false);
  const idx = Math.min(a, items.length - 1);
  const l = items[idx];
  useEffect(() => {
    if (hold) return;
    const t = setTimeout(() => setA(v => (v + 1) % items.length), 5000);
    return () => clearTimeout(t);
  }, [a, hold, items.length]);
  const open = l.hours.open === 0 || (new Date().getHours() >= l.hours.open && new Date().getHours() < l.hours.close);
  return (
    <div className="dx mt-24" style={{ '--p': l.theme.primary, '--a': l.theme.accent }}>
      <div className="dx-stage">
        {items.map((x, i) => <img key={x.id} src={img(x.hero, 1400)} alt="" className={i === idx ? 'on' : ''} />)}
        <div className="dx-tint" />
        <div className="dx-top">
          <span className="dx-chip">{l.brand === 'garena' ? 'G Arena' : 'LE Comfort'} · {l.state}</span>
          <span className={`open-badge ${open ? '' : 'closed'}`}><i />{open ? 'Open now' : 'Closed now'}</span>
        </div>
        <div className="dx-info" key={l.id}>
          <span className="dx-no">{l.no} / 0{LOCATIONS.length}</span>
          <h3 className="dx-name">{l.name}</h3>
          <p className="dx-tag"><em>{l.tagline}.</em> {l.distance}</p>
          <div className="dx-offers">
            {OFFER_ICONS.filter(([k]) => l.amenities[k]).map(([k, ic, t]) => <span key={k}><Icon name={ic} size={16} />{t}</span>)}
            {l.rooms.length > 0 && <span><Icon name="bed" size={16} />{l.stats.rooms} rooms</span>}
          </div>
          <div className="flex gap-8 wrap mt-24">
            <Link to={`/destinations/${l.id}`} className="btn btn-light btn-sm"><span>Explore {l.name.split(' ')[0]}</span><span className="arrow"><Icon name="arrow" /><Icon name="arrow" /></span></Link>
            <Link to={`/booking?loc=${l.id}`} className="btn btn-sm btn-outline btn-plain" style={{ color: '#fff', padding: '10px 20px' }}>Book now</Link>
          </div>
        </div>
      </div>
      <div className="dx-list" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
        {items.map((x, i) => (
          <Link key={x.id} to={`/destinations/${x.id}`} className={`dx-row ${i === idx ? 'on' : ''}`} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} style={{ '--rp': x.theme.primary, '--ra': x.theme.accent }}>
            <span className="dx-row-no">{x.no}</span>
            <span className="dx-row-main">
              <span className="dx-row-name">{x.name}</span>
              <span className="dx-row-sub">{x.brand === 'garena' ? 'G Arena' : 'LE Comfort'} · {x.state}</span>
            </span>
            <span className="dx-row-thumb"><img src={img(x.hero, 200)} alt="" /></span>
            <span className="dx-row-bar"><i key={i === idx && !hold ? `${x.id}-${a}` : 'idle'} className={i === idx && !hold ? 'run' : i === idx ? 'full' : ''} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const FILTERS =[['pool', 'Swimming pool'], ['partyHall', 'Party hall'], ['kids', "Kids' area"], ['spa', 'Spa'], ['pets', 'Pet-friendly'], ['wheelchair', 'Wheelchair access']];

export default function Destinations() {
  const [brand, setBrand] = useState('all');
  const [feat, setFeat] = useState([]);
  const [view, setView] = useState('list');
  const toggle = f => setFeat(s => s.includes(f) ? s.filter(x => x !== f) : [...s, f]);
  const shown = LOCATIONS.filter(l => (brand === 'all' || l.brand === brand) && feat.every(f => l.amenities[f]));

  return (
    <>
      <PageHero title="Find your [[destination]]." eyebrow="8 destinations · 2 states" image="poolAerial" video={VID.wavesAerial} crumbs="Destinations"
        lead="Filter by brand or by the facilities that matter to you, then explore each destination in detail." />

      <section className="section">
        <div className="container">
          <div className="finder-bar">
            <div className="filters">
              {[['all', 'All'], ['garena', 'G Arena'], ['lecomfort', 'LE Comfort']].map(([k, t]) => (
                <button key={k} className={`chip ${brand === k ? 'on' : ''}`} onClick={() => setBrand(k)}>{t}</button>
              ))}
              <span style={{ width: 1, background: 'var(--line)', margin: '0 6px' }} />
              {FILTERS.map(([k, t]) => (
                <button key={k} className={`chip ${feat.includes(k) ? 'on' : ''}`} onClick={() => toggle(k)}>
                  <Icon name={AMENITY_LABELS[k][1]} />{t}
                </button>
              ))}
            </div>
            <div className="view-toggle">
              <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>Explore</button>
              <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>Grid</button>
            </div>
          </div>
          <div className="muted mt-24" style={{ fontSize: 14 }}>Showing {shown.length} of {LOCATIONS.length} destinations</div>

          {view === 'list' ? (
            shown.length > 0 && <Explorer items={shown} />
          ) : (
            <div className="mt-24" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
              {shown.map(l => <DestCard key={l.id} l={l} />)}
            </div>
          )}
          {!shown.length && <div className="empty-state" style={{ display: 'block' }}>No destinations match these filters. Try removing one.</div>}
        </div>
      </section>

      <section className="section bg-forest"><div className="container"><MapConstellation /></div></section>

      <section className="section">
        <div className="container">
          <Eyebrow>Compare at a glance</Eyebrow>
          <Split text="Facilities by [[destination]]." className="display-m mt-24" />
          <div className="table-wrap mt-48 rv">
            <table className="req" style={{ minWidth: 900 }}>
              <thead><tr><th>Destination</th>{Object.values(AMENITY_LABELS).map(([t]) => <th key={t}>{t}</th>)}</tr></thead>
              <tbody>
                {LOCATIONS.map(l => (
                  <tr key={l.id}>
                    <td><Link to={`/destinations/${l.id}`} style={{ fontFamily: 'var(--f-display)', fontSize: 20 }}>{l.name}</Link></td>
                    {Object.keys(AMENITY_LABELS).map(k => <td key={k}>{l.amenities[k] ? <Icon name="check" size={18} style={{ color: 'var(--forest)' }} /> : <span className="muted">—</span>}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
