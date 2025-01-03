import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/auth/reset-password`, {
        token,
        password,
      });
      setMessage('Your password has been reset successfully.');
      setIsPasswordReset(true);
    } catch (error) {
      setMessage('Error: Could not reset password. Please try again later.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-left">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button 
          type="button"
          onClick={() => navigate('/login')}
          disabled={!isPasswordReset}
          className={isPasswordReset ? 'login-btn' : 'login-btn-disabled'}
        >
          Go to Login
        </button>
      </div>
      <div className="reset-password-right">
        <div className="reset-password-image">
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
