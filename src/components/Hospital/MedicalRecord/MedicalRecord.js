import "../../Manage/Account/User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faPenToSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { fetchAllMedicalRecord } from "../../../services/userService";
import ModalMedicalRecord from "./ModalMedicalRecord";
import { setLoading, setUnLoading } from "../../../redux/reducer/loading.ts";
import { useDispatch } from "react-redux";

const MedicalRecord = ({ hospitalID }) => {
  const dispatch = useDispatch();
  const [listMedicalRecord, setListMedicalRecord] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  const [isShowModalMedicalRecord, setIsShowModalMedicalRecord] =
    useState(false);
  const [dataModalMedicalRecord, setDataModalMedicalRecord] = useState({});

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const fetchMedicalRecord = async () => {
    dispatch(setLoading());
    let response = await fetchAllMedicalRecord(
      hospitalID,
      currentPage,
      currentLimit
    );
    dispatch(setUnLoading());

    if (response && response.EC === 0) {
      console.log(response.DT);
      setTotalPages(response.DT.totalPages);
      setListMedicalRecord(response.DT.MedicalRecord);
    }
  };

  const handleDetailMedicalRecord = (user) => {
    setDataModalMedicalRecord(user);
    setIsShowModalMedicalRecord(true);
  };

  const onHideModalMedicalRecord = async () => {
    setIsShowModalMedicalRecord(false);
    setDataModalMedicalRecord({});
    dispatch(setLoading());
    await fetchMedicalRecord();
    dispatch(setUnLoading());
  };

  useEffect(() => {
    fetchMedicalRecord();
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
              <span class="ml-2">Doctor</span>
            </th>
            <th>
              <span class="ml-2">Patient</span>
            </th>
            <th>
              <span class="ml-2">Diagnosis</span>
            </th>
            <th>
              <span class="ml-4">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {listMedicalRecord && listMedicalRecord.length > 0 ? (
            <>
              {listMedicalRecord.map((item, index) => {
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
                      <div class="p-2">{item.doctor_id?.username}</div>
                    </td>
                    <td>
                      <div class="p-2 d-flex flex-column">
                        {item.patient_id?.username}
                      </div>
                    </td>
                    <td>
                      <div class="p-2 d-flex flex-column">{item.diagnosis}</div>
                    </td>

                    <td>
                      <div class="p-2 icons">
                        <FontAwesomeIcon
                          icon={faEye}
                          className="edit-icon"
                          onClick={() => handleDetailMedicalRecord(item)}
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
      <ModalMedicalRecord
        show={isShowModalMedicalRecord}
        onHide={onHideModalMedicalRecord}
        dataModalMedicalRecord={dataModalMedicalRecord}
      />
    </div>
  );
};

export default MedicalRecord;
