import { instance, instancePy } from "../setup/axios";

const registerNewUser = (
  firstName,
  lastName,
  email,
  phone,
  username,
  password
) => {
  return instance.post("/api/v1/register", {
    firstName,
    lastName,
    email,
    phone,
    username,
    password,
  });
};

const loginUser = (valueLogin, password) => {
  return instance.post("/api/v1/login", {
    valueLogin,
    password,
  });
};

const fetchAllUsers = (page, limit) => {
  return instance.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
};

const fetchAllHospital = (page, limit) => {
  return instance.get(`/api/v1/hospital/read?page=${page}&limit=${limit}`);
};

const deleteUser = (user) => {
  return instance.delete("/api/v1/user/delete", {
    data: { id: user._id },
  });
};

const fetchGroup = () => {
  return instance.get("/api/v1/group/read");
};

const createNewUser = (userData) => {
  return instance.post("/api/v1/user/create", {
    ...userData,
  });
};

const updateCurrentUser = (userData) => {
  return instance.put("/api/v1/user/update", {
    ...userData,
  });
};

const getUserAccount = () => {
  return instance.get("/api/v1/account");
};

const fetchHospitalFaculty = (hospital_id, page, limit) => {
  return instance.get(
    `/api/v1/hospital/read-faculty?page=${page}&limit=${limit}&hospital_id=${hospital_id}`
  );
};

const fetchFacultyWithNotPagination = (hospital_id) => {
  return instance.get(
    `/api/v1/hospital/read-faculty?hospital_id=${hospital_id}`
  );
};

const logoutUser = () => {
  return instance.post("/api/v1/logout");
};

const getUserByEmail = (email) => {
  return instance.get(`/api/v1/user/read-info-user?email=${email}`);
};

const updateUser = (userData) => {
  return instance.put("/api/v1/user/update-info-user", {
    ...userData,
  });
};

const ChangePassword = (data) => {
  return instance.put("/api/v1/change-pass", {
    ...data,
  });
};

const getDataHealth = (ecg) => {
  return instancePy.post("/api/predict", ecg);
};

const createHealthRecord = (data) => {
  return instance.post("/api/v1/user/create-healthRecord", data);
};

const getHistoryHealthRecord = () => {
  return instance.get("/api/v1/user/history-healthRecord");
};

const getHistoryHealthRecordByAdmin = (id) => {
  return instance.get(`/api/v1/user/history-healthRecord/${id}`);
};

const getStatisticWithId = (id) => {
  return instance.get(`/api/v1/user/statistic/${id}`);
};

const createNewFaculty = (facultyData) => {
  return instance.post("/api/v1/hospital/create-faculty", {
    ...facultyData,
  });
};

const updateCurrentFaculty = (facultyData) => {
  return instance.put("/api/v1/hospital/update-faculty", {
    ...facultyData,
  });
};

const createNewDoctor = (userData) => {
  return instance.post("/api/v1/hospital/create-doctor", {
    ...userData,
  });
};

const fetchAllDoctor = (hospitalID, page, limit) => {
  return instance.get(
    `/api/v1/hospital/read-doctor?page=${page}&limit=${limit}&hospital_id=${hospitalID}`
  );
};

const createNewStaff = (userData) => {
  return instance.post("/api/v1/hospital/create-staff", {
    ...userData,
  });
};

const fetchAllStaff = (hospitalID, page, limit) => {
  return instance.get(
    `/api/v1/hospital/read-staff?page=${page}&limit=${limit}&hospital_id=${hospitalID}`
  );
};

const fetchAllMedicalRecord = (hospitalID, page, limit) => {
  return instance.get(
    `/api/v1/hospital/read-medicalRecord?page=${page}&limit=${limit}&hospital_id=${hospitalID}`
  );
};

const fetchDoctorMedicalRecord = (doctorID, page, limit) => {
  return instance.get(
    `/api/v1/doctor/read-medicalRecord?page=${page}&limit=${limit}&doctor_id=${doctorID}`
  );
};

const fetchAllHospitalWithPatient = () => {
  return instance.get(`/api/v1/hospital/read`);
};

const fetchHospitalFacultyWithPatient = (hospital_id) => {
  return instance.get(
    `/api/v1/hospital/read-faculty?hospital_id=${hospital_id}`
  );
};

const fetchDoctorInFaculty = (faculty_id) => {
  return instance.get(`/api/v1/doctor/read-doctor?faculty_id=${faculty_id}`);
};

const createAppointment = (data) => {
  return instance.post("/api/v1/user/create-appointment", data);
};

const getAppointmentByDoctor = (valueSearch, doctorID, page, limit) => {
  return instance.get(
    `/api/v1/doctor/read-appointment?valueSearch=${valueSearch}&page=${page}&limit=${limit}&doctor_id=${doctorID}`
  );
};

const updateAppointment = (data) => {
  return instance.put("/api/v1//doctor/update-appointment", data);
};

const createMedicalRecord = (data) => {
  return instance.post("/api/v1/doctor/create-medicalRecord", data);
};

const getAllMessage = (userA, userB) => {
  return instance.get("/api/v1/messages", {
    params: {
      userA,
      userB,
    },
  });
};

const sendMessageBetweenUser = (newMsg) => {
  return instance.post("/api/v1/messages/send", newMsg);
};

export {
  registerNewUser,
  loginUser,
  fetchAllUsers,
  deleteUser,
  fetchGroup,
  createNewUser,
  updateCurrentUser,
  getUserAccount,
  logoutUser,
  getUserByEmail,
  updateUser,
  ChangePassword,
  getDataHealth,
  createHealthRecord,
  getHistoryHealthRecord,
  getHistoryHealthRecordByAdmin,
  getStatisticWithId,
  fetchAllHospital,
  createNewFaculty,
  fetchHospitalFaculty,
  updateCurrentFaculty,
  fetchFacultyWithNotPagination,
  createNewDoctor,
  fetchAllDoctor,
  createNewStaff,
  fetchAllStaff,
  fetchAllMedicalRecord,
  fetchDoctorMedicalRecord,
  fetchAllHospitalWithPatient,
  fetchHospitalFacultyWithPatient,
  fetchDoctorInFaculty,
  createAppointment,
  getAppointmentByDoctor,
  updateAppointment,
  createMedicalRecord,
  getAllMessage,
  sendMessageBetweenUser,
};
