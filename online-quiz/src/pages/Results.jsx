import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';


export default function Results() {
    const { historyId } = useParams();
    const [history] = useLocalStorage('qa_history', []);
    const [quizzes] = useLocalStorage('qa_quizzes', []);


    const rec = history.find(h => h.id === historyId);
    const quiz = quizzes.find(q => q.id === rec?.quizId);


    if (!rec) return <div className="container"><div className="card">Result not found</div></div>;


    return (
        <div className="container">
            <div className="card">
                <h3>Result for {quiz?.title}</h3>
                <p>Score: {rec.score}</p>
                <p>Correct: {rec.correct} • Wrong: {rec.incorrect}</p>
                <Link to="/quizzes" className="btn btn-ghost">Back to Quizzes</Link>
            </div>
        </div>
    );
}