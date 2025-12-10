import { useEffect, useState } from 'react';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';
import { useRouter } from 'next/router';
import ApplicationTable from '../../components/ApplicationTable';

export default function MyApplications() {
  const router = useRouter();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const user = getUser();
    if (!user) router.push('/login');
  }, [router]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/applications/me');
        setApps(data.applications || []);
      } catch (e) {
        // ignore
      }
    };
    load();
  }, []);

  const onWithdraw = async (id) => {
    await api.delete(`/applications/me/${id}`);
    setApps((prev) => prev.filter((a) => a._id !== id));
  };

  return (
    <section className="section">
      <h2>My Applications</h2>
      <ApplicationTable applications={apps} onWithdraw={onWithdraw} />
    </section>
  );
}

