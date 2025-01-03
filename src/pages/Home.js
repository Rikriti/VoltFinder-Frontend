import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GoogleMapView from '../components/GoogleMapView';
import {jwtDecode} from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/Home.css';

function Home({ onSearch }) {
  const [stations, setStations] = useState([]); 
  const [currentLocation, setCurrentLocation] = useState(null); 
  const [error, setError] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const navigate = useNavigate(); 
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const fetchStations = async (location) => {
    try {
      const response = await axios.get(`${apiUrl}/api/ev-chargers`, {
        params: { location: `${location.lat},${location.lng}`, radius: 5000 },
      });
      setStations(response.data.results || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching stations:', err);
      setError('Failed to fetch nearby stations. Please try again later.');
    }
  };

  
  useEffect(() => {
    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setCurrentLocation(location);
            fetchStations(location);
          },
          (err) => handleGeolocationError(err)
        );
      } else {
        setError('Geolocation is not supported by your browser.');
      }
    };

    fetchCurrentLocation();
  }, []);

  
  const handleGeolocationError = (err) => {
    let message = '';
    switch (err.code) {
      case err.PERMISSION_DENIED:
        message = 'User denied the request for Geolocation.';
        break;
      case err.POSITION_UNAVAILABLE:
        message = 'Location information is unavailable.';
        break;
      case err.TIMEOUT:
        message = 'The request to get user location timed out.';
        break;
      default:
        message = 'An unknown error occurred.';
        break;
    }
    setError(message);
    console.error('Geolocation error:', message);
  };

  
  useEffect(() => {
    if (onSearch) {
      const { lat, lng } = onSearch;
      const location = { lat, lng };
      setCurrentLocation(location);
      fetchStations(location);
    }
  }, [onSearch]);

 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId); 
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

 
  const addFavoriteStation = async (station) => {
    const favoriteData = {
      userId: userId,
      stationId: station.place_id,
      stationName: station.name,
    };

    try {
      await axios.post(`${apiUrl}/api/favorites/add`, favoriteData);
      alert(`Added ${station.name} to favorites!`);
    } catch (err) {
      console.error('Error adding favorite station:', err);
      alert('Failed to add station as favorite. Please try again later.');
    }
  };


  const viewDetails = (station) => {
    const placeId = station.place_id;
    window.open(
      `https://www.google.com/maps/place/?q=place_id:${placeId}`,
      '_blank'
    );
  };

 
  const getDirections = (station) => {
    const destination = `${station.geometry.location.lat},${station.geometry.location.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      '_blank'
    );
  };

  
  const goToFavoriteStations = () => {
    navigate('/favorites', { state: { userId: userId } });
  };

  return (
    <div className="home-container">
      {error && <div className="error-message">{error}</div>}

      <div className="stations-list">
        {stations.map((station, index) => (
          <div key={index} className="station-card">
            <div className="station-card-left">
              {station ? (
                <img
                  // src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photos.length > 0 && station.photos[0].photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  src="/assets/stationsThumbnail.jpg"
                  alt={station.name}
                  className="station-image"
                />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="station-card-right">
              <h2>{station.name || 'Station Name'}</h2>
              <p>{station.vicinity || 'Address not available'}</p>
              <p className={`status ${station.business_status?.toLowerCase() || 'unknown'}`}>
                {station.business_status || 'Status unknown'}
              </p>
              <div className="station-reviews">
                {station.rating ? (
                  <p>
                    ⭐ {station.rating} ({station.user_ratings_total || 0} reviews)
                  </p>
                ) : (
                  <p>No reviews available</p>
                )}
              </div>
              <button className="detailsBtn" onClick={() => viewDetails(station)}>➕ Details</button>
              <button className="directionsBtn" onClick={() => getDirections(station)}>📍Directions</button>
              <button className="addFavBtn" onClick={() => addFavoriteStation(station)}>🤍 Add to Favorites</button>
            </div>
          </div>
        ))}
      </div>

      {currentLocation && (
        <div className="map-view">
          <GoogleMapView stations={stations} center={currentLocation} />
        </div>
      )}
    </div>
  );
}

export default Home;