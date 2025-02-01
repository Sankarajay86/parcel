import React from 'react';
import { Link } from 'react-router-dom'; // Using React Router for navigation

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Parcel Express</h1>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/track">Track Parcel</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
