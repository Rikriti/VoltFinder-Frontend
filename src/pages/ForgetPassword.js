import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ForgotPassword.css'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setMessage(response.data.message || 'A password reset link has been sent to your email.');
    } catch (error) {
    
      if (error.response) {
        setMessage(error.response.data.message || 'Error: Could not send reset link. Please try again later.');
      } else {
        setMessage('Error: Could not send reset link. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      
      <div className="forgot-password-left">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      
      <div className="forgot-password-right">
        <h2>Reset your password</h2>
        <p>Enter your email to receive a link to reset your password. We’ll send you instructions on how to create a new one.</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
