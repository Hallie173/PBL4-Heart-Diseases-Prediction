import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styles from "./Manage.module.css";
import classNames from "classnames";
import GroupRoles from "./GroupRoles";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Roles from "./Roles";
import User from "./User";
import EditProfile from "./EditProfile";
import { UserContext } from "../../context/UserContext";

function Manage() {
    const { user } = useContext(UserContext);
    const location = useLocation();

    return (
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
                            className={classNames(styles.navLink, styles.manageItem, styles.userLink,
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
                            className={classNames(styles.navLink, styles.manageItem, styles.roleLink,
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
                            className={classNames(styles.navLink, styles.manageItem, styles.grouproleLink,
                                {
                                    [styles.active]: location.pathname.endsWith("/group-roles"),
                                }
                            )}
                            to="group-roles"
                        >
                            Group-role
                        </Link>
                    </li>
                </ul>
                <div className={styles.tabContent}>
                    <Routes>
                        <Route path="user" element={<User />} />
                        <Route path="roles" element={<Roles />} />
                        <Route path="group-roles" element={<GroupRoles />} />
                    </Routes>
                </div>
            </div>

            <EditProfile />
        </div >
    );
}

export default Manage;
