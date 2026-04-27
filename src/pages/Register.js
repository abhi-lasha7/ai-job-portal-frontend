import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register(form);
      const { token, role, name } = res.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('name', name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>🚀</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join AI Job Portal Today</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a</label>
            <div style={styles.roleSelector}>
              <div
                style={form.role === 'JOB_SEEKER'
                  ? styles.roleActive : styles.roleBtn}
                onClick={() => setForm({...form, role: 'JOB_SEEKER'})}>
                🔍 Job Seeker
              </div>
              <div
                style={form.role === 'EMPLOYER'
                  ? styles.roleActive : styles.roleBtn}
                onClick={() => setForm({...form, role: 'EMPLOYER'})}>
                🏢 Employer
              </div>
            </div>
          </div>

          <button
            style={loading ? styles.buttonDisabled : styles.button}
            type="submit"
            disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>Login here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  logo: { fontSize: '50px', marginBottom: '10px' },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0'
  },
  subtitle: { color: '#666', marginBottom: '25px' },
  error: {
    background: '#fee',
    color: '#c00',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  inputGroup: { marginBottom: '18px', textAlign: 'left' },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  roleSelector: {
    display: 'flex',
    gap: '10px'
  },
  roleBtn: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666'
  },
  roleActive: {
    flex: 1,
    padding: '12px',
    border: '2px solid #f093fb',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
    color: 'white'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #f093fb, #f5576c)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'not-allowed',
    marginTop: '10px'
  },
  link: { marginTop: '20px', color: '#666', fontSize: '14px' },
  linkText: { color: '#f5576c', fontWeight: 'bold' }
};