import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Icon from './Icon';
import { Btn } from './ui';
import Soundscape from './Soundscape';
import { LOCATIONS, BRANDS, img } from '../data';

const NAV = [
  ['/', 'Home'],
  ['/destinations', 'Destinations', true],
  ['/dining', 'Dining'],
  ['/celebrations', 'Celebrations'],
  ['/packages', 'Packages'],
  ['/gallery', 'Gallery'],
  ['/our-story', 'Our Story'],
];

let lenis;

function useSiteEffects() {
  const { pathname } = useLocation();

  // Smooth scroll
  useEffect(() => {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let id;
    const raf = t => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  // Reset scroll + observe reveal targets on every route
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    const observe = () => document.querySelectorAll('.rv:not(.in), .rv-img:not(.in), .split-words:not(.in)').forEach(el => io.observe(el));
    const t = setTimeout(observe, 60);
    const mo = new MutationObserver(observe);
    mo.observe(document.getElementById('root'), { childList: true, subtree: true });

    // Parallax images
    const onScroll = () => {
      document.querySelectorAll('[data-parallax] img').forEach(im => {
        const r = im.parentElement.getBoundingClientRect();
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        im.style.transform = `translateY(${p * -8 - 8}%)`;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { clearTimeout(t); io.disconnect(); mo.disconnect(); removeEventListener('scroll', onScroll); };
  }, [pathname]);
}

function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [megaOff, setMegaOff] = useState(false);
  const last = useRef(0);
  const solid = ['/booking', '/legal', '/contact'].includes(pathname);

  useEffect(() => {
    const on = () => {
      const y = scrollY;
      setScrolled(y > 60);
      setHidden(y > 400 && y > last.current);
      last.current = y;
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const ga = LOCATIONS.filter(l => l.brand === 'garena');
  const lec = LOCATIONS.filter(l => l.brand === 'lecomfort');

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''} ${solid ? 'solid' : ''} ${hidden && !open ? 'hide' : ''}`}>
        <div className="bar">
          <Link to="/" className="brand-lockup" aria-label="G Arena & LE Comfort home">
            <img className="logo-light" src="./img/g-arena-mark-white.png" alt="" />
            <img className="logo-dark" src="./img/g-arena-mark.png" alt="" />
            <span className="words">G Arena<small>& LE Comfort</small></span>
          </Link>
          <nav className="nav">
            {NAV.map(([to, label, mega]) => mega ? (
              // Clicking inside closes the menu; it re-arms once the pointer leaves
              <div className={`has-mega ${megaOff ? 'off' : ''}`} key={to} onClick={e => e.target.closest('a') && setMegaOff(true)} onMouseLeave={() => setMegaOff(false)}>
                <NavLink to={to} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
                <div className="mega">
                  <div>
                    <h6>G Arena · Leisure & Celebrations</h6>
                    {ga.map(l => <Link key={l.id} className="loc" to={`/destinations/${l.id}`}>{l.name}<span>{l.state}</span></Link>)}
                  </div>
                  <div>
                    <h6>LE Comfort · Boutique Stays</h6>
                    {lec.map(l => <Link key={l.id} className="loc" to={`/destinations/${l.id}`}>{l.name}<span>{l.state}</span></Link>)}
                    <Link to="/destinations" className="link-line mt-24" style={{ display: 'inline-flex' }}>View all destinations <Icon name="arrow" /></Link>
                  </div>
                  <Link to="/destinations/revupolavaram" className="mega-feature">
                    <img src={img('beachSunrise', 600)} alt="" />
                    <div><div className="label" style={{ opacity: .8 }}>Featured</div><div style={{ fontFamily: 'var(--f-display)', fontSize: 26, lineHeight: 1.05, marginTop: 6 }}>Revupolavaram Beach</div></div>
                  </Link>
                </div>
              </div>
            ) : (
              <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>{label}</NavLink>
            ))}
          </nav>
          <div className="header-cta">
            <a className="icon-btn phone-link" href={`tel:${BRANDS.garena.phone}`} aria-label="Call us"><Icon name="phone" /></a>
            <Btn to="/booking" size="sm">Reserve</Btn>
            <button className="icon-btn menu-toggle" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        <button className="icon-btn close" style={{ color: '#fff' }} onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="close" /></button>
        {NAV.map(([to, label]) => <Link className="big" key={to} to={to}>{label}</Link>)}
        <Link className="big" to="/contact">Contact</Link>
        <Link className="big" to="/booking"><em>Reserve your visit</em></Link>
        <div className="mt-48" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {LOCATIONS.map(l => <Link key={l.id} to={`/destinations/${l.id}`} className="pill">{l.name}</Link>)}
        </div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer lite">
      <div className="container">
        <div className="fl-cta">
          <h2>Your next escape <em>starts here.</em></h2>
          <div className="fl-cta-actions">
            <Btn to="/booking" variant="light" size="sm">Reserve</Btn>
            <a className="fl-icon" href={`tel:${BRANDS.garena.phone}`} aria-label="Call"><Icon name="phone" /></a>
            <a className="fl-icon wa" href={`https://wa.me/${BRANDS.garena.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          </div>
        </div>
        <div className="fl-grid">
          <div className="fl-brand">
            <div className="fl-logos">
              <Link to="/g-arena"><img src="./img/g-arena-mark-white.png" alt="G Arena" /></Link>
              <span className="fl-sep" />
              <Link to="/le-comfort" className="fl-lc">Le</Link>
            </div>
            <p>Leisure arenas by G Arena and boutique stays by LE Comfort — eight destinations across Telangana &amp; Andhra Pradesh.</p>
            <div className="socials">
              {['instagram', 'facebook', 'youtube'].map(s => <a key={s} href="#" aria-label={s}><Icon name={s} /></a>)}
            </div>
          </div>
          <div>
            <h4>Destinations</h4>
            <ul className="fl-two">{LOCATIONS.map(l => <li key={l.id}><Link to={`/destinations/${l.id}`}>{l.name.replace(' Beach', '')}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/dining">Dining</Link></li>
              <li><Link to="/celebrations">Celebrations</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/our-story">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${BRANDS.garena.phone}`}>{BRANDS.garena.phone}</a></li>
              <li><a href={`mailto:${BRANDS.garena.email}`}>{BRANDS.garena.email}</a></li>
              <li><Link to="/contact">Kuppam, Andhra Pradesh</Link></li>
            </ul>
          </div>
        </div>
        <div className="fl-bottom">
          <span>© 2026 G Arena &amp; LE Comfort</span>
          <span className="fl-links"><Link to="/legal">Privacy &amp; Terms</Link><Link to="/admin">Staff login</Link><span>Crafted by CraftLanee</span></span>
        </div>
      </div>
    </footer>
  );
}

function Cursor() {
  const ring = useRef(), dot = useRef();
  useEffect(() => {
    if (matchMedia('(hover: none)').matches) return;
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, id;
    const move = e => { x = e.clientX; y = e.clientY; dot.current.style.transform = `translate(${x}px,${y}px)`; };
    const over = e => {
      // Only a subtle hover ring — no large labelled bubble
      const a = e.target.closest('a, button, select, input, .choice, .chip, .date-chip, .slot, [data-cursor]');
      ring.current.classList.toggle('hover', !!a);
    };
    const loop = () => { rx += (x - rx) * .16; ry += (y - ry) * .16; ring.current.style.transform = `translate(${rx}px,${ry}px)`; id = requestAnimationFrame(loop); };
    addEventListener('mousemove', move); addEventListener('mouseover', over); loop();
    return () => { removeEventListener('mousemove', move); removeEventListener('mouseover', over); cancelAnimationFrame(id); };
  }, []);
  return (<><div className="cursor" ref={ring} /><div className="cursor-dot" ref={dot} /></>);
}

function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(() => { try { return sessionStorage.getItem('pl') === '1'; } catch { return false; } });
  useEffect(() => {
    if (gone) return;
    let v = 0;
    const t = setInterval(() => {
      v = Math.min(100, v + Math.ceil(Math.random() * 9));
      setN(v);
      if (v >= 100) {
        clearInterval(t);
        setTimeout(() => setDone(true), 250);
        setTimeout(() => { setGone(true); try { sessionStorage.setItem('pl', '1'); } catch {} }, 1400);
      }
    }, 45);
    return () => clearInterval(t);
  }, [gone]);
  if (gone) return null;
  return (
    <div className={`preloader ${done ? 'done' : ''}`}>
      <div className="pl-inner">
        <img src="./img/g-arena-logo-white.png" alt="" />
        <div className="pl-word">Where nature hosts you</div>
        <div className="pl-bar"><i style={{ transform: `scaleX(${n / 100})`, transition: 'transform .2s' }} /></div>
        <div className="pl-count">{String(n).padStart(3, '0')}</div>
      </div>
    </div>
  );
}

function Curtain() {
  const { pathname } = useLocation();
  const [state, setState] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setState('in');
    const t = setTimeout(() => setState('out'), 650);
    const t2 = setTimeout(() => setState(''), 1500);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [pathname]);
  return <div className={`curtain ${state}`}><img src="./img/g-arena-mark-white.png" alt="" /></div>;
}

export default function Layout() {
  useSiteEffects();
  return (
    <>
      <Preloader />
      <Curtain />
      <Cursor />
      <Header />
      <main><Outlet /></main>
      <Footer />
      <Soundscape />
      <div className="wa-float">
        <span className="wa-tip">Chat with our concierge</span>
        <a className="wa" href={`https://wa.me/${BRANDS.garena.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
      </div>
    </>
  );
}
