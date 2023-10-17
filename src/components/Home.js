import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import axios from 'axios';
import Header from './Header';

const Home = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const yelpApiKey = 'R8WSkYG06Wtag3IPuiRtKmiO0GPVz3gTJ5YJDHn8PXuXmmhZPG91_YPXdbEHwOoLonoHF8_vJpHoxjD2ZjsD4zdpQlGMq7bRwB5HBrQcCWH7Kc7GyvcbeDsV2HcoZXYx';

  const handleSearch = async (newLocation, coordinates) => {
    setLocation(newLocation);
    setSelectedRestaurant(null);

    // Check if the search bar is cleared
    if (newLocation.trim() === '' && (!coordinates || !coordinates.latitude || !coordinates.longitude)) {
      setRestaurants([]);
      setSearched(false); // Reset the searched flag
      return; // Exit early if the location is empty
    }

    try {
      let searchLocation = newLocation;

      // Use the coordinates if available
      if (coordinates && coordinates.latitude && coordinates.longitude) {
        searchLocation = `${coordinates.latitude},${coordinates.longitude}`;
      }

      console.log('Search Location:', searchLocation);

      const response = await axios.get(`http://localhost:5000/api/yelp`, {
        params: {
          term: 'vegan',
          location: searchLocation,
          limit: 50,
        },
      });

      console.log('API Response:', response);

      if (response.status === 200) {
        const allRestaurants = response.data;

        // Filter for vegan restaurants
        const veganRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
        );

        // Apply additional limit
        const limitedVeganRestaurants = veganRestaurants.slice(0, 20); // Adjust the limit

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
            await handleSearch(location, { latitude, longitude });

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

  const handleRestaurantClick = async (restaurantId) => {
    const selected = restaurants.find((restaurant) => restaurant.id === restaurantId);
    setSelectedRestaurant(selected);

    // Fetch detailed information using the Yelp API and the selected restaurant ID
    try {
      const response = await axios.get(`https://api.yelp.com/v3/businesses/${restaurantId}`, {
        headers: {
          Authorization: `Bearer ${yelpApiKey}`,
        },
      });

      const detailedRestaurant = response.data;
      console.log('Detailed Restaurant:', detailedRestaurant);
      console.log('Response:', response);
      // Handle the detailed restaurant data as needed
    } catch (error) {
      console.error('Error fetching detailed information:', error);
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
            limit: 50,
          },
        });

        if (response.status === 200) {
          const allRestaurants = response.data;

          // Filter for vegan restaurants
          const veganRestaurants = allRestaurants.filter((restaurant) =>
            restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
          );

          // Apply additional limit
          const limitedVeganRestaurants = veganRestaurants.slice(0, 20); // Adjust the limit

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

  return (
    <div>
      <Header />
      <h2>Home</h2>
      <SearchBar onSearch={handleSearch} onLocationDetect={handleDetectLocation} />
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

export default Home;
