import Link from 'next/link';
import { useRouter } from 'next/router';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/jobs', label: 'Jobs', icon: '💼' },
  { href: '/admin/applications', label: 'Applications', icon: '📋' }
];

export default function SidebarAdmin() {
  const router = useRouter();
  return (
    <aside style={{ height: 'fit-content' }} className="glass sidebar">
      <div style={{ 
        padding: 20, 
        borderBottom: '1px solid var(--border)', 
        fontWeight: 700,
        fontSize: '18px',
        background: 'linear-gradient(120deg, rgba(107,139,255,0.1), rgba(0,245,212,0.1))'
      }}>
        Admin Panel
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
        {links.map((l) => {
          const isActive = router.pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: '14px 20px',
                background: isActive 
                  ? 'linear-gradient(90deg, rgba(107,139,255,0.15), transparent)' 
                  : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                color: isActive ? 'var(--text)' : 'var(--muted)',
                fontWeight: isActive ? 600 : 400
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = 'var(--text)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--muted)';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

