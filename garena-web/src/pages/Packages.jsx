import { useState } from 'react';
import { PageHero, Eyebrow, Split } from '../components/ui';
import { PackagesGrid, CtaBand } from '../components/Sections';
import { LOCATIONS, fmtINR } from '../data';

const FAQ = [
  ['Do I need to pay online?', 'No. The website only accepts reservation requests. Our team calls to confirm availability, and payment is collected at the property.'],
  ['Are prices inclusive of taxes?', 'Room tariffs and packages are shown before GST. The final amount is confirmed on the call.'],
  ['Is pool access charged separately?', 'Pool access is free for stay guests. Day visitors pay per person, as listed on each destination page.'],
  ['What is the cancellation policy?', 'Most reservations can be cancelled free of charge 24–72 hours in advance, depending on the destination and booking type.'],
  ['Do children get special pricing?', 'Children under 5 enter free. Children aged 5–12 receive 50% off day-out packages.'],
];

export default function Packages() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHero title="Packages & [[pricing]]." eyebrow="Transparent pricing" image="cabanas" crumbs="Packages"
        lead="Clear, all-inclusive prices for day-outs, stays and celebrations. You pay only when your booking is confirmed." />

      <section className="section">
        <div className="container">
          <div className="section-head"><div><Eyebrow>Signature packages</Eyebrow><Split text="Pick your [[perfect]] day." className="display-m" /></div></div>
          <PackagesGrid />
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <Eyebrow>Tariff overview</Eyebrow>
          <Split text="Rooms & tables, [[by destination]]." className="display-m mt-24" />
          <div className="table-wrap mt-48 rv">
            <table className="req">
              <thead><tr><th>Destination</th><th>Room tariff from</th><th>Room categories</th><th>Dining (per plate)</th><th>Pool access</th></tr></thead>
              <tbody>
                {LOCATIONS.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{l.name}</td>
                    <td><b>{fmtINR(Math.min(...l.rooms.map(r => r.price)))}</b> <span className="muted">/ night</span></td>
                    <td>{l.rooms.map(r => r.type.split('·')[0]).join(', ')}</td>
                    <td>{l.dining.price.replace(' per plate', '')}</td>
                    <td>{typeof l.amenities.pool === 'string' ? l.amenities.pool.split('·')[1] : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="muted mt-24" style={{ fontSize: 13 }}>Indicative prices. Final tariffs are confirmed by our team at the time of booking.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div><Eyebrow>Good to know</Eyebrow><Split text="Frequently [[asked]]." className="display-m mt-24" /></div>
          <div>
            {FAQ.map(([q, a], i) => (
              <div key={q} className={`acc-item ${open === i ? 'open' : ''}`}>
                <button onClick={() => setOpen(open === i ? -1 : i)}>{q}<i>+</i></button>
                <div className="acc-body"><div><p>{a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
