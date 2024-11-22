import instance from "../setup/axios";
import axios from "../setup/axios";

const deleteRole = (role) => {
  return axios.delete("/api/v1/role/delete", {
    data: { id: role._id },
  });
};

const fetchAllRolesWithPaging = (page, limit) => {
  return axios.get(`/api/v1/role/read?page=${page}&limit=${limit}`);
};

const createRoles = (roles) => {
  return axios.post("/api/v1/role/create", [...roles]);
};

const registerNewUser = (
  firstName,
  lastName,
  email,
  phone,
  username,
  password
) => {
  return axios.post("/api/v1/register", {
    firstName,
    lastName,
    email,
    phone,
    username,
    password,
  });
};

const loginUser = (valueLogin, password) => {
  return axios.post("/api/v1/login", {
    valueLogin,
    password,
  });
};

const fetchAllUsers = (page, limit) => {
  return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
};

const deleteUser = (user) => {
  return axios.delete("/api/v1/user/delete", {
    data: { id: user.id },
  });
};

const fetchGroup = () => {
  return axios.get("/api/v1/group/read");
};

const createNewUser = (userData) => {
  return axios.post("/api/v1/user/create", {
    ...userData,
  });
};

const updateCurrentUser = (userData) => {
  return axios.put("/api/v1/user/update", {
    ...userData,
  });
};

const getUserAccount = () => {
  return axios.get("/api/v1/account");
};

const logoutUser = () => {
  return axios.post("/api/v1/logout");
};

const getUserByEmail = (email) => {
  return axios.get(`/api/v1/user/read-info-user?email=${email}`);
};

const updateUser = (userData) => {
  return axios.put("/api/v1/user/update-info-user", {
    ...userData,
  });
};

const ChangePassword = (data) => {
  return axios.put("/api/v1/change-pass", {
    ...data,
  });
};

export {
  fetchAllRolesWithPaging,
  deleteRole,
  createRoles,
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
};
