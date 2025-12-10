import { motion } from 'framer-motion';

const services = [
  {
    title: 'Attendance Management Service',
    bullets: [
      'GPS-validated teacher attendance',
      'Student attendance using QR codes',
      'Geo-fencing within 20 meters to prevent proxy',
      'Real-time logs synced to cloud',
      'Instant attendance reports for admins'
    ]
  },
  {
    title: 'Project & Assignment Management',
    bullets: [
      'Teachers upload assignments from dashboard',
      'Students submit projects with timestamps',
      'Cloud backup and instant access to files',
      'Organized storage for easy review'
    ]
  },
  {
    title: 'Cloud Data Management',
    bullets: [
      'Secure cloud hosting for all academic data',
      'Automatic data backups',
      'Fast syncing across teacher, student, and admin panels',
      'Centralized digital repository'
    ]
  },
  {
    title: 'Notifications & Communication',
    bullets: [
      'Smart alerts for attendance updates',
      'Reminders for assignment deadlines',
      'Instant result announcements',
      'Important academic updates'
    ]
  },
  {
    title: 'Upcoming Services',
    bullets: [
      'Fees Management: Track paid/pending fees & receipts',
      'Exam Results: Auto-generated digital report cards',
      'Parent Panel: Live location tracking & safety alerts',
      'Comprehensive student performance history'
    ]
  },
  {
    title: 'Why Choose Xavron Services?',
    bullets: [
      '100% cloud-powered with real-time syncing',
      'Multi-panel support (Admin, Teacher, Student, Parent)',
      'Secure, smart, and designed for modern campuses',
      'Seamless automation of daily operations'
    ]
  }
];

export default function Services() {
  return (
    <section className="section">
      <div className="badge">Our Services</div>
      <h2 style={{ marginTop: 10 }}>Automate daily operations smoothly & securely</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: 18 }}>
        {services.map((s) => (
          <motion.div key={s.title} whileHover={{ y: -4 }} className="card" style={{ background: 'var(--card-strong)' }}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{s.title}</div>
            <ul style={{ color: 'var(--muted)', paddingLeft: 18, margin: 0 }}>
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}