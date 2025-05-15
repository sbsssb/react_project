// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <Link to="/">MySNS</Link>
      </div>
      <div className="menu">
        <button className="menu-item"></button>
        <button className="menu-item"></button>
        <button className="menu-item"></button>
        <button className="menu-item"></button>
        <button className="menu-item" component={Link} to="/login"></button>
      </div>
    </div>
  );
}

export default Header;
