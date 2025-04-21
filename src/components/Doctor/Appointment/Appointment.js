import { useEffect, useState } from "react";
import styles from "../../Manage/Manage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ReactPaginate from "react-paginate";
import { getAppointmentByDoctor } from "../../../services/userService";

const statuses = ["Pending", "Confirmed", "Cancelled", "Done"];

const Appointment = ({ doctorID }) => {
  const [activeTab, setActiveTab] = useState("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [appointments, setAppointments] = useState([]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleGetAppointment = async () => {
    const response = await getAppointmentByDoctor(
      activeTab,
      doctorID,
      currentPage,
      currentLimit
    );

    if (response && response.EC === 0) {
      setTotalPages(response.DT.totalPages);
      setAppointments(response.DT.Appointment);
    }
  };

  useEffect(() => {
    handleGetAppointment();
  }, [activeTab, currentPage]);

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
        ${
          activeTab === status
            ? "bg-white shadow text-blue-600"
            : "text-gray-600 hover:text-blue-600 hover:bg-white"
        }`}
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
            {appointments && appointments.length > 0 ? (
              appointments.map((a, index) => (
                <tr key={a.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{a._id}</td>
                  <td className="px-4 py-2">{a.patient_id.username}</td>
                  <td className="px-4 py-2">{a.date}</td>
                  <td className="px-4 py-2">{a.reason}</td>
                  <td className="px-4 py-2">
                    <FontAwesomeIcon
                      icon={faEye}
                      className="edit-icon"
                    ></FontAwesomeIcon>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No appointments found.
                </td>
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
    </div>
  );
};

export default Appointment;
