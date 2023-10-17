// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import Home from './Home';
import About from './About';
import SearchBar from './SearchBar';
import RestaurantList from './RestaurantList';
import RestaurantDetail from './RestaurantDetail';
import Header from './Header';
import '../styles/app.css';


const App = () => (
  <Router>
    <div>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchBar />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/detail/:id" element={<RestaurantDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>      
    </div>
  </Router>
);

export default App;
