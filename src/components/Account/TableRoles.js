import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  fetchAllRolesWithPaging,
  deleteRole,
} from "../../services/roleService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@mui/material";

const TableRoles = forwardRef((props, ref) => {
  const [listRoles, setListRoles] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [loadingRoles, setLoadingRoles] = useState(true);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  useEffect(() => {
    getAllRoles();
  }, [currentPage, currentLimit]);

  useImperativeHandle(ref, () => ({
    fetListRolesAgain() {
      getAllRoles();
    },
  }));

  const getAllRoles = async () => {
    setLoadingRoles(true);
    let data = await fetchAllRolesWithPaging(currentPage, currentLimit);
    if (data && +data.EC === 0) {
      setTotalPages(data.DT.totalPages);
      setListRoles(data.DT.roles);
    }
    setLoadingRoles(false);
  };

  const handleDeleteRole = async (role) => {
    setLoadingRoles(true);
    let data = await deleteRole(role);
    if (data && +data.EC === 0) {
      toast.success(data.EM);
      await getAllRoles();
    }
    setLoadingRoles(false);
  };

  return (
    <>
      <div class="user-body mt-5">
        <table class="table table-borderless table-responsive table-hover card-1 p-4">
          <thead>
            <tr class="border-bottom">
              <th>
                <span class="ml-2">ID</span>
              </th>
              <th>
                <span class="ml-2">URL</span>
              </th>
              <th>
                <span class="ml-2">Description</span>
              </th>
              <th>
                <span class="ml-2">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loadingRoles ? (
              // 👇 Hiện skeleton khi đang loading
              <>
                {[...Array(10)].map((_, idx) => (
                  <tr key={`skeleton-${idx}`}>
                    <td>
                      <Skeleton variant="text" width={100} height={20} />
                    </td>
                    <td>
                      <Skeleton variant="text" width={150} height={20} />
                    </td>
                    <td>
                      <Skeleton variant="text" width={200} height={20} />
                    </td>
                    <td>
                      <Skeleton variant="circular" width={30} height={30} />
                    </td>
                  </tr>
                ))}
              </>
            ) : listRoles && listRoles.length > 0 ? (
              listRoles.map((item, index) => (
                <tr className="border-bottom" key={`row-${index}`}>
                  <td>
                    <div className="d-flex flex-row align-items-center mb-2">
                      {item._id}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex">{item.url}</div>
                  </td>
                  <td>
                    <div className="d-flex flex-column">{item.description}</div>
                  </td>
                  <td>
                    <span
                      title="Delete"
                      className="delete"
                      onClick={() => handleDeleteRole(item)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className="trash-icon"
                      />
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No roles found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 0 && (
          <div className="job-footer mt-3">
            <ReactPaginate
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={totalPages}
              previousLabel="<"
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
    </>
  );
});

export default TableRoles;
