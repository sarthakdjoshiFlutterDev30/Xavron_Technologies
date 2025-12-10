import Link from 'next/link';
import { motion } from 'framer-motion';

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'in' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'tw' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'fb' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'ig' }
];

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Book a Demo', href: '/contact' }
];

export default function Footer() {
  return (
    <footer
      style={{
        padding: '56px 24px 44px',
        marginTop: 60,
        background: 'radial-gradient(circle at 10% 20%, rgba(0,245,212,0.12), transparent 26%), radial-gradient(circle at 90% 10%, rgba(107,139,255,0.14), transparent 22%), linear-gradient(135deg, rgba(8,12,22,0.96), rgba(14,18,32,0.96))',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(90deg, rgba(0,245,212,0.08), transparent 40%, rgba(107,139,255,0.08))' }} />

      <div className="glass" style={{ maxWidth: 1180, margin: '0 auto', padding: 28, borderRadius: 20, position: 'relative' }}>
        <div style={{ height: 4, width: 120, background: 'linear-gradient(90deg,#6b8bff,#00f5d4)', borderRadius: 999, marginBottom: 18 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontWeight: 800, color: '#00f5d4', fontSize: 18, letterSpacing: '0.04em' }}>XAVRON Technologies (OPC) Pvt. Ltd.</div>
            <p style={{ color: 'var(--muted)', marginTop: 10 }}>
              Xavron is a next-gen educational platform simplifying attendance, project management, and student engagement with smart, secure, cloud-based technology.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px' }}>Quick Links</h4>
            <div style={{ display: 'grid', gap: 8 }}>
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ color: 'var(--muted)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#d4af37'; // golden hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted)';
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ color: 'var(--muted)' }}>© 2025 Xavron Technologies (OPC) Pvt. Ltd. All Rights Reserved.</div>
          <div style={{ color: 'var(--muted)' }}>Powered by Flutter & Firebase | Designed for modern educational institutions</div>
        </div>
      </div>
    </footer>
  );
}

