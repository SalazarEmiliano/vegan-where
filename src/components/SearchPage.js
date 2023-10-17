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
    // Check if the search bar is cleared
    if (newLocation.trim() === '') {
      setRestaurants([]);
      setSearched(false); // Reset the searched flag
      return; // Exit early if the location is empty
    }

    try {
      let searchLocation = newLocation;

      // Use the detected location if needed
      // const coordinates = await detectLocation();
      // if (coordinates && coordinates.latitude && coordinates.longitude) {
      //   searchLocation = `${coordinates.latitude},${coordinates.longitude}`;
      // }

      const response = await axios.get(`http://localhost:5000/api/yelp`, {
        params: {
          term: 'vegan',
          location: searchLocation,
          limit: 20, // Adjust the limit as needed
        },
      });

      if (response.status === 200) {
        const allRestaurants = response.data;

        // Filter for vegan restaurants
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
      // Get the user's location using the Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // Use the detected location in your search logic
            console.log('Detected Location:', { latitude, longitude });

            // Trigger a search with the detected coordinates
            await handleSearch(`${latitude},${longitude}`);

            // Rest of your code here...
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
    // Trigger search when coordinates change
    // if (coordinates && coordinates.latitude && coordinates.longitude) {
    //   handleSearch(`${coordinates.latitude},${coordinates.longitude}`);
    // }
  }, []); // Include any dependencies if needed

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
