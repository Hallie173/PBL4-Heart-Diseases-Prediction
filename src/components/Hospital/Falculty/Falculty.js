import "../../Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import ModalFaculty from "./ModalFaculty";
import { fetchHospitalFaculty } from "../../../services/userService";

function Falculty({ hospitalID }) {
  const [listFaculty, setListFaculty] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  // modal delete
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [dataModal, setDataModal] = useState({});
  // modal update/create user
  const [isShowModalFaculty, setIsShowModalFaculty] = useState(false);
  const [actionModalFaculty, setActionModalFaculty] = useState("CREATE");
  const [dataModalFaculty, setDataModalFaculty] = useState({});

  const onHideModalFaculty = async () => {
    setIsShowModalFaculty(false);
    setDataModalFaculty({});
    await fetchFaculty();
  };

  const fetchFaculty = async () => {
    let response = await fetchHospitalFaculty(
      hospitalID,
      currentPage,
      currentLimit
    );
    if (response && response.EC === 0) {
      setListFaculty(response.DT.faculty);
    }
  };

  const handleCreateFaculty = () => {
    setActionModalFaculty("CREATE");
    setIsShowModalFaculty(true);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleEditFaculty = (faculty) => {
    setActionModalFaculty("UPDATE");
    setDataModalFaculty(faculty);
    setIsShowModalFaculty(true);
  };

  useEffect(() => {
    fetchFaculty();
  }, [currentPage]);
  return (
    <div className="hospital">
      <Button className="text-end" onClick={handleCreateFaculty}>
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
              <span class="ml-2">Name</span>
            </th>
            <th>
              <span class="ml-4">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {listFaculty && listFaculty.length > 0 ? (
            <>
              {listFaculty.map((item, index) => {
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
                      <div class="p-2">{item.name}</div>
                    </td>
                    <td>
                      <div class="p-2 icons">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="edit-icon"
                          onClick={() => handleEditFaculty(item)}
                        ></FontAwesomeIcon>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="trash-icon"
                          //   onClick={() => handleDeleteUser(item)}
                        ></FontAwesomeIcon>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              <tr>Not Found User</tr>
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

      <ModalFaculty
        show={isShowModalFaculty}
        onHide={onHideModalFaculty}
        action={actionModalFaculty}
        hospitalID={hospitalID}
        dataModalFaculty={dataModalFaculty}
      />
    </div>
  );
}

export default Falculty;
