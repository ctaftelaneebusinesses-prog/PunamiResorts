import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { LOCATIONS } from '../data';

const NAMES = ['Ramya Krishnan', 'Suresh Patel', 'Divya Reddy', 'Arvind Rao', 'Meera Nair', 'Karthik Varma', 'Lakshmi Prasad', 'Imran Shaikh', 'Anjali Gupta', 'Venkat Naidu', 'Sneha Iyer', 'Rahul Chowdary'];
const TYPES = ['Dining table', 'Room stay', 'Event', 'Pool day-out'];
const STATUSES = ['new', 'called', 'confirmed', 'cancelled'];
const ST_LABEL = { new: 'New', called: 'Called', confirmed: 'Confirmed', cancelled: 'Cancelled' };

const seed = NAMES.map((n, i) => {
  const l = LOCATIONS[i % 8];
  const d = new Date(); d.setDate(d.getDate() + (i % 6));
  return {
    id: 'GA-' + (482910 + i * 137), name: n, phone: '+91 98' + String(48213570 + i * 7391).slice(0, 8),
    loc: l.name, type: TYPES[i % 4], date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    slot: ['1:00 PM', '7:00 PM', '11:00 AM', '3:00 PM'][i % 4], guests: [4, 2, 60, 6, 3, 120, 8, 2, 5, 40, 4, 10][i],
    status: STATUSES[[0, 0, 1, 2, 0, 2, 1, 3, 0, 2, 1, 0][i]], ago: `${(i + 1) * 7} min ago`, ack: ['WhatsApp', 'SMS', 'Email'][i % 3],
  };
});

export default function Admin() {
  const [rows, setRows] = useState(seed);
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState('');
  const shown = useMemo(() => rows.filter(r => (filter === 'all' || r.status === filter) && (r.name + r.loc + r.id).toLowerCase().includes(q.toLowerCase())), [rows, filter, q]);
  const count = s => rows.filter(r => r.status === s).length;
  const update = (id, status) => {
    setRows(rs => rs.map(r => r.id === id ? { ...r, status } : r));
    setSel(s => s && s.id === id ? { ...s, status } : s);
    setToast(`Request ${id} marked as ${ST_LABEL[status]}`);
    setTimeout(() => setToast(''), 2200);
  };
  const week = [42, 58, 51, 66, 74, 96, 88];
  const occ = LOCATIONS.map((l, i) => [l.name, [86, 72, 64, 58, 61, 91, 84, 79][i], l.brand]);

  return (
    <div className="admin">
      <aside className="admin-side">
        <Link to="/" className="brand-lockup"><img src="./img/g-arena-mark-white.png" alt="" style={{ height: 34 }} /><span className="words">G Arena<small>Admin Console</small></span></Link>
        <span className="group">Operations</span>
        <a href="#" className="on"><Icon name="inbox" />Booking requests<span className="count">{count('new')}</span></a>
        <a href="#"><Icon name="calendar" />Calendar</a>
        <a href="#"><Icon name="chart" />Reports</a>
        <span className="group">Content</span>
        <a href="#"><Icon name="pin" />Destinations</a>
        <a href="#"><Icon name="bed" />Rooms & tables</a>
        <a href="#"><Icon name="tag" />Packages & pricing</a>
        <a href="#"><Icon name="image" />Gallery</a>
        <span className="group">System</span>
        <a href="#"><Icon name="users" />Staff & roles</a>
        <a href="#"><Icon name="settings" />Settings</a>
        <Link to="/" style={{ marginTop: 'auto' }}><Icon name="arrowLeft" />Back to website</Link>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <div>
            <div className="label muted">Thursday, 29 October 2026</div>
            <h1>Good afternoon, Team.</h1>
          </div>
          <div className="flex gap-12 items-center wrap">
            <label className="admin-search"><Icon name="search" /><input placeholder="Search name, ID, destination" value={q} onChange={e => setQ(e.target.value)} /></label>
            <button className="btn btn-plain btn-sm" style={{ padding: '12px 20px' }}><span className="flex items-center gap-8"><Icon name="download" size={16} />Export</span></button>
          </div>
        </div>

        <div className="kpis">
          <div className="kpi kpi-main"><div className="label">New requests</div><div className="v">{count('new')}</div><div className="delta">Awaiting a call-back</div></div>
          <div className="kpi"><div className="label">Confirmed today</div><div className="v">{count('confirmed')}</div><div className="delta">▲ 18% vs last week</div></div>
          <div className="kpi"><div className="label">Avg. call-back time</div><div className="v">14<span style={{ fontSize: 20 }}> min</span></div><div className="delta">▼ 6 min faster</div></div>
          <div className="kpi"><div className="label">Cancellations</div><div className="v">{count('cancelled')}</div><div className="delta down">▲ 1 vs yesterday</div></div>
        </div>

        <div className="admin-grid">
          <div className="panel">
            <div className="flex between items-center"><h3>Requests this week</h3><span className="muted" style={{ fontSize: 13 }}>All destinations</span></div>
            <div className="bars">{week.map((v, i) => <div key={i} className={i === 5 ? 'hi' : ''}><i style={{ height: `${v}%` }} /><span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span></div>)}</div>
          </div>
          <div className="panel">
            <h3>Occupancy by destination</h3>
            <div className="mt-16">{occ.map(([n, v, b]) => <div className="occ-row" key={n}><span>{n}</span><span className="track"><i className={b === 'lecomfort' ? 'lec' : ''} style={{ width: v + '%' }} /></span><b>{v}%</b></div>)}</div>
          </div>
        </div>

        <div className="panel">
          <div className="flex between items-center wrap gap-12" style={{ marginBottom: 12 }}>
            <h3>Booking requests</h3>
            <div className="filters">
              {['all', ...STATUSES].map(s => <button key={s} className={`chip ${filter === s ? 'on' : ''}`} style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={() => setFilter(s)}>{s === 'all' ? 'All' : ST_LABEL[s]} <span style={{ opacity: .6 }}>{s === 'all' ? rows.length : count(s)}</span></button>)}
            </div>
          </div>
          <div className="table-wrap">
            <table className="req">
              <thead><tr><th>Guest</th><th>Request ID</th><th>Destination</th><th>Type</th><th>Date & time</th><th>Guests</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {shown.map(r => (
                  <tr key={r.id} onClick={() => setSel(r)} style={{ cursor: 'pointer' }}>
                    <td className="who"><b>{r.name}</b><small>{r.phone} · {r.ago}</small></td>
                    <td className="muted">{r.id}</td>
                    <td>{r.loc}</td>
                    <td>{r.type}</td>
                    <td>{r.date} · {r.slot}</td>
                    <td>{r.guests}</td>
                    <td><span className={`status st-${r.status}`}>{ST_LABEL[r.status]}</span></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="row-actions">
                        <a href={`tel:${r.phone}`} title="Call" onClick={() => update(r.id, 'called')}><button aria-label="Call"><Icon name="phone" /></button></a>
                        <button title="Confirm" aria-label="Confirm" onClick={() => update(r.id, 'confirmed')}><Icon name="check" /></button>
                        <button title="Cancel" aria-label="Cancel" onClick={() => update(r.id, 'cancelled')}><Icon name="close" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <div className={`drawer-scrim ${sel ? 'open' : ''}`} onClick={() => setSel(null)} />
      <aside className={`drawer ${sel ? 'open' : ''}`}>
        {sel && (
          <>
            <div className="flex between items-center">
              <span className={`status st-${sel.status}`}>{ST_LABEL[sel.status]}</span>
              <button className="icon-btn" style={{ boxShadow: 'inset 0 0 0 1px var(--line)' }} onClick={() => setSel(null)} aria-label="Close"><Icon name="close" /></button>
            </div>
            <h2 className="display-s mt-24">{sel.name}</h2>
            <div className="muted">{sel.id} · received {sel.ago}</div>
            <dl className="mt-32">
              <dt>Mobile</dt><dd>{sel.phone}</dd>
              <dt>Destination</dt><dd>{sel.loc}</dd>
              <dt>Type</dt><dd>{sel.type}</dd>
              <dt>Date</dt><dd>{sel.date}, {sel.slot}</dd>
              <dt>Guests</dt><dd>{sel.guests}</dd>
              <dt>Acknowledged via</dt><dd>{sel.ack}</dd>
              <dt>Payment</dt><dd>At property (offline)</dd>
            </dl>
            <div className="field mt-32"><label>Internal notes</label><textarea placeholder="e.g. Guest prefers poolside table, birthday cake at 8 PM" /></div>
            <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
              <a className="btn btn-plain" href={`tel:${sel.phone}`} onClick={() => update(sel.id, 'called')} style={{ justifyContent: 'center' }}><Icon name="phone" size={16} /> Call guest</a>
              <div className="grid-2" style={{ gap: 10 }}>
                <button className="chip" style={{ justifyContent: 'center' }} onClick={() => update(sel.id, 'confirmed')}><Icon name="check" />Confirm</button>
                <button className="chip" style={{ justifyContent: 'center' }} onClick={() => update(sel.id, 'cancelled')}><Icon name="close" />Cancel</button>
              </div>
              <a className="chip" style={{ justifyContent: 'center', color: '#1DA851' }} href={`https://wa.me/${sel.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"><Icon name="whatsapp" />Send WhatsApp confirmation</a>
            </div>
          </>
        )}
      </aside>
      <div className={`toast ${toast ? 'show' : ''}`}><Icon name="check" />{toast}</div>
    </div>
  );
}
