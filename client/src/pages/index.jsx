import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const featureCards = [
  { title: 'Smart Attendance', text: 'QR & face verification with geo-fenced accuracy.' },
  { title: 'Project Management', text: 'Upload, review, and track assignments with ease.' },
  { title: 'Analytics & Reporting', text: 'Insights for performance and engagement.' },
  { title: 'Cloud Storage', text: 'Secure, real-time data accessible anywhere.' },
  { title: 'Multi-Platform Access', text: 'Android, iOS, and Web ready.' }
];

const steps = [
  'Sign Up & Add Students – quick setup with role-based access.',
  'Mark Attendance – QR codes + optional face verification.',
  'Upload & Track Projects – teachers manage, students submit.',
  'Analyze Performance – real-time dashboards and reports.'
];

export default function Home() {
  const glowRef = useRef(null);

  useEffect(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      boxShadow: '0 0 30px rgba(0,245,212,0.4)',
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 30%, rgba(107,139,255,0.2), transparent 35%), radial-gradient(circle at 80% 20%, rgba(0,245,212,0.18), transparent 30%)', filter: 'blur(2px)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ position: 'relative' }}>
          <div className="badge">Premium • Reailable • Education OS</div>
          <h1 style={{ fontSize: 48, margin: '14px 0 10px' }}>Revolutionizing Education with Smart, Seamless Technology</h1>
          <p style={{ color: 'var(--muted)', maxWidth: 760, margin: '0 auto' }}>
            Xavron simplifies attendance, project management, and student engagement — all in one platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" href="/contact">Book a Demo</Link>
            <Link className="btn btn-ghost" href="/signup">Get Started</Link>
          </div>
          <div ref={glowRef} style={{ margin: '32px auto 0', width: 240, height: 6, background: 'linear-gradient(90deg,#6b8bff,#00f5d4)', borderRadius: 999 }} />
        </motion.div>
      </section>

      {/* Features / Highlights */}
      <section className="section">
        <h2>Everything Your Institution Needs in One Platform</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 16 }}>
          {featureCards.map((card) => (
            <motion.div key={card.title} whileHover={{ y: -4 }} className="card" style={{ background: 'var(--card-strong)' }}>
              <div style={{ fontWeight: 700 }}>{card.title}</div>
              <p style={{ color: 'var(--muted)', marginTop: 8 }}>{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <h2>Simple, Fast, and Reliable</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {steps.map((step, idx) => (
            <motion.div key={step} whileHover={{ y: -3 }} className="card">
              <div className="badge" style={{ marginBottom: 8 }}>Step {idx + 1}</div>
              <p style={{ color: 'var(--muted)' }}>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="section">
        <h2>Affordable, Transparent Pricing</h2>
        <p style={{ color: 'var(--muted)' }}>₹365/student/year + 18% GST</p>
        <Link className="btn btn-primary" href="/pricing">View Pricing</Link>
      </section>

      {/* About mini */}
      <section className="section">
        <div className="card" style={{ background: 'var(--card-strong)' }}>
          <h3>About Xavron</h3>
          <p style={{ color: 'var(--muted)' }}>
            Xavron is a next-gen educational management platform designed to streamline attendance, assignments, and student engagement. With QR-based attendance, geo-fencing, and cloud storage, we make administration simple and secure.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
            <Link className="btn btn-ghost" href="/about">Learn More</Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="card" style={{ background: 'var(--card-strong)' }}>
          <h2>Ready to Transform Your Institution?</h2>
          <p style={{ color: 'var(--muted)' }}>Book a demo or talk to us today.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
            <Link className="btn btn-primary" href="/contact">Book a Demo</Link>
            <Link className="btn btn-ghost" href="/contact">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

