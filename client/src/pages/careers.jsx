import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import JobCard from '../components/JobCard';
import { api } from '../utils/axios';
import { getUser } from '../utils/auth';

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [appliedMap, setAppliedMap] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data.jobs || []);
        
        // Check user status
        const user = getUser();
        setIsLoggedIn(!!user);

        if (user) {
          const res = await api.get('/applications/me');
          const map = {};
          (res.data.applications || []).forEach((app) => {
            const jobKey = typeof app.jobId === 'string' ? app.jobId : app.jobId?._id;
            if (jobKey) map[jobKey] = app._id;
          });
          setAppliedMap(map);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const withdraw = async (applicationId) => {
    await api.delete(`/applications/me/${applicationId}`);
    setAppliedMap((prev) => {
      const copy = { ...prev };
      const jobId = Object.keys(copy).find((key) => copy[key] === applicationId);
      if (jobId) delete copy[jobId];
      return copy;
    });
  };

  return (
    <section className="section">
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="badge">We are hiring</div>
        <h2>Careers at XAVRON</h2>
        {!isLoggedIn && (
          <p style={{ color: '#ef4444', fontWeight: 'bold', marginTop: 12 }}>
            Login Required to Apply For Roles
          </p>
        )}
      </div>

      {['IT', 'Non-IT'].map((category) => {
        const filtered = jobs.filter((job) => (job.category || 'IT') === category);
        if (!filtered.length) return null;
        return (
          <div key={category} style={{ marginBottom: 28 }}>
            <h3 style={{ marginBottom: 10 }}>{category} Roles</h3>
            <motion.div layout className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {filtered.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  appliedApplicationId={appliedMap[job._id]}
                  onWithdraw={withdraw}
                />
              ))}
            </motion.div>
          </div>
        );
      })}
    </section>
  );
}