import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Dashboard from './pages/Dashboard';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/applicants/:jobId" element={<Applicants />} />
        <Route path="/my-applications" element={<MyApplications />} />
      </Routes>
    </Router>
  );
}

export default App;
