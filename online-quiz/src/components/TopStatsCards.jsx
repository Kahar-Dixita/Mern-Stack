import React from 'react';

export default function TopStatsCards({ users, quizzes, history }) {
  const totalAttempts = history.length;
  const avgScore = totalAttempts ? Math.round(history.reduce((acc,h)=>acc+h.score,0)/totalAttempts) : 0;

  return (
    <div style={{ display:'flex', gap:'1rem', marginBottom:'1rem', flexWrap:'wrap' }}>
      <div style={{ flex:1, background:'#fff', padding:'1rem', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>
        <h4>Total Users</h4>
        <p>{users.length}</p>
      </div>
      <div style={{ flex:1, background:'#fff', padding:'1rem', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>
        <h4>Total Quizzes</h4>
        <p>{quizzes.length}</p>
      </div>
      <div style={{ flex:1, background:'#fff', padding:'1rem', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>
        <h4>Total Attempts</h4>
        <p>{totalAttempts}</p>
      </div>
      <div style={{ flex:1, background:'#fff', padding:'1rem', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.1)' }}>
        <h4>Average Score</h4>
        <p>{avgScore}</p>
      </div>
    </div>
  );
}
