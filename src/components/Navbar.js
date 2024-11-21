import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../logo.jpg";
import avatar from "../avatar.png";
import { UserContext } from "../context/UserContext";

function Navbar() {
  const { user } = useContext(UserContext);
  let navigate = useNavigate();
  useEffect(() => {
    if (user && !user.isAuthenticated) {
      console.log(user);
      navigate("/login");
    }
  }, []);
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link to="/" className="navbar-brand" href="#">
            <img src={logo} />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#">
                  Giới thiệu
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Hướng dẫn
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Tra cứu
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Liên hệ
                </a>
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
  );
}

export default Navbar;
