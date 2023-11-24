// Navigation.js
import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => (
  <nav>
    <ul>
      <li className="nav-item">
        <Link to="/">Home</Link>
      </li>
      <li className="nav-item">
        <Link to="/about">Why Vegan?</Link>
      </li>
    </ul>
  </nav>
);

export default Navigation;
