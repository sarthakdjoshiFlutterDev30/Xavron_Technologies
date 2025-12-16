import { motion } from 'framer-motion';

const plan = {
  name: 'Annual Subscription',
  price: '₹365',
  unit: 'per user / year',
  gst: '18% GST applicable',
  example: {
    students: 100,
    base: '₹36,500',
    gst: '₹6,570',
    total: '₹43,070 / year'
  },
  includes: [
    'Smart QR-based attendance with optional face verification',
    'Geo-fencing enabled attendance tracking',
    'Project & assignment management',
    'Cloud-based storage and real-time sync',
    'Multi-platform access (Android, iOS, Web)',
    'Analytics and reporting dashboards',
    'Secure authentication and role-based access'
  ],
  payment: [
    '50% advance payment before deployment',
    '50% balance after successful setup and onboarding'
  ],
  why: [
    'Affordable, easy to implement, and scalable for institutions of all sizes.'
  ]
};

export default function Pricing() {
  return (
    <section className="section">
      <div className="badge">Pricing</div>
      <h2 style={{ marginTop: 10 }}>Simple, transparent, value-packed</h2>

      <motion.div whileHover={{ y: -6 }} className="card" style={{ marginTop: 18, background: 'var(--card-strong)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 22 }}>{plan.name}</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>{plan.price}</div>
          <div style={{ color: 'var(--muted)' }}>{plan.unit}</div>
          <div className="badge">{plan.gst}</div>
        </div>
      </motion.div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>Example (for {plan.example.students} Users)</h3>
        <ul style={{ color: 'var(--muted)', paddingLeft: 18 }}>
          <li>Base: {plan.example.base}</li>
          <li>GST (18%): {plan.example.gst}</li>
          <li><strong>Total: {plan.example.total}</strong></li>
        </ul>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 18 }}>
        <div className="card">
          <h3>What’s included</h3>
          <ul style={{ color: 'var(--muted)', paddingLeft: 18 }}>
            {plan.includes.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Payment terms</h3>
          <ul style={{ color: 'var(--muted)', paddingLeft: 18 }}>
            {plan.payment.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="card">
          <h3>Why choose Xavron</h3>
          <ul style={{ color: 'var(--muted)', paddingLeft: 18 }}>
            {plan.why.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

