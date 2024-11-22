import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Account.css";
import GroupRoles from "./GroupRoles";
import avatar from "../../avatar.png";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Roles from "./Roles";
import User from "./User";
import EditProfile from "./EditProfile";
import { UserContext } from "../../context/UserContext";

function Account() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <div className="management-container">
      <div className="account-manage">
        <div className="account-type">
          <span className="admin-account">Admin</span>
        </div>
        <div className="show-avatar">
          <img src={user.account.avatar} />
        </div>
        <div className="show-info">
          <p>
            <span className="left">Full name:</span>
            <span className="right">
              {user.account.firstName + " " + user.account.lastName}
            </span>
          </p>
          <p>
            <span className="left">Sexuality:</span>
            <span className="right">
              {user.account.gender === "true" ? "Male" : "Female"}
            </span>
          </p>
          <p>
            <span className="left">Phone:</span>
            <span className="right">{user.account.phone}</span>
          </p>
          <p>
            <span className="left">Email:</span>
            <span className="right">{user.account.email}</span>
          </p>
          <p>
            <span className="left">Address:</span>
            <span className="right">{user.account.address}</span>
          </p>
        </div>
        <div className="change-info">
          <button
            type="button"
            className="change-button"
            data-bs-toggle="modal"
            data-bs-target="#edit-form-modal"
          >
            <FontAwesomeIcon icon={faPen} /> Edit
          </button>
        </div>
      </div>
      <div className="roles-manage">
        <ul class="nav nav-tabs">
          <li className="nav-item">
            <Link
              className={`nav-link manage-item user-link ${
                location.pathname.endsWith("/user") ? "active" : ""
              }`}
              to="user"
            >
              User
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link manage-item role-link ${
                location.pathname.endsWith("/roles") ? "active" : ""
              }`}
              to="roles"
            >
              Role
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link manage-item grouprole-link ${
                location.pathname.endsWith("/group-roles") ? "active" : ""
              }`}
              to="group-roles"
            >
              Group-role
            </Link>
          </li>
        </ul>
        <div className="tab-content">
          <Routes>
            <Route path="user" element={<User />} />
            <Route path="roles" element={<Roles />} />
            <Route path="group-roles" element={<GroupRoles />} />
          </Routes>
        </div>
      </div>

      <EditProfile />
    </div>
  );
}

export default Account;
