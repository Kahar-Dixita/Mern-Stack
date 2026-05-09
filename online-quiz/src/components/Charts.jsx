import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Charts({ quizzes, history }) {
  const data = quizzes.map(q => {
    const attempts = history.filter(h => h.quizId === q.id);
    const avgScore = attempts.length ? Math.round(attempts.reduce((a,b)=>a+b.score,0)/attempts.length) : 0;
    return { name: q.title, avgScore };
  });

  return (
    <div style={{ height:300, background:'#fff', padding: '1rem', borderRadius:8, boxShadow:'0 2px 6px rgba(0,0,0,0.1)', marginBottom:'1rem' }}>
      <h4>Quiz Performance</h4>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgScore" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
