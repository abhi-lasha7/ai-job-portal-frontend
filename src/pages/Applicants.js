import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/api';

export default function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadApplicants(); }, [jobId]);

  const loadApplicants = async () => {
    try {
      const res = await applicationAPI.getApplicants(jobId);
      setApplicants(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (appId, status, feedback) => {
    try {
      await applicationAPI.updateStatus(appId, status, feedback);
      loadApplicants();
    } catch (err) {
      console.error(err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#00b894';
    if (score >= 60) return '#fdcb6e';
    return '#d63031';
  };

  if (loading) return (
    <div style={styles.loading}>Loading applicants...</div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
        <h1 style={styles.title}>Applicants</h1>
        <p style={styles.subtitle}>
          {applicants.length} applicants - Ranked by AI Score
        </p>
      </div>

      {applicants.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <h3>No applicants yet!</h3>
          <p>Share your job posting to get more applicants</p>
        </div>
      ) : (
        <div style={styles.list}>
          {applicants.map((app, index) => (
            <div key={app.id} style={styles.card}>
              <div style={styles.rank}>#{index + 1}</div>

              <div style={styles.info}>
                <div style={styles.nameRow}>
                  <h3 style={styles.name}>{app.seekerName}</h3>
                  <span style={styles.email}>{app.seekerEmail}</span>
                </div>

                <div style={styles.aiSection}>
                  <div style={styles.scoreContainer}>
                    <div style={{
                      ...styles.scoreBadge,
                      background: getScoreColor(app.aiScore)
                    }}>
                      AI Score: {app.aiScore}%
                    </div>
                    <div style={styles.scoreBar}>
                      <div style={{
                        ...styles.scoreBarFill,
                        width: `${app.aiScore}%`,
                        background: getScoreColor(app.aiScore)
                      }} />
                    </div>
                  </div>
                  <p style={styles.aiReason}>{app.aiReason}</p>
                  {app.aiMatchedSkills ? (
                    <p style={styles.matchedSkills}>
                      Matched: {app.aiMatchedSkills}
                    </p>
                  ) : null}
                </div>

                {app.coverLetter ? (
                  <div style={styles.coverLetter}>
                    <strong>Cover Letter:</strong>
                    <p>{app.coverLetter}</p>
                  </div>
                ) : null}

                {app.resumeUrl ? (
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={styles.resumeLink}>
                    View Resume
                  </a>
                ) : null}
              </div>

              <div style={styles.statusSection}>
                <span style={{
                  ...styles.statusBadge,
                  background: getStatusColor(app.status)
                }}>
                  {app.status}
                </span>

                {app.employerFeedback ? (
                  <p style={styles.feedback}>{app.employerFeedback}</p>
                ) : null}

                <div style={styles.actions}>
                  <button style={styles.acceptBtn}
                    onClick={() => updateStatus(app.id, 'ACCEPTED', 'Congratulations! You have been selected!')}>
                    Accept
                  </button>
                  <button style={styles.shortlistBtn}
                    onClick={() => updateStatus(app.id, 'SHORTLISTED', 'You have been shortlisted!')}>
                    Shortlist
                  </button>
                  <button style={styles.rejectBtn}
                    onClick={() => updateStatus(app.id, 'REJECTED', 'Thank you for applying!')}>
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    PENDING: '#ffeaa7',
    REVIEWING: '#74b9ff',
    SHORTLISTED: '#00b894',
    ACCEPTED: '#00cec9',
    REJECTED: '#ff7675'
  };
  return colors[status] || '#f0f0f0';
}

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  loading: { textAlign: 'center', padding: '100px', fontSize: '18px', color: '#666' },
  header: { marginBottom: '25px' },
  backBtn: {
    background: 'none', border: '2px solid #667eea', color: '#667eea',
    padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'
  },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#333', margin: '0 0 5px 0' },
  subtitle: { color: '#666', margin: 0 },
  empty: {
    textAlign: 'center', padding: '60px', background: 'white',
    borderRadius: '20px', color: '#666'
  },
  emptyIcon: { fontSize: '60px', marginBottom: '15px' },
  list: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: {
    background: 'white', borderRadius: '16px', padding: '25px',
    display: 'flex', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  rank: {
    width: '40px', height: '40px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white', borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: '14px', flexShrink: 0
  },
  info: { flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  name: { fontSize: '18px', fontWeight: 'bold', color: '#333', margin: 0 },
  email: { color: '#666', fontSize: '14px' },
  aiSection: { marginBottom: '12px' },
  scoreContainer: { marginBottom: '8px' },
  scoreBadge: {
    display: 'inline-block', color: 'white', padding: '4px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px'
  },
  scoreBar: { height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: '3px' },
  aiReason: { color: '#555', fontSize: '14px', margin: '5px 0' },
  matchedSkills: { color: '#00b894', fontSize: '13px', fontWeight: '600' },
  coverLetter: {
    background: '#f8f9fa', padding: '12px', borderRadius: '8px',
    fontSize: '14px', color: '#555', marginBottom: '10px'
  },
  resumeLink: { color: '#667eea', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' },
  statusSection: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'flex-end', gap: '10px', minWidth: '150px'
  },
  statusBadge: { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#333' },
  feedback: { color: '#666', fontSize: '12px', textAlign: 'right', margin: 0 },
  actions: { display: 'flex', flexDirection: 'column', gap: '8px' },
  acceptBtn: {
    padding: '8px 16px', background: '#00b894', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
  },
  shortlistBtn: {
    padding: '8px 16px', background: '#fdcb6e', color: '#333',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
  },
  rejectBtn: {
    padding: '8px 16px', background: '#ff7675', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
  }
};