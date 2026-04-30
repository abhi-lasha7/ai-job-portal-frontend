import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../services/api';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    workType: 'Hybrid',
    jobType: 'Full-time',
    salaryRange: '',
    experience: '',
    skillsRequired: '',
    lastDate: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await jobsAPI.create(form);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job!');
    }
    setLoading(false);
  };

  const update = (field, value) => {
    setForm({...form, [field]: value});
  };

  if (success) return (
    <div style={styles.successContainer}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>🎉</div>
        <h2 style={styles.successTitle}>Job Posted Successfully!</h2>
        <p style={styles.successText}>
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <button
          style={styles.backBtn}
          onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>📝 Post a New Job</h1>
        <p style={styles.subtitle}>
          Fill in the details to find the best candidates
        </p>
      </div>

      {/* Form */}
      <div style={styles.formCard}>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input
                style={styles.input}
                placeholder="e.g. Java Backend Developer"
                value={form.title}
                onChange={e => update('title', e.target.value)}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company Name *</label>
              <input
                style={styles.input}
                placeholder="e.g. TechCorp"
                value={form.company}
                onChange={e => update('company', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Location *</label>
              <input
                style={styles.input}
                placeholder="e.g. Mumbai, Delhi, Pune"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Salary Range</label>
              <input
                style={styles.input}
                placeholder="e.g. 8-12 LPA"
                value={form.salaryRange}
                onChange={e => update('salaryRange', e.target.value)}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Work Type</label>
              <select
                style={styles.select}
                value={form.workType}
                onChange={e => update('workType', e.target.value)}>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Job Type</label>
              <select
                style={styles.select}
                value={form.jobType}
                onChange={e => update('jobType', e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
                <option>Freelance</option>
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Experience Required</label>
              <input
                style={styles.input}
                placeholder="e.g. 1-3 years"
                value={form.experience}
                onChange={e => update('experience', e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Last Date to Apply</label>
              <input
                style={styles.input}
                type="datetime-local"
                value={form.lastDate}
                onChange={e => update('lastDate', e.target.value)}
              />
            </div>
          </div>

          {/* Skills */}
          <div style={styles.fullField}>
            <label style={styles.label}>
              Skills Required
            </label>
            <input
              style={styles.input}
              placeholder="e.g. Java, Spring Boot, MySQL, REST APIs"
              value={form.skillsRequired}
              onChange={e => update('skillsRequired', e.target.value)}
            />
            <small style={styles.hint}>
              Separate skills with commas
            </small>
          </div>

          {/* Description */}
          <div style={styles.fullField}>
            <label style={styles.label}>Job Description *</label>
            <textarea
              style={styles.textarea}
              placeholder="Describe the role, responsibilities and requirements..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Submit */}
          <button
            style={loading ? styles.btnDisabled : styles.submitBtn}
            type="submit"
            disabled={loading}>
            {loading ? 'Posting Job...' : '🚀 Post Job Now'}
          </button>

        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    marginBottom: '25px'
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
    marginBottom: '15px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 5px 0'
  },
  subtitle: { color: '#666', margin: 0 },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '35px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  error: {
    background: '#fee',
    color: '#c00',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  field: {},
  fullField: { marginBottom: '20px' },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#555',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'white'
  },
  textarea: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'vertical'
  },
  hint: { color: '#999', fontSize: '12px' },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  btnDisabled: {
    width: '100%',
    padding: '16px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '17px',
    cursor: 'not-allowed',
    marginTop: '10px'
  },
  successContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa'
  },
  successCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '50px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  successIcon: { fontSize: '60px', marginBottom: '20px' },
  successTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333'
  },
  successText: { color: '#666' }
};