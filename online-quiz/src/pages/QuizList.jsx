import React, { useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';

export default function QuizList() {
    const { user } = useAuth();
    const nav = useNavigate();

    const [quizzes] = useLocalStorage('qa_quizzes', []);
    const [questionsAll] = useLocalStorage('qa_questions', []);
    const [history] = useLocalStorage('qa_history', []);

    // ✅ Redirect admin users directly to the dashboard
    useEffect(() => {
        if (user?.role === 'admin') {
            nav('/admin');
        }
    }, [user, nav]);

    // Function to check if user already attempted a quiz
    const hasAttempted = (quizId) => {
        if (!user) return false;
        return history.some(h => h.quizId === quizId && h.userId === user.id);
    };

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-center">Available Quizzes</h2>

            {quizzes.length === 0 && (
                <div className="card p-3 text-center text-muted">
                    No quizzes available. Ask admin to add some.
                </div>
            )}

            <div className="row">
                {quizzes.map(q => {
                    const questionCount = questionsAll.filter(quest => quest.quizId === q.id).length;
                    const attempted = hasAttempted(q.id);

                    return (
                        <div key={q.id} className="col-md-6 col-lg-4 mb-4 position-relative">
                            <QuizCard quiz={q} questionCount={questionCount} />
                            
                            {attempted && (
                                <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                                    Attempted
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
