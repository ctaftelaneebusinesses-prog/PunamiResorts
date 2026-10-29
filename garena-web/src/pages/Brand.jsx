import { Eyebrow, Split, Pic, Btn, PageHero, Marquee } from '../components/ui';
import { DestCard, CtaBand, PackageCard, Testimonials } from '../components/Sections';
import Icon from '../components/Icon';
import { LeComfortMark } from './Home';
import { BRANDS, LOCATIONS, PACKAGES, VID } from '../data';

const COPY = {
  garena: {
    hero: 'poolPalms', video: VID.greenCoast, title: 'G [[Arena]]',
    intro: 'Born from a simple idea — that the best celebrations happen outdoors, under open skies and among trees.',
    story: 'Since 2014, G Arena has grown from a single family pool garden into five leisure destinations across Telangana and Andhra Pradesh. Each arena pairs landscaped lawns and pools with a family restaurant and a celebration venue, so a single visit can hold a swim, a feast and a party.',
    pillars: [['pool', 'Open-air leisure', 'Pools, lawns and play areas designed for full-day family outings.'], ['cake', 'Celebrations', 'Party halls and lawns for 50 to 500 guests, with décor and catering included.'], ['utensils', 'Family dining', 'Regional Telugu cuisine, buffets and live counters at every arena.'], ['leaf', 'Rooted in nature', 'Mature trees, native planting and wide green spaces at every property.']],
    imgs: ['poolAerial', 'banquetHall', 'friendsDining'],
    awards: ['Best Family Destination — Telangana Tourism Awards 2024', 'FSSAI Certified Kitchens', 'Certificate of Excellence — Tripadvisor 2023'],
  },
  lecomfort: {
    hero: 'beachPalm', video: VID.beachAerial, title: 'LE [[Comfort]]',
    intro: 'Small, quiet and personal — boutique stays for travellers who prefer calm over crowds.',
    story: 'LE Comfort brings the warmth of G Arena hospitality to overnight stays. Our three properties, in the hill town of Kuppam and on the Mypadu and Revupolavaram coasts, are intentionally intimate. Rooms are thoughtfully designed, dining is unhurried and staff remember your name.',
    pillars: [['bed', 'Considered rooms', 'Suites, cottages and sea-facing rooms with premium linen.'], ['spa', 'Slow wellness', 'Seaside massages, spa rituals and quiet pool decks.'], ['utensils', 'Coastal kitchens', 'Fresh catch, Andhra classics and leisurely breakfasts.'], ['heart', 'Personal service', 'A dedicated host for every stay, available 24×7.']],
    imgs: ['roomDark', 'infinitySea', 'terraceSea'],
    awards: ['Boutique Stay of the Year — AP Hospitality 2025', 'Travellers’ Choice — Tripadvisor 2024', 'Clean & Safe Certified'],
  },
};

export default function Brand({ id }) {
  const b = BRANDS[id];
  const c = COPY[id];
  const locs = LOCATIONS.filter(l => l.brand === id);
  const theme = { '--primary': b.colors.primary, '--accent': b.colors.accent, '--soft': id === 'garena' ? '#EEF2E1' : '#F3EBDD' };
  return (
    <div style={theme}>
      <PageHero title={c.title} eyebrow={b.tagline} lead={b.desc} video={c.video} image={c.hero} crumbs={b.name} minH="96svh">
        <div className="flex gap-12 wrap mt-32 rv">
          <Btn to={`/booking`} variant="light">Request a booking</Btn>
          <Btn to="/destinations" variant="outline">All destinations</Btn>
        </div>
      </PageHero>

      <section className="section">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div>
            {id === 'garena' ? <img src="./img/g-arena-logo.png" alt="G Arena" style={{ height: 120 }} className="rv" /> : <div className="rv"><LeComfortMark dark /></div>}
            <p className="statement mt-32 rv" style={{ fontSize: 'clamp(1.8rem,3.2vw,3.2rem)' }}>{c.intro}</p>
            <p className="lead mt-24 rv">{c.story}</p>
            <div className="mt-32 rv" style={{ display: 'grid', gap: 10 }}>
              {c.awards.map(a => <div key={a} className="flex items-center gap-12" style={{ fontSize: 14.5, fontWeight: 600 }}><Icon name="sparkle" size={18} style={{ color: 'var(--accent)' }} />{a}</div>)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Pic k={c.imgs[0]} w={900} className="ratio-34 frame-arch" reveal style={{ gridRow: 'span 2', alignSelf: 'center' }} />
            <Pic k={c.imgs[1]} w={700} className="ratio-11" reveal style={{ '--d': '.15s' }} />
            <Pic k={c.imgs[2]} w={700} className="ratio-11 frame-leaf" reveal style={{ '--d': '.3s' }} />
          </div>
        </div>
      </section>

      <section className="section-sm bg-soft">
        <div className="container">
          <div className="grid-4">
            {c.pillars.map(([ic, t, d], i) => (
              <div key={t} className="amenity rv" style={{ '--d': `${i * .08}s`, padding: 30 }}>
                <div className="ic"><Icon name={ic} /></div>
                <h4 style={{ fontFamily: 'var(--f-display)', fontSize: 28, fontWeight: 400 }}>{t}</h4>
                <p style={{ fontSize: 14.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Our destinations</Eyebrow><Split text={`${locs.length} addresses, [[one]] standard.`} className="display-m" /></div>
            <p className="lead rv">Each property has its own character, colours and landscape, with the same {b.name} hospitality throughout.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
            {locs.map(l => <div className="rv" key={l.id}><DestCard l={l} /></div>)}
          </div>
        </div>
      </section>

      <Marquee items={id === 'garena' ? ['Suryapet', 'Kamareddy', 'Palamaneru', 'Nagari', 'DV Satram'] : ['Kuppam', 'Mypadu Beach', 'Revupolavaram', 'Boutique stays']} />

      <section className="section">
        <div className="container">
          <div className="section-head"><div><Eyebrow>Signature packages</Eyebrow><Split text="Made for [[you]]." className="display-m" /></div></div>
          <div className="grid-3">{PACKAGES.filter(p => p.brand === id).concat(PACKAGES.filter(p => p.brand !== id)).slice(0, 3).map((p, i) => <PackageCard key={p.name} p={p} i={i} />)}</div>
        </div>
      </section>

      <section className="section bg-ivory"><div className="container"><Testimonials /></div></section>
      <CtaBand image={c.hero} />
    </div>
  );
}
