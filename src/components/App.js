// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './Home';
import About from './About';
import SearchPage from './SearchPage';  // Import the new SearchPage component
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import '../styles/app.css';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/detail/:id" element={<RestaurantDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  </Router>
);

export default App;
