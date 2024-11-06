import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./GroupRoles.css";

function GroupRoles() {
    return (
        <div className="group-roles">
            <div className="select-div">
                <h5 className="select-title">Select a group: (<span className="text-danger">*</span>)</h5>
                <select className="select-group">
                    <option value="admin-group">Admin</option>
                    <option value="user-group">User</option>
                </select>
            </div>
            <div className="assign-roles">
                <h5 className="assign-roles-title">Assign Roles:</h5>
                <label for="a-create">
                    <input type="checkbox" id="ad-create" />/admin/create
                </label>
                <label for="a-update">
                    <input type="checkbox" id="ad-update" />/admin/update
                </label>
                <label for="a-read">
                    <input type="checkbox" id="ad-read" />/admin/read
                </label>
                <label for="a-delete">
                    <input type="checkbox" id="ad-delete" />/admin/delete
                </label>

                <button type="submit" className="save-roles-list">Save</button>
            </div>
        </div>
    )
}

export default GroupRoles;