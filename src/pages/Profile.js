import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData(response.data);
      } catch (err) {
        console.error(err);
        navigate('/login'); 
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/api/auth/updateProfile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(formData);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error(err);
      alert('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-form">
        <h1>Profile</h1>
        {editMode ? (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <input
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="User Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehicleName">Vehicle Name:</label>
              <input
                id="vehicleName"
                name="vehicleName"
                value={formData.vehicleName}
                onChange={handleChange}
                placeholder="Vehicle Name"
              />
            </div>
            <button type="submit" className='updateBtn'>Update</button>
            <button className="cancelBtn" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info">
            <p>
              <strong>First Name:</strong> {profile.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {profile.lastName}
            </p>
            <p>
              <strong>User Name:</strong> {profile.userName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Vehicle Name:</strong> {profile.vehicleName}
            </p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
