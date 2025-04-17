import "../../Manage/Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { deleteUser, fetchAllDoctor } from "../../../services/userService";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import ModalDoctor from "./ModalDoctor";
import ModalDelete from "./ModalDelete";
import { Button } from "react-bootstrap";

function Doctor({ hospitalID }) {
  const [listDoctor, setListDoctor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  // modal delete
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataModal, setDataModal] = useState({});
  // modal update/create user
  const [isShowModalDoctor, setIsShowModalDoctor] = useState(false);
  const [actionModalDoctor, setActionModalDoctor] = useState("CREATE");
  const [dataModalDoctor, setDataModalDoctor] = useState({});

  const handleClose = () => {
    setIsShowModalDelete(false);
    setDataModal({});
  };

  const confirmDeleteUser = async () => {
    let response = await deleteUser(dataModal);
    console.log(">>Check response: ", response);
    if (response && response.EC === 0) {
      toast.success(response.EM);
      await fetchUsers();
      setIsShowModalDelete(false);
    } else {
      toast.error(response.EM);
    }
  };

  const onHideModalDoctor = async () => {
    setIsShowModalDoctor(false);
    setDataModalDoctor({});
    await fetchUsers();
  };

  const handleEditDoctor = (user) => {
    setActionModalDoctor("UPDATE");
    setDataModalDoctor(user);
    setIsShowModalDoctor(true);
  };

  const handleCreateDoctor = (user) => {
    setActionModalDoctor("CREATE");
    setIsShowModalDoctor(true);
  };

  const handleDeleteUser = async (user) => {
    setDataModal(user);
    setIsShowModalDelete(true);
  };

  const fetchUsers = async () => {
    let response = await fetchAllDoctor(hospitalID, currentPage, currentLimit);

    if (response && response.EC === 0) {
      console.log(response.DT);
      setTotalPages(response.DT.totalPages);
      setListDoctor(response.DT.doctor);
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
      <Button className="text-end" onClick={() => handleCreateDoctor()}>
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
              <span class="ml-2">Name</span>
            </th>
            <th>
              <span class="ml-2">Phone</span>
            </th>
            <th>
              <span class="ml-2">Email</span>
            </th>
            <th>
              <span class="ml-4">Faculty</span>
            </th>
            <th>
              <span class="ml-4">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {listDoctor && listDoctor.length > 0 ? (
            <>
              {listDoctor.map((item, index) => {
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
                      <div class="p-2 d-flex flex-column">
                        {item.firstName + " " + item.lastName}
                      </div>
                    </td>
                    <td>
                      <div class="p-2 d-flex flex-column">{item.phone}</div>
                    </td>
                    <td>
                      <div class="p-2 d-flex flex-column">{item.email}</div>
                    </td>
                    <td>
                      <div class="p-2">
                        {item.faculty_id ? item.faculty_id.name : ""}
                      </div>
                    </td>
                    <td>
                      <div class="p-2 icons">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="edit-icon"
                          onClick={() => handleEditDoctor(item)}
                        ></FontAwesomeIcon>
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
      {/* <ModalDelete
        show={isShowModalDelete}
        handleClose={handleClose}
        confirmDeleteUser={confirmDeleteUser}
        dataModal={dataModal}
      /> */}

      <ModalDoctor
        show={isShowModalDoctor}
        onHide={onHideModalDoctor}
        action={actionModalDoctor}
        hospitalID={hospitalID}
        dataModalDoctor={dataModalDoctor}
      />
    </div>
  );
}

export default Doctor;
