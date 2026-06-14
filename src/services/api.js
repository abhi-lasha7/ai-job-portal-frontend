import axios from 'axios';

const API_BASE_URL = "https://ai-job-portal-backend-jvvl.onrender.com";

const API = axios.create({
  baseURL: BASE_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  health: () => API.get('/auth/health')
};

export const jobsAPI = {
  getAll: () => API.get('/jobs'),
  getById: (id) => API.get(`/jobs/${id}`),
  search: (keyword) => API.get(`/jobs/search?keyword=${keyword}`),
  trending: () => API.get('/jobs/trending'),
  filterByLocation: (loc) =>
    API.get(`/jobs/filter/location?location=${loc}`),
  filterByType: (type) =>
    API.get(`/jobs/filter/type?jobType=${type}`),
  create: (data) => API.post('/jobs', data),
  update: (id, data) => API.put(`/jobs/${id}`, data),
  delete: (id) => API.delete(`/jobs/${id}`),
  myJobs: () => API.get('/jobs/my-jobs')
};

export const applicationAPI = {
  apply: (jobId, formData) =>
    API.post(`/applications/apply/${jobId}`, formData),
  myApplications: () => API.get('/applications/my-applications'),
  getApplicants: (jobId) =>
    API.get(`/applications/job/${jobId}/applicants`),
  updateStatus: (id, status, feedback) =>
    API.put(`/applications/${id}/status?status=${status}&feedback=${feedback}`)
};

export const dashboardAPI = {
  getDashboard: () => API.get('/dashboard')
};
