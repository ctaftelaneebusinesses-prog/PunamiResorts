import { useState } from 'react';
import { PageHero, Eyebrow, Split } from '../components/ui';
import Icon from '../components/Icon';
import { LOCATIONS, VID, img } from '../data';

const ITEMS = LOCATIONS.flatMap(l => l.gallery.map((g, i) => ({ k: g, loc: l.id, name: l.name, tall: i % 3 === 1 })));
const VIDEOS = [[VID.lake, 'lakeDock', 'G Arena · Morning by the lake'], [VID.beachAerial, 'beachSunrise', 'LE Comfort · Revupolavaram coast'], [VID.waterfall, 'mountainDeck', 'G Arena · Nagari hills']];

export default function Gallery() {
  const [f, setF] = useState('all');
  const [lb, setLb] = useState(null);
  return (
    <>
      <PageHero title="A gallery of [[slow]] days." eyebrow="Photos & Films" image="palmsInfinity" crumbs="Gallery" />
      <section className="section">
        <div className="container">
          <div className="filters" style={{ marginBottom: 32 }}>
            <button className={`chip ${f === 'all' ? 'on' : ''}`} onClick={() => setF('all')}>All</button>
            {LOCATIONS.map(l => <button key={l.id} className={`chip ${f === l.id ? 'on' : ''}`} onClick={() => setF(l.id)}>{l.name}</button>)}
          </div>
          <div className="masonry">
            {ITEMS.filter(i => f === 'all' || i.loc === f).map((it, i) => (
              <div key={it.loc + it.k + i} className="m-item" onClick={() => setLb(it)} data-cursor="View">
                <img src={img(it.k, 800)} alt={it.name} loading="lazy" style={{ aspectRatio: it.tall ? '3/4' : '4/3', objectFit: 'cover' }} />
                <span className="cap">{it.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-forest">
        <div className="container on-dark">
          <Eyebrow light>Films</Eyebrow>
          <Split text="Watch the [[mood]]." className="display-m mt-24" />
          <div className="grid-3 mt-48">
            {VIDEOS.map(([src, poster, cap]) => (
              <div key={cap} className="rv">
                <div className="frame ratio-45" data-cursor="Play">
                  <video src={src} poster={img(poster, 800)} muted loop playsInline preload="none"
                    onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} onClick={e => (e.target.paused ? e.target.play() : e.target.pause())} />
                </div>
                <div className="flex items-center gap-8 mt-16" style={{ fontSize: 14 }}><Icon name="play" size={14} style={{ color: 'var(--leaf)' }} />{cap}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className={`lightbox ${lb ? 'open' : ''}`} onClick={() => setLb(null)}>
        <button className="icon-btn lb-close" aria-label="Close"><Icon name="close" /></button>
        {lb && <img src={img(lb.k, 1800)} alt="" />}
        {lb && <div className="lb-cap">{lb.name}</div>}
      </div>
    </>
  );
}
