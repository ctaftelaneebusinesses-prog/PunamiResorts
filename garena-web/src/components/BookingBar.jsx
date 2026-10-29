import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn } from './ui';
import { LOCATIONS } from '../data';

export default function BookingBar({ light, defaultLoc = '' }) {
  const nav = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ loc: defaultLoc, type: 'table', date: today, guests: '4' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => {
    e.preventDefault();
    nav(`/booking?${new URLSearchParams(f).toString()}`);
  };
  return (
    <form className={`booking-bar ${light ? 'light' : ''}`} onSubmit={submit}>
      <div className="bb-field">
        <label htmlFor="bb-loc">Destination</label>
        <select id="bb-loc" value={f.loc} onChange={set('loc')}>
          <option value="">All 8 destinations</option>
          <optgroup label="G Arena">{LOCATIONS.filter(l => l.brand === 'garena').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
          <optgroup label="LE Comfort">{LOCATIONS.filter(l => l.brand === 'lecomfort').map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</optgroup>
        </select>
      </div>
      <div className="bb-field">
        <label htmlFor="bb-type">Reservation</label>
        <select id="bb-type" value={f.type} onChange={set('type')}>
          <option value="table">Dining table</option>
          <option value="room">Room stay</option>
          <option value="event">Event / celebration</option>
          <option value="day">Pool day-out</option>
        </select>
      </div>
      <div className="bb-field">
        <label htmlFor="bb-date">Preferred date</label>
        <input id="bb-date" type="date" min={today} value={f.date} onChange={set('date')} />
      </div>
      <div className="bb-field">
        <label htmlFor="bb-g">Guests</label>
        <select id="bb-g" value={f.guests} onChange={set('guests')}>
          {['1', '2', '3', '4', '5', '6', '8', '10', '15', '20+'].map(g => <option key={g} value={g}>{g} {g === '1' ? 'guest' : 'guests'}</option>)}
        </select>
      </div>
      <Btn type="submit" variant={light ? '' : 'light'}>Check & Request</Btn>
    </form>
  );
}
