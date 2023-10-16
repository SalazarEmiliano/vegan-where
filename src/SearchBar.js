// SearchBar.js
import React from 'react';

const SearchBar = ({ onSearch }) => {
  const handleSearch = (e) => {
    const location = e.target.value;
    onSearch(location);
  };

  return (
    <div>
      <input type="text" placeholder="Enter location" onChange={handleSearch} />
    </div>
  );
};

export default SearchBar;
