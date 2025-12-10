import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { clearUser, getUser } from '../../utils/auth';
import { api } from '../../utils/axios';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setOpen(false);
  }, [router.asPath]);

  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (e) {}
    clearUser();
    setUser(null);
    router.push('/');
  };

  return (
    <header
      style={{
        padding: '18px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(18, 18, 18, 0.55)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* LOGO */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src="/Logo_Xavron.png" alt="logo" width={30} height={30} />
          <h4 style={{ marginLeft: 10, color: '#00f5d4', fontWeight: 700, letterSpacing: 1 }}>
            XAVRON Technologies (OPC) Pvt. Ltd.
          </h4>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                position: 'relative',
                color: router.pathname === l.href ? '#00f5d4' : '#ececec',
                opacity: router.pathname === l.href ? 1 : 0.7,
                transition: '0.25s',
                fontWeight: 500
              }}
            >
              {l.label}
              {router.pathname === l.href && (
                <motion.div
                  layoutId="navActive"
                  style={{
                    height: 2,
                    background: '#00f5d4',
                    borderRadius: 4,
                    marginTop: 4
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 12 }}>
          {user ? (
            <>
              {user.role === 'admin' && <Link className="btn-ghost" href="/admin/dashboard">Admin</Link>}
              {user.role === 'frontdesk' && <Link className="btn-ghost" href="/frontdesk/dashboard">Frontdesk</Link>}
              {user.role === 'user' && <Link className="btn-ghost" href="/user/my-applications">My Applications</Link>}
              
              <button className="btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" href="/login">Login</Link>
              <Link className="btn-primary" href="/signup">Sign up</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <div className="mobile-nav-icon" onClick={() => setOpen(!open)}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              marginTop: 12,
              padding: 20,
              background: 'rgba(20,20,20,0.8)',
              borderRadius: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  color: router.pathname === l.href ? '#00f5d4' : '#ffffff',
                  opacity: router.pathname === l.href ? 1 : 0.8
                }}
              >
                {l.label}
              </Link>
            ))}

            <div style={{ marginTop: 10 }}>
              {user ? (
                <>
                  <button onClick={logout} className="btn-primary" style={{ width: '100%' }}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn-ghost" style={{ width: '100%' }} href="/login">Login</Link>
                  <Link className="btn-primary" style={{ width: '100%', marginTop: 8 }} href="/signup">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .btn-primary {
          padding: 8px 18px;
          background: linear-gradient(90deg,#00f5d4,#6b8bff);
          border-radius: 8px;
          color: #000;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }

        .btn-primary:hover {
          opacity: 0.85;
        }

        .btn-ghost {
          padding: 8px 16px;
          color: #e7ecf5;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          transition: 0.3s;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.1);
        }

        .mobile-nav-icon {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .mobile-nav-icon .bar {
          height: 3px;
          width: 25px;
          background: #fff;
          border-radius: 2px;
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-icon {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
