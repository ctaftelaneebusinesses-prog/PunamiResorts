import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { Btn, Eyebrow, Split } from '../components/ui';
import { LOCATIONS, img, locById } from '../data';

const TYPES = [
  ['table', 'utensils', 'Dining table', 'Reserve tables for lunch or dinner'],
  ['room', 'bed', 'Room stay', 'Overnight stays and weekend getaways'],
  ['event', 'cake', 'Event / celebration', 'Birthdays, anniversaries, corporate'],
  ['day', 'pool', 'Pool day-out', 'Pool access with food packages'],
];
const SLOTS = ['7:00 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM', '7:00 PM', '9:00 PM'];
const STEPS = ['Destination', 'Reservation', 'Date & guests', 'Your details'];

export default function Booking() {
  const [qs] = useSearchParams();
  const [step, setStep] = useState(qs.get('loc') ? 1 : 0);
  const [done, setDone] = useState(false);
  const [f, setF] = useState({
    loc: qs.get('loc') || '', type: qs.get('type') || 'table', date: 0, slot: '1:00 PM',
    guests: Number(String(qs.get('guests') || '4').replace('+', '')), units: 1, nights: 1,
    name: '', phone: '', email: '', notes: '', ack: 'whatsapp',
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const loc = locById(f.loc);
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }), []);
  const date = days[f.date];
  const unitLabel = f.type === 'room' ? 'Rooms' : f.type === 'event' ? 'Halls' : f.type === 'day' ? 'Cabanas' : 'Tables';
  const ref = useMemo(() => 'GA-' + Math.floor(100000 + Math.random() * 899999), []);
  const [tried, setTried] = useState(false);
  const nameOk = f.name.trim().length >= 2;
  const phoneOk = f.phone.replace(/\D/g, '').length >= 10;
  const canNext = [!!f.loc, !!f.type, true, nameOk && phoneOk][step];
  const theme = loc ? { '--primary': loc.theme.primary, '--accent': loc.theme.accent, '--soft': loc.theme.soft } : {};

  const go = n => { setTried(false); setStep(n); scrollTo({ top: 0, behavior: 'smooth' }); };
  const next = () => (canNext ? go(step + 1) : setTried(true));
  const submit = e => { e.preventDefault(); if (canNext) { setDone(true); scrollTo(0, 0); } else setTried(true); };

  if (done) return (
    <div style={theme}>
      <section className="section" style={{ paddingTop: 160 }}>
        <div className="container success">
          <svg className="check" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" /><path d="M38 62l15 15 30-32" /></svg>
          <Eyebrow>Request received · Ref {ref}</Eyebrow>
          <Split as="h1" text={`Thank you, [[${(f.name.split(' ')[0] || 'guest')}]].`} className="display-l mt-24" />
          <p className="lead" style={{ margin: '24px auto 0' }}>Your request for <b>{loc?.name}</b> on <b>{date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</b> has been received. Our team will call you on <b>{f.phone}</b> shortly to confirm availability.</p>
          <div className="timeline-h">
            {[['01', 'Request received', 'A confirmation has been sent to you on ' + (f.ack === 'whatsapp' ? 'WhatsApp' : f.ack === 'sms' ? 'SMS' : 'email') + '.'],
              ['02', 'Concierge call', 'We call within 30 minutes during working hours to confirm.'],
              ['03', 'Confirmation', 'Your reservation is confirmed over the phone.'],
              ['04', 'Pay at property', 'Payment is collected on arrival. No online payment required.']].map(([k, t, d]) => (
              <div key={k}><div className="k">{k}</div><b style={{ display: 'block', margin: '6px 0' }}>{t}</b><span className="muted" style={{ fontSize: 14 }}>{d}</span></div>
            ))}
          </div>
          <div className="flex gap-12 wrap mt-48" style={{ justifyContent: 'center' }}>
            <Btn to={`/destinations/${f.loc}`}>Back to {loc?.name}</Btn>
            <Btn href="https://wa.me/919000000001" variant="outline">Chat on WhatsApp</Btn>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div style={theme}>
      <section className="section" style={{ paddingTop: 150 }}>
        <div className="container">
          <div className="section-head">
            <div><Eyebrow>Reservation request</Eyebrow><Split as="h1" text="Reserve your [[visit]]." className="display-l" /></div>
            <div className="notice rv" style={{ maxWidth: 420 }}><Icon name="shield" /><span><b>No online payment.</b> Submit your request and our concierge will call you to confirm availability. Payment is made at the property.</span></div>
          </div>

          <form className="wizard" onSubmit={submit}>
            <ol className="steps">
              {STEPS.map((s, i) => (
                <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''} onClick={() => i < step && go(i)} style={{ cursor: i < step ? 'pointer' : 'default' }}>
                  <span className="n">{i < step ? <Icon name="check" size={16} /> : i + 1}</span><span className="t">{s}</span>
                </li>
              ))}
            </ol>

            <div>
              {/* STEP 1 */}
              <div className={`step-panel ${step === 0 ? 'on' : ''}`}>
                <h2 className="display-s">Where would you like to go?</h2>
                {['garena', 'lecomfort'].map(b => (
                  <div key={b} className="mt-32">
                    <div className="label muted" style={{ marginBottom: 14 }}>{b === 'garena' ? 'G Arena · Leisure & celebrations' : 'LE Comfort · Boutique stays'}</div>
                    <div className="choice-grid">
                      {LOCATIONS.filter(l => l.brand === b).map(l => (
                        <div key={l.id} className={`choice ${f.loc === l.id ? 'on' : ''}`} onClick={() => set('loc', l.id)}>
                          <span className="tick"><Icon name="check" /></span>
                          <div className="frame"><img src={img(l.hero, 500)} alt="" loading="lazy" /></div>
                          <div className="c-body"><b>{l.name}</b><span>{l.state} · {l.tagline}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* STEP 2 */}
              <div className={`step-panel ${step === 1 ? 'on' : ''}`}>
                <h2 className="display-s">What would you like to reserve{loc ? ` at ${loc.name}` : ''}?</h2>
                <div className="choice-grid mt-32">
                  {TYPES.map(([k, ic, t, d]) => (
                    <div key={k} className={`choice type-choice ${f.type === k ? 'on' : ''}`} onClick={() => set('type', k)}>
                      <span className="tick"><Icon name="check" /></span>
                      <span className="ic"><Icon name={ic} /></span>
                      <div><b style={{ fontFamily: 'var(--f-display)', fontSize: 26, fontWeight: 400 }}>{t}</b><div className="muted" style={{ fontSize: 13.5 }}>{d}</div></div>
                    </div>
                  ))}
                </div>
                {loc && (
                  <div className="notice mt-32"><Icon name="info" /><span><b>{loc.name}:</b> {loc.booking.advance.toLowerCase()} · {loc.booking.minmax} · {loc.booking.cancel}.</span></div>
                )}
              </div>

              {/* STEP 3 */}
              <div className={`step-panel ${step === 2 ? 'on' : ''}`}>
                <h2 className="display-s">Choose a date and time</h2>
                <div className="label muted mt-32" style={{ marginBottom: 12 }}>{date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
                <div className="date-strip">
                  {days.map((d, i) => {
                    const we = d.getDay() === 0 || d.getDay() === 6;
                    return (
                      <button type="button" key={i} className={`date-chip ${f.date === i ? 'on' : ''} ${we ? 'peak' : ''}`} onClick={() => set('date', i)}>
                        <small>{d.toLocaleDateString('en-IN', { weekday: 'short' })}</small>
                        <span className="d">{d.getDate()}</span>
                        <small>{d.toLocaleDateString('en-IN', { month: 'short' })}</small>
                      </button>
                    );
                  })}
                </div>
                {f.type !== 'room' ? (
                  <>
                    <div className="label muted mt-32" style={{ marginBottom: 12 }}>Preferred time slot · {loc?.stats.slot || '2 hrs'} each</div>
                    <div className="slot-grid">
                      {SLOTS.map((s, i) => {
                        const full = (i + f.date) % 5 === 3;
                        return <button type="button" key={s} disabled={full} className={`slot ${f.slot === s ? 'on' : ''} ${full ? 'full' : ''}`} onClick={() => set('slot', s)}>{s}</button>;
                      })}
                    </div>
                  </>
                ) : (
                  <div className="mt-32">
                    <div className="label muted" style={{ marginBottom: 12 }}>Number of nights</div>
                    <div className="stepper"><button type="button" onClick={() => set('nights', Math.max(1, f.nights - 1))}>−</button><output>{f.nights}</output><button type="button" onClick={() => set('nights', Math.min(14, f.nights + 1))}>+</button></div>
                  </div>
                )}
                <div className="grid-2 mt-32" style={{ gap: 24 }}>
                  <div>
                    <div className="label muted" style={{ marginBottom: 12 }}>Guests</div>
                    <div className="stepper"><button type="button" onClick={() => set('guests', Math.max(1, f.guests - 1))}>−</button><output>{f.guests}</output><button type="button" onClick={() => set('guests', Math.min(500, f.guests + 1))}>+</button></div>
                  </div>
                  <div>
                    <div className="label muted" style={{ marginBottom: 12 }}>{unitLabel} required</div>
                    <div className="stepper"><button type="button" onClick={() => set('units', Math.max(1, f.units - 1))}>−</button><output>{f.units}</output><button type="button" onClick={() => set('units', Math.min(10, f.units + 1))}>+</button></div>
                  </div>
                </div>
                <div className="notice mt-32"><Icon name="clock" /><span>Live availability shown for preview. Weekends are marked <b>Peak</b>. Final confirmation is given by our team over the phone.</span></div>
              </div>

              {/* STEP 4 */}
              <div className={`step-panel ${step === 3 ? 'on' : ''}`}>
                <div className="grid-2" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start' }}>
                  <div>
                    <h2 className="display-s">Your details</h2>
                    <div className="form-grid mt-32">
                      <div className={`field full ${tried && !nameOk ? 'err' : ''}`}><label>Full name *</label><input value={f.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Ramya Krishnan" />{tried && !nameOk && <small className="field-err">Please enter your name</small>}</div>
                      <div className={`field ${tried && !phoneOk ? 'err' : ''}`}><label>Mobile number *</label><input value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="98765 43210" inputMode="tel" />{tried && !phoneOk && <small className="field-err">Enter a 10-digit mobile number</small>}</div>
                      <div className="field"><label>Email</label><input type="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" /></div>
                      <div className="field full"><label>Special requests</label><textarea value={f.notes} onChange={e => set('notes', e.target.value)} placeholder="Occasion, dietary preferences, decoration, accessibility needs…" /></div>
                      <div className="field full">
                        <label>Send my acknowledgement via</label>
                        <div className="filters">
                          {[['whatsapp', 'WhatsApp'], ['sms', 'SMS'], ['email', 'Email']].map(([k, t]) => <button type="button" key={k} className={`chip ${f.ack === k ? 'on' : ''}`} onClick={() => set('ack', k)}>{t}</button>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="summary-card">
                    <span className="label" style={{ color: 'var(--leaf-soft)' }}>Request summary</span>
                    <div style={{ fontFamily: 'var(--f-display)', fontSize: 32, marginTop: 8, lineHeight: 1.05 }}>{loc?.name || '—'}</div>
                    <dl>
                      <dt>Reservation</dt><dd>{TYPES.find(t => t[0] === f.type)[2]}</dd>
                      <dt>Date</dt><dd>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</dd>
                      <dt>{f.type === 'room' ? 'Nights' : 'Time'}</dt><dd>{f.type === 'room' ? f.nights : f.slot}</dd>
                      <dt>Guests</dt><dd>{f.guests}</dd>
                      <dt>{unitLabel}</dt><dd>{f.units}</dd>
                      <dt>Payment</dt><dd>At property</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="flex between items-center mt-48" style={{ borderTop: '1px solid var(--line)', paddingTop: 24 }}>
                {step > 0 ? <button type="button" className="link-line" onClick={() => go(step - 1)}><Icon name="arrowLeft" /> Back</button> : <Link to="/destinations" className="link-line">Browse destinations</Link>}
                <div className="flex items-center gap-16">
                  {tried && !canNext && <span className="field-err">{step === 0 ? 'Please choose a destination' : 'Please complete the required fields'}</span>}
                  {/* Distinct keys so React never morphs the Continue button into the submit button mid-click */}
                  {step < 3
                    ? <Btn key="next" onClick={next}>Continue · Step {step + 2} of 4</Btn>
                    : <Btn key="send" type="submit">Send request</Btn>}
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
