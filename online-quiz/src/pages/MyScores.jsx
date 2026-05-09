import React from 'react';
import { useAuth } from '../context/AuthContext';
import useLocalStorage from '../hooks/useLocalStorage';

export default function MyScores() {
    const { user } = useAuth();
    const [quizzes] = useLocalStorage('qa_quizzes', []);
    const [history] = useLocalStorage('qa_history', []);

    // If user not logged in
    if (!user) {
        return (
            <div className="container my-4">
                <div className="card p-4 text-center">
                    <h3>Welcome!</h3>
                    <p>Please login to view your scores.</p>
                </div>
            </div>
        );
    }

    // Filter attempts for current user
    const myAttempts = history.filter(h => h.userId === user.id);

    // Map attempts by quiz
    const attemptsByQuiz = quizzes.map(quiz => {
        const attempts = myAttempts.filter(h => h.quizId === quiz.id);
        return { quiz, attempts };
    });

    return (
        <div className="container my-4">
            <div className="card p-4">
                <h3 className="mb-4">{user.name}'s Quiz Scores</h3>

                {myAttempts.length === 0 && (
                    <p className="text-muted">You have not attempted any quizzes yet.</p>
                )}

                {myAttempts.length > 0 && attemptsByQuiz.map(({ quiz, attempts }) => (
                    <div key={quiz.id} className="card mb-3 p-3">
                        <h5 className="mb-3">{quiz.title || 'Unknown Quiz'}</h5>

                        {attempts.length === 0 ? (
                            <p className="text-muted">No attempts for this quiz yet.</p>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped mb-0">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Score</th>
                                            <th>Correct</th>
                                            <th>Incorrect</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attempts.map((h, idx) => (
                                            <tr key={h.id}>
                                                <td>{idx + 1}</td>
                                                <td>{h.score ?? 0}</td>
                                                <td>{h.correct ?? 0}</td>
                                                <td>{h.incorrect ?? 0}</td>
                                                <td>{new Date(h.date).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
