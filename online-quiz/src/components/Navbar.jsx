import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background 0.3s',
  };

  const hover = e => e.currentTarget.style.background = '#555';
  const leave = e => e.currentTarget.style.background = 'transparent';

  function doLogout() {
    logout();
    nav('/');
  }

  return (
    <nav style={{ backgroundColor: '#333', padding: '10px 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 20 }}>
            QuizApp
          </Link>
        </div>

        {user && <span style={{ color: '#fff', marginRight: 20 }}>Hi, {user.name}</span>}

        <ul style={{ listStyle: 'none', display: 'flex', gap: '15px', margin: 0, padding: 0, alignItems: 'center' }}>
          {/* Only show these links if user is NOT admin */}
          {user && user.role !== 'admin' && (
            <>
              <li>
                <Link to="/" style={linkStyle} onMouseEnter={hover} onMouseLeave={leave}>Home</Link>
              </li>
              <li>
                <Link to="/quizzes" style={linkStyle} onMouseEnter={hover} onMouseLeave={leave}>Quizzes</Link>
              </li>
              <li>
                <Link to="/my-scores" style={linkStyle} onMouseEnter={hover} onMouseLeave={leave}>My Scores</Link>
              </li>
            </>
          )}

          {/* Admin link */}
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin" style={linkStyle} onMouseEnter={hover} onMouseLeave={leave}>Admin</Link>
            </li>
          )}

          {/* Profile & Logout for everyone */}
          {user ? (
            <>
              <li>
                <Link to="/profile" style={linkStyle} onMouseEnter={hover} onMouseLeave={leave}>Profile</Link>
              </li>
              <li>
                <button
                  onClick={doLogout}
                  style={{ ...linkStyle, backgroundColor: '#ff5757', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ff3b3b'}
                  onMouseLeave={e => e.currentTarget.style.background = '#ff5757'}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  style={{ ...linkStyle, backgroundColor: '#555' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#777'}
                  onMouseLeave={e => e.currentTarget.style.background = '#555'}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  style={{ ...linkStyle, backgroundColor: '#555' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#777'}
                  onMouseLeave={e => e.currentTarget.style.background = '#555'}
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
