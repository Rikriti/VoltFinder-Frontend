import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import PrivateRoute from './components/routes';
import Register from './components/Register';
import Profile from './pages/Profile';
import FavoriteStations from './pages/FavoriteStations'; 
import ForgotPassword from './pages/ForgetPassword';
import ResetPassword from './pages/ResetPassword';
import './styles/Loader.css'; 

function App() {
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); 
    } else {
      setIsLoggedIn(false); 
    }
    setIsLoading(false); 
  }, []); 

  
  const handleSearch = (location) => {
    setSearchedLocation(location);
  };

 
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      {isLoggedIn && <Navbar onSearch={handleSearch} setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
      <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home onSearch={searchedLocation} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<FavoriteStations />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
