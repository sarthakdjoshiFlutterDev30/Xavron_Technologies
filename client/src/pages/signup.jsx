import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/axios';
import { saveUser } from '../utils/auth';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', contactNo: '' });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', contactNo: '' });

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactPattern = /^[0-9]{10}$/;

  const validateField = (name, value) => {
    const trimmed = value.trim();
    if (name === 'email') {
      return emailPattern.test(trimmed) ? '' : 'Enter a valid email address.';
    }
    if (name === 'contactNo') {
      return contactPattern.test(trimmed) ? '' : 'Contact number must be exactly 10 digits.';
    }
    return '';
  };

  const handleChange = (name) => (e) => {
    const rawValue = e.target.value;
    const value = name === 'contactNo' ? rawValue.replace(/\D/g, '').slice(0, 10) : rawValue;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'email' || name === 'contactNo') {
      const message = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: message }));
      if (message) setError(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailMessage = validateField('email', form.email);
    const contactMessage = validateField('contactNo', form.contactNo);
    setFieldErrors({ email: emailMessage, contactNo: contactMessage });
    if (emailMessage || contactMessage) return;

    try {
      const payload = {
        ...form,
        email: form.email.trim(),
        contactNo: form.contactNo.trim(),
      };
      const { data } = await api.post('/auth/signup', payload);
      saveUser(data.user);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2>Sign up</h2>
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <input required placeholder="Full name" value={form.name} onChange={handleChange('name')} />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange('email')}
          />
          {fieldErrors.email && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{fieldErrors.email}</div>}
          <input
            required
            type="tel"
            placeholder="Contact Number"
            value={form.contactNo}
            onChange={handleChange('contactNo')}
            pattern="[0-9]{10}"
            title="Use exactly 10 digits, numbers only"
          />
          {fieldErrors.contactNo && <div style={{ color: 'var(--danger)', fontSize: 12 }}>{fieldErrors.contactNo}</div>}
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary" type="submit">Create account</button>
          {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        </form>
      </div>
    </section>
  );
}

