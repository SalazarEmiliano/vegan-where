// SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch, onLocationDetect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleDetectLocation = () => {
    onLocationDetect();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleDetectLocation}>Detect Location</button>
    </div>
  );
};

export default SearchBar;
