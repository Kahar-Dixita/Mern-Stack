// File: AdminDashboard.jsx
import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export default function AdminDashboard() {
  const { users, deleteUser } = useAuth();
  const [quizzes, setQuizzes] = useLocalStorage('qa_quizzes', []);
  const [questions, setQuestions] = useLocalStorage('qa_questions', []);
  const [history, setHistory] = useLocalStorage('qa_history', []);

  const [selectedTab, setSelectedTab] = useState('users'); // users | quizzes | leaderboard
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newChoices, setNewChoices] = useState([
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' }
  ]);
  const [correctChoice, setCorrectChoice] = useState('A');

  // Leaderboard
  const leaderboard = history
    .map(h => {
      const user = users.find(u => u.id === h.userId) || { name: 'Unknown', email: 'unknown' };
      const quiz = quizzes.find(q => q.id === h.quizId) || { title: 'Unknown Quiz' };
      return {
        userName: user.name,
        userEmail: user.email,
        quizTitle: quiz.title,
        score: h.score,
        id: h.id,
        date: new Date(h.date).toLocaleString()
      };
    })
    .sort((a, b) => b.score - a.score);

  // Quiz actions
  function addQuiz() {
    const newQuiz = { id: uuidv4(), title: 'Untitled Quiz', published: false, timeLimitMinutes: 10 };
    setQuizzes(prev => [newQuiz, ...prev]);
    setSelectedQuizId(newQuiz.id);
    setQuizTitle(newQuiz.title);
  }

  function selectQuiz(id) {
    setSelectedQuizId(id);
    const quiz = quizzes.find(q => q.id === id);
    setQuizTitle(quiz?.title || '');
  }

  function saveQuizTitle() {
    setQuizzes(prev => prev.map(q => q.id === selectedQuizId ? { ...q, title: quizTitle } : q));
  }

  function deleteQuiz(id) {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    setQuestions(prev => prev.filter(q => q.quizId !== id));
    if (selectedQuizId === id) setSelectedQuizId(null);
  }

  // Question actions
  function addQuestion() {
    if (!selectedQuizId) return;
    const newQ = {
      id: uuidv4(),
      quizId: selectedQuizId,
      text: newQuestionText,
      choices: newChoices,
      correctChoiceId: correctChoice,
      sn: questions.filter(q => q.quizId === selectedQuizId).length + 1
    };
    setQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
    setNewChoices([{ id: 'A', text: '' }, { id: 'B', text: '' }, { id: 'C', text: '' }]);
    setCorrectChoice('A');
  }

  function deleteQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id));
  }

  function deleteScore(id) {
    setHistory(prev => prev.filter(h => h.id !== id));
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      {/* Tabs */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button className={`btn ${selectedTab === 'users' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('users')}>Users</button>
        <button className={`btn ${selectedTab === 'quizzes' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('quizzes')}>Quizzes</button>
        <button className={`btn ${selectedTab === 'leaderboard' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSelectedTab('leaderboard')}>Leaderboard</button>
      </div>

      {/* USERS */}
      {selectedTab === 'users' && (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <h3 className="mb-3">All Users</h3>
          {users.length === 0 ? (
            <p className="text-muted">No users found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* QUIZZES */}
      {selectedTab === 'quizzes' && (
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Quizzes</h3>
            <button className="btn btn-success" onClick={addQuiz}>Add Quiz</button>
          </div>

          {quizzes.length === 0 ? (
            <p className="text-muted">No quizzes available.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Questions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map(q => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>{questions.filter(x => x.quizId === q.id).length}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => selectQuiz(q.id)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteQuiz(q.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Selected Quiz Card */}
      {selectedQuizId && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Edit Quiz</h4>

            {/* Quiz Title */}
            <div className="mb-4 d-flex flex-column flex-md-row gap-2">
              <input
                className="form-control"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                placeholder="Quiz Title"
              />
              <button className="btn btn-primary mt-2 mt-md-0" onClick={saveQuizTitle}>Save Title</button>
            </div>

            {/* Questions Table */}
            <h5 className="mb-3">Questions</h5>
            {questions.filter(q => q.quizId === selectedQuizId).length === 0 ? (
              <p className="text-muted">No questions added yet.</p>
            ) : (
              <div className="table-responsive mb-4">
                <table className="table table-bordered table-striped">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Question</th>
                      <th>Choices</th>
                      <th>Answer</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions
                      .filter(q => q.quizId === selectedQuizId)
                      .map(q => (
                        <tr key={q.id}>
                          <td>{q.sn}</td>
                          <td>{q.text}</td>
                          <td>{q.choices.map(c => `${c.id}:${c.text}`).join(', ')}</td>
                          <td>{q.correctChoiceId}</td>
                          <td>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteQuestion(q.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add New Question */}
            <h5 className="mb-3 mt-4">Add New Question</h5>
            <div className="mb-3">
              <input
                className="form-control mb-2"
                value={newQuestionText}
                onChange={e => setNewQuestionText(e.target.value)}
                placeholder="Question Text"
              />
              {newChoices.map((c, idx) => (
                <div key={c.id} className="mb-2 d-flex gap-2 align-items-center">
                  <label className="mb-0">{c.id}</label>
                  <input
                    className="form-control"
                    value={c.text}
                    onChange={e => {
                      const copy = [...newChoices];
                      copy[idx].text = e.target.value;
                      setNewChoices(copy);
                    }}
                  />
                </div>
              ))}
              <label htmlFor="" className='mt-3'>correct ans :</label>
              <select
                className="form-select mb-3 mt-3"
                value={correctChoice}
                onChange={e => setCorrectChoice(e.target.value)}
              >
                {newChoices.map(c => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
             <button className="btn btn-success" onClick={addQuestion}>
  Add Question
</button>

            </div>
          </div>
        </div>
      )}

      {/* LEADERBOARD */}
      {selectedTab === 'leaderboard' && (
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="mb-3">Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <p className="text-muted">No scores yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(l => (
                    <tr key={l.id}>
                      <td>{l.userName}</td>
                      <td>{l.userEmail}</td>
                      <td>{l.quizTitle}</td>
                      <td>{l.score}</td>
                      <td>{l.date}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteScore(l.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
