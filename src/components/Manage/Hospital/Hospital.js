import "../Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { deleteUser, fetchAllHospital } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDelete from "../Account/ModalDelete";
import { Button } from "react-bootstrap";
import ModalHospital from "./ModalHospital";
import { Skeleton } from "@mui/material";

function Hospital() {
  const [listUsers, setListUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  // modal delete
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataModal, setDataModal] = useState({});
  // modal update/create user
  const [isShowModalHospital, setIsShowModalHospital] = useState(false);
  const [actionModalHospital, setActionModalHospital] = useState("CREATE");
  const [dataModalHospital, setDataModalHospital] = useState({});

  const [loadingUsers, setLoadingUsers] = useState(true);

  const handleClose = () => {
    setIsShowModalDelete(false);
    setDataModal({});
  };

  const confirmDeleteUser = async () => {
    setLoadingUsers(true);
    let response = await deleteUser(dataModal);
    console.log(">>Check response: ", response);
    if (response && response.EC === 0) {
      toast.success(response.EM);
      await fetchHospital();
      setIsShowModalDelete(false);
    } else {
      toast.error(response.EM);
    }
    setLoadingUsers(false);
  };

  const onHideModalHospital = async () => {
    setIsShowModalHospital(false);
    setDataModalHospital({});
    await fetchHospital();
  };

  const handleEditUser = (user) => {
    setActionModalHospital("UPDATE");
    setDataModalHospital(user);
    setIsShowModalHospital(true);
  };

  const handleCreateUser = () => {
    setActionModalHospital("CREATE");
    setIsShowModalHospital(true);
  };

  const handleDeleteUser = async (user) => {
    setDataModal(user);
    setIsShowModalDelete(true);
  };

  const fetchHospital = async () => {
    setLoadingUsers(true);
    let response = await fetchAllHospital(currentPage, currentLimit);
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
    fetchHospital();
  }, [currentPage]);

  return (
    <div className="hospital">
      <Button className="text-end" onClick={handleCreateUser}>
        Add
      </Button>
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
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={`skeleton-${index}`} className="border-bottom">
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="text" />
                </td>
                <td>
                  <Skeleton variant="rectangular" height={24} />
                </td>
              </tr>
            ))
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
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="edit-icon"
                        onClick={() => handleEditUser(item)}
                      />
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="trash-icon"
                        onClick={() => handleDeleteUser(item)}
                      />
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
      <ModalDelete
        show={isShowModalDelete}
        handleClose={handleClose}
        confirmDeleteUser={confirmDeleteUser}
        dataModal={dataModal}
      />

      <ModalHospital
        show={isShowModalHospital}
        onHide={onHideModalHospital}
        action={actionModalHospital}
        dataModalHospital={dataModalHospital}
      />
    </div>
  );
}

export default Hospital;
