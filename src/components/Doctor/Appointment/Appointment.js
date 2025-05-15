import { useEffect, useState } from "react";
import styles from "../../Manage/Manage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { getAppointmentByDoctor } from "../../../services/userService";
import ModalAppointment from "./ModalAppointment";
import { toast } from "react-toastify";
import ModalMedicalRecord from "../MedicalRecord/ModalMedicalRecord";
import { setLoading, setUnLoading } from "../../../redux/reducer/loading.ts";
import { useDispatch } from "react-redux";
import { Skeleton } from "@mui/material";

const statuses = ["Pending", "Confirmed", "Cancelled", "Done"];

const Appointment = ({ doctorID }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [isShowModalAppointment, setIsShowModalAppointment] = useState(false);
  const [dataModalAppointment, setDataModalAppointment] = useState({});
  const [isShowModalMedicalRecord, setIsShowModalMedicalRecord] =
    useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const onHideModalMedicalRecord = async () => {
    setIsShowModalMedicalRecord(false);
  };

  const handleDetailMedicalRecord = () => {
    setIsShowModalMedicalRecord(true);
  };

  const onHideModalAppointment = async () => {
    setIsShowModalAppointment(false);
    setDataModalAppointment({});
    dispatch(setLoading());
    await handleGetAppointment();
    dispatch(setUnLoading());
  };

  const handleDetailAppointment = (appointment) => {
    setDataModalAppointment(appointment);
    setIsShowModalAppointment(true);
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleGetAppointment = async () => {
    setLoadingAppointments(true);
    const response = await getAppointmentByDoctor(
      activeTab,
      doctorID,
      currentPage,
      currentLimit
    );

    if (response && response.EC === 0) {
      const appointmentsWithLocalTime = response.DT.Appointment.map(
        (appointment) => ({
          ...appointment,
          date: new Date(appointment.date).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
          }),
        })
      );

      setTotalPages(response.DT.totalPages);
      setAppointments(appointmentsWithLocalTime);
    }
    setLoadingAppointments(false);
  };

  useEffect(() => {
    handleGetAppointment();
  }, [activeTab, currentPage]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-center mb-3">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`bg-transparent border-0 px-3 py-2 text-body fw-medium position-relative
        ${activeTab === status ? "text-primary active-tab" : "text-secondary"}
      `}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="user">
        <table className="table table-borderless table-responsive table-hover card-1 p-4">
          <thead>
            <tr class="border-bottom">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Patient</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingAppointments ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <Skeleton variant="text" width={20} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton variant="text" width={100} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton variant="text" width={120} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton variant="text" width={80} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton variant="text" width={160} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton variant="circular" width={24} height={24} />
                  </td>
                </tr>
              ))
            ) : appointments && appointments.length > 0 ? (
              appointments.map((a, index) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{a._id}</td>
                  <td className="px-4 py-2">{a.patient_id.username}</td>
                  <td className="px-4 py-2">{a.date}</td>
                  <td className="px-4 py-2">{a.reason}</td>
                  <td className="px-4 py-2">
                    <div class="p-2 icons">
                      <FontAwesomeIcon
                        icon={faPen}
                        className="edit-icon"
                        onClick={() => handleDetailAppointment(a)}
                      ></FontAwesomeIcon>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No appointments found.
                  </td>
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

        <ModalAppointment
          show={isShowModalAppointment}
          onHide={onHideModalAppointment}
          dataModalAppointment={dataModalAppointment}
          action={activeTab}
        />

        <ModalMedicalRecord
          show={isShowModalMedicalRecord}
          onHide={onHideModalMedicalRecord}
        />
      </div>
    </div>
  );
};

export default Appointment;
