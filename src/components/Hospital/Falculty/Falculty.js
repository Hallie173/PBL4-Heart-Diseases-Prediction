import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import ModalFaculty from "./ModalFaculty";
import { fetchHospitalFaculty } from "../../../services/userService";
import { Skeleton } from "@mui/material";

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

  const [loadingFaculty, setLoadingFaculty] = useState(true);

  const onHideModalFaculty = async () => {
    setIsShowModalFaculty(false);
    setDataModalFaculty({});
    await fetchFaculty();
  };

  const fetchFaculty = async () => {
    setLoadingFaculty(true);
    let response = await fetchHospitalFaculty(
      hospitalID,
      currentPage,
      currentLimit
    );
    if (response && response.EC === 0) {
      setListFaculty(response.DT.faculty);
    }
    setLoadingFaculty(false);
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
          {loadingFaculty ? (
            Array.from({ length: 10 }).map((_, index) => (
              <tr className="border-bottom" key={`skeleton-${index}`}>
                <td>
                  <Skeleton variant="text" width={40} />
                </td>
                <td>
                  <Skeleton variant="text" width={120} />
                </td>
                <td>
                  <Skeleton variant="text" width={100} />
                </td>
                <td>
                  <Skeleton variant="rectangular" height={24} width={60} />
                </td>
              </tr>
            ))
          ) : listFaculty && listFaculty.length > 0 ? (
            listFaculty.map((item, index) => (
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
                  <div className="p-2">{item.name}</div>
                </td>
                <td>
                  <div className="p-2 icons">
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="edit-icon"
                      onClick={() => handleEditFaculty(item)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className="trash-icon"
                      // onClick={() => handleDeleteUser(item)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Not Found User</td>
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
