import Link from 'next/link';
import { motion } from 'framer-motion';

export default function JobCard({ job, appliedApplicationId, onWithdraw }) {
  const isApplied = Boolean(appliedApplicationId);

  const isNonIT = job.category === 'Non-IT';
  
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontSize: isNonIT ? 14 : 18, fontWeight: 700 }}>{job.title}</div>
          <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: isNonIT ? 12 : 'inherit' }}>{job.role}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge" style={{ background: job.category === 'Non-IT' ? '#ffe0b2' : '#c8e6c9', color: '#222' }}>
            {job.category || 'IT'}
          </span>
          {isApplied ? (
            <button className="btn btn-ghost" onClick={() => onWithdraw?.(appliedApplicationId)}>
              Withdraw
            </button>
          ) : (
            <Link className="btn btn-primary" href={`/apply/${job._id}`}>Apply</Link>
          )}
        </div>
      </div>
      <p style={{ color: 'var(--muted)', marginTop: 12, fontSize: isNonIT ? 12 : 'inherit' }}>{job.description}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {job.skills?.map((s) => (
          <span key={s} className="badge" style={{ color: '#9ef0e0' }}>{s}</span>
        ))}
      </div>
    </motion.div>
  );
}

