import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    try {
      const res = await applicationAPI.myApplications();
      setApplications(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = filter === 'ALL' ? applications :
    applications.filter(a => a.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffeaa7',
      REVIEWING: '#74b9ff',
      SHORTLISTED: '#00b894',
      ACCEPTED: '#00cec9',
      REJECTED: '#ff7675'
    };
    return colors[status] || '#f0f0f0';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      PENDING: '⏳',
      REVIEWING: '👀',
      SHORTLISTED: '⭐',
      ACCEPTED: '🎉',
      REJECTED: '❌'
    };
    return emojis[status] || '📝';
  };

  if (loading) return (
    <div style={styles.loading}>Loading your applications...</div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
        <h1 style={styles.title}>My Applications</h1>
        <p style={styles.subtitle}>Track all your job applications</p>
      </div>

      <div style={styles.statsRow}>
        {['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map(status => (
          <button
            key={status}
            style={filter === status ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(status)}>
            {status === 'ALL' ? 'All' :
             status === 'PENDING' ? 'Pending' :
             status === 'SHORTLISTED' ? 'Shortlisted' :
             status === 'ACCEPTED' ? 'Accepted' : 'Rejected'}
            {' '}
            ({status === 'ALL' ? applications.length :
              applications.filter(a => a.status === status).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <h3>No applications found!</h3>
          <button style={styles.browseBtn} onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map(app => (
            <div key={app.id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.companyLogo}>
                  {app.company ? app.company.charAt(0) : 'J'}
                </div>
              </div>

              <div style={styles.cardMiddle}>
                <h3 style={styles.jobTitle}>{app.jobTitle}</h3>
                <p style={styles.company}>{app.company}</p>

                {app.aiScore ? (
                  <div style={styles.aiScore}>
                    <span style={{
                      ...styles.scoreBadge,
                      background: app.aiScore >= 80 ? '#00b894' :
                                  app.aiScore >= 60 ? '#fdcb6e' : '#ff7675'
                    }}>
                      AI Match: {app.aiScore}%
                    </span>
                    {app.aiReason ? (
                      <p style={styles.aiReason}>{app.aiReason}</p>
                    ) : null}
                  </div>
                ) : null}

                {app.employerFeedback ? (
                  <div style={styles.feedback}>
                    Feedback: {app.employerFeedback}
                  </div>
                ) : null}

                <p style={styles.date}>
                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div style={styles.cardRight}>
                <div style={{
                  ...styles.statusBadge,
                  background: getStatusColor(app.status)
                }}>
                  {getStatusEmoji(app.status)} {app.status}
                </div>

                {app.resumeUrl ? (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={styles.resumeLink}>
                    View Resume
                  </a>
                ) : null}

                <p style={styles.applicants}>
                  {app.totalApplicants} applicants
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#666' },
  header: { marginBottom: '25px' },
  backBtn: {
    background: 'none', border: '2px solid #667eea', color: '#667eea',
    padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', display: 'block'
  },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' },
  subtitle: { color: '#666', margin: 0 },
  statsRow: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '10px 18px', border: '2px solid #e0e0e0',
    borderRadius: '25px', background: 'white', cursor: 'pointer', fontSize: '14px'
  },
  filterActive: {
    padding: '10px 18px', border: '2px solid #667eea',
    borderRadius: '25px', background: '#667eea', color: 'white',
    cursor: 'pointer', fontSize: '14px'
  },
  empty: {
    textAlign: 'center', padding: '60px', background: 'white',
    borderRadius: '20px', color: '#666'
  },
  browseBtn: {
    padding: '12px 25px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '15px', marginTop: '15px'
  },
  list: { display: 'flex', flexDirection: 'column', gap: '15px' },
  card: {
    background: 'white', borderRadius: '16px', padding: '20px 25px',
    display: 'flex', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    alignItems: 'center'
  },
  cardLeft: {},
  companyLogo: {
    width: '50px', height: '50px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white', borderRadius: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: 'bold'
  },
  cardMiddle: { flex: 1 },
  jobTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: '0 0 4px 0' },
  company: { color: '#666', margin: '0 0 8px 0', fontSize: '14px' },
  aiScore: { marginBottom: '8px' },
  scoreBadge: {
    display: 'inline-block', color: 'white', padding: '3px 12px',
    borderRadius: '15px', fontSize: '12px', fontWeight: 'bold'
  },
  aiReason: { color: '#666', fontSize: '13px', margin: '4px 0 0 0' },
  feedback: {
    background: '#f8f9fa', padding: '8px 12px', borderRadius: '8px',
    fontSize: '13px', color: '#555', marginBottom: '8px'
  },
  date: { color: '#999', fontSize: '13px', margin: 0 },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  statusBadge: { padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', color: '#333' },
  resumeLink: { color: '#667eea', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' },
  applicants: { color: '#999', fontSize: '12px', margin: 0 }
};