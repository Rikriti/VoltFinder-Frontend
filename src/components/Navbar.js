import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { UserContext } from '../context/userContext';
import SearchBar from '../components/SearchBar';

function Navbar({ onSearch, setIsLoggedIn }) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userNameContext } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); 
    navigate('/login'); 
  };

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleCitySelect = (location) => {
    onSearch(location);
  };

  return (
    <div className="navbar-container">
      <Link to="/" className="navbar-brand">⚡VoltFinder</Link>
      <div className="search-bar">
        <SearchBar onSearch={handleCitySelect} />
      </div>
      <div className="user-menu">
        {isLoggedIn && (
          <div className="user-dropdown">
            <button className="user-button" onClick={toggleDropdown}>
              {userNameContext || 'User'}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/favorites" className="dropdown-item">Favorites</Link>
                <Link to="/profile" className="dropdown-item">Edit Profile</Link> 
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
