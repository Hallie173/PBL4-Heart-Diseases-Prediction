import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./Manage.module.css";
import "../Navbar.css";
import logo from "../../logo.jpg";
import classNames from "classnames";
import GroupRoles from "./Group_Role/GroupRoles";
import HearthRecord from "./HealthRecord/HearthRecord";
import Statistic from "./Statistic/Statistic";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Roles from "./Role/Roles";
import User from "./Account/User";
import EditProfile from "./Account/EditProfile";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/userService";
import History from "../HistoryHealthRecord.js/history";
import EcgHistory from "../HistoryHealthRecord.js/EcgHistory";
import Graph from "./Statistic/Graph";
import Hospital from "./Hospital/Hospital";
import { setLoading, setUnLoading } from "../../redux/reducer/loading.ts";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserRedux } from "../../redux/reducer/user.reducer";

function Manage() {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user) || {};
  let navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(setLoading());
    let data = await logoutUser(); // clear cookies
    localStorage.removeItem("jwt"); // clear local storage
    localStorage.removeItem("user"); // clear local storage
    dispatch(logoutUserRedux());
    console.log("call logoutUserRedux");
    dispatch(setUnLoading());
    if (data && +data.EC === 0) {
      toast.success("Logout succeeds...");
      navigate("/login");
    } else {
      toast.error(data.EM);
    }
  };

  useEffect(() => {
    if (user && !user.isAuthenticated) {
      console.log(user);
      // navigate("/login");
    }
  }, []);

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminNavbar}>
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
                {/* <Link to="/logout" className="log-in">
              <button className="btn btn-outline-primary">Log In</button>
            </Link> */}
                <Link className="log-out">
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
      </div>
      <div className={styles.managementContainer}>
        <div className={styles.accountManage}>
          <div className={styles.accountType}>
            <span className={styles.adminAccount}>User</span>
          </div>
          <div className={styles.showAvatar}>
            <img src={user.account.avatar} />
          </div>
          <div className={styles.showInfo}>
            <p>
              <span className={styles.left}>Full name:</span>
              <span className={styles.right}>
                {user.account.firstName + " " + user.account.lastName}
              </span>
            </p>
            <p>
              <span className={styles.left}>Sexuality:</span>
              <span className={styles.right}>
                {user.account.gender === "true" ? "Male" : "Female"}
              </span>
            </p>
            <p>
              <span className={styles.left}>Phone:</span>
              <span className={styles.right}>{user.account.phone}</span>
            </p>
            <p>
              <span className={styles.left}>Email:</span>
              <span className={styles.right}>{user.account.email}</span>
            </p>
            <p>
              <span className={styles.left}>Address:</span>
              <span className={styles.right}>{user.account.address}</span>
            </p>
          </div>
          <div className={styles.changeInfo}>
            <button
              type="button"
              className={styles.changeButton}
              data-bs-toggle="modal"
              data-bs-target="#edit-form-modal"
            >
              <FontAwesomeIcon icon={faPen} /> Edit
            </button>
          </div>
        </div>
        <div className={styles.rolesManage}>
          <ul class={classNames(styles.nav, styles.navTabs)}>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.userLink,
                  {
                    [styles.active]: location.pathname.endsWith("/user"),
                  }
                )}
                to="user"
              >
                User
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.roleLink,
                  {
                    [styles.active]: location.pathname.endsWith("/roles"),
                  }
                )}
                to="roles"
              >
                Role
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.grouproleLink,
                  {
                    [styles.active]: location.pathname.endsWith("/group-roles"),
                  }
                )}
                to="group-roles"
              >
                Group-role
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.heartRecordLink,
                  {
                    [styles.active]:
                      location.pathname.endsWith("/heart-record"),
                  }
                )}
                to="heart-record"
              >
                Heart Record
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.statisticLink,
                  {
                    [styles.active]: location.pathname.endsWith("/statistic"),
                  }
                )}
                to="statistic"
              >
                Statistic
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.statisticLink,
                  {
                    [styles.active]: location.pathname.endsWith("/hospital"),
                  }
                )}
                to="hospital"
              >
                Hospital
              </Link>
            </li>
          </ul>
          <div className={styles.tabContent}>
            <Routes>
              <Route path="user" element={<User />} />
              <Route path="roles" element={<Roles />} />
              <Route path="group-roles" element={<GroupRoles />} />
              <Route path="heart-record" element={<HearthRecord />} />
              <Route path="heart-record/:id" element={<History />} />
              <Route path="statistic" element={<Statistic />} />
              <Route path="statistic/:id" element={<Graph />} />
              <Route path="ecg-history" element={<EcgHistory />} />
              <Route path="hospital" element={<Hospital />} />
            </Routes>
          </div>
        </div>

        <EditProfile />
      </div>
    </div>
  );
}

export default Manage;
