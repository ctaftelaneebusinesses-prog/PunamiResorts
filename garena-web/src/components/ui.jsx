import { Link } from 'react-router-dom';
import Icon from './Icon';
import { img } from '../data';

export function Btn({ to, href, children, variant = '', size = '', onClick, type, className = '', ...rest }) {
  const cls = `btn ${variant && 'btn-' + variant} ${size && 'btn-' + size} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      <span className="arrow"><Icon name="arrow" /><Icon name="arrow" /></span>
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} target="_blank" rel="noreferrer" {...rest}>{inner}</a>;
  return <button type={type || 'button'} className={cls} onClick={onClick} {...rest}>{inner}</button>;
}

export function Eyebrow({ children, light, className = '' }) {
  return <span className={`eyebrow ${light ? 'light' : ''} ${className}`}>{children}</span>;
}

/* Splits a heading into words that slide up when revealed. Supports <em> via [[word]] syntax. */
export function Split({ text, as: Tag = 'h2', className = '', delay = 0 }) {
  const words = text.split(' ');
  let inEm = false;
  return (
    <Tag className={`split-words ${className}`} style={{ '--d': `${delay}s` }}>
      {words.map((w, i) => {
        // [[...]] marks an italic accent phrase; it may span words and carry trailing punctuation
        if (w.startsWith('[[')) { inEm = true; w = w.slice(2); }
        let em = inEm, tail = '';
        const close = w.indexOf(']]');
        if (close > -1) { tail = w.slice(close + 2); w = w.slice(0, close); inEm = false; }
        return (
          <span className="w" key={i}>
            <span style={{ '--i': i }}>{em ? <em>{w}</em> : w}{tail}</span>{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </Tag>
  );
}

export function Pic({ k, w = 1400, alt = '', className = '', reveal, parallax, style, children }) {
  const cls = `frame ${reveal ? 'rv-img' : ''} ${parallax ? 'parallax' : ''} ${className}`;
  return (
    <div className={cls} style={style} data-parallax={parallax ? '' : undefined}>
      <img src={img(k, w)} alt={alt} loading="lazy" />
      {children}
    </div>
  );
}

export function BgVideo({ src, poster }) {
  return <video src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" />;
}

export function Stars({ n = 5 }) {
  return <span className="stars">{Array.from({ length: n }, (_, i) => <Icon key={i} name="star" />)}</span>;
}

export function Marquee({ items, dark }) {
  const row = items.map((t, i) => (
    <span key={i}>{i % 2 ? <em>{t}</em> : t}<Icon name="leaf" /></span>
  ));
  return (
    <div className={`marquee ${dark ? 'dark' : ''}`}>
      <div className="marquee-track">{row}{row}</div>
    </div>
  );
}

export function RotateBadge({ text = 'Eight destinations · Two brands · One family · ' }) {
  return (
    <div className="badge-rotate">
      <svg className="ring" viewBox="0 0 132 132">
        <defs><path id="circ" d="M66,66 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" /></defs>
        <text><textPath href="#circ">{text}</textPath></text>
      </svg>
      <span className="core"><Icon name="arrowUpRight" /></span>
    </div>
  );
}

export function PageHero({ title, eyebrow, lead, image, video, crumbs, children, minH }) {
  return (
    <section className="page-hero" style={minH ? { minHeight: minH } : undefined}>
      <div className="hero-media">
        {video ? <BgVideo src={video} poster={img(image, 1600)} /> : <img src={img(image, 2000)} alt="" />}
      </div>
      <div className="container hero-inner">
        {crumbs && (
          <div className="crumbs">
            <Link to="/">Home</Link><span>/</span><span>{crumbs}</span>
          </div>
        )}
        {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
        <Split as="h1" text={title} className="display-l on-dark mt-24" />
        {lead && <p className="lead rv mt-24" style={{ color: 'rgba(255,255,255,.82)' }}>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, light }) {
  return (
    <div className={`section-head ${light ? 'on-dark' : ''}`}>
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <Split text={title} className="display-m" />
      </div>
      {children}
    </div>
  );
}
