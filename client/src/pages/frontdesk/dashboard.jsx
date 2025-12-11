import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SidebarFrontdesk from '../components/Layout/SidebarFrontdesk';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';

export default function FrontdeskDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayVisitors: 0,
    activeVisitors: 0,
    pendingVisitors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'frontdesk') router.push('/');
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: statsData } = await api.get('/frontdesk/dashboard/stats');

        setStats({
          ...statsData,
          pendingVisitors: statsData.pendingVisitors || 0
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    // Refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon, label, value, color, gradient }) => (
    <div 
      className="card" 
      style={{ 
        background: gradient || 'var(--card)',
        border: `1px solid ${color}40`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: 8, fontWeight: 500 }}>
            {label}
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: color || 'var(--text)' }}>
            {loading ? '...' : value}
          </div>
        </div>
        <div style={{ 
          fontSize: '32px', 
          opacity: 0.2,
          position: 'absolute',
          right: 16,
          top: 16
        }}>
          {icon}
        </div>
      </div>
    </div>
  );


  return (
    <section className="section" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
      <SidebarFrontdesk />
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Frontdesk Dashboard</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Monitor visitor activity</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard 
            icon="⏳"
            label="Pending Visitors"
            value={stats.pendingVisitors || 0}
            color="#ffa726"
            gradient="linear-gradient(135deg, rgba(255,167,38,0.15) 0%, rgba(255,167,38,0.05) 100%)"
          />
          <StatCard 
            icon="🚶"
            label="Today's Visitors"
            value={stats.todayVisitors}
            color="#00f5d4"
            gradient="linear-gradient(135deg, rgba(0,245,212,0.15) 0%, rgba(0,245,212,0.05) 100%)"
          />
          <StatCard 
            icon="📍"
            label="Checked In Now"
            value={stats.activeVisitors}
            color="#4ade80"
            gradient="linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.05) 100%)"
          />
        </div>
      </div>
    </section>
  );
}

