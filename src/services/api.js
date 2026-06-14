import axios from 'axios';

const API = axios.create({
  baseURL: "https://ai-job-portal-backend-jvvl.onrender.com"
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/api/auth/register', data),
  login: (data) => API.post('/api/auth/login', data),
  health: () => API.get('/api/auth/health')
};

export const jobsAPI = {
  getAll: () => API.get('/api/jobs'),
  getById: (id) => API.get(`/api/jobs/${id}`),
  search: (keyword) => API.get(`/api/jobs/search?keyword=${keyword}`),
  trending: () => API.get('/api/jobs/trending'),
  filterByLocation: (loc) => API.get(`/api/jobs/filter/location?location=${loc}`),
  filterByType: (type) => API.get(`/api/jobs/filter/type?jobType=${type}`),
  create: (data) => API.post('/api/jobs', data),
  update: (id, data) => API.put(`/api/jobs/${id}`, data),
  delete: (id) => API.delete(`/api/jobs/${id}`),
  myJobs: () => API.get('/api/jobs/my-jobs')
};

export const applicationAPI = {
  apply: (jobId, formData) => API.post(`/api/applications/apply/${jobId}`, formData),
  myApplications: () => API.get('/api/applications/my-applications'),
  getApplicants: (jobId) => API.get(`/api/applications/job/${jobId}/applicants`),
  updateStatus: (id, status, feedback) =>
    API.put(`/api/applications/${id}/status?status=${status}&feedback=${feedback}`)
};

export const dashboardAPI = {
  getDashboard: () => API.get('/api/dashboard')
};
