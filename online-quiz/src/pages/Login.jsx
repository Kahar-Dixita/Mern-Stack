import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login, users, setUsers } = useAuth(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const nav = useNavigate();

    async function handle(e) {
    e.preventDefault();
    try {
      // if no admin exists, recreate it
      const adminExists = users.some(u => u.role === 'admin');
      if (!adminExists) {
        const admin = {
          id: 'admin-1',
          name: 'admin',
          email: 'harshil@gmail.com',
          password: 'harshil123',
          role: 'admin'
        };
        setUsers([...users, admin]);
      }

      await login({ email, password });
      nav('/quizzes');
    } catch (ex) {
      setErr(ex.message);
    }
  }

    return (
        <div className="container my-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: 400 }}>
                <div className="card-body">
                    <h3 className="card-title text-center mb-4">Login</h3>
                    {err && <div className="alert alert-danger">{err}</div>}

                    <form onSubmit={handle}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className="form-control" value={password}  onChange={e => setPassword(e.target.value)}  placeholder="Enter your password" required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100"> Login </button>
                    </form>  </div>
            </div>  </div>
    );
}
