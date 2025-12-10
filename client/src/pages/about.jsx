import { motion } from 'framer-motion';

const featureBlocks = [
  {
    title: 'Smart Attendance (GPS + QR)',
    points: [
      'Fast, accurate QR-based scanning for students',
      'Teacher validation via GPS & 20m geo-fencing',
      'Fraud-proof logs with instant cloud syncing'
    ]
  },
  {
    title: 'Precision Geo-Fencing',
    points: [
      'Strict 20-meter boundary enforcement',
      'Eliminates proxy attendance & misuse',
      'Real-time location validation for faculty'
    ]
  },
  {
    title: 'Project & Assignment Upload',
    points: [
      'Digital submissions with timestamp verification',
      'Centralized upload system for teachers',
      'Secure cloud storage for easy review & download'
    ]
  },
  {
    title: 'Cross-Platform Ecosystem',
    points: [
      'Unified experience across Web, Android & iOS',
      'Automated data organization for institutes',
      'Zero data loss with secure cloud backups'
    ]
  }
];

const why = [
  'Replaces outdated manual processes with intelligent automation',
  'Ensures 100% accurate, tamper-proof attendance records',
  'Streamlines academic workflow from assignments to grading',
  'Provides real-time visibility and control to administrators',
  'Scalable architecture ready for future modules like Fees & Results'
];

const future = [
  'Fees Management: Digital ledger, receipts & pending fee tracking',
  'Exam Dashboard: Result uploads & auto-generated report cards',
  'Parents Panel: Live child location tracking during campus hours',
  'Instant notifications for academic updates & safety alerts',
  'Comprehensive student-wise billing history & performance logs'
];

export default function About() {
  return (
    <section className="section">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
        <div className="badge">About Xavron</div>

        <h1 style={{ margin: '10px 0 4px' }}>Empowering Education through Smart Digital Ecosystems</h1>

        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          Xavron is a product-based EdTech company focused on building a smart, secure, and modern 
          digital infrastructure for institutes. We simplify core areas of academic management—Attendance, 
          Projects, and Tracking—while preparing for powerful future modules to give institutions 
          complete visibility and control.
        </p>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {featureBlocks.map((block) => (
            <div key={block.title} className="card" style={{ background: 'var(--card-strong)' }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{block.title}</div>
              <ul style={{ color: 'var(--muted)', paddingLeft: 16, margin: 0 }}>
                {block.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="card" style={{ background: 'var(--card-strong)', marginTop: 18 }}>
          <h3>Mission</h3>
          <p style={{ color: 'var(--muted)' }}>
            To replace manual academic chaos with an intelligent, automated system that ensures 
            efficiency, fraud-proof operations, and a seamless digital connection between 
            students, teachers, and administrators.
          </p>
        </div>

        <div className="card" style={{ background: 'var(--card-strong)', marginTop: 14 }}>
          <h3>Vision</h3>
          <p style={{ color: 'var(--muted)' }}>
            To become the most reliable digital backbone for educational institutions, evolving 
            beyond just attendance to cover fees, results, and student safety in one unified platform.
          </p>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <h3>Why Choose Xavron?</h3>
          <ul style={{ color: 'var(--muted)', paddingLeft: 18, marginTop: 6 }}>
            {why.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <h3>Tech Stack</h3>
          <p style={{ color: 'var(--muted)' }}>
            Frontend: Flutter (Android, iOS, Web) <br></br> Backend: Firebase (Firestore, Auth, Storage) ·<br></br> 
            Geofencing: Geolocator · QR System: QR generation and secure scanning
          </p>
        </div>

        <div className="card" style={{ marginTop: 18 }}>
          <h3>Upcoming Modules</h3>
          <ul style={{ color: 'var(--muted)', paddingLeft: 18 }}>
            {future.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}