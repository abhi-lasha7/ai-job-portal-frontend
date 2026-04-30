import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationAPI } from '../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [error, setError] = useState('');
  const role = localStorage.getItem('role');

  useEffect(() => { loadJob(); }, [id]);

  const loadJob = async () => {
    try {
      const res = await jobsAPI.getById(id);
      setJob(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError('Please upload your resume!');
      return;
    }
    setApplying(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      formData.append('coverLetter', coverLetter);
      await applicationAPI.apply(id, formData);
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed!');
    }
    setApplying(false);
  };

  if (loading) return (
    <div style={styles.loading}>Loading job details...</div>
  );

  if (!job) return (
    <div style={styles.loading}>Job not found!</div>
  );

  return (
    <div style={styles.container}>

      {/* Back Button */}
      <button
        style={styles.backBtn}
        onClick={() => navigate('/jobs')}>
        ← Back to Jobs
      </button>

      {/* Job Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.company}>{job.company}</div>
          <h1 style={styles.title}>{job.title}</h1>
          <div style={styles.tags}>
            <span style={styles.tag}>📍 {job.location}</span>
            <span style={styles.tag}>💰 {job.salaryRange}</span>
            <span style={styles.tag}>⏱️ {job.jobType}</span>
            <span style={styles.tag}>🏠 {job.workType}</span>
            <span style={styles.tag}>📅 {job.experience}</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.views}>👁️ {job.viewCount} views</span>
          {role === 'JOB_SEEKER' && !applied && (
            <button
              style={styles.applyBtn}
              onClick={() => setShowApplyForm(!showApplyForm)}>
              {showApplyForm ? 'Cancel' : '🚀 Apply Now'}
            </button>
          )}
          {applied && (
            <div style={styles.appliedBadge}>
              ✅ Applied Successfully!
            </div>
          )}
        </div>
      </div>

      {/* Apply Form */}
      {showApplyForm && (
        <div style={styles.applyForm}>
          <h2 style={styles.applyTitle}>📝 Apply for {job.title}</h2>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleApply}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Cover Letter
              </label>
              <textarea
                style={styles.textarea}
                placeholder="Tell the employer why you are perfect for this role..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Upload Resume (PDF only) *
              </label>
              <input
                type="file"
                accept=".pdf"
                style={styles.fileInput}
                onChange={e => setResume(e.target.files[0])}
              />
            </div>
            <button
              style={applying ? styles.btnDisabled : styles.submitBtn}
              type="submit"
              disabled={applying}>
              {applying ? '🤖 AI is screening your resume...' :
                          '🚀 Submit Application'}
            </button>
          </form>
        </div>
      )}

      {/* Job Details */}
      <div style={styles.content}>
        <div style={styles.mainContent}>

          {/* Description */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📋 Job Description</h2>
            <p style={styles.description}>{job.description}</p>
          </div>

          {/* Skills */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🛠️ Required Skills</h2>
            <div style={styles.skillsGrid}>
              {job.skillsRequired?.split(',').map((skill, i) => (
                <span key={i} style={styles.skillBadge}>
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Job Overview</h3>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Company</span>
              <span style={styles.sideValue}>{job.company}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Location</span>
              <span style={styles.sideValue}>{job.location}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Salary</span>
              <span style={styles.sideValue}>{job.salaryRange}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Experience</span>
              <span style={styles.sideValue}>{job.experience}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Job Type</span>
              <span style={styles.sideValue}>{job.jobType}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Work Type</span>
              <span style={styles.sideValue}>{job.workType}</span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Last Date</span>
              <span style={styles.sideValue}>
                {job.lastDate ?
                  new Date(job.lastDate).toLocaleDateString() :
                  'Open'}
              </span>
            </div>
            <div style={styles.sideItem}>
              <span style={styles.sideLabel}>Posted By</span>
              <span style={styles.sideValue}>{job.employerName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  loading: {
    textAlign: 'center',
    padding: '100px',
    fontSize: '18px',
    color: '#666'
  },
  backBtn: {
    background: 'none',
    border: '2px solid #667eea',
    color: '#667eea',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  header: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  },
  headerLeft: { flex: 1 },
  company: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '8px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 15px 0'
  },
  tags: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  tag: {
    background: '#f5f5f5',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#555'
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px'
  },
  views: { color: '#999', fontSize: '14px' },
  applyBtn: {
    padding: '14px 30px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  appliedBadge: {
    background: '#d4edda',
    color: '#155724',
    padding: '12px 20px',
    borderRadius: '12px',
    fontWeight: 'bold'
  },
  applyForm: {
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '20px',
    border: '2px solid #667eea'
  },
  applyTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px'
  },
  error: {
    background: '#fee',
    color: '#c00',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  fileInput: {
    width: '100%',
    padding: '12px',
    border: '2px dashed #667eea',
    borderRadius: '10px',
    background: '#f8f9ff',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  btnDisabled: {
    width: '100%',
    padding: '15px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'not-allowed'
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '20px'
  },
  mainContent: {},
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    marginBottom: '20px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  },
  description: {
    color: '#555',
    lineHeight: '1.8',
    fontSize: '15px'
  },
  skillsGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  skillBadge: {
    background: 'linear-gradient(135deg, #667eea20, #764ba220)',
    color: '#667eea',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #667eea40'
  },
  sidebar: {},
  sideCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: '20px'
  },
  sideTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '2px solid #f0f0f0'
  },
  sideItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #f5f5f5'
  },
  sideLabel: { color: '#666', fontSize: '14px' },
  sideValue: { color: '#333', fontWeight: '600', fontSize: '14px' }
};