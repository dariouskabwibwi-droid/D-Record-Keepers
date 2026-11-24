
import React, { useState } from 'react';

export default function App() {
  const [clients, setClients] = useState([
    { id: 1, name: 'Mary Banda', nrc: '123456/78/9', phone: '0970000001', location: 'Lusaka', group: 'Group A' },
    { id: 2, name: 'John Phiri', nrc: '234567/89/0', phone: '0970000002', location: 'Chongwe', group: 'Group B' }
  ]);

  const [form, setForm] = useState({
    name: '', nrc: '', phone: '', location: '', group: ''
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState('dashboard');
  const [message, setMessage] = useState('');

  function addClient(e) {
    e.preventDefault();
    if (!form.name || !form.nrc || !form.phone) {
      setMessage('Please enter the name, NRC and phone number.');
      return;
    }
    if (clients.some(c => c.nrc === form.nrc || c.phone === form.phone)) {
      setMessage('A client with this NRC or phone number already exists.');
      return;
    }
    setClients([...clients, { ...form, id: Date.now() }]);
    setForm({ name: '', nrc: '', phone: '', location: '', group: '' });
    setMessage('Client registered successfully.');
    setPage('clients');
  }

  const filtered = clients.filter(c =>
    Object.values(c).join(' ').toLowerCase().includes(search.toLowerCase())
  );

  function exportClients() {
    const rows = [
      ['Name', 'NRC', 'Phone', 'Location', 'Group'],
      ...clients.map(c => [c.name, c.nrc, c.phone, c.location, c.group])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'd-record-clients.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <h1>D-Record Keeper</h1>
          <p>Ultimate Edition</p>
        </div>
        <span className="status">DEMO</span>
      </header>

      <nav className="nav">
        {['dashboard', 'clients', 'register'].map(item => (
          <button key={item} onClick={() => { setPage(item); setMessage(''); }}>
            {item === 'register' ? 'Add Client' : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>

      <section className="content">
        {page === 'dashboard' && <>
          <h2>Dashboard</h2>
          <div className="stats">
            <article><span>Total clients</span><strong>{clients.length}</strong></article>
            <article><span>Groups</span><strong>{new Set(clients.map(c => c.group).filter(Boolean)).size}</strong></article>
            <article><span>Locations</span><strong>{new Set(clients.map(c => c.location).filter(Boolean)).size}</strong></article>
          </div>
          <h3>Welcome to D-Record Keeper</h3>
          <p>Manage client records from your phone.</p>
          <button className="primary" onClick={() => setPage('register')}>Register a client</button>
        </>}

        {page === 'register' && <>
          <h2>Register New Client</h2>
          <form onSubmit={addClient}>
            {[
              ['name', 'Full name'],
              ['nrc', 'NRC number'],
              ['phone', 'Phone number'],
              ['location', 'Location'],
              ['group', 'Group']
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={label}
                />
              </label>
            ))}
            <button className="primary" type="submit">Save client</button>
          </form>
        </>}

        {page === 'clients' && <>
          <h2>Client Records</h2>
          <input
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={exportClients}>Export CSV</button>
          {filtered.map(c => (
            <article className="client" key={c.id}>
              <strong>{c.name}</strong>
              <p>NRC: {c.nrc}</p>
              <p>Phone: {c.phone}</p>
              <p>Location: {c.location || 'Not entered'}</p>
              <p>Group: {c.group || 'Not assigned'}</p>
              <button onClick={() => setClients(clients.filter(x => x.id !== c.id))}>
                Remove demo record
              </button>
            </article>
          ))}
          {filtered.length === 0 && <p>No matching clients found.</p>}
        </>}
        {message && <p className="message">{message}</p>}
      </section>
      <footer>D-Record Keeper ULTIMATE · Prototype</footer>
    </main>
  );
                               }
