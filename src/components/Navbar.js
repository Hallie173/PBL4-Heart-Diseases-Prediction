import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../logo.jpg";
import { toast } from "react-toastify";
import { logoutUser } from "../services/userService";
import { setLoading, setUnLoading } from "../redux/reducer/loading.ts";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserRedux } from "../redux/reducer/user.reducer";

function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) || {};

  let navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(setLoading());
    let data = await logoutUser(); // clear cookies
    localStorage.removeItem("jwt"); // clear local storage
    localStorage.removeItem("user"); // clear local storage
    dispatch(logoutUserRedux());
    dispatch(setUnLoading());
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
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Trang Chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/guide" className="nav-link">
                  Hướng dẫn
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/appointment" className="nav-link">
                  Đặt lịch khám
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chat" className="nav-link">
                  Tin Nhắn
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
                Đăng xuất
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
