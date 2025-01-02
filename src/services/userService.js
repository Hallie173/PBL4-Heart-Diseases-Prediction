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
};
