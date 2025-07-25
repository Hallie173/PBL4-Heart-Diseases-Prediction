import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {  fetchAllPatients } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { Skeleton } from "@mui/material";
import ModalPatient from "./ModalPatient";

function Patient() {
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  // modal update/create user
  const [isShowModalUser, setIsShowModalUser] = useState(false);
  const [actionModalUser, setActionModalUser] = useState("CREATE");
  const [dataModalUser, setDataModalUser] = useState({});

  const [loadingUserList, setLoadingUserList] = useState(true);


  const onHideModalUser = async () => {
    setIsShowModalUser(false);
    setDataModalUser({});
    setLoadingUserList(true);
    await fetchUsers();
    setLoadingUserList(false);
  };

  const handleEditUser = (user) => {
    setActionModalUser("UPDATE");
    setDataModalUser(user);
    setIsShowModalUser(true);
  };

  const fetchUsers = async () => {
    setLoadingUserList(true);
    let response = await fetchAllPatients(currentPage, currentLimit);

    if (response && response.EC === 0) {
      console.log(response.DT);
      setTotalPages(response.DT.totalPages);
      setListUsers(response.DT.users);
    }
    setLoadingUserList(false);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  useEffect(() => {
    fetchUsers();
    console.log("loadingUserList", loadingUserList);
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
          {loadingUserList ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr className="border-bottom" key={`skeleton-${index}`}>
                <td>
                  <Skeleton variant="text" width={20} />
                </td>
                <td>
                  <Skeleton variant="text" width={120} />
                </td>
                <td>
                  <Skeleton variant="text" width={100} />
                </td>
                <td>
                  <Skeleton variant="text" width={160} />
                </td>
                <td>
                  <Skeleton variant="text" width={80} />
                </td>
                <td>
                  <Skeleton variant="circular" width={24} height={24} />
                </td>
              </tr>
            ))
          ) : listUsers && listUsers.length > 0 ? (
            listUsers.map((item, index) => (
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
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleEditUser(item)}
                    />
                  </div>
                </td>
              </tr>
            ))
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

      <ModalPatient
        show={isShowModalUser}
        onHide={onHideModalUser}
        action={actionModalUser}
        dataModalUser={dataModalUser}
      />
    </div>
  );
}

export default Patient;
