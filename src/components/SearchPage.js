// SearchPage.js
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import axios from 'axios';

const SearchPage = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (newLocation) => {
    setLocation(newLocation);

    // Check if the search bar is cleared
    if (newLocation.trim() === '') {
      setRestaurants([]);
      setSearched(false); // Reset the searched flag
    }
  };

  useEffect(() => {
    let timeoutId;

    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        if (location.trim().length < 2) {
          setRestaurants([]);
          setSearched(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/yelp`, {
          params: {
            term: 'vegan',
            location,
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

    if (location.trim() !== '') {
      // Clear the previous timeout
      clearTimeout(timeoutId);

      // Set a new timeout to wait for the user to stop typing
      timeoutId = setTimeout(() => {
        fetchData();
      }, 500); // Adjust the delay
    }

    return () => {
      // Cleanup: clear the timeout when the component unmounts or location changes
      clearTimeout(timeoutId);
    };
  }, [location]);

  return (
    <div>
      <h2>Search Page</h2>
      <SearchBar onSearch={handleSearch} />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {searched && restaurants.length === 0 && !loading && !error && (
        <p>No restaurants found. Please try a different location.</p>
      )}
      {searched && restaurants.length > 0 && <RestaurantList restaurants={restaurants} />}
      {/* Add other components or information related to the search page */}
    </div>
  );
};

export default SearchPage;
