import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import _ from "lodash";
import { updateAppointment } from "../../../services/userService";
import { toast } from "react-toastify";
import ModalMedicalRecord from "../MedicalRecord/ModalMedicalRecord";
import { useState } from "react";
import { setLoading, setUnLoading } from "../../../redux/reducer/loading.ts";
import { useDispatch } from "react-redux";

const ModalAppointment = (props) => {
  const dispatch = useDispatch();
  const { dataModalAppointment, action } = props;
  const [isShowModalMedicalRecord, setIsShowModalMedicalRecord] =
    useState(false);

  const onHideModalMedicalRecord = async () => {
    setIsShowModalMedicalRecord(false);
    props.onHide();
  };

  const handleDetailMedicalRecord = () => {
    setIsShowModalMedicalRecord(true);
  };

  const handleCloseModalAppointment = () => {
    props.onHide();
  };

  const handleConfirmAppointment = async () => {
    dispatch(setLoading());
    const response = await updateAppointment({
      id: dataModalAppointment._id,
      status: "Confirmed",
    });
    dispatch(setUnLoading());
    if (response && +response.EC === 0) {
      toast.success(response.EM);
      handleCloseModalAppointment();
    } else {
      toast.error(response.EM);
    }
  };

  const handleCancelAppointment = async () => {
    dispatch(setLoading());
    const response = await updateAppointment({
      id: dataModalAppointment._id,
      status: "Cancelled",
    });
    dispatch(setUnLoading());
    if (response && +response.EC === 0) {
      toast.success(response.EM);
      handleCloseModalAppointment();
    } else {
      toast.error(response.EM);
    }
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        className="modal-user"
        onHide={() => handleCloseModalAppointment()}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span>Appointment Information</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="content-body row">
            <div className="col-12 col-sm-6 form-group">
              <label>Patient</label>
              <input
                className="form-control"
                type="email"
                value={dataModalAppointment.patient_id?.username}
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label>Date</label>
              <input
                className="form-control"
                type="text"
                value={dataModalAppointment.date}
                readOnly
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Reason</label>
              <textarea
                className="form-control"
                rows={5}
                value={dataModalAppointment.reason}
                readOnly
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between align-items-center">
          <div>
            {action === "Pending" ? (
              <>
                <Button
                  className="me-2"
                  variant="success"
                  onClick={() => handleConfirmAppointment()}
                >
                  Confirm
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleCancelAppointment()}
                >
                  Cancel
                </Button>
              </>
            ) : action === "Confirmed" ? (
              <>
                <Button
                  variant="danger"
                  onClick={() => handleDetailMedicalRecord()}
                >
                  Write Medical Record
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>

          <Button
            variant="secondary"
            onClick={() => handleCloseModalAppointment()}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalMedicalRecord
        show={isShowModalMedicalRecord}
        onHide={onHideModalMedicalRecord}
        create={true}
        dataModalAppointment={dataModalAppointment}
      />
    </>
  );
};

export default ModalAppointment;
