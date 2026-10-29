import { PageHero, Eyebrow, Split, Pic, Marquee } from '../components/ui';
import { CtaBand } from '../components/Sections';
import Icon from '../components/Icon';
import { VID } from '../data';

const TIMELINE = [
  ['2014', 'The first arena', 'G Arena opens in Suryapet as a family pool garden with a small restaurant.', 'poolGarden'],
  ['2017', 'Room to celebrate', 'A 400-guest celebration lawn and banquet hall open, along with our second arena in Kamareddy.', 'banquetHall'],
  ['2020', 'Into the hills', 'Palamaneru and Nagari bring G Arena to the hills and forests of Andhra Pradesh.', 'forestBridge'],
  ['2023', 'LE Comfort is born', 'Our boutique stay brand opens in Kuppam, followed by Mypadu Beach.', 'roomDark'],
  ['2026', 'Eight destinations', 'DV Satram and Revupolavaram complete a family of eight destinations across two states.', 'beachSunrise'],
];

export default function Story() {
  return (
    <>
      <PageHero title="A story [[grown]] from the ground." eyebrow="About us" video={VID.forest} image="forest" crumbs="Our Story"
        lead="From a single pool garden in Suryapet to eight destinations across two states. Our story is one of land, people and hospitality." />

      <section className="section">
        <div className="container">
          <Eyebrow>Our belief</Eyebrow>
          <p className="statement mt-32 rv">Hospitality should feel like a <em style={{ color: 'var(--accent)' }}>garden</em> — open, generous and always growing.</p>
          <div className="grid-3 mt-64">
            {[['leaf', 'Nature first', 'We build around existing trees, water and landscape, never against them.'], ['users', 'Family at heart', 'Spaces designed so three generations can enjoy the same day together.'], ['shield', 'Honest value', 'Transparent pricing, clean kitchens and staff who go the extra mile.']].map(([ic, t, d], i) => (
              <div key={t} className="rv" style={{ '--d': `${i * .1}s`, borderTop: '1px solid var(--line)', paddingTop: 26 }}>
                <Icon name={ic} size={28} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: 34, margin: '14px 0 10px' }}>{t}</h3>
                <p className="muted" style={{ margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <div className="center" style={{ marginBottom: 60 }}><Eyebrow>Milestones</Eyebrow><Split text="Twelve years, [[eight]] homes." className="display-m mt-24" /></div>
          <div className="timeline">
            {TIMELINE.map(([y, t, d, im]) => (
              <div className="t-item rv" key={y}>
                <div className="yr">{y}</div>
                <div>
                  <h3>{t}</h3>
                  <p className="muted" style={{ margin: '0 0 18px', maxWidth: '44ch' }}>{d}</p>
                  <Pic k={im} w={700} className="ratio-32" style={{ maxWidth: 420 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={['Awards', 'Telangana Tourism 2024', 'Tripadvisor Excellence', 'FSSAI Certified', 'AP Hospitality 2025']} />

      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <Pic k="lobby" w={1200} className="ratio-45 frame-arch" reveal />
          <div>
            <Eyebrow>In the press</Eyebrow>
            <Split text="What they're [[saying]]." className="display-m mt-24" />
            {[['The Hindu', '“A green oasis on the Hyderabad–Vijayawada highway that has quietly become the region’s favourite party venue.”'], ['Deccan Chronicle', '“LE Comfort Revupolavaram may be the best-kept secret on the Vizag coast.”'], ['Eenadu', '“Family hospitality, Andhra flavours and spaces that feel effortless.”']].map(([s, q]) => (
              <div key={s} className="rv" style={{ padding: '24px 0', borderBottom: '1px solid var(--line)' }}>
                <div className="label muted">{s}</div>
                <p style={{ fontFamily: 'var(--f-display)', fontSize: 26, lineHeight: 1.25, margin: '8px 0 0' }}>{q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Become part of our [[story]]." image="treeSun" />
    </>
  );
}
