import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "../Manage/Manage.module.css";
import "../Navbar.css";
import logo from "../../logo.jpg";
import classNames from "classnames";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/userService";
import MedicalRecord from "./MedicalRecord/MedicalRecord";
import ModalDoctor from "../Hospital/Doctor/ModalDoctor";
import Appointment from "./Appointment/Appointment";
import { setLoading, setUnLoading } from "../../redux/reducer/loading.ts";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUserRedux,
  updateUserRedux,
} from "../../redux/reducer/user.reducer";

function DoctorManage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isShowModalDoctor, setIsShowModalDoctor] = useState(false);
  const [actionModalDoctor, setActionModalDoctor] = useState("UPDATE");
  const [dataModalDoctor, setDataModalDoctor] = useState({});
  const user = useSelector((state) => state.user) || {};

  let navigate = useNavigate();

  const onHideModalDoctor = async () => {
    setIsShowModalDoctor(false);
    setDataModalDoctor({});
  };

  const handleEditDoctor = (user) => {
    setDataModalDoctor(user);
    setIsShowModalDoctor(true);
  };

  const handleUpdateDoctor = (newDataUser) => {
    dispatch(updateUserRedux(newDataUser));
  };

  const handleLogout = async () => {
    dispatch(setLoading());
    let data = await logoutUser(); // clear cookies
    localStorage.removeItem("jwt"); // clear local storage
    localStorage.removeItem("user");
    logoutUserRedux();
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
  }, [user]);

  return (
    <div className={styles.adminPage}>
      <div className={styles.adminNavbar}>
        <div className="navbar-container">
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <Link to="/" className="navbar-brand" href="#">
                <img src={logo} />
              </Link>
              <div className="collapse navbar-collapse" id="navbarNav">
                <Link className="log-out" to="/doctor/chat">
                  <button className="btn btn-outline-success">Chat</button>
                </Link>
                <Link className="log-out">
                  <button
                    className="btn btn-outline-secondary"
                    to="/"
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
              onClick={() => handleEditDoctor(user.account)}
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
                  styles.grouproleLink,
                  {
                    [styles.active]: location.pathname.endsWith("/appointment"),
                  }
                )}
                to="appointment"
              >
                Appointment
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
                      location.pathname.endsWith("/medical-record"),
                  }
                )}
                to="medical-record"
              >
                Medical Record
              </Link>
            </li>
          </ul>
          <div className={styles.tabContent}>
            <Outlet />
          </div>
        </div>

        <ModalDoctor
          show={isShowModalDoctor}
          onHide={onHideModalDoctor}
          action={actionModalDoctor}
          hospitalID={user.account.id}
          dataModalDoctor={dataModalDoctor}
          handleUpdateDoctor={handleUpdateDoctor}
        />
      </div>
    </div>
  );
}

export default DoctorManage;
