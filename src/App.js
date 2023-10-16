// App.js
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import axios from 'axios';

const App = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

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
            limit: 50,
          },
        });

        if (response.status === 200) {
          const allRestaurants = response.data;

          // Filter for vegan restaurants
          const veganRestaurants = allRestaurants.filter((restaurant) =>
            restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
          );

          // Apply additional limit if needed
          const limitedVeganRestaurants = veganRestaurants.slice(0, 20); // Adjust the limit as needed

          setRestaurants(limitedVeganRestaurants);
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
      }, 500); // Adjust the delay as needed (e.g., 500 milliseconds)
    }

    return () => {
      // Cleanup: clear the timeout when the component unmounts or location changes
      clearTimeout(timeoutId);
    };
  }, [location]);

  const handleSearch = (newLocation) => {
    setLocation(newLocation);
    setSelectedRestaurant(null);

    // Check if the search bar is cleared
    if (newLocation.trim() === '') {
      setRestaurants([]);
      setSearched(false); // Reset the searched flag
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    const selected = restaurants.find((restaurant) => restaurant.id === restaurantId);
    setSelectedRestaurant(selected);
  };

  return (
    <div>
      <h1>Vegan Restaurant Finder</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {searched && restaurants.length === 0 && !loading && !error && (
        <p>No restaurants found. Please try a different location.</p>
      )}
      <RestaurantList restaurants={restaurants} onRestaurantClick={handleRestaurantClick} />
      {selectedRestaurant && <RestaurantDetail restaurant={selectedRestaurant} />}
    </div>
  );
};

export default App;
