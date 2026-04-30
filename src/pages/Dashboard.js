import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const role = localStorage.getItem('role');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await dashboardAPI.getDashboard();
      setDashboard(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return (
    <div style={styles.loading}>
      <div style={styles.spinner}>⏳</div>
      <p>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logo}>💼 AI Job Portal</div>
        <div style={styles.navRight}>
          <span style={styles.welcome}>👋 Hello, {name}!</span>
          <span style={styles.roleBadge}>{role}</span>
          <button
            style={styles.jobsBtn}
            onClick={() => navigate('/jobs')}>
            Browse Jobs
          </button>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>

        {/* Welcome Banner */}
        <div style={styles.banner}>
          <h1 style={styles.bannerTitle}>
            Welcome back, {name}! 🎉
          </h1>
          <p style={styles.bannerSubtitle}>
            {role === 'EMPLOYER'
              ? 'Manage your job postings and find the best candidates'
              : 'Track your applications and find your dream job'}
          </p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          {role === 'EMPLOYER' ? (
            <>
              <StatCard
                icon="💼"
                title="Jobs Posted"
                value={dashboard?.myPostedJobs || 0}
                color="#667eea"/>
              <StatCard
                icon="👥"
                title="Total Applicants"
                value={dashboard?.totalApplicantsReceived || 0}
                color="#f093fb"/>
              <StatCard
                icon="⏳"
                title="Pending Review"
                value={dashboard?.pendingApplications || 0}
                color="#ffeaa7"/>
              <StatCard
                icon="✅"
                title="Shortlisted"
                value={dashboard?.shortlistedCandidates || 0}
                color="#00b894"/>
              <StatCard
                icon="🎉"
                title="Accepted"
                value={dashboard?.acceptedCandidates || 0}
                color="#00cec9"/>
              <StatCard
                icon="❌"
                title="Rejected"
                value={dashboard?.rejectedCandidates || 0}
                color="#d63031"/>
            </>
          ) : (
            <>
              <StatCard
                icon="📝"
                title="Total Applied"
                value={dashboard?.myApplications || 0}
                color="#667eea"/>
              <StatCard
                icon="⏳"
                title="Pending"
                value={dashboard?.pendingMyApplications || 0}
                color="#ffeaa7"/>
              <StatCard
                icon="⭐"
                title="Shortlisted"
                value={dashboard?.shortlistedMyApplications || 0}
                color="#00b894"/>
              <StatCard
                icon="🎉"
                title="Accepted"
                value={dashboard?.acceptedMyApplications || 0}
                color="#00cec9"/>
              <StatCard
                icon="🔍"
                title="Jobs Available"
                value={dashboard?.totalJobs || 0}
                color="#a29bfe"/>
            </>
          )}
        </div>

        {/* Recent Jobs */}
        {dashboard?.recentJobs?.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🔥 Recent Jobs
            </h2>
            <div style={styles.jobsList}>
              {dashboard.recentJobs.map(job => (
                <div key={job.id} style={styles.jobCard}>
                  <div style={styles.jobInfo}>
                    <h3 style={styles.jobTitle}>{job.title}</h3>
                    <p style={styles.jobCompany}>
                      🏢 {job.company} • 📍 {job.location}
                    </p>
                    <p style={styles.jobMeta}>
                      💰 {job.salaryRange} •
                      ⏱️ {job.jobType} •
                      🏠 {job.workType}
                    </p>
                  </div>
                  <div style={styles.jobRight}>
                    <span style={styles.viewCount}>
                      👁️ {job.viewCount} views
                    </span>
                    {role === 'JOB_SEEKER' && (
              <button
                style={styles.applyBtn}
                 onClick={() => navigate(`/jobs/${job.id}`)}>
                 Apply Now →
              </button>
  )}
  {role === 'EMPLOYER' && (
  <button
    style={styles.applyBtn}
    onClick={() => navigate(`/applicants/${job.id}`)}>
    View Applicants →
  </button>
)}
{role === 'EMPLOYER' && (
  <button
    style={styles.postJobBtn}
    onClick={() => navigate('/post-job')}>
    + Post Job
  </button>
)}

{role === 'JOB_SEEKER' && (
  <button
    style={styles.myAppsBtn}
    onClick={() => navigate('/my-applications')}>
    📋 My Applications
  </button>
)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {dashboard?.recentApplications?.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              📋 Recent Applications
            </h2>
            <div style={styles.appsList}>
              {dashboard.recentApplications.map(app => (
                <div key={app.id} style={styles.appCard}>
                  <div style={styles.appInfo}>
                    <h3 style={styles.appTitle}>
                      {app.jobTitle}
                    </h3>
                    <p style={styles.appMeta}>
                      {role === 'EMPLOYER'
                        ? `👤 ${app.seekerName}`
                        : `🏢 ${app.company}`}
                    </p>
                  </div>
                  <div style={styles.appRight}>
                    {app.aiScore && (
                      <span style={styles.aiScore}>
                        🤖 AI: {app.aiScore}%
                      </span>
                    )}
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(app.status)
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div style={styles.statCard}>
      <div style={{...styles.statIcon, background: color}}>
        {icon}
      </div>
      <div style={styles.statInfo}>
        <div style={styles.statValue}>{value}</div>
        <div style={styles.statTitle}>{title}</div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    PENDING: '#ffeaa7',
    REVIEWING: '#74b9ff',
    SHORTLISTED: '#00b894',
    ACCEPTED: '#00cec9',
    REJECTED: '#d63031'
  };
  return colors[status] || '#gray';
}

const styles = {
  container: { minHeight: '100vh', background: '#f8f9fa' },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  spinner: { fontSize: '50px', marginBottom: '20px' },
  navbar: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#667eea'
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  welcome: { color: '#333', fontWeight: '600' },
  roleBadge: {
    background: '#f0f4ff',
    color: '#667eea',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  jobsBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  myAppsBtn: {
  padding: '8px 20px',
  background: '#a29bfe',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
},
  logoutBtn: {
    padding: '8px 20px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px'
  },
  banner: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '20px',
    padding: '40px',
    color: 'white',
    marginBottom: '30px'
  },
  bannerTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 10px 0'
  },
  bannerSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
  },
  statIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  statInfo: {},
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  },
  statTitle: { fontSize: '13px', color: '#666' },
  section: { marginBottom: '30px' },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  },
  jobsList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  jobCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '20px 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
  },
  jobInfo: {},
  jobTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0'
  },
  jobCompany: { color: '#666', margin: '0 0 5px 0', fontSize: '14px' },
  jobMeta: { color: '#999', margin: 0, fontSize: '13px' },
  jobRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px'
  },
  viewCount: { color: '#999', fontSize: '13px' },
  applyBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  appsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  appCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '15px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  appInfo: {},
  appTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 4px 0'
  },
  appMeta: { color: '#666', margin: 0, fontSize: '14px' },
  appRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px'
  },
  aiScore: {
    background: '#f0f4ff',
    color: '#667eea',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold'
  },

  postJobBtn: {
  padding: '8px 20px',
  background: '#00b894',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
}, 
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#333'
  }
};