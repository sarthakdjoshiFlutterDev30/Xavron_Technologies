import { useState } from 'react';
import { api } from '../utils/axios';
import { motion } from 'framer-motion';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'contact' });
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '', type: 'contact' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="section">
      <div className="card">
        <h2>Contact / Demo / Service Inquiry</h2>
        <p style={{ color: 'var(--muted)' }}>We typically respond within 24 hours.</p>
        <form onSubmit={submit} className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="contact">Contact</option>
            <option value="demo">Demo Booking</option>
            <option value="service">Service Inquiry</option>
          </select>
          <textarea style={{ gridColumn: '1/3' }} rows={4} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <motion.button whileTap={{ scale: 0.98 }} className="btn btn-primary" type="submit" style={{ gridColumn: '1/3', justifyContent: 'center' }}>
            {status === 'loading' ? 'Sending...' : 'Submit'}
          </motion.button>
          {status === 'success' && <div style={{ color: 'var(--success)' }}>Submitted. We will reach out.</div>}
          {status === 'error' && <div style={{ color: 'var(--danger)' }}>Something went wrong.</div>}
        </form>
      </div>
    </section>
  );
}

