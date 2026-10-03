import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple demo authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        navigate('/patient-form');
      } else {
        setError('Invalid credentials. Try: admin / admin123');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container fade-in">
      <div className="card login-card">
        <div className="login-header">
          <div className="login-icon">🏥</div>
          <h2>Smart Discharge System</h2>
          <p style={{ color: '#757575', marginTop: '0.5rem' }}>
            Please login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#757575', fontSize: '0.9rem' }}>
            <p>Demo Credentials:</p>
            <p><strong>Username:</strong> admin</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
