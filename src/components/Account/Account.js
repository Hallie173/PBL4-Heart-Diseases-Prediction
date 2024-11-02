import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Account.css";
import GroupRoles from './GroupRoles';

function Account() {
    return (
        <div className="management-container">
            <div className="account-manage">
                <p>xxxxxxxxxxxx</p>
            </div>
            <div className="roles-manage">
                <GroupRoles />
            </div>
        </div>
    )
}

export default Account;