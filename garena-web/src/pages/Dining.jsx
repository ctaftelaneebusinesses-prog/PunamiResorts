import { useEffect, useState } from 'react';
import { PageHero, Eyebrow, Split, Pic, Btn, Marquee } from '../components/ui';
import { CtaBand } from '../components/Sections';
import Icon from '../components/Icon';
import { LOCATIONS, img } from '../data';

const MENU = {
  'Signature Mains': [
    ['Hyderabadi Dum Biryani', 'Aged basmati, slow-cooked over coal with saffron and mint.', 380, 'nv', 'biryani2'],
    ['Andhra Kodi Kura', 'Country chicken in a fiery Guntur chilli gravy.', 420, 'nv', 'curry'],
    ['Nellore Chepala Pulusu', 'Tangy tamarind fish curry, a Mypadu coastal speciality.', 460, 'nv', 'fishCurry'],
    ['Gutti Vankaya', 'Stuffed baby brinjals in peanut-sesame masala.', 290, 'v', 'thali'],
    ['Paneer Tikka Lababdar', 'Charred cottage cheese in a rich tomato-butter gravy.', 340, 'v', 'platesTop'],
    ['Royyala Vepudu', 'Pan-roasted prawns with curry leaves and pepper.', 520, 'nv', 'foodTable'],
  ],
  'Thalis & Buffet': [
    ['Andhra Veg Meals', 'Unlimited rice, pappu, two curries, pickles, curd and sweet.', 280, 'v', 'thaliTop'],
    ['Coastal Non-Veg Thali', 'Fish fry, chicken curry, rasam, rice and accompaniments.', 450, 'nv', 'thali'],
    ['Weekend Grand Buffet', '40+ dishes with live dosa and grill counters.', 899, 'nv', 'friendsDining'],
    ['Kids Mini Thali', 'A gentler, smaller thali for little guests.', 199, 'v', 'pav'],
  ],
  'Starters & Grills': [
    ['Apollo Fish', 'Crisp boneless fish tossed with green chilli and curry leaf.', 360, 'nv', 'fishCurry'],
    ['Chilli Mushroom', 'Wok-tossed mushrooms with spring onion.', 260, 'v', 'platesTop'],
    ['Tandoori Platter', 'Chicken tikka, malai kebab and seekh kebab.', 640, 'nv', 'biryani'],
    ['Corn Samosa Chaat', 'Crisp samosa, sweet curd and tamarind chutney.', 180, 'v', 'samosa'],
  ],
};

const TIMES = ['12:30 PM', '1:30 PM', '2:30 PM', '7:00 PM', '8:00 PM', '9:00 PM'];

/* Book a table without leaving the menu */
function TableBooker() {
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ loc: 'suryapet', date: today, time: '1:30 PM', guests: 4, name: '', phone: '' });
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const loc = LOCATIONS.find(l => l.id === f.loc);
  const ok = f.name.trim().length >= 2 && f.phone.replace(/\D/g, '').length >= 10;
  const submit = e => { e.preventDefault(); ok ? setSent(true) : setTried(true); };

  if (sent) return (
    <aside className="table-card">
      <div className="success" style={{ padding: '20px 0' }}>
        <svg className="check" viewBox="0 0 120 120" style={{ width: 90, height: 90 }}><circle cx="60" cy="60" r="54" /><path d="M38 62l15 15 30-32" /></svg>
        <h3 className="display-s">Table requested.</h3>
        <p className="muted">{f.guests} guests at {loc.name}, {new Date(f.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {f.time}. We'll call {f.phone} to confirm.</p>
        <button className="link-line mt-16" onClick={() => { setSent(false); setF(s => ({ ...s, name: '', phone: '' })); }}>Book another table</button>
      </div>
    </aside>
  );

  return (
    <aside className="table-card">
      <div className="table-card-head">
        <img src={img(loc.gallery.find(g => ['restaurant', 'terraceSea', 'fineDining', 'cafe', 'friendsDining', 'restWindow'].includes(g)) || 'restaurant', 700)} alt="" />
        <div><span className="label">Reserve a table</span><h3>Book a table</h3></div>
      </div>
      <form className="table-form" onSubmit={submit}>
        <div className="field"><label>Restaurant</label>
          <select value={f.loc} onChange={e => set('loc', e.target.value)}>{LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} · {l.stats.tables} tables</option>)}</select>
        </div>
        <div className="form-grid" style={{ gap: 12 }}>
          <div className="field"><label>Date</label><input type="date" min={today} value={f.date} onChange={e => set('date', e.target.value)} /></div>
          <div className="field"><label>Guests</label>
            <div className="stepper" style={{ width: '100%', justifyContent: 'space-between' }}><button type="button" onClick={() => set('guests', Math.max(1, f.guests - 1))}>−</button><output>{f.guests}</output><button type="button" onClick={() => set('guests', Math.min(40, f.guests + 1))}>+</button></div>
          </div>
        </div>
        <div className="field"><label>Time</label>
          <div className="slot-grid">{TIMES.map(t => <button type="button" key={t} className={`slot ${f.time === t ? 'on' : ''}`} onClick={() => set('time', t)}>{t}</button>)}</div>
        </div>
        <div className="form-grid" style={{ gap: 12 }}>
          <div className={`field ${tried && f.name.trim().length < 2 ? 'err' : ''}`}><label>Name *</label><input value={f.name} onChange={e => set('name', e.target.value)} placeholder="Your name" /></div>
          <div className={`field ${tried && f.phone.replace(/\D/g, '').length < 10 ? 'err' : ''}`}><label>Mobile *</label><input value={f.phone} onChange={e => set('phone', e.target.value)} inputMode="tel" placeholder="98765 43210" /></div>
        </div>
        {tried && !ok && <span className="field-err">Please add your name and a 10-digit mobile number.</span>}
        <Btn type="submit" className="w-full" style={{ justifyContent: 'space-between' }}>Request table</Btn>
        <p className="muted" style={{ fontSize: 12.5, margin: 0, display: 'flex', gap: 8 }}><Icon name="shield" size={16} />No payment now. We call to confirm within 30 minutes.</p>
      </form>
    </aside>
  );
}

export default function Dining() {
  const [tab, setTab] = useState('Signature Mains');
  const [veg, setVeg] = useState('all');
  const items = MENU[tab].filter(i => veg === 'all' || i[3] === veg);
  return (
    <>
      <PageHero title="Feasts under an [[open]] sky." eyebrow="Food & Dining" image="fineDining" crumbs="Dining"
        lead="Regional Telugu flavours, coastal seafood and family-style buffets, served at all eight destinations." />

      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            <Eyebrow>Our kitchens</Eyebrow>
            <Split text="Rooted in [[Andhra]], made for everyone." className="display-m mt-24" />
            <p className="lead mt-24 rv">Each restaurant cooks with seasonal produce from nearby farms and the morning's catch from the coast. Choose a buffet, order à la carte or arrange a custom menu for your event.</p>
            <div className="grid-2 mt-48 rv" style={{ gap: 18 }}>
              {[['utensils', 'Veg & Non-Veg', 'Separate kitchens and counters'], ['sparkle', 'Buffet & à la carte', 'Weekend buffets at every arena'], ['tag', '₹250 – ₹1,500', 'Indicative price per plate'], ['cake', 'Event menus', 'Custom menus for 20 to 500 guests']].map(([ic, t, d]) => (
                <div key={t} className="flex gap-16"><span className="amenity" style={{ padding: 0, border: 0, background: 'none' }}><span className="ic"><Icon name={ic} /></span></span><div><b>{t}</b><div className="muted" style={{ fontSize: 14 }}>{d}</div></div></div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Pic k="thaliTop" w={800} className="ratio-34 frame-arch" reveal />
            <div style={{ display: 'grid', gap: 16, marginTop: 60 }}>
              <Pic k="biryani2" w={600} className="ratio-11" reveal style={{ '--d': '.15s' }} />
              <Pic k="samosa" w={600} className="ratio-11 frame-leaf" reveal style={{ '--d': '.3s' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>The menu</Eyebrow><Split text="A taste of the [[table]]." className="display-m" /></div>
            <div className="flex gap-12 wrap">
              <div className="tabs">{Object.keys(MENU).map(t => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
              <div className="tabs">{[['all', 'All'], ['v', 'Veg'], ['nv', 'Non-veg']].map(([k, t]) => <button key={k} className={veg === k ? 'on' : ''} onClick={() => setVeg(k)}>{t}</button>)}</div>
            </div>
          </div>
          <div className="dine-layout">
            <div>
              <div className="dish-grid">
                {items.map(([n, d, p, v, k], i) => (
                  <article className="dish" key={tab + n} style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="dish-img"><img src={img(k, 600)} alt={n} loading="lazy" /><span className={`dish-tag ${v}`}><span className={`veg ${v === 'nv' ? 'nv' : ''}`} />{v === 'nv' ? 'Non-veg' : 'Veg'}</span></div>
                    <div className="dish-body">
                      <div className="flex between" style={{ gap: 12, alignItems: 'baseline' }}><h4>{n}</h4><span className="p">₹{p}</span></div>
                      <p>{d}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p className="muted mt-24" style={{ fontSize: 13 }}>Sample menu. Dishes and prices vary by destination and season. All prices exclude GST.</p>
            </div>
            <div id="book-table" style={{ scrollMarginTop: 100 }}><TableBooker /></div>
          </div>
        </div>
      </section>

      <Marquee items={['Dum biryani', 'Coastal thalis', 'Live dosa counters', 'Wood-fire grills', 'Filter coffee']} />

      <section className="section">
        <div className="container">
          <div className="bento">
            <Pic k="restaurant" w={1200} className="b-a rv-img" />
            <Pic k="terraceSea" w={900} className="b-b rv-img" />
            <div className="b-d tile-text rv"><Icon name="utensils" size={26} /><div style={{ fontFamily: 'var(--f-display)', fontSize: 22, lineHeight: 1.1 }}>8 restaurants</div></div>
            <Pic k="curry" w={600} className="b-e rv-img" />
            <Pic k="friendsDining" w={900} className="b-c rv-img" />
            <div className="b-f tile-text alt rv"><span className="label">Group dining</span><div style={{ fontFamily: 'var(--f-display)', fontSize: 26, lineHeight: 1.1 }}>Special menus for events</div></div>
            <Pic k="fishCurry" w={600} className="b-d rv-img" />
            <Pic k="pav" w={900} className="b-e rv-img" />
          </div>
          <div className="center mt-48"><Btn to="/booking?type=table">Reserve a table</Btn></div>
        </div>
      </section>
      <CtaBand title="Pull up a [[chair]]." image="foodTable" />
    </>
  );
}
