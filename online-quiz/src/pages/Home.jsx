import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="container my-5">
            <div className="card shadow-sm p-4">
                <div className="card-body text-center">
                    <h1 className="card-title mb-3">Welcome to QuizApp!</h1>
                    <p className="card-text mb-4">
                        Test your knowledge and challenge yourself with exciting quizzes. 
                        Register or log in to start attempting quizzes. Admins can manage quizzes, 
                        view user scores, and keep track of all quiz activities.
                    </p>
                    
                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <Link to="/register" className="btn btn-primary btn-lg">Register</Link>
                        <Link to="/login" className="btn btn-success btn-lg">Login</Link>
                        <Link to="/quizzes" className="btn btn-outline-primary btn-lg">View Quizzes</Link>
                    </div>

                    <hr className="my-4" />

                    <p className="text-muted small">
                        Start your learning journey today! Keep track of your scores, 
                        challenge friends, and become a quiz master.
                    </p>
                </div>
            </div>
        </div>
    );
}
