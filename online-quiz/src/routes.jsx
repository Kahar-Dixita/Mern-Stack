// AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import pages (all default exports)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizPlay from './pages/QuizPlay';
import Results from './pages/Results';
import Profile from './pages/Profile';
import MyScores from './pages/MyScores';
import AdminDashboard from './pages/AdminDashboard'; // <-- correct default import

import { useAuth } from './context/AuthContext';

function Private({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quizzes" element={<Private><QuizList /></Private>} />
      <Route path="/quiz/:id" element={<Private><QuizPlay /></Private>} />
      <Route path="/results/:historyId" element={<Private><Results /></Private>} />
      <Route path="/my-scores" element={<Private><MyScores /></Private>} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/admin" element={<Private adminOnly={true}><AdminDashboard /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
