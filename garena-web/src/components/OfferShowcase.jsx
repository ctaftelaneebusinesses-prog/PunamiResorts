import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { Eyebrow, Split } from './ui';
import { img } from '../data';

/* Each destination presents its offerings in its own layout, matched to its character. */
const STYLE = {
  suryapet: { layout: 'mosaic', eyebrow: 'The flagship arena', title: "What's [[available]] here." },
  kamareddy: { layout: 'accordion', eyebrow: 'Golden-hour experiences', title: 'Open up your [[day]].' },
  palamaneru: { layout: 'stack', eyebrow: 'Life in the hills', title: 'Slow days, [[layered]].' },
  nagari: { layout: 'film', eyebrow: 'Below the peaks', title: 'Scenes from [[Nagari]].' },
  dvsatram: { layout: 'list', eyebrow: 'By the lake', title: 'Everything, [[unhurried]].' },
  kuppam: { layout: 'tabs', eyebrow: 'The boutique stay', title: 'Your stay, [[curated]].' },
  mypadu: { layout: 'postcards', eyebrow: 'Greetings from Mypadu', title: 'Postcards from the [[shore]].' },
  revupolavaram: { layout: 'arches', eyebrow: 'The secret cove', title: 'Sunrise to [[sunset]].' },
};

const Cta = ({ children = 'View & book' }) => <span className="ot-cta">{children} <Icon name="arrow" size={15} /></span>;

function Actions({ o, l }) {
  return (
    <div className="flex gap-8 wrap">
      <Link to={`/booking?loc=${l.id}&type=${o.type}`} className="btn btn-sm"><span>Book this</span><span className="arrow"><Icon name="arrow" /><Icon name="arrow" /></span></Link>
      <a href={`tel:${l.phone}`} className="btn btn-sm btn-outline btn-plain" style={{ padding: '10px 18px', gap: 8 }}><Icon name="phone" size={15} />Call</a>
    </div>
  );
}

function Mosaic({ offers, open }) {
  return (
    <div className="offer-grid">
      {offers.map((o, i) => (
        <button key={o.key} className={`offer-tile rv ${i === 0 ? 'wide' : ''}`} style={{ '--d': `${(i % 4) * .06}s` }} onClick={() => open(o)} data-cursor="View">
          <img src={img(o.img, i === 0 ? 1200 : 700)} alt="" loading="lazy" />
          <span className="ot-icon"><Icon name={o.icon} /></span>
          <span className="ot-body"><span className="ot-title">{o.title}</span><span className="ot-short">{o.short}</span></span>
          <Cta />
        </button>
      ))}
    </div>
  );
}

function Accordion({ offers, open }) {
  const [a, setA] = useState(0);
  return (
    <div className="oc-acc rv">
      {offers.map((o, i) => (
        <button key={o.key} className={`oc-acc-panel ${a === i ? 'on' : ''}`} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => (a === i ? open(o) : setA(i))}>
          <img src={img(o.img, 1100)} alt="" loading="lazy" />
          <span className="oc-acc-num">0{i + 1}</span>
          <span className="oc-acc-v">{o.title}</span>
          <span className="oc-acc-body">
            <span className="ot-icon" style={{ position: 'static' }}><Icon name={o.icon} /></span>
            <span className="ot-title" style={{ fontSize: 'clamp(2rem,3vw,3rem)' }}>{o.title}</span>
            <span className="ot-short">{o.short}</span>
            <Cta />
          </span>
        </button>
      ))}
    </div>
  );
}

function Stack({ offers, l }) {
  return (
    <div className="oc-stack">
      {offers.map((o, i) => (
        <article key={o.key} className="oc-stack-card" style={{ top: `${100 + i * 18}px` }}>
          <div className="oc-stack-img"><img src={img(o.img, 1100)} alt="" loading="lazy" /></div>
          <div className="oc-stack-body">
            <span className="oc-big-num">0{i + 1}</span>
            <span className="flex items-center gap-8 label" style={{ color: 'var(--primary)' }}><Icon name={o.icon} size={18} />{o.short}</span>
            <h3 className="display-s mt-16">{o.title}</h3>
            <p className="muted">{o.desc}</p>
            <dl className="offer-facts" style={{ marginBottom: 24 }}>{o.facts.slice(0, 3).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <Actions o={o} l={l} />
          </div>
        </article>
      ))}
    </div>
  );
}

function Film({ offers, open }) {
  return (
    <div className="oc-film">
      {offers.map((o, i) => (
        <button key={o.key} className="oc-film-card rv" style={{ '--d': `${i * .06}s` }} onClick={() => open(o)} data-cursor="View">
          <span className="oc-film-num">{String(i + 1).padStart(2, '0')}</span>
          <span className="oc-film-img"><img src={img(o.img, 800)} alt="" loading="lazy" /></span>
          <span className="oc-film-meta">
            <span className="flex items-center gap-8" style={{ fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .7 }}><Icon name={o.icon} size={15} />{o.short}</span>
            <span className="ot-title" style={{ marginTop: 6 }}>{o.title}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function List({ offers, open }) {
  const [h, setH] = useState(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <div className="oc-list" onMouseMove={e => setP({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setH(null)}>
      {offers.map((o, i) => (
        <button key={o.key} className="oc-list-row rv" onMouseEnter={() => setH(o)} onClick={() => open(o)}>
          <span className="oc-list-n">0{i + 1}</span>
          <span className="oc-list-t">{o.title}</span>
          <span className="oc-list-s"><Icon name={o.icon} size={18} />{o.short}</span>
          <span className="oc-list-go"><Icon name="arrowUpRight" /></span>
        </button>
      ))}
      <div className={`oc-list-float ${h ? 'on' : ''}`} style={{ transform: `translate(${p.x + 30}px, ${p.y - 120}px) rotate(${h ? 4 : -6}deg)` }}>
        {offers.map(o => <img key={o.key} src={img(o.img, 600)} alt="" className={h?.key === o.key ? 'on' : ''} />)}
      </div>
    </div>
  );
}

function Tabs({ offers, l }) {
  const [a, setA] = useState(0);
  const o = offers[a];
  return (
    <div className="oc-tabs rv">
      <div className="oc-tabs-nav">
        {offers.map((x, i) => (
          <button key={x.key} className={a === i ? 'on' : ''} onClick={() => setA(i)} onMouseEnter={() => setA(i)}>
            <span className="oc-tab-ic"><Icon name={x.icon} /></span>
            <span><b>{x.title}</b><small>{x.short}</small></span>
            <Icon name="arrow" size={16} />
          </button>
        ))}
      </div>
      <div className="oc-tabs-panel">
        {offers.map((x, i) => <img key={x.key} src={img(x.img, 1300)} alt="" className={a === i ? 'on' : ''} />)}
        <div className="oc-tabs-card" key={o.key}>
          <span className="label" style={{ color: 'var(--primary)' }}>{l.name}</span>
          <h3 className="display-s mt-8">{o.title}</h3>
          <p className="muted" style={{ margin: '10px 0 0', fontSize: 14.5 }}>{o.desc}</p>
          <dl className="offer-facts" style={{ marginBottom: 20 }}>{o.facts.slice(0, 3).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <Actions o={o} l={l} />
        </div>
      </div>
    </div>
  );
}

function Postcards({ offers, open, l }) {
  const tilt = [-4, 3, -2, 5, -3, 2, -5, 4];
  return (
    <div className="oc-cards">
      {offers.map((o, i) => (
        <button key={o.key} className="oc-postcard rv" style={{ '--r': `${tilt[i % 8]}deg`, '--d': `${i * .07}s` }} onClick={() => open(o)} data-cursor="View">
          <span className="oc-stamp"><Icon name={o.icon} /></span>
          <span className="oc-pc-img"><img src={img(o.img, 700)} alt="" loading="lazy" /></span>
          <span className="oc-pc-cap">
            <span className="oc-pc-title">{o.title}</span>
            <span className="oc-pc-sub">{o.short} · {l.name}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Arches({ offers, open }) {
  return (
    <div className="oc-arches">
      {offers.map((o, i) => (
        <button key={o.key} className="oc-arch rv" style={{ '--d': `${i * .07}s` }} onClick={() => open(o)} data-cursor="View">
          <span className="oc-arch-img"><img src={img(o.img, 700)} alt="" loading="lazy" /></span>
          <span className="oc-arch-sun"><Icon name={o.icon} /></span>
          <span className="ot-title" style={{ fontSize: 26, marginTop: 18 }}>{o.title}</span>
          <span className="ot-short">{o.short}</span>
        </button>
      ))}
    </div>
  );
}

const LAYOUTS = { mosaic: Mosaic, accordion: Accordion, stack: Stack, film: Film, list: List, tabs: Tabs, postcards: Postcards, arches: Arches };
const DARK = ['film', 'arches'];

export default function OfferShowcase({ l, offers, open, children }) {
  const s = STYLE[l.id] || STYLE.suryapet;
  const View = LAYOUTS[s.layout];
  const dark = DARK.includes(s.layout);
  return (
    <section className={`section oc-section oc-sec-${s.layout} ${dark ? 'on-dark' : ''}`}>
      <div className="container">
        <div className="section-head">
          <div><Eyebrow light={dark}>{s.eyebrow}</Eyebrow><Split text={s.title} className="display-m" /></div>
          <p className="lead rv">{s.layout === 'tabs' || s.layout === 'stack' ? 'Everything we offer, with timings and prices. Book or call in one tap.' : 'Tap any experience to see timings and prices, then book or call in one step.'}</p>
        </div>
        <View offers={offers} open={open} l={l} />
        {children}
      </div>
    </section>
  );
}
