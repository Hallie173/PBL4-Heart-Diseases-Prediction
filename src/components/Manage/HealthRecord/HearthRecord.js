import "../Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import styles from "../Manage.module.css";

function HearthRecord() {
  const location = useLocation();
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = async () => {
    let response = await fetchAllUsers(currentPage, currentLimit);

    if (response && response.EC === 0) {
      console.log(response.DT);
      setTotalPages(response.DT.totalPages);
      setListUsers(response.DT.users);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  return (
    <div className="user">
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
              <span class="ml-2">Email</span>
            </th>
            <th>
              <span class="ml-4">Group</span>
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
                      <div class="p-2 d-flex flex-column">{item.email}</div>
                    </td>
                    <td>
                      <div class="p-2">
                        {item.groupId ? item.groupId.name : ""}
                      </div>
                    </td>
                    <td>
                      <div class="p-2 icons">
                        <Link to={`/manage/heart-record/${item._id}`}>
                          <FontAwesomeIcon
                            icon={faClockRotateLeft}
                            className="trash-icon"
                          ></FontAwesomeIcon>
                        </Link>
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
      {totalPages > 0 && (
        <div className="user-footer">
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={totalPages}
            previousLabel="< previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
            renderOnZeroPageCount={null}
          />
        </div>
      )}
    </div>
  );
}

export default HearthRecord;
