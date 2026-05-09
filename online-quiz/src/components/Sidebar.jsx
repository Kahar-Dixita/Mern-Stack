import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ admin = false }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? { fontWeight: 'bold', color: '#2563eb' } : {};

  return (
    <div style={{ width: '220px', background: '#f1f1f1', padding: '1rem', minHeight: '100vh' }}>
      <h3>Admin Panel</h3>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to="/admin" style={isActive('/admin')}>Dashboard</Link>
        <Link to="/admin/users" style={isActive('/admin/users')}>Users</Link>
        <Link to="/admin/quizzes" style={isActive('/admin/quizzes')}>Quizzes</Link>
        <Link to="/admin/leaderboard" style={isActive('/admin/leaderboard')}>Leaderboard</Link>
      </nav>
    </div>
  );
}
