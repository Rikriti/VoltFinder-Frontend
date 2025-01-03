import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import vehicleList from '../vehicles.json'; // Adjust the path as needed
import '../styles/register.css';// Import the CSS file

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    vehicleName: '',
    userName: '',
    email: '',
    password: '',
  });

  const apiUrl = process.env.REACT_APP_API_URL;

  const [error, setError] = useState('');
    const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData,  {headers: {
    'Content-Type': 'application/json', 
  },});
      if (response.status === 201) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error during registration:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred during registration');
      } else {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <div className="register-page">
      {/* Left Container */}
      <div className="register-left">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="userName"
            placeholder="UserName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle</option>
            {vehicleList.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.name}>
                {vehicle.name}
              </option>
            ))}
          </select>
          <button type="submit" className="registerBtn">Register</button>
          <br></br>
          <br></br>
          <p>Already have an account ?</p>
          <button type="submit" className="loginBtn" onClick={() => navigate('/login')}>Login</button>
        </form>
      </div>

      {/* Right Container */}
      <div className="register-right">
        <div className="app-description">
          <h2>Welcome to VoltFinder!</h2>
          <p>
            Join our platform to explore and manage electric vehicle charging solutions.
            Register now and take the first step towards a sustainable future.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
