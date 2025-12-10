import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/axios';
import { saveUser } from '../utils/auth';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await api.post('/auth/login', form);
      saveUser(data.user);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="section">
      <div className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2>Login</h2>
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button className="btn btn-primary" type="submit">Login</button>
          {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
        </form>
      </div>
    </section>
  );
}

