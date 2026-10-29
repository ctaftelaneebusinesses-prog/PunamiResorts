import { useState } from 'react';
import { PageHero, Eyebrow, Split, Pic, Btn } from '../components/ui';
import { CtaBand } from '../components/Sections';
import Icon from '../components/Icon';
import { LOCATIONS, VID } from '../data';

const OCCASIONS = [
  ['cake', 'Birthdays', 'balloons', 'Themed décor, cake tables and games for every age.'],
  ['heart', 'Anniversaries & Engagements', 'aisle', 'Floral stages, candlelit dinners and curated menus.'],
  ['briefcase', 'Corporate Events', 'conference', 'Offsites, team days, award nights and conferences.'],
  ['music', 'Parties & Get-togethers', 'djCrowd', 'DJ nights, pool parties and family reunions.'],
];
const SERVICES = [['sparkle', 'Decoration', 'Theme, floral and lighting décor by our in-house team.'], ['utensils', 'Catering', 'Veg & non-veg menus from ₹450 per guest.'], ['music', 'DJ & Music', 'Professional DJ, sound and lighting rigs.'], ['users', 'Minimum guests', 'Packages start from 25 guests.']];

export default function Celebrations() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <PageHero title="Moments worth [[celebrating]]." eyebrow="Events & Occasions" image="fairyLights" crumbs="Celebrations"
        lead="Lawns, halls and beach decks for 25 to 500 guests, with décor, catering and music arranged by our events team." />

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Occasions</Eyebrow><Split text="Every reason to [[gather]]." className="display-m" /></div>
            <p className="lead rv">Tell us the occasion. We handle the venue, décor, food and music.</p>
          </div>
          <div className="grid-4">
            {OCCASIONS.map(([ic, t, im, d], i) => (
              <div key={t} className="card rv" style={{ '--d': `${i * .08}s` }}>
                <Pic k={im} w={700} className="ratio-45" />
                <div className="card-body">
                  <Icon name={ic} size={22} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: 28, margin: '10px 0 6px' }}>{t}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: 14 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-forest">
        <div className="container grid-2 on-dark" style={{ alignItems: 'center' }}>
          <div>
            <Eyebrow light>End-to-end planning</Eyebrow>
            <Split text="You celebrate. We [[handle]] the rest." className="display-m mt-24" />
            <div style={{ display: 'grid', gap: 0, marginTop: 40 }}>
              {SERVICES.map(([ic, t, d]) => (
                <div key={t} className="flex gap-16 rv" style={{ padding: '20px 0', borderBottom: '1px solid var(--line-light)' }}>
                  <Icon name={ic} size={24} style={{ color: 'var(--leaf)', flex: 'none' }} />
                  <div><div style={{ fontFamily: 'var(--f-display)', fontSize: 26 }}>{t}</div><div style={{ opacity: .7, fontSize: 14.5 }}>{d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <Pic k="banquetHall" w={1200} className="ratio-45 frame-arch" reveal />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Eyebrow>Venues</Eyebrow>
          <Split text="Find the right [[space]]." className="display-m mt-24" />
          <div className="table-wrap mt-48 rv">
            <table className="req">
              <thead><tr><th>Destination</th><th>Event space</th><th>Brand</th><th>Catering</th><th></th></tr></thead>
              <tbody>
                {LOCATIONS.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{l.name}</td>
                    <td>{l.amenities.partyHall}</td>
                    <td>{l.brand === 'garena' ? 'G Arena' : 'LE Comfort'}</td>
                    <td>{l.dining.cuisine}</td>
                    <td><a className="link-line" href={`#/destinations/${l.id}`}>View <Icon name="arrow" /></a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-ivory" id="enquire">
        <div className="container grid-2">
          <div>
            <Eyebrow>Event enquiry</Eyebrow>
            <Split text="Let's plan [[together]]." className="display-m mt-24" />
            <p className="lead mt-24 rv">Share a few details and our events team will call you with venue options, menus and a tailored quote within 24 hours.</p>
            <Pic k="dinnerDecor" w={900} className="ratio-32 mt-48" reveal />
          </div>
          {sent ? (
            <div className="success" style={{ alignSelf: 'center' }}>
              <svg className="check" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" /><path d="M38 62l15 15 30-32" /></svg>
              <h3 className="display-s">Enquiry received.</h3>
              <p className="muted">Our events team will call you within 24 hours.</p>
            </div>
          ) : (
            <form className="form-grid rv" style={{ alignContent: 'start' }} onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <div className="field"><label>Name *</label><input required /></div>
              <div className="field"><label>Mobile *</label><input required inputMode="tel" /></div>
              <div className="field"><label>Occasion</label><select>{OCCASIONS.map(o => <option key={o[1]}>{o[1]}</option>)}</select></div>
              <div className="field"><label>Destination</label><select>{LOCATIONS.map(l => <option key={l.id}>{l.name}</option>)}</select></div>
              <div className="field"><label>Event date</label><input type="date" /></div>
              <div className="field"><label>Expected guests</label><input type="number" min="25" placeholder="Minimum 25" /></div>
              <div className="field full">
                <label>Services required</label>
                <div className="filters">{['Decoration', 'Catering', 'DJ & Music', 'Photography', 'Stay for guests'].map(s => <label key={s} className="chip"><input type="checkbox" style={{ accentColor: 'var(--forest)' }} />{s}</label>)}</div>
              </div>
              <div className="field full"><label>Tell us more</label><textarea placeholder="Theme, budget, timings…" /></div>
              <div className="full"><Btn type="submit">Send enquiry</Btn></div>
            </form>
          )}
        </div>
      </section>
      <CtaBand title="Raise a toast at [[G Arena]]." video={VID.waterfall} image="fairyLights" />
    </>
  );
}
