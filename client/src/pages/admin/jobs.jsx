import { useEffect, useState } from 'react';
import SidebarAdmin from '../../components/Layout/SidebarAdmin';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';
import { useRouter } from 'next/router';

export default function AdminJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const jobRoles = [
    'COO (Chief Operating Officer) – Overseeing daily operations, workflows.',
    'CTO (Chief Technology Officer) – Technology strategy, development oversight.',
    'CFO (Chief Financial Officer) – Budget, funding, and financial planning.',
    'HR Manager / Talent Acquisition – Hiring, payroll, policies.',
    'Product Manager – Features roadmap, prioritization, user experience.',
    'UI/UX Designer – App & website design, user flow, animations.',
    'Graphic Designer – Marketing materials, social media, visuals.',
    'Content Writer – Website copy, blogs, product descriptions.',
    'Full Stack Developer (MERN) – Backend + frontend (Node.js, MongoDB, React/Next.js).',
    'Flutter Developer – Mobile apps (Android & iOS).',
    'Frontend Developer (Next.js) – Website & landing pages.',
    'Backend Developer (Node.js / Firebase) – APIs, database, authentication.',
    'QA Engineer / Tester – Manual & automated testing of apps/web.',
    'DevOps Engineer – Deployment, cloud infrastructure, CI/CD.',
    'AI/ML Engineer (Future) – Attendance predictions, analytics.',
    'Customer Support / Helpdesk – Solve client/student/teacher issues.',
    'Technical Support – Troubleshoot app or platform technical issues.',
    'Operations Executive – Day-to-day process management, onboarding institutions.',
    'Admin / Office Manager – Internal administration, documentation.',
    'Sales Manager / Executive – B2B sales to schools/colleges.',
    'Digital Marketing Specialist – Social media, SEO, campaigns.',
    'Growth Hacker / Strategist – User acquisition, retention strategies.',
    'Business Development Executive – Partnerships, collaborations.',
    'Data Analyst – Attendance trends, student performance data.',
    'Business Analyst – Insights for product improvement & pricing strategies.',
    'Legal Advisor – For contracts, patents, compliance.',
    'Finance / Accounting Executive – Billing, GST, payroll.',
    'Interns'
  ];
  const jobTitles = jobRoles;
  const descriptionOptions = [
    'Lead strategic initiatives and oversee daily operations.',
    'Drive technology roadmap and engineering excellence.',
    'Manage budgets, funding, and financial planning.',
    'Own hiring, payroll, and HR policies.',
    'Define product roadmap and user experience.',
    'Design app, web, and user flows.',
    'Create marketing visuals and social content.',
    'Write web copy, blogs, and product descriptions.',
    'Build and maintain full-stack features.',
    'Develop and ship Flutter mobile apps.',
    'Implement Next.js frontends and landing pages.',
    'Build Node.js/Firebase APIs and data layers.',
    'Test web/app releases (manual + automation).',
    'Own deployment, CI/CD, and cloud infra.',
    'Research AI/ML features and analytics.',
    'Handle customer questions and support tickets.',
    'Troubleshoot technical platform issues.',
    'Run day-to-day operations and onboarding.',
    'Manage internal administration and docs.',
    'Drive B2B sales to schools/colleges.',
    'Run social, SEO, and campaign execution.',
    'Optimize acquisition and retention.',
    'Develop partnerships and collaborations.',
    'Analyze attendance and performance data.',
    'Provide product and pricing insights.',
    'Advise on contracts and compliance.',
    'Handle billing, GST, and payroll.',
    'Support across development, marketing, ops.'
  ];
  const responsibilityOptions = [
    'Strategy & Leadership',
    'Team Management',
    'Project Delivery',
    'Process Optimization',
    'Stakeholder Communication',
    'Roadmap Ownership',
    'Design Systems',
    'Content Planning',
    'Full-Stack Development',
    'Mobile Development',
    'API Development',
    'Quality Assurance',
    'CI/CD & DevOps',
    'Data & Analytics',
    'Customer Support',
    'Technical Support',
    'Sales & Partnerships',
    'Marketing Campaigns',
    'Documentation'
  ];
  const skillOptions = [
    'Leadership',
    'People Management',
    'Agile/Scrum',
    'Product Strategy',
    'UX/UI Tools',
    'Graphic Tools',
    'Copywriting',
    'JavaScript/TypeScript',
    'React/Next.js',
    'Node.js',
    'MongoDB/Firebase',
    'Flutter/Dart',
    'Testing/QA',
    'DevOps/CI-CD',
    'Cloud (AWS/GCP/Azure)',
    'Data Analysis',
    'Communication',
    'Sales/BD',
    'Marketing (SEO/Ads)'
  ];
  const experienceOptions = ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'];
  const [form, setForm] = useState({
    title: '',
    role: '',
    description: '',
    responsibilities: '',
    skills: '',
    experience: '',
    category: 'IT'
  });

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') router.push('/');
  }, [router]);

  const load = async () => {
    const { data } = await api.get('/jobs');
    setJobs(data.jobs || []);
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      responsibilities: form.responsibilities.split(',').map((s) => s.trim()).filter(Boolean),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    };
    await api.post('/jobs/admin', payload);
    setForm({ title: '', role: '', description: '', responsibilities: '', skills: '', experience: '', category: 'IT' });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/jobs/admin/${id}`);
    load();
  };

  const toggleActive = async (id, currentStatus) => {
    await api.put(`/jobs/admin/${id}`, { isActive: !currentStatus });
    load();
  };

  return (
    <section className="section" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
      <SidebarAdmin />
      <div style={{ flex: 1 }}>
        <div className="card">
          <h3>Create Job</h3>
          <form onSubmit={create} className="grid" style={{ gap: 10 }}>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input required placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="IT">IT</option>
              <option value="Non-IT">Non-IT</option>
            </select>
            <textarea rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Responsibilities (comma separated)" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
            <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            <input placeholder="Experience (e.g., 3+ years)" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            <button className="btn btn-primary" type="submit">Create</button>
          </form>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 20 }}>
          {jobs.map((job) => (
            <div key={job._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: job.category === 'Non-IT' ? 14 : 'inherit' }}>{job.title}</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge" style={{ background: job.category === 'Non-IT' ? '#ffe0b2' : '#c8e6c9', color: '#222' }}>
                    {job.category || 'IT'}
                  </span>
                  <span 
                    className="badge" 
                    style={{ 
                      background: job.isActive ? 'rgba(74,222,128,0.18)' : 'rgba(255,107,107,0.15)', 
                      color: job.isActive ? '#d4f7df' : '#ffd6d6',
                      fontSize: '11px'
                    }}
                  >
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: job.category === 'Non-IT' ? 12 : 'inherit' }}>{job.role}</div>
              <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: job.category === 'Non-IT' ? 12 : 'inherit' }}>{job.description}</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => toggleActive(job._id, job.isActive)}
                  style={{ fontSize: '13px', padding: '8px 14px' }}
                >
                  {job.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  className="btn btn-ghost" 
                  onClick={() => remove(job._id)}
                  style={{ fontSize: '13px', padding: '8px 14px', color: 'var(--danger)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

