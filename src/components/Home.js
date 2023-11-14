// Home.js
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import Map from './Map';
import axios from 'axios';
import Header from './Header';
import { API_BASE_URL } from './config';

const Home = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [mapCenter, setMapCenter] = useState([48.104796, 11.588756]);
  const [highlightedRestaurantId, setHighlightedRestaurantId] = useState(null);
  const yelpApiKey = 'R8WSkYG06Wtag3IPuiRtKmiO0GPVz3gTJ5YJDHn8PXuXmmhZPG91_YPXdbEHwOoLonoHF8_vJpHoxjD2ZjsD4zdpQlGMq7bRwB5HBrQcCWH7Kc7GyvcbeDsV2HcoZXYx';


  const handleSearch = async (newLocation, coordinates) => {
    setLocation(newLocation);
    setSelectedRestaurant(null);

    if (newLocation.trim() === '' && (!coordinates || !coordinates.latitude || !coordinates.longitude)) {
      setRestaurants([]);
      setSearched(false);
      return;
    }

    try {
      let searchLocation = newLocation;

      if (coordinates && coordinates.latitude && coordinates.longitude) {
        searchLocation = `${coordinates.latitude},${coordinates.longitude}`;
      }

      console.log('Search Location:', searchLocation);

      const response = await axios.get(`${API_BASE_URL}/yelp`, {
        params: {
          term: 'vegan',
          location: searchLocation,
          limit: 50,
        },
      });

      console.log('API Response:', response);

      if (response.status === 200) {
        const allRestaurants = response.data;

        const veganRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
        );

        const limitedVeganRestaurants = veganRestaurants.slice(0, 20);

        setRestaurants(limitedVeganRestaurants);
        setSearched(true);

        // Update the map center based on the first valid restaurant
        if (limitedVeganRestaurants.length > 0) {
          const firstRestaurant = limitedVeganRestaurants[0];
          setMapCenter([firstRestaurant.coordinates.latitude, firstRestaurant.coordinates.longitude]);
        }
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

const handleRestaurantClick = async (restaurantId) => {
  if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
    setSelectedRestaurant(null);
    setHighlightedRestaurantId(null);
  } else {
    const selected = restaurants.find((restaurant) => restaurant.id === restaurantId);
    setSelectedRestaurant(selected);
    setHighlightedRestaurantId(restaurantId);

    try {
      const response = await axios.get(`${API_BASE_URL}/yelp/${restaurantId}`);
      const detailedRestaurant = response.data;

      setSelectedRestaurant(detailedRestaurant);
      setHighlightedRestaurantId(restaurantId);

      console.log('Detailed Restaurant:', detailedRestaurant);
      console.log('Response:', response);
    } catch (error) {
      console.error('Error fetching detailed information:', error);
    }
  }
};


  const handleClear = () => {
    setLocation('');
    setRestaurants([]);
    setSelectedRestaurant(null);
    setLoading(false);
    setError(null);
    setSearched(false);
    setMapCenter([48.104796, 11.588756]);
    setHighlightedRestaurantId(null);
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

        const response = await axios.get(`${API_BASE_URL}/yelp`, {
          params: {
            term: 'vegan',
            location,
            limit: 50,
          },
        });

        if (response.status === 200) {
          const allRestaurants = response.data;

          const veganRestaurants = allRestaurants.filter((restaurant) =>
            restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
          );

          const limitedVeganRestaurants = veganRestaurants.slice(0, 20);

          setRestaurants(limitedVeganRestaurants);
          setSearched(true);

          // Update the map center based on the first valid restaurant
          if (limitedVeganRestaurants.length > 0) {
            const firstRestaurant = limitedVeganRestaurants[0];
            setMapCenter([firstRestaurant.coordinates.latitude, firstRestaurant.coordinates.longitude]);
          }
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
      clearTimeout(timeoutId);
      const miliseconds = 500;
      timeoutId = setTimeout(() => {
        fetchData();
      }, miliseconds);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [location]);

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setHighlightedRestaurantId(restaurant.id);
  };

  return (
    <div>
      <Header />
      <h2>Home</h2>
      <SearchBar onSearch={handleSearch} onLocationDetect={handleDetectLocation} onClear={handleClear} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {searched && restaurants.length === 0 && !loading && !error && (
        <p>No restaurants found. Please try a different location.</p>
      )}
      <RestaurantList restaurants={restaurants} onRestaurantClick={handleRestaurantClick} />
      {selectedRestaurant && <RestaurantDetail restaurant={selectedRestaurant} onClear={handleClear} />}
      <Map center={mapCenter} restaurants={restaurants} selectedRestaurant={selectedRestaurant} highlightedRestaurantId={highlightedRestaurantId} onMarkerClick={handleMarkerClick} />
    </div>
  );
};

export default Home;
