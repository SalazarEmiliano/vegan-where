// RestaurantDetail.js
import React from 'react';

const RestaurantDetail = ({ restaurant }) => {
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.address}</p>
      <p>Rating: {restaurant.rating}</p>
    </div>
  );
};

export default RestaurantDetail;
