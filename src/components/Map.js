// Map.js
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet';

const Map = ({ center, restaurants, onMarkerClick }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Check if there are restaurants with valid coordinates
    const validRestaurants = restaurants.filter(
      (restaurant) =>
        restaurant.coordinates &&
        restaurant.coordinates.latitude !== null &&
        restaurant.coordinates.longitude !== null
    );

    // Update the center based on the first valid restaurant
    if (validRestaurants.length > 0 && mapRef.current) {
      const firstRestaurant = validRestaurants[0];
      mapRef.current.setView(
        [firstRestaurant.coordinates.latitude, firstRestaurant.coordinates.longitude],
        13
      );
    }
  }, [center, restaurants]);

  const createCustomIcon = (restaurant) => {
    const { image_url } = restaurant;

    // Use the default Leaflet icon if no image URL is provided
    if (!image_url) {
      return L.icon();
    }

    // Use a custom icon with a fallback image
    return new L.Icon({
      iconUrl: image_url,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const handleMarkerClick = (restaurant) => {
    onMarkerClick(restaurant);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
      <MapContainer ref={mapRef} center={center} zoom={15} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {restaurants.map(
          (restaurant) =>
            restaurant.coordinates &&
            restaurant.coordinates.latitude !== null &&
            restaurant.coordinates.longitude !== null ? (
              <Marker
                key={restaurant.id}
                position={[
                  restaurant.coordinates.latitude,
                  restaurant.coordinates.longitude,
                ]}
                icon={createCustomIcon(restaurant)}
                eventHandlers={{
                  click: () => handleMarkerClick(restaurant),
                }}  
              >
                {/* You can customize the marker as needed */}
              </Marker>
            ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
