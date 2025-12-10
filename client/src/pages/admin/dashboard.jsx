import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SidebarAdmin from '../../components/Layout/SidebarAdmin';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    reviewedApplications: 0,
    selectedApplications: 0,
    rejectedApplications: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') router.push('/');
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [{ data: jobsData }, { data: appsData }] = await Promise.all([
          api.get('/jobs'),
          api.get('/applications/admin')
        ]);

        const jobs = jobsData.jobs || [];
        const applications = appsData.applications || [];

        const activeJobs = jobs.filter(j => j.isActive !== false).length;
        const inactiveJobs = jobs.length - activeJobs;

        const pendingApps = applications.filter(a => a.status === 'Pending').length;
        const reviewedApps = applications.filter(a => a.status === 'Reviewed').length;
        const selectedApps = applications.filter(a => a.status === 'Selected').length;
        const rejectedApps = applications.filter(a => a.status === 'Rejected').length;

        setStats({
          totalJobs: jobs.length,
          activeJobs,
          inactiveJobs,
          totalApplications: applications.length,
          pendingApplications: pendingApps,
          reviewedApplications: reviewedApps,
          selectedApplications: selectedApps,
          rejectedApplications: rejectedApps
        });

        // Get recent 5 applications
        const recent = applications
          .sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt))
          .slice(0, 5);
        setRecentApplications(recent);
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
      <SidebarAdmin />
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Dashboard</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>Overview of jobs and applications</p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard 
            icon="💼"
            label="Total Jobs"
            value={stats.totalJobs}
            color="#6b8bff"
            gradient="linear-gradient(135deg, rgba(107,139,255,0.15) 0%, rgba(107,139,255,0.05) 100%)"
          />
          <StatCard 
            icon="✅"
            label="Active Jobs"
            value={stats.activeJobs}
            color="#4ade80"
            gradient="linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.05) 100%)"
          />
          <StatCard 
            icon="⏸️"
            label="Inactive Jobs"
            value={stats.inactiveJobs}
            color="#9fb0d6"
            gradient="linear-gradient(135deg, rgba(159,176,214,0.15) 0%, rgba(159,176,214,0.05) 100%)"
          />
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard 
            icon="📋"
            label="Total Applications"
            value={stats.totalApplications}
            color="#00f5d4"
            gradient="linear-gradient(135deg, rgba(0,245,212,0.15) 0%, rgba(0,245,212,0.05) 100%)"
          />
          <StatCard 
            icon="⏳"
            label="Pending"
            value={stats.pendingApplications}
            color="#6b8bff"
            gradient="linear-gradient(135deg, rgba(107,139,255,0.15) 0%, rgba(107,139,255,0.05) 100%)"
          />
          <StatCard 
            icon="👁️"
            label="Reviewed"
            value={stats.reviewedApplications}
            color="#00f5d4"
            gradient="linear-gradient(135deg, rgba(0,245,212,0.15) 0%, rgba(0,245,212,0.05) 100%)"
          />
          <StatCard 
            icon="✅"
            label="Selected"
            value={stats.selectedApplications}
            color="#4ade80"
            gradient="linear-gradient(135deg, rgba(74,222,128,0.15) 0%, rgba(74,222,128,0.05) 100%)"
          />
          <StatCard 
            icon="❌"
            label="Rejected"
            value={stats.rejectedApplications}
            color="#ff6b6b"
            gradient="linear-gradient(135deg, rgba(255,107,107,0.15) 0%, rgba(255,107,107,0.05) 100%)"
          />
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ margin: 0 }}>Recent Applications</h3>
            <Link href="/admin/applications" className="btn btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}>
              View All →
            </Link>
          </div>
          {loading ? (
            <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading...</div>
          ) : recentApplications.length === 0 ? (
            <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>No applications yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentApplications.map((app) => (
                <div 
                  key={app._id} 
                  style={{ 
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {app.candidateName || app.userId?.name || 'Anonymous'}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '13px' }}>
                      {app.jobId?.title || 'Unknown Job'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className={`status ${app.status}`} style={{ fontSize: '11px' }}>
                      {app.status}
                    </span>
                    <div style={{ color: 'var(--muted)', fontSize: '12px' }}>
                      {app.appliedAt 
                        ? new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '—'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

