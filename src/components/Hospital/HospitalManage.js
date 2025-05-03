import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "../Manage/Manage.module.css";
import "../Navbar.css";
import logo from "../../logo.jpg";
import classNames from "classnames";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { logoutUser } from "../../services/userService";
import ModalHospital from "../Manage/Hospital/ModalHospital";
import Doctor from "./Doctor/Doctor";
import Falculty from "./Falculty/Falculty";
import Staff from "./Staff/Staff";
import MedicalRecord from "./MedicalRecord/MedicalRecord";
import { setLoading, setUnLoading } from "../../redux/reducer/loading.ts";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUserRedux,
  updateUserRedux,
} from "../../redux/reducer/user.reducer";

function HospitalManage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isShowModalHospital, setIsShowModalHospital] = useState(false);
  const [actionModalHospital, setActionModalHospital] = useState("UPDATE");
  const [dataModalHospital, setDataModalHospital] = useState({});
  const user = useSelector((state) => state.user) || {};

  let navigate = useNavigate();

  const onHideModalHospital = async () => {
    setIsShowModalHospital(false);
    setDataModalHospital({});
  };

  const handleEditHospital = (user) => {
    console.log("check user: ", user);

    setDataModalHospital(user);
    setIsShowModalHospital(true);
  };

  const handleUpdateHospital = (newDataUser) => {
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
              onClick={() => handleEditHospital(user.account)}
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
                    [styles.active]: location.pathname.endsWith("/doctor"),
                  }
                )}
                to="doctor"
              >
                Doctor
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.roleLink,
                  {
                    [styles.active]: location.pathname.endsWith("/staff"),
                  }
                )}
                to="staff"
              >
                Staff
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link
                className={classNames(
                  styles.navLink,
                  styles.manageItem,
                  styles.grouproleLink,
                  {
                    [styles.active]: location.pathname.endsWith("/faculty"),
                  }
                )}
                to="faculty"
              >
                Falculty
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
            <Routes>
              <Route
                path="doctor"
                element={<Doctor hospitalID={user.account.id} />}
              />
              <Route
                path="staff"
                element={<Staff hospitalID={user.account.id} />}
              />
              <Route
                path="faculty"
                element={<Falculty hospitalID={user.account.id} />}
              />
              <Route
                path="medical-record"
                element={<MedicalRecord hospitalID={user.account.id} />}
              />
            </Routes>
          </div>
        </div>

        <ModalHospital
          show={isShowModalHospital}
          onHide={onHideModalHospital}
          action={actionModalHospital}
          dataModalHospital={dataModalHospital}
          handleUpdateHospital={handleUpdateHospital}
        />
      </div>
    </div>
  );
}

export default HospitalManage;
