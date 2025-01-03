import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import '../styles/FavoriteStations.css';

const FavoriteStations = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;


  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId; 
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }

  useEffect(() => {
    if (userId) {
      axios
        .get(`${apiUrl}/api/favorites?userId=${userId}`)
        .then((response) => {
          setFavorites(response.data.favorites || []);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to fetch favorites');
          setLoading(false);
        });
    } else {
      setError('User not authenticated');
      setLoading(false);
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await axios.delete(`${apiUrl}/api/favorites/remove/${favoriteId}`);
      setFavorites(favorites.filter((favorite) => favorite.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error.message);
    }
  };

  const handleShowDetails = (stationId) => {
    const googleMapsDetailsURL = `https://www.google.com/maps/place/?q=place_id:${stationId}`;
    window.open(googleMapsDetailsURL, '_blank');
  };


  return (
    <div className="favorite-stations">
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div className="station-card" key={favorite.id}>
            <div className="station-details">
              <h3>{favorite.station_name}</h3>
              <p>Station ID: {favorite.station_id}</p>
            </div>
            <div className="station-actions">
              <button
                className="details-button"
                onClick={() => handleShowDetails(favorite.station_id)}
              >
                Show Details
              </button>
              <button
                className="remove-button"
                onClick={() => handleRemoveFavorite(favorite.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="emptyFavList">
          <img src="/assets/emptyList.jpg" alt=""></img>
        </div>
      )}
    </div>
  );
};

export default FavoriteStations;