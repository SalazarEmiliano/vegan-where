// RestaurantList.js
import React from "react";

const RestaurantList = ({ restaurants, onRestaurantClick }) => {
  return (
    <div>
      <ul>
        {restaurants.map((restaurant) => (
          <li
            className="restaurant-item"
            key={restaurant.id}
            onClick={() => onRestaurantClick(restaurant.id)}
          >
            {restaurant.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
