import { useEffect, useState } from "react";
import _ from "lodash";
import {
  createAppointment,
  fetchAllHospitalWithPatient,
  fetchDoctorInFaculty,
  fetchHospitalFacultyWithPatient,
} from "../services/userService";
import { toast } from "react-toastify";
import { setLoading, setUnLoading } from "../redux/reducer/loading";
import { useDispatch } from "react-redux";

const Appointment = ({ patient }) => {
  const dispatch = useDispatch();
  const [hospital, setHospital] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const defaultData = {
    patient: "",
    hospital: "",
    faculty: "",
    doctor: "",
    reason: "",
    date: "",
  };

  const validInputsDefault = {
    hospital: true,
    faculty: true,
    doctor: true,
    reason: true,
    date: true,
  };

  const [data, setData] = useState(defaultData);
  const [validData, setValidData] = useState(defaultData);

  useEffect(() => {
    if (patient) {
      console.log("Patient data:", patient);

      setData((prevData) => ({
        ...prevData,
        patient: patient.id,
      }));
    }
  }, [patient]);

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(data);
    _userData[name] = value;
    setData(_userData);
  };

  const handleGetAllHospital = async () => {
    dispatch(setLoading());
    let response = await fetchAllHospitalWithPatient();
    dispatch(setUnLoading());
    if (response && +response.EC === 0) {
      setHospital(response.DT);
      setData((prevData) => ({
        ...prevData,
        hospital: response.DT[0]._id,
      }));
    }
  };

  const handleGetAllFaculty = async (hospital_id) => {
    dispatch(setLoading());
    let response = await fetchHospitalFacultyWithPatient(hospital_id);
    dispatch(setUnLoading());
    if (response && +response.EC === 0) {
      setFaculty(response.DT);
      setData((prevData) => ({
        ...prevData,
        faculty: response.DT[0]._id,
      }));
    }
  };

  const handleGetAllDoctor = async (faculty_id) => {
    dispatch(setLoading());
    let response = await fetchDoctorInFaculty(faculty_id);
    dispatch(setUnLoading());
    if (response && +response.EC === 0) {
      setDoctor(response.DT);
      setData((prevData) => ({
        ...prevData,
        doctor: response.DT[0]?._id || "",
      }));
    }
  };

  useEffect(() => {
    handleGetAllHospital();
  }, []);

  useEffect(() => {
    if (data.hospital) {
      handleGetAllFaculty(data.hospital);
    }
  }, [data.hospital]);

  useEffect(() => {
    if (data.faculty) {
      handleGetAllDoctor(data.faculty);
    }
  }, [data.faculty]);

  const handleAppointment = async (e) => {
    e.preventDefault();
    let isValid = true;
    let _validInputs = _.cloneDeep(validInputsDefault);

    // Validate inputs
    if (!data.hospital) {
      toast.error("Tên bệnh viện không được để trống!");
      _validInputs.hospital = false;
      isValid = false;
    }
    if (!data.faculty) {
      toast.error("Tên khoa không được để trống!");
      _validInputs.faculty = false;
      isValid = false;
    }
    if (!data.doctor) {
      toast.error("Tên bác sĩ không được để trống!");
      _validInputs.doctor = false;
      isValid = false;
    }
    if (!data.reason) {
      toast.error("Lý do khám không được để trống!");
      _validInputs.reason = false;
      isValid = false;
    }

    if (!data.date) {
      toast.error("Ngày khám không được để trống!");
      _validInputs.date = false;
      isValid = false;
    } else if (new Date(data.date).getTime() < Date.now()) {
      toast.error("Ngày khám không được nhỏ hơn ngày giờ hiện tại!");
      _validInputs.date = false;
      isValid = false;
    }

    setValidData(_validInputs);
    if (isValid) {
      dispatch(setLoading());
      const response = await createAppointment(data);
      dispatch(setUnLoading());
      if (response && +response.EC === 0) {
        toast.success("Đặt lịch khám thành công!");
        setData(defaultData);
      } else {
        toast.error(response.EM);
      }
    }
  };

  useEffect(() => {
    console.log("Data:", data);
  }, [data]);

  return (
    <div className="appointment-container my-5 mx-5">
      <div className="appointment-header">
        <h2>Thông tin đặt lịch khám</h2>
      </div>
      <div className="appointment-content">
        <div className="appointment-info">
          <form>
            {/* <!-- Tên bệnh viện --> */}
            <div class="mb-3">
              <label for="hospitalSelect" class="form-label">
                Tên bệnh viện
              </label>
              <select
                class="form-select"
                id="hospitalSelect"
                value={data.hospital}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "hospital")
                }
              >
                {hospital.length > 0 &&
                  hospital.map((item, index) => {
                    return (
                      <option key={`hospital-${index}`} value={item._id}>
                        {item.username}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* <!-- Tên Khoa --> */}
            <div class="mb-3">
              <label for="departmentSelect" class="form-label">
                Tên Khoa
              </label>
              <select
                className="form-select"
                id="departmentSelect"
                value={data.faculty}
                onChange={(e) => handleOnChangeInput(e.target.value, "faculty")}
              >
                {faculty.length > 0 &&
                  faculty.map((item, index) => {
                    return (
                      <option key={`faculty-${index}`} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            {/* <!-- Tên bác sĩ --> */}
            <div class="mb-3">
              <label for="doctorSelect" class="form-label">
                Tên Bác sĩ
              </label>
              <select
                class="form-select"
                id="doctorSelect"
                value={data.doctor}
                onChange={(e) => handleOnChangeInput(e.target.value, "doctor")}
              >
                {doctor.length > 0 &&
                  doctor.map((item, index) => {
                    return (
                      <option key={`doctor-${index}`} value={item._id}>
                        {item.username}
                      </option>
                    );
                  })}
              </select>
            </div>
            {/* <!-- Ngày khám --> */}
            <div class="mb-3">
              <label for="date" class="form-label">
                Ngày khám
              </label>
              <input
                type="datetime-local"
                class="form-control"
                id="date"
                placeholder="Nhập tên của bạn"
                value={data.date}
                onChange={(e) => handleOnChangeInput(e.target.value, "date")}
              />
            </div>

            {/* <!-- Lý do --> */}
            <div class="mb-3">
              <label for="reason" class="form-label">
                Lý do khám
              </label>
              <textarea
                class="form-control"
                id="reason"
                rows="4"
                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                value={data.reason}
                onChange={(e) => handleOnChangeInput(e.target.value, "reason")}
              ></textarea>
            </div>

            {/* <!-- Submit --> */}
            <button
              type="submit"
              class="btn btn-primary"
              onClick={(e) => {
                handleAppointment(e);
              }}
            >
              Đặt lịch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
