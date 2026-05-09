import React from 'react';
import { Link } from 'react-router-dom';


export default function QuizCard({ quiz, questionCount }) {
    return (
        <div className="card">
            <h3>{quiz.title}</h3>
            <p className="small">Questions: {questionCount} • Time: {quiz.timeLimitMinutes} mins</p>
            <Link to={`/quiz/${quiz.id}`} className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Start Quiz</Link>
        </div>
    );
}
