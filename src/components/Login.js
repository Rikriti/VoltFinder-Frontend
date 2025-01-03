import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/userContext';
import '../styles/login.css';

function Login({ setIsLoggedIn }) {
  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserNameContext } = useContext(UserContext);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { userName, password });
      const { token } = response.data;

      
      localStorage.setItem('token', token);

      setError('');

      setUserNameContext(userName);

      setIsLoggedIn(true);

      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h2>Login to VoltFinder</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="loginBtn">Login</button>
          <button
            type="button"
            onClick={() => navigate('/register')} 
          >
            Register
          </button>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </form>
      </div>
      <div className="login-right">
        <div className="app-description">
          <h2>Welcome to VoltFinder</h2>
          <p>
          VoltFinder makes it easy to locate nearby EV charging stations with speed and efficiency. Stay updated in real time and navigate effortlessly to the closest station.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
