import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { Btn, Pic, BgVideo, Stars, Split, Eyebrow } from './ui';
import { PACKAGES, TESTIMONIALS, LOCATIONS, img, fmtINR } from '../data';

export function PackageCard({ p, i = 0 }) {
  const ref = useRef();
  const tilt = e => {
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };
  return (
    <div ref={ref} className="pkg-card rv" style={{ '--d': `${i * .08}s` }} onMouseMove={tilt} onMouseLeave={() => (ref.current.style.transform = '')}>
      <span className="ribbon">{p.tag}</span>
      <Pic k={p.img} w={800} />
      <div className="body">
        <div className="label muted">{p.brand === 'garena' ? 'G Arena' : 'LE Comfort'}</div>
        <h3 className="mt-8">{p.name}</h3>
        <div className="price">{fmtINR(p.price)}<small>{p.unit}</small></div>
        <ul>{p.items.map(it => <li key={it}><Icon name="check" />{it}</li>)}</ul>
        <Btn to={`/booking?type=${p.brand === 'garena' ? 'day' : 'room'}`} size="sm">Request this package</Btn>
      </div>
    </div>
  );
}

export function PackagesGrid({ limit = 4 }) {
  return <div className="grid-4">{PACKAGES.slice(0, limit).map((p, i) => <PackageCard key={p.name} p={p} i={i} />)}</div>;
}

export function Testimonials() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const go = d => { setOut(true); setTimeout(() => { setI(v => (v + d + TESTIMONIALS.length) % TESTIMONIALS.length); setOut(false); }, 400); };
  useEffect(() => { const t = setInterval(() => go(1), 7000); return () => clearInterval(t); }, []);
  const t = TESTIMONIALS[i];
  return (
    <div className="testi">
      <div className="rv">
        <Eyebrow>Guest stories</Eyebrow>
        <Split text="Loved by [[families]] across the South." className="display-m mt-24" />
        <div className="rating-card mt-32">
          <div className="big">4.8</div>
          <div>
            <Stars />
            <div style={{ fontWeight: 700, marginTop: 4 }}>Google Reviews</div>
            <div className="muted" style={{ fontSize: 13.5 }}>Based on 2,400+ verified guest reviews</div>
          </div>
        </div>
      </div>
      <div>
        <div className={`testi-quote fade-swap ${out ? 'out' : ''}`}>{t.quote}</div>
        <div className="testi-meta">
          <div className={`fade-swap ${out ? 'out' : ''}`}>
            <Stars n={t.rating} />
            <div style={{ fontWeight: 700, marginTop: 6 }}>{t.name}</div>
            <div className="muted" style={{ fontSize: 13.5 }}>{t.place}</div>
          </div>
          <div className="testi-nav">
            <button onClick={() => go(-1)} aria-label="Previous"><Icon name="arrowLeft" /></button>
            <button onClick={() => go(1)} aria-label="Next"><Icon name="arrow" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CtaBand({ title = 'Your table by the [[pool]] is waiting.', text = 'Send a reservation request in under a minute. Our concierge will call you to confirm — no online payment required.', video, image = 'poolDusk' }) {
  return (
    <section className="section-sm">
      <div className="container">
        <div className="cta-band">
          <div className="bg">{video ? <BgVideo src={video} poster={img(image, 1600)} /> : <img src={img(image, 1800)} alt="" />}</div>
          <Eyebrow light>Reservations open</Eyebrow>
          <Split text={title} className="display-l on-dark mt-24" />
          <p className="lead rv" style={{ margin: '24px auto 0', color: 'rgba(255,255,255,.8)' }}>{text}</p>
          <div className="actions rv">
            <Btn to="/booking" variant="light">Request a Reservation</Btn>
            <Btn href="https://wa.me/919000000001" variant="outline">WhatsApp Concierge</Btn>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DestCard({ l }) {
  return (
    <Link to={`/destinations/${l.id}`} className="dest-card" data-cursor="Explore">
      <div className="frame"><img src={img(l.hero, 900)} alt={l.name} loading="lazy" /></div>
      <div className="meta">
        <div className="flex between items-center">
          <span className="no">{l.no}</span>
          <span className="brand-chip" style={{ '--chip': l.brand === 'garena' ? 'var(--leaf)' : '#E7C79A' }}>{l.brand === 'garena' ? 'G Arena' : 'LE Comfort'}</span>
        </div>
        <div className="flex between" style={{ alignItems: 'flex-end', gap: 16 }}>
          <div>
            <h3>{l.name}</h3>
            <div className="tag">{l.tagline} · {l.state}</div>
          </div>
          <span className="go"><Icon name="arrowUpRight" /></span>
        </div>
      </div>
    </Link>
  );
}

/* Vertical scroll drives a horizontal track (desktop). Falls back to swipe on mobile. */
export function HorizontalDestinations({ items = LOCATIONS, head }) {
  const outer = useRef(), track = useRef(), bar = useRef();
  const [h, setH] = useState('auto');
  useEffect(() => {
    const desktop = () => innerWidth > 900;
    const size = () => {
      if (!desktop()) { setH('auto'); track.current.style.transform = ''; return; }
      setH(track.current.scrollWidth - innerWidth + innerHeight + 'px');
    };
    const on = () => {
      if (!desktop()) return;
      const r = outer.current.getBoundingClientRect();
      const max = outer.current.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / max));
      track.current.style.transform = `translateX(${-p * (track.current.scrollWidth - innerWidth)}px)`;
      bar.current.style.width = p * 100 + '%';
    };
    size(); on();
    addEventListener('resize', size); addEventListener('scroll', on, { passive: true });
    return () => { removeEventListener('resize', size); removeEventListener('scroll', on); };
  }, []);
  return (
    <div ref={outer} className="hscroll" style={{ height: h }}>
      <div style={{ position: 'sticky', top: 0, height: h === 'auto' ? 'auto' : '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', padding: h === 'auto' ? '0' : '40px 0' }}>
        <div className="container">{head}</div>
        <div style={{ overflowX: h === 'auto' ? 'auto' : 'visible' }}>
          <div ref={track} className="hscroll-track">{items.map(l => <DestCard key={l.id} l={l} />)}</div>
        </div>
        <div className="hscroll-progress"><i ref={bar} /></div>
      </div>
    </div>
  );
}
