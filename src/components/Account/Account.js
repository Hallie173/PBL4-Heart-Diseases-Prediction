import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Account.css";
import GroupRoles from './GroupRoles';
import avatar from '../../avatar.png';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Roles from './Roles';
import User from './User';

function Account() {
    return (
        <div className="management-container">
            <div className="account-manage">
                <div className="account-type">
                    <span className="admin-account">Admin</span>
                </div>
                <div className="show-avatar">
                    <img src={avatar} />
                </div>
                <div className="show-info">
                    <p><span className="left">Full name:</span><span className="right">Le Duy Phuong Ha</span></p>
                    <p><span className="left">Sexuality:</span><span className="right">Female</span></p>
                    <p><span className="left">Date of Birth:</span><span className="right">17/03/2004</span></p>
                    <p><span className="left">Email:</span><span className="right">phuonghaleduy@gmail.com</span></p>
                    <p><span className="left">Address:</span><span className="right">Da Nang, Viet Nam</span></p>
                </div>
                <div className="change-info">
                    <button className="change-button">
                        <FontAwesomeIcon icon={faPen} />  Edit
                    </button>
                </div>
            </div>
            <div className="roles-manage">
                <ul class="nav nav-tabs">
                    <li className="nav-item">
                        <Link className="nav-link manage-item user-link" to="user">User</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link manage-item role-link" to="roles">Role</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link manage-item grouprole-link" to="group-roles">Group-role</Link>
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
        </div>
    )
}

export default Account;