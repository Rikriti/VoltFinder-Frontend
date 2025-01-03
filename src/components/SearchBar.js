import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SearchBar.css';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const results = await fetchCitySuggestions(value);
        setSuggestions(results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (city) => {
    setQuery(city.name);
    setSuggestions([]);
    onSearch({ lat: city.latitude, lng: city.longitude }); 
  };

  const fetchCitySuggestions = async (query) => {
    const options = {
      method: 'GET',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: { namePrefix: query, countryIds: 'US', limit: 10 },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY, 
        'X-RapidAPI-Host': process.env.REACT_APP_RAPIDAPI_HOST,
      },
    };

    try {
      const response = await axios.request(options);
      return response.data.data; // List of cities
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter city or area"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city) => (
            <li key={city.id} onClick={() => handleSuggestionClick(city)}>
              {city.name}, {city.region}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;