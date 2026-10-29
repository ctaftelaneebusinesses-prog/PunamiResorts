import { useEffect, useState } from 'react';
import { Eyebrow, Split } from '../components/ui';

const SECTIONS = [
  ['privacy', 'Privacy Policy', [
    ['Information we collect', 'When you submit a reservation request or enquiry, we collect your name, mobile number, email address (optional), preferred destination, dates and guest count, along with any notes you provide.'],
    ['How we use it', 'Your information is used only to process your request, call you to confirm availability, send acknowledgements by SMS, WhatsApp or email, and improve our services. We never sell your data.'],
    ['Data retention', 'Reservation records are kept for up to 24 months for operational and legal purposes, after which they are securely deleted.'],
  ]],
  ['terms', 'Terms & Conditions', [
    ['Reservation requests', 'Submitting a request on this website does not guarantee a booking. A reservation is confirmed only after our team calls you and confirms availability.'],
    ['Payments', 'No online payment is collected through this website. Payment is made at the property or through a method agreed on the confirmation call.'],
    ['Guest conduct', 'Guests must follow pool safety rules, property timings and staff instructions. Outside food and beverages are not permitted unless agreed in advance.'],
  ]],
  ['cancellation', 'Cancellation & Refund', [
    ['Table & day-out bookings', 'Cancel free of charge up to 24 hours before your slot. Later cancellations may forfeit any advance paid at the property.'],
    ['Room stays', 'Free cancellation up to 48–72 hours before check-in, depending on the destination. See each destination page for exact terms.'],
    ['Events', 'Event advances are refundable up to 7 days before the event, minus vendor costs already incurred for décor or catering.'],
  ]],
  ['rules', 'Guest Rules', [
    ['Pool', 'Proper swimwear is mandatory. Children under 12 must be accompanied by an adult. The pool closes at the listed time.'],
    ['ID & check-in', 'Valid government photo ID is required for all adult guests at check-in.'],
    ['Pets', 'Pets are welcome only at pet-friendly destinations and must be leashed in common areas.'],
  ]],
];

export default function Legal() {
  const [on, setOn] = useState('privacy');
  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setOn(e.target.id)), { rootMargin: '-40% 0px -55% 0px' });
    SECTIONS.forEach(([id]) => io.observe(document.getElementById(id)));
    return () => io.disconnect();
  }, []);
  const jump = id => e => { e.preventDefault(); document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); };
  return (
    <section className="section" style={{ paddingTop: 160 }}>
      <div className="container">
        <Eyebrow>Legal & policies</Eyebrow>
        <Split as="h1" text="The [[fine]] print." className="display-l mt-24" />
        <p className="muted mt-16">Last updated: 29 October 2026</p>
        <div className="legal-wrap mt-64">
          <nav className="legal-nav">{SECTIONS.map(([id, t]) => <a key={id} href={`#${id}`} onClick={jump(id)} className={on === id ? 'on' : ''}>{t}</a>)}</nav>
          <div className="prose">
            {SECTIONS.map(([id, t, items]) => (
              <section id={id} key={id}>
                <h2>{t}</h2>
                {items.map(([h, p]) => <div key={h}><h3>{h}</h3><p>{p}</p></div>)}
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
