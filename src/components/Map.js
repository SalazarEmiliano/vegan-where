import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import "../styles/map.css";

const Map = ({
  center,
  restaurants,
  onMarkerClick,
  highlightedRestaurantId,
}) => {
  const mapRef = useRef(null);
  const [clickedRestaurantId, setClickedRestaurantId] = useState(null);

  useEffect(() => {
    const validRestaurants = restaurants.filter(
      (restaurant) =>
        restaurant.coordinates &&
        restaurant.coordinates.latitude !== null &&
        restaurant.coordinates.longitude !== null
    );
    if (validRestaurants.length > 0 && mapRef.current) {
      const firstRestaurant = validRestaurants[0];
      mapRef.current.setView(
        [
          firstRestaurant.coordinates.latitude,
          firstRestaurant.coordinates.longitude,
        ],
        13
      );
    }
  }, [center, restaurants]);

  const handleMarkerClick = (restaurant) => {
    onMarkerClick(restaurant);
    setClickedRestaurantId(restaurant.id);
    const { latitude, longitude } = restaurant.coordinates;
    if (mapRef.current) {
      if (clickedRestaurantId === restaurant.id) {
        mapRef.current.setView([latitude, longitude], 15);
      } else {
        mapRef.current.setView([latitude, longitude]);
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", overflow: "hidden" }}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {restaurants.map((restaurant) => {
          if (
            restaurant.coordinates &&
            restaurant.coordinates.latitude !== null &&
            restaurant.coordinates.longitude !== null
          ) {
            const isHighlighted = highlightedRestaurantId === restaurant.id;

            const icon = Leaflet.icon({
              className: isHighlighted
                ? "map-icon marker-selected"
                : "map-icon",
              iconUrl: "../../default_icon.png",
              iconSize: isHighlighted ? [50, 50] : [32, 32],
              iconAnchor: isHighlighted ? [20, 40] : [16, 32],
              popupAnchor: isHighlighted ? [0, -40] : [0, -32],
            });

            return (
              <Marker
                key={restaurant.id}
                position={[
                  restaurant.coordinates.latitude,
                  restaurant.coordinates.longitude,
                ]}
                icon={icon}
                eventHandlers={{
                  click: () => handleMarkerClick(restaurant),
                }}
              >
                <Popup>
                  <div>{restaurant.name}</div>
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
