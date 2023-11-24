// Home.js
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import RestaurantList from "./RestaurantList";
import RestaurantDetail from "./RestaurantDetail";
import Map from "./Map";
import axios from "axios";
import Header from "./Header";
import { API_BASE_URL } from "./config";
import Footer from "./Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [location, setLocation] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [mapCenter, setMapCenter] = useState([48.104796, 11.588756]);
  const [highlightedRestaurantId, setHighlightedRestaurantId] = useState(null);

  const handleSearch = async (newLocation, coordinates) => {
    setLocation(newLocation);
    setSelectedRestaurant(null);

    if (
      newLocation.trim() === "" &&
      (!coordinates || !coordinates.latitude || !coordinates.longitude)
    ) {
      setRestaurants([]);
      setSearched(false);
      return;
    }

    try {
      let searchLocation = newLocation;

      if (coordinates && coordinates.latitude && coordinates.longitude) {
        searchLocation = `${coordinates.latitude},${coordinates.longitude}`;
      }
      const response = await axios.get(`${API_BASE_URL}/yelp`, {
        params: {
          term: "vegan",
          location: searchLocation,
          limit: 50,
        },
      });

      if (response.status === 200) {
        toast("Location detected", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        const allRestaurants = response.data;

        const veganRestaurants = allRestaurants.filter((restaurant) =>
          restaurant.categories.some(
            (category) => category.title.toLowerCase() === "vegan"
          )
        );

        const limitedVeganRestaurants = veganRestaurants.slice(0, 20);

        setRestaurants(limitedVeganRestaurants);
        setSearched(true);

        // Update the map center based on the first valid restaurant
        if (limitedVeganRestaurants.length > 0) {
          const firstRestaurant = limitedVeganRestaurants[0];
          setMapCenter([
            firstRestaurant.coordinates.latitude,
            firstRestaurant.coordinates.longitude,
          ]);
        }
      } else {
        toast.error("Location not found. Please try something different.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Location not found. Please try something different.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
            await handleSearch(`${latitude},${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error);
            setError(
              "Error getting location. Please try again or enter a location manually."
            );
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser");
        setError("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      setError(
        "Error detecting location. Please try again or enter a location manually."
      );
    }
  };

  const handleRestaurantClick = async (restaurantId) => {
    if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
      setSelectedRestaurant(null);
      setHighlightedRestaurantId(null);
    } else {
      const selected = restaurants.find(
        (restaurant) => restaurant.id === restaurantId
      );

      setSelectedRestaurant(selected);
      setHighlightedRestaurantId(restaurantId);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/yelp/${restaurantId}`
        );
        const detailedRestaurant = response.data;

        setSelectedRestaurant(detailedRestaurant);
        setHighlightedRestaurantId(restaurantId);

        setMapCenter([
          selected.coordinates.latitude,
          selected.coordinates.longitude,
        ]);
      } catch (error) {
        console.error("Error fetching detailed information:", error);
      }
    }
  };

  const handleClear = () => {
    setLocation("");
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
            term: "vegan",
            location,
            limit: 50,
          },
        });

        if (response.status === 200) {
          const allRestaurants = response.data;

          const veganRestaurants = allRestaurants.filter((restaurant) =>
            restaurant.categories.some(
              (category) => category.title.toLowerCase() === "vegan"
            )
          );

          const limitedVeganRestaurants = veganRestaurants.slice(0, 20);

          setRestaurants(limitedVeganRestaurants);
          setSearched(true);

          // Update the map center based on the first valid restaurant
          if (limitedVeganRestaurants.length > 0) {
            const firstRestaurant = limitedVeganRestaurants[0];
            setMapCenter([
              firstRestaurant.coordinates.latitude,
              firstRestaurant.coordinates.longitude,
            ]);
          }
        } else {
          console.log("Location not found. Please try something different.");
        }
      } catch (error) {
        console.log("Location not found. Please try something different.");
      } finally {
        setLoading(false);
      }
    };

    if (location.trim() !== "") {
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
    const { latitude, longitude } = restaurant.coordinates;
    setMapCenter([latitude, longitude]);
  };

  return (
    <div className="content-wrapper">
      <Header />
      <h1>Vegan Restaurant Finder</h1>
      <SearchBar
        onSearch={handleSearch}
        onLocationDetect={handleDetectLocation}
        onClear={handleClear}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {searched && restaurants.length === 0 && !loading && !error && (
        <p>No restaurants found. Please try a different location.</p>
      )}
      <RestaurantList
        restaurants={restaurants}
        onRestaurantClick={handleRestaurantClick}
      />
      <div className="map-and-details-container">
        
        <div className="map-container">
          <Map
            center={mapCenter}
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            highlightedRestaurantId={highlightedRestaurantId}
            onMarkerClick={handleMarkerClick}
          />
        </div>
        {selectedRestaurant && (
          
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onClear={handleClear}
            />
          
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
