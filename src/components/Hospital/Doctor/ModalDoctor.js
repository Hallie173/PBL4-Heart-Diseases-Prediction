import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import {
  updateCurrentUser,
  fetchFacultyWithNotPagination,
  createNewDoctor,
} from "../../../services/userService";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalDoctor = (props) => {
  const { show, action, dataModalDoctor, hospitalID } = props;
  const defaultUserData = {
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    groupId: "",
    hospital_id: hospitalID,
    faculty_id: "",
  };

  const validInputsDefault = {
    email: true,
    username: true,
    firstName: true,
    lastName: true,
    password: true,
    phone: true,
    gender: true,
    address: true,
    faculty_id: true,
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  const [faculty, setFaculty] = useState([]);

  // useEffect(() => {
  //   getFaculty();
  // }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  useEffect(() => {
    if (action === "UPDATE") {
      setUserData({
        ...dataModalDoctor,
        group: dataModalDoctor.groupId ? dataModalDoctor.groupId._id : "",
      });
    }
  }, [dataModalDoctor]);

  useEffect(() => {
    getFaculty();
    if (action === "CREATE") {
      if (faculty && faculty.length > 0) {
        setUserData({ ...userData, faculty_id: faculty[0]._id });
      }
    }
  }, [show]);

  const getFaculty = async () => {
    let res = await fetchFacultyWithNotPagination(hospitalID);
    if (res && res.EC === 0) {
      setFaculty(res.DT);
      if (res.DT && res.DT.length > 0) {
        let tmp = res.DT;
        setUserData({ ...userData, faculty_id: tmp[0]._id });
      }
    } else {
      toast.error(res.EM);
    }
  };

  const handleOnChangeInput = (value, name) => {
    let _userData = _.cloneDeep(userData);
    _userData[name] = value;
    setUserData(_userData);
  };

  const checkValidateInputs = () => {
    // create user
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = [
      "email",
      "phone",
      "password",
      "username",
      "firstName",
      "lastName",
      "address",
    ];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!userData[arr[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);

        toast.error(`Empty input ${arr[i]}`);
        return false;
        break;
      }
    }

    let regx = /\S+@\S+\.\S+/;
    if (!regx.test(userData.email)) {
      toast.error("Please enter a valid email address");
      let _validInputs = _.cloneDeep(validInputsDefault);
      _validInputs["email"] = false;
      setValidInputs(_validInputs);
      return false;
    }

    let regxPhoneVN = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
    if (!regxPhoneVN.test(userData.phone)) {
      toast.error("Please enter a valid Vietnamese phone number");
      let _validInputs = _.cloneDeep(validInputsDefault);
      _validInputs["phone"] = false;
      setValidInputs(_validInputs);
      return false;
    }

    if (userData.password.length < 4) {
      toast.error("Your password must have more than 3 letter");
      let _validInputs = _.cloneDeep(validInputsDefault);
      _validInputs["password"] = false;
      setValidInputs(_validInputs);
      return false;
    }

    return check;
  };

  const handleConfirmUser = async () => {
    // Validate inputs
    const isValid = checkValidateInputs();
    if (!isValid) return;

    let res;
    if (action === "CREATE") {
      res = await createNewDoctor(userData);
    } else if (action === "UPDATE") {
      res = await updateCurrentUser({
        ...userData,
        groupId: userData["group"],
      });
    }

    if (res && res.EC === 0) {
      props.onHide();

      // Reset form nếu là tạo mới
      if (action === "CREATE") {
        setUserData({
          ...defaultUserData,
          faculty: faculty && faculty.length > 0 ? faculty[0]._id : "",
        });
        toast.success("Tạo người dùng thành công!");
      } else {
        toast.success("Cập nhật người dùng thành công!");
      }
    } else {
      // Gán lại validInputs để báo lỗi input
      const _validInputs = _.cloneDeep(validInputsDefault);
      if (res?.DT) {
        _validInputs[res.DT] = false;
      }
      setValidInputs(_validInputs);

      // Toast báo lỗi phù hợp theo action
      if (action === "CREATE") {
        toast.error(res.EM);
      } else {
        toast.error(res.EM);
      }
    }
  };

  const handleCloseModalDoctor = () => {
    props.onHide();
    setUserData(defaultUserData);
    setValidInputs(validInputsDefault);
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalDoctor()}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>
              {props.action === "CREATE"
                ? "CREATE NEW DOCTOR"
                : "EDIT A DOCTOR"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-group">
              <label>
                Email Address (<span className="red">*</span>):
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.email ? "form-control" : "form-control is-invalid"
                }
                type="email"
                value={userData.email}
                onChange={(event) => {
                  handleOnChangeInput(event.target.value, "email");
                }}
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label>
                Phone Number (<span className="red">*</span>):
              </label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.phone ? "form-control" : "form-control is-invalid"
                }
                type="text"
                value={userData.phone}
                onChange={(event) => {
                  handleOnChangeInput(event.target.value, "phone");
                }}
              />
            </div>

            <div className="col-12 col-sm-4 form-group">
              <label>Username:</label>
              <input
                disabled={action === "CREATE" ? false : true}
                className={
                  validInputs.username
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={userData.username}
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "username")
                }
              />
            </div>

            <div className="col-12 col-sm-4 form-group">
              <label>First Name:</label>
              <input
                className={
                  validInputs.firstName
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={userData.firstName}
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "firstName")
                }
              />
            </div>

            <div className="col-12 col-sm-4 form-group">
              <label>Last Name:</label>
              <input
                className={
                  validInputs.lastName
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={userData.lastName}
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "lastName")
                }
              />
            </div>

            <div className="col-12 form-group">
              {action === "CREATE" && (
                <>
                  <label>
                    Password (<span className="red">*</span>):
                  </label>
                  <input
                    className={
                      validInputs.password
                        ? "form-control"
                        : "form-control is-invalid"
                    }
                    type="password"
                    value={userData.password}
                    onChange={(event) =>
                      handleOnChangeInput(event.target.value, "password")
                    }
                  />
                </>
              )}
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Address:</label>
              <input
                className={
                  validInputs.address
                    ? "form-control"
                    : "form-control is-invalid"
                }
                type="text"
                value={userData.address}
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "address")
                }
              />
            </div>

            <div className="col-12 col-sm-6 form-group">
              <label>Gender:</label>
              <select
                className="form-select"
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "gender")
                }
                value={userData.gender}
              >
                <option value={true}>Male</option>
                <option value={false}>Female</option>
              </select>
            </div>

            <div className="col-12 col-sm-6 form-group">
              <label>
                Faculty (<span className="red">*</span>):
              </label>
              <select
                className={
                  validInputs.faculty_id
                    ? "form-select"
                    : "form-select is-invalid"
                }
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "faculty_id")
                }
                value={userData.faculty_id}
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModalDoctor()}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleConfirmUser()}>
            {action === "CREATE" ? "Save" : "Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDoctor;
