import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eyebrow, Split, Btn } from '../components/ui';
import Icon from '../components/Icon';
import { LOCATIONS, BRANDS } from '../data';

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="section" style={{ paddingTop: 160 }}>
        <div className="container grid-2">
          <div>
            <Eyebrow>Contact us</Eyebrow>
            <Split as="h1" text="We'd love to [[hear]] from you." className="display-l mt-24" />
            <p className="lead mt-24 rv">Reservations, events, partnerships or feedback. Reach our team by phone, WhatsApp or the form, and we'll get back to you within a few hours.</p>
            <div className="grid-2 mt-48 rv" style={{ gap: 16 }}>
              {[['phone', 'Call reservations', BRANDS.garena.phone, `tel:${BRANDS.garena.phone}`], ['whatsapp', 'WhatsApp concierge', 'Chat now', `https://wa.me/${BRANDS.garena.whatsapp}`], ['mail', 'Email', BRANDS.garena.email, `mailto:${BRANDS.garena.email}`], ['pin', 'Head office', 'Kuppam, Andhra Pradesh', '#map']].map(([ic, t, v, href]) => (
                <a key={t} href={href} className="contact-card">
                  <Icon name={ic} size={24} style={{ color: 'var(--accent)' }} />
                  <span className="label muted">{t}</span>
                  <b style={{ fontSize: 16 }}>{v}</b>
                </a>
              ))}
            </div>
          </div>
          <div className="rv" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 'clamp(24px,3vw,40px)', border: '1px solid var(--line)', alignSelf: 'start' }}>
            {sent ? (
              <div className="success">
                <svg className="check" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" /><path d="M38 62l15 15 30-32" /></svg>
                <h3 className="display-s">Message sent.</h3>
                <p className="muted">We'll respond within a few hours.</p>
              </div>
            ) : (
              <form className="form-grid" onSubmit={e => { e.preventDefault(); setSent(true); }}>
                <div className="full"><h3 className="display-s">Send a message</h3></div>
                <div className="field"><label>Name *</label><input required /></div>
                <div className="field"><label>Mobile *</label><input required inputMode="tel" /></div>
                <div className="field full"><label>Email</label><input type="email" /></div>
                <div className="field"><label>Destination</label><select><option>General enquiry</option>{LOCATIONS.map(l => <option key={l.id}>{l.name}</option>)}</select></div>
                <div className="field"><label>Topic</label><select><option>Reservation</option><option>Event / celebration</option><option>Feedback</option><option>Partnership</option></select></div>
                <div className="field full"><label>Message</label><textarea /></div>
                <div className="full"><Btn type="submit">Send message</Btn></div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-ivory">
        <div className="container">
          <div className="section-head"><div><Eyebrow>Destination contacts</Eyebrow><Split text="Reach each [[destination]] directly." className="display-m" /></div></div>
          <div className="grid-4">
            {LOCATIONS.map((l, i) => (
              <div key={l.id} className="contact-card rv" style={{ '--d': `${(i % 4) * .06}s` }}>
                <span className="label" style={{ color: l.theme.primary }}>{l.brand === 'garena' ? 'G Arena' : 'LE Comfort'} · {l.no}</span>
                <h3>{l.name}</h3>
                <div className="row"><Icon name="pin" />{l.distance.split('·')[0]}</div>
                <div className="row"><Icon name="phone" /><a href={`tel:${l.phone}`}>{l.phone}</a></div>
                <div className="row"><Icon name="mail" /><a href={`mailto:${l.email}`}>{l.email}</a></div>
                <div className="row"><Icon name="clock" />{l.hours.label.split('·')[0]}</div>
                <div className="flex gap-16 mt-8">
                  <Link to={`/destinations/${l.id}`} className="link-line">Details <Icon name="arrow" /></Link>
                  <a className="link-line" target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${encodeURIComponent(l.name + ', ' + l.state)}`}>Directions <Icon name="arrow" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="map" className="section-sm">
        <div className="container" style={{ height: 480 }}>
          <iframe className="map-embed" title="Head office" loading="lazy" src="https://maps.google.com/maps?q=Kuppam%2C%20Andhra%20Pradesh&z=12&output=embed" />
        </div>
      </section>
    </>
  );
}
