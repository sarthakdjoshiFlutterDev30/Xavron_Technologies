import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';
import { useRef } from 'react';

export default function ApplyJob() {
  const router = useRouter();
  const { jobId } = router.query;
  const resumeInputRef = useRef(null);
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!jobId) return;
    api.get(`/jobs/${jobId}`).then(({ data }) => setJob(data.job)).catch(() => {});
  }, [jobId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!coverLetter || !coverLetter.trim()) {
      setStatus('Cover letter is required');
      return;
    }
    if (!resume) {
      setStatus('Resume is required (PDF only)');
      return;
    }
    const isPdf = resume?.type === 'application/pdf' || resume?.name?.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setStatus('Only PDF format is allowed');
      return;
    }
    setStatus('Submitting...');
    try {
      const form = new FormData();
      form.append('jobId', jobId);
      form.append('coverLetter', coverLetter.trim());
      form.append('resume', resume);
      await api.post('/applications/apply', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setStatus('Applied successfully');
      setCoverLetter('');
      setResume(null);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to apply (login required)');
    }
  };

  const user = getUser();

  return (
    <section className="section">
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h2 style={{ margin: 0 }}>Apply for {job?.title || 'Role'}</h2>
          {job?.category && (
            <span className="badge" style={{ background: job.category === 'Non-IT' ? '#ffe0b2' : '#c8e6c9', color: '#222' }}>
              {job.category}
            </span>
          )}
        </div>
        {!user && <div style={{ color: 'var(--danger)' }}>Login required to apply.</div>}
        <form onSubmit={submit} className="grid" style={{ gap: 14 }}>
          <textarea required rows={4} placeholder="Cover letter *" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          <input required ref={resumeInputRef} type="file" accept=".pdf" onChange={(e) => setResume(e.target.files?.[0])} />
          <button disabled={!user} className="btn btn-primary" type="submit">Submit Application</button>
          {status && <div style={{ color: status.includes('success') || status.includes('Applied') ? 'var(--success)' : 'var(--danger)' }}>{status}</div>}
        </form>
      </div>
    </section>
  );
}

