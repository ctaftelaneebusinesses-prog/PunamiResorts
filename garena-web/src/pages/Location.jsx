import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Btn, Eyebrow, Split, BgVideo } from '../components/ui';
import { DestCard } from '../components/Sections';
import OfferShowcase from '../components/OfferShowcase';
import { LOCATIONS, BRANDS, AMENITY_LABELS, locById, img, fmtINR } from '../data';

function isOpen(h) {
  if (h.open === 0 && h.close === 24) return true;
  const n = new Date().getHours();
  return n >= h.open && n < h.close;
}

const COASTAL = ['mypadu', 'revupolavaram'];
const pickImg = (l, keys, fallback) => l.gallery.find(g => keys.includes(g)) || fallback;

/* Turns a location's data into the list of things a guest can actually book or use there */
function offeringsFor(l) {
  const a = l.amenities, coastal = COASTAL.includes(l.id), list = [];
  const minRoom = l.rooms.length ? Math.min(...l.rooms.map(r => r.price)) : 0;
  if (a.pool) {
    const [time, price] = String(a.pool).split('·').map(s => s.trim());
    list.push({ key: 'pool', icon: 'pool', title: 'Swimming Pool', short: price || 'Open daily', type: 'day',
      img: pickImg(l, ['poolPalms', 'poolAerial', 'poolGarden', 'poolWhite', 'poolLodge', 'palmsInfinity', 'infinityDeck', 'infinitySea', 'poolNight', 'cabanas'], coastal ? 'infinitySea' : 'poolAerial'),
      desc: 'Clean, lifeguarded pool with changing rooms, lockers and shaded seating. Swimwear is mandatory.',
      facts: [['Timings', time], ['Charges', price || 'Included'], ['Lifeguard', 'On duty']] });
  }
  list.push({ key: 'dining', icon: 'utensils', title: 'Restaurant & Dining', short: l.dining.price.replace(' per plate', ' / plate'), type: 'table',
    img: pickImg(l, ['thali', 'thaliTop', 'biryani', 'curry', 'fishCurry', 'terraceSea', 'fineDining', 'restaurant', 'cafe', 'friendsDining', 'restWindow'], 'thaliTop'),
    desc: `${l.stats.tables} tables seating ${l.stats.seats} guests. Reserve a table for lunch, dinner or a family get-together.`,
    facts: [['Cuisine', l.dining.cuisine], ['Service', l.dining.style], ['Price', l.dining.price], ['Tables', `${l.stats.tables} tables · ${l.stats.seats} seats`]] });
  if (l.rooms.length) list.push({ key: 'rooms', icon: 'bed', title: 'Rooms & Stays', short: `From ${fmtINR(minRoom)} / night`, type: 'room',
    img: l.rooms[0].img, desc: `${l.stats.rooms} rooms across ${l.rooms.length} categories, with breakfast, Wi-Fi and housekeeping included.`,
    facts: l.rooms.map(r => [r.type, `${fmtINR(r.price)} / night`]), rooms: l.rooms });
  if (a.partyHall) list.push({ key: 'hall', icon: 'cake', title: 'Party Hall & Events', short: a.partyHall, type: 'event',
    img: pickImg(l, ['banquetHall', 'banquet', 'fairyLights', 'dinnerDecor', 'balloons'], 'fairyLights'),
    desc: 'Birthdays, anniversaries, engagements and corporate events, with decoration, catering and DJ available.',
    facts: [['Capacity', a.partyHall], ['Décor', 'Theme & floral'], ['Catering', 'Veg & Non-Veg menus'], ['Music', 'DJ & sound']] });
  if (a.kids) list.push({ key: 'kids', icon: 'kids', title: "Kids' Play Area", short: 'Safe & supervised', type: 'day',
    img: 'playground', desc: 'Slides, swings and a soft-play zone, with a separate kids splash area at selected pools.',
    facts: [['Age group', '2 – 12 years'], ['Supervision', 'Staff on site'], ['Charges', 'Free for guests']] });
  if (a.games) list.push({ key: 'games', icon: 'games', title: 'Games & Activities', short: typeof a.games === 'string' ? a.games.split(',')[0] : 'Indoor & outdoor', type: 'day',
    img: coastal ? 'beachHut' : 'kid', desc: 'Activities for groups and families. Equipment is provided at the activity desk.',
    facts: [['Available', typeof a.games === 'string' ? a.games : 'Indoor & outdoor games'], ['Equipment', 'Provided']] });
  if (a.spa) list.push({ key: 'spa', icon: 'spa', title: 'Spa & Wellness', short: typeof a.spa === 'string' ? a.spa : 'Massages', type: 'day',
    img: pickImg(l, ['massage', 'spaStill', 'stones'], 'massage'), desc: 'Relaxing therapies by trained therapists. Advance booking recommended.',
    facts: [['Therapies', typeof a.spa === 'string' ? a.spa : 'Massage'], ['Booking', 'By appointment']] });
  if (a.gym) list.push({ key: 'gym', icon: 'gym', title: 'Fitness Centre', short: 'For stay guests', type: 'room',
    img: 'gym', desc: 'Cardio and strength equipment, open early morning to late evening.',
    facts: [['Timings', '6 AM – 10 PM'], ['Access', 'Free for stay guests']] });
  return list;
}

function OfferModal({ o, l, brand, onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className={`offer-modal ${o ? 'open' : ''}`} onClick={onClose}>
      {o && (
        <div className="offer-sheet" onClick={e => e.stopPropagation()}>
          <div className="offer-media">
            <img src={img(o.img, 1200)} alt={o.title} />
            <button className="icon-btn offer-close" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
            <span className="offer-badge"><Icon name={o.icon} size={18} />{l.name}</span>
          </div>
          <div className="offer-body">
            <h3 className="display-s">{o.title}</h3>
            <p className="muted" style={{ margin: '10px 0 0' }}>{o.desc}</p>
            <dl className="offer-facts">{o.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <div className="offer-actions">
              <Btn to={`/booking?loc=${l.id}&type=${o.type}`}>Book this</Btn>
              <a className="btn btn-outline btn-plain" href={`tel:${l.phone}`}><Icon name="phone" size={16} /> Call</a>
              <a className="btn btn-plain" style={{ '--bg': '#25D366' }} href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to know about ${o.title} at ${l.name}.`)}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={16} /> WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Location() {
  const { id } = useParams();
  const l = locById(id) || LOCATIONS[0];
  const brand = BRANDS[l.brand];
  const open = isOpen(l.hours);
  const [lb, setLb] = useState(null);
  const [offer, setOffer] = useState(null);
  const theme = { '--primary': l.theme.primary, '--accent': l.theme.accent, '--soft': l.theme.soft };
  const siblings = LOCATIONS.filter(x => x.brand === l.brand && x.id !== l.id);
  const offers = offeringsFor(l);

  return (
    <div style={theme} key={l.id}>
      {/* HERO */}
      <section className="page-hero" style={{ minHeight: '86svh' }}>
        <div className="hero-media"><BgVideo src={l.video} poster={img(l.hero, 1800)} /></div>
        <div className="container hero-inner" style={{ paddingBottom: 110 }}>
          <div className="loc-switch rv">
            {LOCATIONS.map(x => <Link key={x.id} to={`/destinations/${x.id}`} className={x.id === l.id ? 'active' : ''}>{x.name}</Link>)}
          </div>
          <div className="flex items-center gap-12 wrap mt-48 rv">
            <span className={`open-badge ${open ? '' : 'closed'}`}><i />{open ? 'Open now' : 'Closed now'} · {l.hours.label.split('·')[0]}</span>
            <span className="pill">{brand.name} · {l.state}</span>
          </div>
          <h1 className="display-xl mt-24 split-words on-dark" style={{ maxWidth: '12ch' }}>
            {l.name.split(' ').map((w, i) => <span className="w" key={i}><span style={{ '--i': i }}>{w}&nbsp;</span></span>)}
          </h1>
          <p className="lead rv mt-16" style={{ color: 'rgba(255,255,255,.88)' }}><em style={{ fontFamily: 'var(--f-display)', fontSize: '1.4em' }}>{l.tagline}.</em> {l.distance}</p>
          {/* Offer shortcuts right in the hero */}
          <div className="hero-offers rv">
            {offers.map(o => (
              <button key={o.key} onClick={() => setOffer(o)}><Icon name={o.icon} size={18} />{o.title.split(' &')[0]}</button>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <div className="container">
        <div className="quick-facts rv">
          <div><div className="label">Timings</div><div className="v">{l.hours.open === 0 ? '24×7' : `${l.hours.open} AM – ${l.hours.close - 12} PM`}<small>{l.hours.label.split('·')[1] || 'Front desk'}</small></div></div>
          <div><div className="label">Dining</div><div className="v">{l.stats.tables} tables<small>{l.stats.seats} seats</small></div></div>
          <div><div className="label">Rooms</div><div className="v">{l.stats.rooms}<small>{l.rooms.length} categories</small></div></div>
          <div><div className="label">Booking slot</div><div className="v">{l.stats.slot}<small>{l.booking.minmax}</small></div></div>
          <div><div className="label">Call us</div><div className="v" style={{ fontSize: 24 }}><a href={`tel:${l.phone}`}>{l.phone}</a><small>Reservations desk</small></div></div>
        </div>
      </div>

      {/* WHAT'S AVAILABLE */}
      <OfferShowcase l={l} offers={offers} open={setOffer}>
        {/* Compact availability strip for everything else */}
        <div className="facility-strip rv">
          {Object.entries(AMENITY_LABELS).map(([k, [label]]) => (
            <span key={k} className={l.amenities[k] ? 'yes' : 'no'}><Icon name={l.amenities[k] ? 'check' : 'close'} size={14} />{label}</span>
          ))}
        </div>
      </OfferShowcase>

      {/* GALLERY */}
      <section className="section-sm bg-ivory">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 32 }}>
            <div><Eyebrow>Gallery</Eyebrow><Split text={`Inside ${l.name}`} className="display-s" /></div>
            <Btn to="/gallery" variant="outline" size="sm">Full gallery</Btn>
          </div>
          <div className="loc-strip">
            {l.gallery.map((g, i) => (
              <div key={g + i} className="frame" onClick={() => setLb(g)} data-cursor="View">
                <img src={img(g, 700)} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT INFO + MAP */}
      <section className="section">
        <div className="container book-grid">
          <div>
            <Eyebrow>Plan your visit</Eyebrow>
            <Split text="Good to [[know]]." className="display-m mt-24" />
            <div className="policy-list mt-32">
              <div><span className="label">Hours</span><span className="v">{l.hours.label}</span></div>
              <div><span className="label">Book ahead</span><span className="v">{l.booking.advance}</span></div>
              <div><span className="label">Peak days</span><span className="v">{l.booking.peak}</span></div>
              <div><span className="label">Cancellation</span><span className="v">{l.booking.cancel}</span></div>
            </div>
            <div className="frame mt-32" style={{ height: 340 }}>
              <iframe className="map-embed" title={`Map of ${l.name}`} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(l.name + ', ' + l.state)}&z=11&output=embed`} />
            </div>
          </div>
          <aside>
            <div className="sticky-book">
              <span className="label muted">Reserve at</span>
              <h3 className="mt-8">{l.name}</h3>
              <div className="notice mt-24"><Icon name="shield" /><span>No online payment. Send a request and we'll call to confirm. Pay at the property.</span></div>
              <div style={{ display: 'grid', gap: 10, marginTop: 22 }}>
                {offers.slice(0, 4).map(o => (
                  <Link key={o.key} to={`/booking?loc=${l.id}&type=${o.type}`} className="chip" style={{ justifyContent: 'space-between' }}>
                    <span className="flex items-center gap-12"><Icon name={o.icon} />{o.title}</span><Icon name="arrow" />
                  </Link>
                ))}
              </div>
              <div className="divider-leaf mt-24"><Icon name="leaf" /></div>
              <a href={`tel:${l.phone}`} className="flex items-center gap-12 mt-24" style={{ fontWeight: 700 }}><Icon name="phone" size={18} />{l.phone}</a>
              <a href={`https://wa.me/${brand.whatsapp}`} className="flex items-center gap-12 mt-16" style={{ fontWeight: 700, color: '#1DA851' }}><Icon name="whatsapp" size={18} />Chat on WhatsApp</a>
            </div>
          </aside>
        </div>
      </section>

      {/* SIBLINGS */}
      <section className="section-sm bg-ivory">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 32 }}><div><Eyebrow>More from {brand.name}</Eyebrow><Split text="Nearby [[escapes]]." className="display-s" /></div></div>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 10 }}>{siblings.map(s => <DestCard key={s.id} l={s} />)}</div>
        </div>
      </section>

      {/* Always-visible actions */}
      <div className="action-dock">
        <span className="ad-name"><b>{l.name}</b><small>{open ? 'Open now' : 'Closed now'}</small></span>
        <a href={`tel:${l.phone}`}><Icon name="phone" size={18} /><span>Call</span></a>
        <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /><span>WhatsApp</span></a>
        <Link to={`/booking?loc=${l.id}`} className="ad-book"><Icon name="calendar" size={18} /><span>Book now</span></Link>
      </div>

      <OfferModal o={offer} l={l} brand={brand} onClose={() => setOffer(null)} />
      <div className={`lightbox ${lb ? 'open' : ''}`} onClick={() => setLb(null)}>
        <button className="icon-btn lb-close" aria-label="Close"><Icon name="close" /></button>
        {lb && <img src={img(lb, 1800)} alt="" />}
      </div>
    </div>
  );
}
