// RestaurantDetail.js
import React from "react";

const RestaurantDetail = ({ restaurant }) => {
  const defaultImage = "/default_image.jpg";

  return (
    <div className="restaurant-detail">
      <h2>{restaurant.name}</h2>
      <p>Address: {restaurant.location.display_address.join(", ")}</p>
      <p>Phone: {restaurant.phone}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Price: {restaurant.price}</p>
      <p>
        Categories:{" "}
        {restaurant.categories.map((category) => category.title).join(", ")}
      </p>
      <div className="image-container">
        <img
          src={restaurant.image_url || defaultImage}
          alt={restaurant.name}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <a href={restaurant.url}>More about this place</a>
    </div>
  );
};

export default RestaurantDetail;
