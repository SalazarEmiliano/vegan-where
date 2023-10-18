// SearchPage.js

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import axios from 'axios';

const SearchPage = ({ onLocationDetect }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (newLocation) => {
    if (newLocation.trim() === '') {
      setRestaurants([]);
      setSearched(false); // Reset the searched flag
      return; // Exit early if the location is empty
    }

    try {
      let searchLocation = newLocation;

      const response = await axios.get(`http://localhost:5000/api/yelp`, {
        params: {
          term: 'vegan',
          location: searchLocation,
          limit: 20,
        },
      });

      if (response.status === 200) {
        const allRestaurants = response.data;
        
        const veganRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
        );

        setRestaurants(veganRestaurants);
        setSearched(true);
      } else {
        setError('City not found. Please try a different location.');
      }
    } catch (error) {
      setError('City not found. Please try a different location.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetectLocation = async () => {
    try {      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            console.log('Detected Location:', { latitude, longitude });

            await handleSearch(`${latitude},${longitude}`);
          },
          (error) => {
            console.error('Error getting location:', error);
            setError('Error getting location. Please try again or enter a location manually.');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser');
        setError('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      setError('Error detecting location. Please try again or enter a location manually.');
    }
  };

  useEffect(() => {
    // if (coordinates && coordinates.latitude && coordinates.longitude) {
    //   handleSearch(`${coordinates.latitude},${coordinates.longitude}`);
    // }
  }, []);

  return (
    <div>
      <h2>Search Page</h2>
      <SearchBar onSearch={handleSearch} onLocationDetect={handleDetectLocation} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searched && restaurants.length === 0 && !loading && !error && (
        <p>No restaurants found. Please try a different location.</p>
      )}
      {searched && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
    </div>
  );
};

export default SearchPage;
