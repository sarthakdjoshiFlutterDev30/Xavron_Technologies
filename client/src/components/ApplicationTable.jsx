export default function ApplicationTable({ applications = [], onStatusChange, onWithdraw }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Contact</th>
            <th>Job</th>
            <th>Status</th>
            <th>Cover Letter</th>
            <th>Resume</th>
            {onStatusChange && <th>Action</th>}
            {onWithdraw && <th>Withdraw</th>}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id}>
              <td>{app.userId?.name || app.candidateName || '—'}</td>
              <td>{app.userId?.contactNo || app.candidateContact || app.contactNo || '—'}</td>
              <td>{app.jobId?.title || '—'}</td>
              <td><span className={`status ${app.status}`}>{app.status}</span></td>
              <td style={{ maxWidth: 260, whiteSpace: 'pre-wrap' }}>{app.coverLetter || '—'}</td>
              <td>
                <a 
                  href={app.resumeUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-ghost"
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '13px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>📄</span>
                  Preview
                </a>
              
              </td>
              {onStatusChange && (
                <td>
                  <select 
                    value={app.status} 
                    onChange={(e) => onStatusChange(app._id, e.target.value)}
                    style={{
                      padding: '8px 32px 8px 12px',
                      fontSize: '13px',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239fb0d6' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(107,139,255,0.6)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(107,139,255,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                   <option value="Pending" title="Pending">⏳</option>
                    <option value="Reviewed" title="Reviewed">👁️</option>
                    <option value="Selected" title="Selected">✅</option>
                    <option value="Rejected" title="Rejected">❌</option>
                      </select>
                </td>
              )}
              {onWithdraw && (
                <td>
                  <button className="btn btn-ghost" onClick={() => onWithdraw(app._id)}>Withdraw</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

