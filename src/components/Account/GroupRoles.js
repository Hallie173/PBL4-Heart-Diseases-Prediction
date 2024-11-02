import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./GroupRoles.css";

function GroupRoles() {
    return (
        <div className="group-roles">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link manage-item user-link active" aria-current="page" href="#">User</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link manage-item role-link" href="#">Role</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link manage-item grouprole-link" href="#">Group-role</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link manage-item edit-link" href="#">Edit</a>
                </li>
            </ul>
            <div className="tab-content">
                <p>aaaaaaaaaaa</p>
            </div>
        </div>
    )
}

export default GroupRoles;