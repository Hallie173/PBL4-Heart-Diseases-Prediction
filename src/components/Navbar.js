import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../logo.jpg';
import avatar from '../avatar.png';

function Navbar() {
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link to="/" className="navbar-brand" href="#"><img src={logo} /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link" aria-current="page" href="#">Trang chủ</Link>
              </li>
              <li className="nav-item">
                <Link to="/introduction" className="nav-link" href="#">Giới thiệu</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">Hướng dẫn</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">Tra cứu</Link>
              </li>
            </ul>
            <Link to="/login" className="log-in">
              <button className="btn btn-outline-primary">Log In</button>
            </Link>
            <Link to="/signup" className="sign-up">
              <button className="btn btn-outline-secondary">Sign Up</button>
            </Link>
            <Link to="/account" className="account-management">
              <img src={avatar} />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;