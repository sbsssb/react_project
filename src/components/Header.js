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
        <button className="menu-item">타임라인</button>
        <button className="menu-item">살펴보기</button>
        <button className="menu-item">알림</button>
        <button className="menu-item">프로필</button>
        <button className="menu-item" component={Link} to="/login">로그인</button>
      </div>
    </div>
  );
}

export default Header;
