// RestaurantDetail.js
import React from 'react';

const RestaurantDetail = ({ restaurant }) => {
  console.log('Restaurant Object:', restaurant);
  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>Address: {restaurant.location.address1}</p>
      <p>City: {restaurant.location.city}</p>
      <p>State: {restaurant.location.state}</p>
      <p>Zip Code: {restaurant.location.zip_code}</p>
      <p>Country: {restaurant.location.country}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Price: {restaurant.price}</p>
      <p>Phone: {restaurant.phone}</p>
      <p>Distance: {restaurant.distance}</p>
      <img src={restaurant.image_url} alt={restaurant.name} style={{ maxWidth: '100%', height: 'auto' }} />
      <p>Categories: {restaurant.categories.map(category => category.title).join(', ')}</p>
      <a href={restaurant.url}>More about this place</a>
      <p>Display address: {restaurant.location.display_address.join(', ')}</p>
      <p>coordinates: {restaurant.coordinates.latitude}</p>
      <p>coordinates: {restaurant.coordinates.longitude}</p>
    </div>
  );
};

export default RestaurantDetail;
