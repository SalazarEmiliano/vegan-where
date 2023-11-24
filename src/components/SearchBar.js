// SearchBar.js
import React, { useState } from 'react';
import '../styles/searchBar.css';

const SearchBar = ({ onSearch, onLocationDetect, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleDetectLocation = () => {
    onLocationDetect();
  };

  const handleClear = () => {
    setSearchTerm('');
    onClear();
  };

  return (
    <div className='search-bar'>
      <input
        type="text"
        placeholder="Insert city, address or postcode..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className='button-wrapper'>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleDetectLocation}>Detect Location</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      
    </div>
  );
};

export default SearchBar;
