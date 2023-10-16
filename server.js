// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/yelp', async (req, res) => {
  const { term, location, limit } = req.query;

  try {
    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer R8WSkYG06Wtag3IPuiRtKmiO0GPVz3gTJ5YJDHn8PXuXmmhZPG91_YPXdbEHwOoLonoHF8_vJpHoxjD2ZjsD4zdpQlGMq7bRwB5HBrQcCWH7Kc7GyvcbeDsV2HcoZXYx`,
      },
      params: {
        term,
        location,
        limit,
      },
    });

    const allRestaurants = response.data.businesses;
    const veganRestaurants = allRestaurants.filter((restaurant) =>
      restaurant.categories.some((category) => category.title.toLowerCase() === 'vegan')
    );

    res.json(veganRestaurants);
  } catch (error) {
    console.error('Error:', error.message);

    if (error.response) {
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
    }

    res.status(error.response?.status || 500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
