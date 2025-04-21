import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import _ from "lodash";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createMedicalRecord } from "../../../services/userService";

const ModalMedicalRecord = (props) => {
  const { dataModalMedicalRecord, create, dataModalAppointment } = props;
  const [data, setData] = useState({});
  const [validInput, setValidInputs] = useState({});
  const dataDefault = {
    id: "",
    patient_id: "",
    doctor_id: "",
    hospital_id: "",
    diagnosis: "",
    notes: "",
  };

  const dataValid = {
    patient_id: true,
    doctor_id: true,
    hospital_id: true,
    diagnosis: true,
    notes: true,
  };

  const handleOnChangeInput = (value, name) => {
    let _data = _.cloneDeep(data);
    _data[name] = value;
    setData(_data);
  };

  const handleCloseModalMedicalRecord = () => {
    props.onHide();
  };

  const checkValidateInputs = () => {
    setValidInputs(dataValid);
    let arr = ["diagnosis", "notes"];
    let check = true;
    for (let i = 0; i < arr.length; i++) {
      if (!data[arr[i]]) {
        let _validInputs = _.cloneDeep(dataValid);
        _validInputs[arr[i]] = false;
        setValidInputs(_validInputs);

        toast.error(`Empty input ${arr[i]}`);
        return false;
      }
    }

    return check;
  };

  const handleConfirmMedicalRecord = async () => {
    // Validate inputs
    const isValid = checkValidateInputs();
    if (!isValid) return;

    console.log("call API: ", data);
    let res = await createMedicalRecord({
      ...data,
      patient_id: data.patient_id._id,
    });

    if (res && res.EC === 0) {
      props.onHide();
      setData(dataDefault);
      toast.success("Tạo Bệnh Án Thành Công!");
    } else {
      // Gán lại validInputs để báo lỗi input
      const _validInputs = _.cloneDeep(dataValid);
      if (res?.DT) {
        _validInputs[res.DT] = false;
      }
      setValidInputs(_validInputs);
      toast.error(res.EM);
    }
  };

  useEffect(() => {
    if (dataModalMedicalRecord) {
      setData(dataModalMedicalRecord);
    }
  }, [dataModalMedicalRecord]);

  useEffect(() => {
    if (dataModalAppointment) {
      setData({
        ...data,
        id: dataModalAppointment._id,
        patient_id: dataModalAppointment.patient_id,
        doctor_id: dataModalAppointment.doctor_id,
        hospital_id: dataModalAppointment.hospital_id,
      });
    }
  }, [dataModalAppointment]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <Modal
        size="xl"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalMedicalRecord()}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>Medical Record Information</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-group">
              {!create && (
                <>
                  <label>Doctor</label>
                  <input
                    disabled
                    className="form-control"
                    type="email"
                    value={data.doctor_id?.username}
                  />
                </>
              )}
            </div>
            <div
              className={
                !create
                  ? "col-12 col-sm-6 form-group"
                  : "col-12 col-sm-12 form-group"
              }
            >
              <label>Patient</label>
              <input
                disabled
                className="form-control"
                type="text"
                value={data.patient_id?.username}
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Diagnosis</label>
              <input
                className="form-control"
                type="text"
                value={data.diagnosis}
                onChange={(e) =>
                  handleOnChangeInput(e.target.value, "diagnosis")
                }
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Notes</label>
              <textarea
                className="form-control"
                rows={10} // hoặc tùy chỉnh số dòng mong muốn
                value={data.notes}
                onChange={(e) => handleOnChangeInput(e.target.value, "notes")}
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              {!create && (
                <>
                  <label>Date</label>
                  <input
                    className="form-control"
                    type="text"
                    value={data.created_at}
                  />
                </>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className={
            create ? "d-flex justify-content-between align-items-center" : ""
          }
        >
          {create && (
            <>
              <Button
                variant="success"
                onClick={() => handleConfirmMedicalRecord()}
              >
                Submit
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            onClick={() => handleCloseModalMedicalRecord()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalMedicalRecord;
