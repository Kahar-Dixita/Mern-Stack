import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import Question from '../components/Question';
import calculateScore from '../utils/calculateScore';
import randomizeQuestions from '../utils/randomizeQuestions';
import { useAuth } from '../context/AuthContext';

export default function QuizPlay() {
    const { id } = useParams();
    const { user } = useAuth();
    const [quizzes] = useLocalStorage('qa_quizzes', []);
    const [questionsAll] = useLocalStorage('qa_questions', []);
    const [history, setHistory] = useLocalStorage('qa_history', []);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 min
    const nav = useNavigate();

    const quiz = quizzes.find(q => q.id === id);
    const questions = useMemo(() => randomizeQuestions(questionsAll.filter(q => q.quizId === id)), [questionsAll, id]);

    useEffect(() => {
        if (!quiz) nav('/quizzes');
    }, [quiz, nav]);

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    submit();
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    function handleChange(qid, cid) {
        setAnswers(prev => ({ ...prev, [qid]: cid }));
    }

    function submit() {
        const { score, correct, incorrect } = calculateScore(questions, answers, quiz?.sahi, quiz?.wrong);
        const record = {
            id: 'hist-' + Date.now(),
            quizId: id,
            score,
            correct,
            incorrect,
            userId: user?.id || 'guest',
            date: Date.now(),
            answers
        };
        setHistory(prev => [record, ...prev]);
        nav(`/results/${record.id}`);
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">{quiz?.title}</h2>
                <span className="badge bg-primary fs-5">
                    Time Left: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
            </div>

            <div className="row g-3 mb-4">
                {questions.map((q, index) => (
                    <div key={q.id} className="col-12">
                        <Question
                            q={q}
                            value={answers[q.id]}
                            onChange={handleChange}
                            index={index}  // <-- important
                        />
                    </div>
                ))}
            </div>

            <div className="text-center">
                <button className="btn btn-success btn-lg" onClick={submit}>Submit Quiz</button>
            </div>
        </div>
    );
}
