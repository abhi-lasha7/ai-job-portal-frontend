import React, { useState, useEffect } from 'react';
import { jobsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => { loadJobs(); }, []);

  const loadJobs = async () => {
    try {
      const res = await jobsAPI.getAll();
      setJobs(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) { loadJobs(); return; }
    try {
      const res = await jobsAPI.search(search);
      setJobs(res.data.data);
    } catch (err) { console.error(err); }
  };

  const filteredJobs = filter === 'all' ? jobs :
    jobs.filter(j => j.workType === filter);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>💼 Find Your Dream Job</h1>
        <p style={styles.subtitle}>
          {jobs.length} jobs available
        </p>
      </div>

      {/* Search Bar */}
      <div style={styles.searchBox}>
        <input
          style={styles.searchInput}
          placeholder="🔍 Search jobs, skills, companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
        />
        <button style={styles.searchBtn} onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {['all', 'Remote', 'Hybrid', 'On-site'].map(f => (
          <button
            key={f}
            style={filter === f ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(f)}>
            {f === 'all' ? '🌐 All' :
             f === 'Remote' ? '🏠 Remote' :
             f === 'Hybrid' ? '🏢 Hybrid' : '🏙️ On-site'}
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={styles.loading}>Loading jobs...</div>
      ) : (
        <div style={styles.grid}>
          {filteredJobs.map(job => (
            <div key={job.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.company}>{job.company}</div>
                <span style={styles.workTypeBadge}>{job.workType}</span>
              </div>

              <h3 style={styles.jobTitle}>{job.title}</h3>

              <div style={styles.tags}>
                <span style={styles.tag}>📍 {job.location}</span>
                <span style={styles.tag}>💰 {job.salaryRange}</span>
                <span style={styles.tag}>⏱️ {job.jobType}</span>
              </div>

              <p style={styles.skills}>
                🛠️ {job.skillsRequired}
              </p>

              <div style={styles.cardFooter}>
                <span style={styles.views}>
                  👁️ {job.viewCount} views
                </span>
                {role === 'JOB_SEEKER' && (
                  <button
                    style={styles.applyBtn}
                    onClick={() => navigate(`/apply/${job.id}`)}>
                    Apply Now →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333'
  },
  subtitle: { color: '#666', fontSize: '18px' },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '15px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none'
  },
  searchBtn: {
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  filterActive: {
    padding: '8px 20px',
    border: '2px solid #667eea',
    borderRadius: '20px',
    background: '#667eea',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  company: {
    fontWeight: 'bold',
    color: '#667eea',
    fontSize: '14px'
  },
  workTypeBadge: {
    background: '#f0f4ff',
    color: '#667eea',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  jobTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    margin: '10px 0'
  },
  tags: { display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '10px 0' },
  tag: {
    background: '#f5f5f5',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#555'
  },
  skills: { color: '#666', fontSize: '14px', margin: '10px 0' },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  },
  views: { color: '#999', fontSize: '13px' },
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
  loading: { textAlign: 'center', padding: '50px', color: '#666' }
};