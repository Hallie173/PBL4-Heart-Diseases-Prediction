import "../Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { Link, useLocation } from "react-router-dom";
import { Skeleton } from "@mui/material";

function HearthRecord() {
  const location = useLocation();
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    let response = await fetchAllUsers(currentPage, currentLimit);

    if (response && response.EC === 0) {
      console.log(response.DT);
      setTotalPages(response.DT.totalPages);
      setListUsers(response.DT.users);
    }
    setLoadingUsers(false);
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
          {loadingUsers ? (
            // Hiển thị skeleton khi đang tải dữ liệu
            <>
              {[...Array(10)].map((_, index) => (
                <tr className="border-bottom" key={`skeleton-row-${index}`}>
                  {Array(6)
                    .fill()
                    .map((__, colIdx) => (
                      <td key={`skeleton-col-${colIdx}`}>
                        <Skeleton variant="text" width="100%" height={30} />
                      </td>
                    ))}
                </tr>
              ))}
            </>
          ) : listUsers && listUsers.length > 0 ? (
            <>
              {listUsers.map((item, index) => (
                <tr className="border-bottom" key={`row-${index}`}>
                  <td>
                    <div className="p-2">
                      {(currentPage - 1) * currentLimit + index + 1}
                    </div>
                  </td>
                  <td>
                    <div className="p-2 d-flex flex-row align-items-center mb-2">
                      {item._id}
                    </div>
                  </td>
                  <td>
                    <div className="p-2">{item.username}</div>
                  </td>
                  <td>
                    <div className="p-2 d-flex flex-column">{item.email}</div>
                  </td>
                  <td>
                    <div className="p-2">
                      {item.groupId ? item.groupId.name : ""}
                    </div>
                  </td>
                  <td>
                    <div className="p-2 icons">
                      <Link to={`/manage/heart-record/${item._id}`}>
                        <FontAwesomeIcon
                          icon={faClockRotateLeft}
                          className="trash-icon"
                        />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={6}>Not Found User</td>
            </tr>
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
