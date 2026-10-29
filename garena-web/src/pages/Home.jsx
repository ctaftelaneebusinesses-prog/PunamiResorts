import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Btn, Eyebrow, Split, Pic, BgVideo, Marquee, RotateBadge } from '../components/ui';
import BookingBar from '../components/BookingBar';
import MapConstellation from '../components/MapConstellation';
import { PackagesGrid, Testimonials, CtaBand, HorizontalDestinations } from '../components/Sections';
import { BRANDS, LOCATIONS, VID, img } from '../data';

function Counter({ to, suffix = '' }) {
  const ref = useRef();
  const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = t => { const p = Math.min(1, (t - t0) / 1800); setV(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: .4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString('en-IN')}{suffix && <sup>{suffix}</sup>}</span>;
}

const EXPERIENCES = [
  { k: 'pool', t: 'Pools & Day-outs', img: 'poolAerial', d: 'Lagoon pools, splash zones and shaded cabanas — open from sunrise, with lifeguards on every deck.', tags: ['Lagoon & infinity pools', 'Kids splash zone', 'Cabanas', 'Lifeguard on duty'] },
  { k: 'dine', t: 'Dining & Feasts', img: 'thaliTop', d: 'Andhra thalis, coastal seafood and wood-fire grills, served buffet-style or à la carte under the open sky.', tags: ['Veg & Non-Veg', 'Buffet & à la carte', 'Live counters', 'Event menus'] },
  { k: 'cele', t: 'Celebrations', img: 'fairyLights', d: 'Birthdays, anniversaries, engagements and corporate days — with décor, catering and DJ handled end to end.', tags: ['Up to 500 guests', 'Theme décor', 'DJ & sound', 'Catering packages'] },
  { k: 'stay', t: 'Boutique Stays', img: 'roomDark', d: 'From forest cottages to sea-facing suites — calm, considered rooms for a night or a long weekend.', tags: ['AC & Non-AC rooms', 'Suites & cottages', 'Breakfast included', '24×7 front desk'] },
  { k: 'play', t: 'Play & Wellness', img: 'playground', d: 'Play zones for little ones, games for the grown-ups and a quiet spa for everyone who needs a pause.', tags: ["Kids' play area", 'Indoor & outdoor games', 'Spa', 'Gym'] },
];

function Experiences() {
  const [on, setOn] = useState(0);
  const refs = useRef([]);
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(+e.target.dataset.i)), { rootMargin: '-45% 0px -45% 0px' });
    refs.current.forEach(r => r && io.observe(r));
    return () => io.disconnect();
  }, []);
  return (
    <div className="exp">
      <div className="exp-media">
        {EXPERIENCES.map((e, i) => <img key={e.k} src={img(e.img, 1400)} alt={e.t} className={i === on ? 'on' : ''} />)}
        <div className="exp-count">0{on + 1} / 0{EXPERIENCES.length}</div>
      </div>
      <div className="exp-items">
        {EXPERIENCES.map((e, i) => (
          <div key={e.k} ref={r => (refs.current[i] = r)} data-i={i} className={`exp-item ${i === on ? 'on' : ''}`}>
            <span className="k">0{i + 1} — EXPERIENCE</span>
            <h3>{e.t}</h3>
            <p className="lead">{e.d}</p>
            <ul>{e.tags.map(t => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), sessionStorage.getItem('pl') ? 200 : 1700); return () => clearTimeout(t); }, []);
  const lineStyle = i => ({ transform: heroIn ? 'none' : undefined, transition: `transform 1.3s cubic-bezier(.22,1,.36,1) ${i * .12}s` });

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-media"><BgVideo src={VID.lake} poster={img('lakeDock', 1800)} /></div>
        <div className="hero-side"><RotateBadge /></div>
        <div className="container hero-inner">
          <Eyebrow light className="rv in">G Arena & LE Comfort · Est. 2014</Eyebrow>
          <h1 className="display-xl hero-title mt-24">
            <span className="line"><span style={lineStyle(0)}>Where nature</span></span>
            <span className="line"><span style={lineStyle(1)}><em style={{ color: 'var(--leaf-soft)' }}>hosts</em> you.</span></span>
          </h1>
          <div className="hero-bottom">
            <p className="lead" style={{ margin: 0, opacity: heroIn ? 1 : 0, transition: 'opacity 1.2s .5s' }}>
              Pools, feasts, celebrations and quiet stays — across eight green and coastal destinations in Telangana and Andhra Pradesh.
            </p>
            <div className="scroll-cue hide-sm" style={{ justifySelf: 'end' }}><i /> Scroll to explore</div>
          </div>
          <div className="mt-32" style={{ opacity: heroIn ? 1 : 0, transform: heroIn ? 'none' : 'translateY(30px)', transition: 'all 1.2s cubic-bezier(.22,1,.36,1) .7s' }}>
            <BookingBar />
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="section">
        <div className="container">
          <Eyebrow>Welcome</Eyebrow>
          <p className="statement mt-32 rv">
            Two brands, one philosophy —
            <span className="inline-img"><img src={img('poolPalms', 300)} alt="" /></span>
            open spaces, honest food and
            <span className="inline-img"><img src={img('friendsDining', 300)} alt="" /></span>
            <span className="ghost">warm hospitality that makes every visit</span> feel like coming home.
          </p>
          <div className="stats-row">
            <div className="stat rv"><div className="num"><Counter to={12} suffix="+" /></div><p>Years of hospitality</p></div>
            <div className="stat rv" style={{ '--d': '.1s' }}><div className="num"><Counter to={8} /></div><p>Destinations across 2 states</p></div>
            <div className="stat rv" style={{ '--d': '.2s' }}><div className="num"><Counter to={350} suffix="K" /></div><p>Guests welcomed</p></div>
            <div className="stat rv" style={{ '--d': '.3s' }}><div className="num"><Counter to={4800} suffix="+" /></div><p>Celebrations hosted</p></div>
          </div>
        </div>
      </section>

      {/* BRAND PORTAL */}
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Choose your escape</Eyebrow><Split text="Two worlds. [[One]] welcome." className="display-m" /></div>
            <p className="lead rv">Day-long leisure and grand celebrations at G Arena, or slow, restful stays at LE Comfort.</p>
          </div>
          <div className="portal">
            {['garena', 'lecomfort'].map(id => {
              const b = BRANDS[id];
              const locs = LOCATIONS.filter(l => l.brand === id);
              return (
                <Link key={id} to={id === 'garena' ? '/g-arena' : '/le-comfort'} className="portal-panel" data-cursor="Enter"
                  style={{ '--tone': id === 'garena' ? 'rgba(6,43,20,.92)' : 'rgba(10,45,58,.92)' }}>
                  <div className="bg">{id === 'garena'
                    ? <BgVideo src={VID.canopy} poster={img('poolPalms', 1200)} />
                    : <BgVideo src={VID.beachAerial} poster={img('beachPalm', 1200)} />}</div>
                  <div className="p-top">
                    {id === 'garena'
                      ? <img className="p-logo" src="./img/g-arena-logo-white.png" alt="G Arena" />
                      : <LeComfortMark />}
                    <span className="pill">{locs.length} destinations</span>
                  </div>
                  <div>
                    <div className="label" style={{ opacity: .8 }}>{id === 'garena' ? 'Leisure · Dining · Celebrations' : 'Boutique stays · Hills & Coast'}</div>
                    <h3 className="mt-16">{b.name}</h3>
                    <p className="p-desc">{b.desc}</p>
                    <div className="p-locs">{locs.map(l => <span className="pill" key={l.id}><span className="dot" style={{ background: id === 'garena' ? 'var(--leaf)' : '#E7C79A' }} />{l.name}</span>)}</div>
                    <span className="btn btn-light btn-sm"><span>Discover {b.name}</span><span className="arrow"><Icon name="arrow" /><Icon name="arrow" /></span></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DESTINATIONS (horizontal) */}
      <section className="bg-ivory" style={{ padding: 'clamp(60px,8vw,100px) 0' }}>
        <HorizontalDestinations head={
          <div className="section-head" style={{ marginBottom: 40 }}>
            <div><Eyebrow>Destinations</Eyebrow><Split text="Eight places to [[unwind]]." className="display-m" /></div>
            <Btn to="/destinations" variant="outline">All destinations</Btn>
          </div>
        } />
      </section>

      {/* MAP */}
      <section className="section bg-forest"><div className="container"><MapConstellation /></div></section>

      {/* EXPERIENCES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Experiences</Eyebrow><Split text="One day. [[Many]] ways to spend it." className="display-m" /></div>
            <p className="lead rv">Every destination brings together the same five pillars, shaped around its own landscape.</p>
          </div>
          <Experiences />
        </div>
      </section>

      <Marquee items={['Pool days', 'Family feasts', 'Birthdays', 'Sea-facing suites', 'Corporate retreats', 'Forest cottages', 'Sunset dinners']} />

      {/* PACKAGES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Packages</Eyebrow><Split text="Curated, all-inclusive [[escapes]]." className="display-m" /></div>
            <Btn to="/packages" variant="outline">View all packages</Btn>
          </div>
          <PackagesGrid />
        </div>
      </section>

      {/* GALLERY BENTO */}
      <section className="section-sm bg-ivory">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Moments</Eyebrow><Split text="Captured at [[G Arena]] & LE Comfort." className="display-m" /></div>
            <Btn to="/gallery" variant="outline">Open gallery</Btn>
          </div>
          <div className="bento">
            <Pic k="poolAerial" w={1200} className="b-a rv-img" />
            <Pic k="banquetHall" w={900} className="b-b rv-img" />
            <div className="b-d tile-text rv"><Icon name="leaf" size={28} /><div style={{ fontFamily: 'var(--f-display)', fontSize: 24, lineHeight: 1.1 }}>12 years of memories</div></div>
            <Pic k="biryani2" w={600} className="b-e rv-img" />
            <Pic k="beachHut" w={900} className="b-c rv-img" />
            <div className="b-f tile-text alt rv"><span className="label">Follow us</span><div style={{ fontFamily: 'var(--f-display)', fontSize: 28 }}>@garena.lecomfort</div></div>
            <Pic k="kid" w={600} className="b-d rv-img" />
            <Pic k="roomView" w={900} className="b-e rv-img" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section"><div className="container"><Testimonials /></div></section>

      <CtaBand video={VID.water} />
    </>
  );
}

export function LeComfortMark({ dark }) {
  const c = dark ? 'var(--sea)' : '#fff';
  return (
    <svg viewBox="0 0 200 74" style={{ height: 66, width: 'auto' }} aria-label="LE Comfort">
      <circle cx="37" cy="37" r="33" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M14 46c6-4 11-4 17 0s11 4 17 0 11-4 12-2" fill="none" stroke="#E7C79A" strokeWidth="2" strokeLinecap="round" />
      <text x="37" y="38" textAnchor="middle" fill={c} style={{ fontFamily: 'Cormorant, serif', fontSize: 26, fontStyle: 'italic' }}>Le</text>
      <text x="82" y="34" fill={c} style={{ fontFamily: 'Marcellus, serif', fontSize: 19, letterSpacing: 4 }}>COMFORT</text>
      <text x="82" y="52" fill={c} opacity=".65" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 8.5, letterSpacing: 3 }}>BOUTIQUE STAYS</text>
    </svg>
  );
}
