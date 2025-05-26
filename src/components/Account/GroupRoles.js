import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GroupRoles.css";
import { fetchGroup } from "../../services/userService";
import {
  fetchAllRoles,
  fetchRolesByGroup,
  assignRolesToGroup,
} from "../../services/roleService";
import _, { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import { setLoading, setUnLoading } from "../../redux/reducer/loading.ts";
import { useDispatch } from "react-redux";
import { Skeleton } from "@mui/material";

function GroupRoles() {
  const dispatch = useDispatch();
  const [userGroups, setUserGroups] = useState([]);
  const [listRoles, setListRoles] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");

  const [assignRolesByGroup, setAssignRolesByGroup] = useState([]);

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingAssignRoles, setLoadingAssignRoles] = useState(true);

  useEffect(() => {
    getGroups();
    getAllRoles();
  }, []);

  const getGroups = async () => {
    setLoadingGroups(true);
    let res = await fetchGroup();
    if (res && res.EC === 0) {
      setUserGroups(res.DT);
    } else {
      toast.error(res.EM);
    }
    setLoadingGroups(false);
  };

  const getAllRoles = async () => {
    setLoadingGroups(true);
    let data = await fetchAllRoles();
    if (data && +data.EC === 0) {
      setListRoles(data.DT);
    }
    setLoadingGroups(false);
  };

  const handleOnchangeGroup = async (value) => {
    setSelectGroup(value);
    if (value) {
      setLoadingAssignRoles(true);
      let data = await fetchRolesByGroup(value);

      if (data && +data.EC === 0) {
        let result = buildDataRolesByGroup(data.DT, listRoles);
        setAssignRolesByGroup(result);
      }
      setLoadingAssignRoles(false);
    }
  };

  const buildDataRolesByGroup = (groupRoles, allRoles) => {
    let result = [];
    if (allRoles && allRoles.length > 0) {
      allRoles.map((role) => {
        let object = {};
        object.url = role.url;
        object._id = role._id;
        object.description = role.description;
        object.isAssigned = false;
        if (groupRoles && groupRoles.length > 0) {
          object.isAssigned = groupRoles.some(
            (item) => item.url === object.url
          );
        }

        result.push(object);
      });
    }

    return result;
  };

  const handleSelectRole = (value) => {
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    let foundIndex = _assignRolesByGroup.findIndex(
      (item) => item._id === value
    );
    if (foundIndex > -1) {
      _assignRolesByGroup[foundIndex].isAssigned =
        !_assignRolesByGroup[foundIndex].isAssigned;
    }

    setAssignRolesByGroup(_assignRolesByGroup);
  };

  const buildDataToSave = () => {
    let result = {};
    const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
    result.groupId = selectGroup;
    let groupRolesFilter = _assignRolesByGroup.filter(
      (item) => item.isAssigned === true
    );
    let finalGroupRoles = groupRolesFilter.map((item) => {
      let data = { groupId: selectGroup, roleId: item._id };
      return data;
    });
    result.groupRoles = finalGroupRoles;
    return result;
  };

  const handleSave = async () => {
    let data = buildDataToSave();
    setLoadingGroups(true);
    let res = await assignRolesToGroup(data);

    if (res && res.EC === 0) {
      toast.success(res.EM);
    } else {
      toast.error(res.EM);
    }
    setLoadingGroups(false);
  };

  useEffect(() => {
    console.log(assignRolesByGroup);
  }, [assignRolesByGroup]);

  return (
    <div className="group-roles">
      <div className="select-div">
        <h5 className="select-title">
          Select a group: (<span className="text-danger">*</span>)
        </h5>
        <select
          className={"form-select"}
          onChange={(event) => handleOnchangeGroup(event.target.value)}
        >
          <option value="">Please select your group</option>
          {loadingGroups ? (
            <>
              <option disabled>Loading...</option>
              <option disabled>
                <Skeleton variant="text" width={100} />
              </option>
              <option disabled>
                <Skeleton variant="text" width={100} />
              </option>
            </>
          ) : (
            userGroups.length > 0 &&
            userGroups.map((item, index) => (
              <option key={`group-${index}`} value={item._id}>
                {item.name}
              </option>
            ))
          )}
        </select>
      </div>
      <hr />
      {selectGroup && (
        <div className="roles">
          <h5>Assign Roles: </h5>
          {loadingAssignRoles ? (
            <>
              {[...Array(10)].map((_, index) => (
                <div className="form-check mb-4 d-flex" key={`skeleton-role-${index}`}>
                  <Skeleton
                    variant="rectangular"
                    width={20}
                    height={20}
                    sx={{ marginRight: 1 }}
                  />
                  <Skeleton variant="text" width={150} />
                </div>
              ))}
            </>
          ) : (
            assignRolesByGroup &&
            assignRolesByGroup.length > 0 &&
            assignRolesByGroup.map((item, index) => (
              <div className="form-check mb-4" key={`list-role-${index}`}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={item._id}
                  id={`list-role-${index}`}
                  checked={item.isAssigned}
                  onChange={(event) => handleSelectRole(event.target.value)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`list-role-${index}`}
                >
                  {item.url}
                </label>
              </div>
            ))
          )}

          <div className="mt-3">
            <button className="btn btn-warning" onClick={() => handleSave()}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupRoles;
