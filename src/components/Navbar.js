import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../logo.jpg";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { logoutUser } from "../services/userService";

function Navbar() {
  const { user, logoutContext } = useContext(UserContext);
  let navigate = useNavigate();

  const handleLogout = async () => {
    let data = await logoutUser(); // clear cookies
    localStorage.removeItem("jwt"); // clear local storage
    logoutContext(); // clear user in context
    if (data && +data.EC === 0) {
      toast.success("Logout succeeds...");
      navigate("/login");
    } else {
      toast.error(data.EM);
    }
  };

  useEffect(() => {
    if (user && user.isAuthenticated === false) {
      navigate("/login");
    }
  }, [user, navigate]);
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
                <Link className="nav-link" aria-current="page" to="/">
                  Introduction
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/guide" className="nav-link">
                  Guide
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/look-up" className="nav-link">
                  Look Up
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
            {/* <Link to="/logout" className="log-in">
              <button className="btn btn-outline-primary">Log In</button>
            </Link> */}
            <Link className="sign-up">
              <button
                className="btn btn-outline-secondary"
                onClick={() => handleLogout()}
              >
                Log out
              </button>
            </Link>
            <Link to="/account" className="account-management">
              <img src={user.account.avatar} />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
