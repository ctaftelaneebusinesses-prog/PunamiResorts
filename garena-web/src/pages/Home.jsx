import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { Btn, Eyebrow, Split, BgVideo, RotateBadge } from '../components/ui';
import BookingBar from '../components/BookingBar';
import { Testimonials, CtaBand, HorizontalDestinations } from '../components/Sections';
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
  { k: 'pool', to: '/packages', short: 'Lagoon pools & cabanas', t: 'Pools & Day-outs', img: 'poolAerial', d: 'Lagoon pools, splash zones and shaded cabanas — open from sunrise, with lifeguards on every deck.', tags: ['Lagoon & infinity pools', 'Kids splash zone', 'Cabanas', 'Lifeguard on duty'] },
  { k: 'dine', to: '/dining', short: 'Andhra thalis & grills', t: 'Dining & Feasts', img: 'thaliTop', d: 'Andhra thalis, coastal seafood and wood-fire grills, served buffet-style or à la carte under the open sky.', tags: ['Veg & Non-Veg', 'Buffet & à la carte', 'Live counters', 'Event menus'] },
  { k: 'cele', to: '/celebrations', short: 'Up to 500 guests', t: 'Celebrations', img: 'fairyLights', d: 'Birthdays, anniversaries, engagements and corporate days — with décor, catering and DJ handled end to end.', tags: ['Up to 500 guests', 'Theme décor', 'DJ & sound', 'Catering packages'] },
  { k: 'stay', to: '/le-comfort', short: 'Suites & cottages', t: 'Boutique Stays', img: 'roomDark', d: 'From forest cottages to sea-facing suites — calm, considered rooms for a night or a long weekend.', tags: ['AC & Non-AC rooms', 'Suites & cottages', 'Breakfast included', '24×7 front desk'] },
  { k: 'play', to: '/destinations', short: 'Play zones & spa', t: 'Play & Wellness', img: 'playground', d: 'Play zones for little ones, games for the grown-ups and a quiet spa for everyone who needs a pause.', tags: ["Kids' play area", 'Indoor & outdoor games', 'Spa', 'Gym'] },
];

function Experiences() {
  return (
    <div className="xp-row">
      {EXPERIENCES.map((e, i) => (
        <Link key={e.k} to={e.to} className="xp-card rv" style={{ '--d': `${i * .06}s` }} data-cursor="View">
          <img src={img(e.img, 700)} alt="" loading="lazy" />
          <span className="xp-body">
            <span className="xp-k">0{i + 1}</span>
            <span className="xp-t">{e.t}</span>
            <span className="xp-d">{e.short}</span>
          </span>
        </Link>
      ))}
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
            <div className="hero-bar-desk"><BookingBar /></div>
            <div className="hero-m-cta">
              <Btn to="/booking" variant="light">Reserve your visit</Btn>
              <Link to="/destinations" className="btn btn-outline btn-plain">Explore 8 destinations</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="container">
        <div className="stat-strip rv">
          <div><b><Counter to={12} suffix="+" /></b><span>Years</span></div>
          <div><b><Counter to={8} /></b><span>Destinations</span></div>
          <div><b><Counter to={350} suffix="K" /></b><span>Guests</span></div>
          <div><b><Counter to={4800} suffix="+" /></b><span>Celebrations</span></div>
        </div>
      </div>

      {/* BRAND PORTAL */}
      <section className="section-sm">
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

      {/* EXPERIENCES */}
      <section className="section-sm">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Experiences</Eyebrow><Split text="One day. [[Many]] ways to spend it." className="display-m" /></div>
            <p className="lead rv">Every destination brings together the same five pillars, shaped around its own landscape.</p>
          </div>
          <Experiences />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-sm bg-ivory"><div className="container"><Testimonials /></div></section>

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
