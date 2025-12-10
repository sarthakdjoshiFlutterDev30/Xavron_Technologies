import { useEffect, useState } from 'react';
import SidebarAdmin from '../../components/Layout/SidebarAdmin';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';
import { useRouter } from 'next/router';
import ApplicationTable from '../../components/ApplicationTable';

export default function AdminApplications() {
  const router = useRouter();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') router.push('/');
  }, [router]);

  const load = async () => {
    const { data } = await api.get('/applications/admin');
    setApps(data.applications || []);
  };

  useEffect(() => { load(); }, []);

  const onStatusChange = async (id, status) => {
    await api.put(`/applications/admin/${id}/status`, { status });
    load();
  };

  return (
    <section className="section" style={{ display: 'flex', gap: 18 }}>
      <SidebarAdmin />
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Job Applications</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>
            Review applications and update status. Setting to "Reviewed" creates a visitor record. Setting to "Selected" creates an employee record.
          </p>
        </div>
        <ApplicationTable applications={apps} onStatusChange={onStatusChange} />
      </div>
    </section>
  );
}

