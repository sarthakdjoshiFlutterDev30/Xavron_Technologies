import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SidebarFrontdesk from '../components/Layout/SidebarFrontdesk';
import { api } from '../../utils/axios';
import { getUser } from '../../utils/auth';

export default function FrontdeskVisitors() {
  const router = useRouter();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    purpose: '',
    idProof: '',
    idProofNumber: '',
    notes: ''
  });
  const [statusFilter, setStatusFilter] = useState('');
  const [visitorSearch, setVisitorSearch] = useState('');
  const [visitorSuggestions, setVisitorSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'frontdesk') router.push('/');
  }, [router]);

  useEffect(() => {
    loadVisitors();
  }, [statusFilter]);


  const loadVisitors = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const { data } = await api.get('/frontdesk/visitors', { params });
      setVisitors(data.visitors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/frontdesk/visitors', formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        purpose: '',
        idProof: '',
        idProofNumber: '',
        notes: ''
      });
      loadVisitors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register visitor');
    }
  };

  const handleCheckIn = async (visitorId) => {
    if (!confirm('Check in this visitor?')) return;
    try {
      await api.post(`/frontdesk/visitors/${visitorId}/checkin`);
      loadVisitors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check in visitor');
    }
  };

  const handleCheckOut = async (visitorId) => {
    if (!confirm('Check out this visitor?')) return;
    try {
      await api.post(`/frontdesk/visitors/${visitorId}/checkout`);
      loadVisitors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check out visitor');
    }
  };

  const searchVisitorByName = async (name) => {
    if (!name || name.length < 2) {
      setVisitorSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const { data } = await api.get('/frontdesk/visitors/search', { params: { name } });
      setVisitorSuggestions(data.visitors || []);
      setShowSuggestions(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVisitorNameChange = (e) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
    setVisitorSearch(name);
    searchVisitorByName(name);
  };

  const selectVisitor = (visitor) => {
    setFormData({
      ...formData,
      name: visitor.name,
      email: visitor.email || '',
      phone: visitor.phone || '',
      company: visitor.company || '',
      purpose: visitor.purpose || '',
      idProof: visitor.idProof || '',
      idProofNumber: visitor.idProofNumber || '',
      notes: visitor.notes || ''
    });
    setVisitorSearch(visitor.name);
    setShowSuggestions(false);
    setVisitorSuggestions([]);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <section className="section" style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
      <SidebarFrontdesk />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: 8 }}>Visitor Log</h2>
            <p style={{ color: 'var(--muted)', margin: 0 }}>
              Manage visitor check-ins and check-outs. Visitors with "Reviewed" status appear here automatically.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Register Visitor'}
          </button>
        </div>

        <div className="card" style={{ marginBottom: 24, background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.2)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ fontSize: '24px' }}>ℹ️</div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Workflow:</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6 }}>
                • When Admin sets application status to "Reviewed", a visitor record is created automatically<br/>
                • Visitors appear with "Pending" status - click "Check In" when they arrive<br/>
                • Click "Check Out" when they leave
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Register New Visitor</h3>
            <form onSubmit={handleSubmit} className="grid" style={{ gap: 14 }}>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Name * (Type to search previous visitors)
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleVisitorNameChange}
                  onFocus={() => {
                    if (visitorSuggestions.length > 0) setShowSuggestions(true);
                  }}
                  onBlur={() => {
                    // Delay to allow clicking on suggestions
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  placeholder="Visitor name (type to search)"
                />
                {showSuggestions && visitorSuggestions.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    marginTop: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}>
                    {visitorSuggestions.map((visitor) => (
                      <div
                        key={visitor._id}
                        onClick={() => selectVisitor(visitor)}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 600 }}>{visitor.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                          {visitor.phone} {visitor.email && `• ${visitor.email}`}
                        </div>
                        {visitor.company && (
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                            {visitor.company}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Phone *
                </label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email (optional)"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name (optional)"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Purpose *
                </label>
                <input
                  required
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Purpose of visit"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  ID Proof Type
                </label>
                <input
                  type="text"
                  value={formData.idProof}
                  onChange={(e) => setFormData({ ...formData, idProof: e.target.value })}
                  placeholder="e.g., Aadhar, Driving License"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  ID Proof Number
                </label>
                <input
                  type="text"
                  value={formData.idProofNumber}
                  onChange={(e) => setFormData({ ...formData, idProofNumber: e.target.value })}
                  placeholder="ID number"
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '13px', fontWeight: 500 }}>
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes (optional)"
                />
              </div>
              <button className="btn btn-primary" type="submit">Register Visitor</button>
            </form>
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: 4 }}>Visitor Log</h3>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: '13px' }}>
                Manage visitor check-ins and check-outs. Visitors with "Reviewed" status appear here.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)' }}
              >
                <option value="">All Visitors</option>
                <option value="pending">Pending Check-in</option>
                <option value="checked-in">Currently In</option>
                <option value="checked-out">Checked Out</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Loading...</div>
          ) : visitors.length === 0 ? (
            <div style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>No visitors found</div>
          ) : (
            <>
            <div className="hide-on-mobile" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Contact</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Purpose</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Check In</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Check Out</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{visitor.name}</div>
                        {visitor.company && (
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{visitor.company}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>
                        <div>{visitor.phone}</div>
                        {visitor.email && (
                          <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{visitor.email}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{visitor.purpose}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{formatDateTime(visitor.checkIn)}</td>
                      <td style={{ padding: '12px', fontSize: '13px' }}>{formatDateTime(visitor.checkOut)}</td>
                      <td style={{ padding: '12px' }}>
                        {visitor.status === 'checked-in' ? (
                          <span className="status pending" style={{ fontSize: '11px' }}>Checked In</span>
                        ) : visitor.status === 'checked-out' ? (
                          <span className="status selected" style={{ fontSize: '11px' }}>Checked Out</span>
                        ) : (
                          <span className="status rejected" style={{ fontSize: '11px' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {visitor.status === 'pending' && (
                            <button
                              className="btn btn-primary"
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                              onClick={() => handleCheckIn(visitor._id)}
                            >
                              Check In
                            </button>
                          )}
                          {visitor.status === 'checked-in' && (
                            <button
                              className="btn btn-ghost"
                              style={{ fontSize: '12px', padding: '6px 12px' }}
                              onClick={() => handleCheckOut(visitor._id)}
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="show-on-mobile" style={{ display: 'grid', gap: 12 }}>
              {visitors.map((visitor) => (
                <div key={visitor._id} style={{ padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 12, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontWeight: 700 }}>{visitor.name}</div>
                    {visitor.status === 'checked-in' ? (
                      <span className="status selected" style={{ fontSize: '11px' }}>Checked In</span>
                    ) : visitor.status === 'checked-out' ? (
                      <span className="status Reviewed" style={{ fontSize: '11px' }}>Checked Out</span>
                    ) : (
                      <span className="status Pending" style={{ fontSize: '11px' }}>Pending</span>
                    )}
                  </div>
                  {visitor.company && (
                    <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: 4 }}>{visitor.company}</div>
                  )}
                  <div style={{ color: 'var(--muted)', fontSize: '13px', marginTop: 6 }}>
                    {visitor.phone} {visitor.email && `• ${visitor.email}`}
                  </div>
                  <div style={{ fontSize: '13px', marginTop: 6 }}>
                    {visitor.purpose}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8, color: 'var(--muted)', fontSize: '12px' }}>
                    <div>In: {formatDateTime(visitor.checkIn)}</div>
                    <div>Out: {formatDateTime(visitor.checkOut)}</div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {visitor.status === 'pending' && (
                      <button className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleCheckIn(visitor._id)}>Check In</button>
                    )}
                    {visitor.status === 'checked-in' && (
                      <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => handleCheckOut(visitor._id)}>Check Out</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

