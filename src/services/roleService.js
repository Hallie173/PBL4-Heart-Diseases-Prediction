import { instance } from "../setup/axios";

const createRoles = (roles) => {
  return instance.post("/api/v1/role/create", [...roles]);
};

const fetchAllRoles = () => {
  return instance.get(`/api/v1/role/read-roles`);
};

const fetchAllRolesWithPaging = (page, limit) => {
  return instance.get(`/api/v1/role/read?page=${page}&limit=${limit}`);
};

const deleteRole = (role) => {
  return instance.delete("/api/v1/role/delete", {
    data: { id: role._id },
  });
};

const fetchRolesByGroup = (groupId) => {
  return instance.get(`/api/v1/role/by-group/${groupId}`);
};

const assignRolesToGroup = (data) => {
  return instance.post("/api/v1/role/assign-to-group", { data });
};

export {
  createRoles,
  fetchAllRoles,
  deleteRole,
  fetchRolesByGroup,
  assignRolesToGroup,
  fetchAllRolesWithPaging,
};
