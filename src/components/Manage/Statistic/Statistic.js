import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllUsers } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { Skeleton } from "@mui/material";

function Statistic() {
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
              <span class="ml-4">Group</span>
            </th>
            <th>
              <span class="ml-4">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {loadingUsers ? (
            <>
              {[...Array(10)].map((_, index) => (
                <tr className="border-bottom" key={`skeleton-row-${index}`}>
                  <td>
                    <Skeleton variant="text" width={30} />
                  </td>
                  <td>
                    <Skeleton variant="text" width={100} />
                  </td>
                  <td>
                    <Skeleton variant="text" width={80} />
                  </td>
                  <td>
                    <Skeleton variant="text" width={80} />
                  </td>
                  <td>
                    <Skeleton variant="text" width={50} />
                  </td>
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
                    <div className="p-2">
                      {item.groupId ? item.groupId.name : ""}
                    </div>
                  </td>
                  <td>
                    <div className="p-2">
                      <Link to={`/manage/statistic/${item._id}`}>Show</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td colSpan={5}>Not Found User</td>
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

export default Statistic;
