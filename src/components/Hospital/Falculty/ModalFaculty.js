import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import {
  fetchGroup,
  createNewUser,
  updateCurrentUser,
  createNewFaculty,
  updateCurrentFaculty,
} from "../../../services/userService";
import { toast } from "react-toastify";
import _ from "lodash";

const ModalFaculty = (props) => {
  const { action, hospitalID, dataModalFaculty } = props;
  const defaultFacultyData = {
    name: "",
    hospital_id: hospitalID,
  };

  const validInputsDefault = {
    name: true,
  };

  const [facultyData, setFacultyData] = useState(defaultFacultyData);
  const [validInputs, setValidInputs] = useState(validInputsDefault);

  useEffect(() => {
    console.log(facultyData);
  }, [facultyData]);

  useEffect(() => {
    if (action === "UPDATE") {
      setFacultyData({
        ...dataModalFaculty,
      });
    }
  }, [dataModalFaculty]);

  useEffect(() => {
    if (action === "CREATE") {
      console.log("hospitalID: ", hospitalID);
    }
  }, [action]);

  const handleOnChangeInput = (value, name) => {
    let _facultyData = _.cloneDeep(facultyData);
    _facultyData[name] = value;
    setFacultyData(_facultyData);
  };

  const checkValidateInputs = () => {
    // create user
    if (action === "UPDATE") return true;
    setValidInputs(validInputsDefault);
    let arr = ["name"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!facultyData[arr[i]]) {
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);

        toast.error(`Empty input ${arr[i]}`);
        check = false;
        break;
      }
    }

    return check;
  };

  const handleConfirmUser = async () => {
    // create user
    let check = checkValidateInputs();
    if (check === true) {
      let res =
        action === "CREATE"
          ? await createNewFaculty(facultyData)
          : await updateCurrentFaculty(facultyData);
      if (res && res.EC === 0) {
        props.onHide();
        setFacultyData(defaultFacultyData);
        toast.success("UPDATE success");
      } else {
        toast.error(res.EM);
        let _validInputs = _.cloneDeep(validInputsDefault);
        _validInputs[res.DT] = false;
        setValidInputs(_validInputs);
        toast.success("UPDATE unsuccess");
      }
    }
  };

  const handleCloseModalUser = () => {
    props.onHide();
    setFacultyData(defaultFacultyData);
    setValidInputs(validInputsDefault);
  };

  return (
    <>
      <Modal
        size="l"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalUser()}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            <span>
              {props.action === "CREATE"
                ? "CREATE NEW FACULTY"
                : "EDIT A FACULTY"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-12 form-group">
              <label>
                Name (<span className="red">*</span>):
              </label>
              <input
                className={
                  validInputs.email ? "form-control" : "form-control is-invalid"
                }
                type="text"
                value={facultyData.name}
                onChange={(event) =>
                  handleOnChangeInput(event.target.value, "name")
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleCloseModalUser()}>
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

export default ModalFaculty;
