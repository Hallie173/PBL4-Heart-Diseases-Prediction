import React, { useState } from "react";
import "./Statistic.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function Statistic() {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(6);

    const [dataModal, setDataModal] = useState(null);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);

    const handleDeleteUser = async (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    };

    return (
        <div className="statistic">
            <table class="table table-borderless table-responsive table-hover card-1 p-4">
                <thead>
                    <tr class="border-bottom">
                        <th>
                            <span class="ml-2">#</span>
                        </th>
                        <th>
                            <span class="ml-2">ID</span>
                        </th>
                        <th>
                            <span class="ml-2">Username</span>
                        </th>
                        <th>
                            <span class="ml-4">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {listUsers && listUsers.length > 0 ? (
                        <>
                            {listUsers.map((item, index) => {
                                return (
                                    <tr class="border-bottom" key={`row-${index}`}>
                                        <td>
                                            <div class="p-2">
                                                {(currentPage - 1) * currentLimit + index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="p-2 d-flex flex-row align-items-center mb-2">
                                                {item._id}
                                            </div>
                                        </td>
                                        <td>
                                            <div class="p-2">{item.username}</div>
                                        </td>
                                        <td>
                                            <div class="p-2 icons">
                                                <FontAwesomeIcon
                                                    icon={faTrashCan}
                                                    className="trash-icon"
                                                    onClick={() => handleDeleteUser(item)}
                                                ></FontAwesomeIcon>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            <tr>
                                <td>Not Found User</td>
                            </tr>
                        </>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Statistic;