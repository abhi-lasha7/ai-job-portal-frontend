import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Dashboard from './pages/Dashboard';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Applicants from './pages/Applicants';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={
          token ? <Jobs /> : <Navigate to="/login" />
        } />
        <Route path="/jobs/:id" element={
          token ? <JobDetail /> : <Navigate to="/login" />
        } />
        <Route path="/dashboard" element={
          token ? <Dashboard /> : <Navigate to="/login" />
        } />
        <Route path="/post-job" element={
          token ? <PostJob /> : <Navigate to="/login" />
        } />
        <Route path="/applicants/:jobId" element={
          token ? <Applicants /> : <Navigate to="/login" />
        } />
        <Route path="/" element={
          <Navigate to={token ? "/dashboard" : "/login"} />
        } />
      </Routes>
    </Router>
  );
}

export default App;