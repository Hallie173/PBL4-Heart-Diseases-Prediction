import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import _ from "lodash";

const ModalMedicalRecord = (props) => {
  const { dataModalMedicalRecord } = props;
  const handleCloseModalMedicalRecord = () => {
    props.onHide();
  };
  return (
    <>
      <Modal
        size="lg"
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
              <label>Doctor</label>
              <input
                className="form-control"
                type="email"
                value={dataModalMedicalRecord.doctor_id?.username}
              />
            </div>
            <div className="col-12 col-sm-6 form-group">
              <label>Patient</label>
              <input
                className="form-control"
                type="text"
                value={dataModalMedicalRecord.patient_id?.username}
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Diagnosis</label>
              <input
                className="form-control"
                type="text"
                value={dataModalMedicalRecord.diagnosis}
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Notes</label>
              <textarea
                className="form-control"
                rows={10} // hoặc tùy chỉnh số dòng mong muốn
                value={dataModalMedicalRecord.notes}
                readOnly // nếu chỉ để hiển thị, không cho sửa
              />
            </div>

            <div className="col-12 col-sm-12 form-group">
              <label>Date</label>
              <input
                className="form-control"
                type="text"
                value={dataModalMedicalRecord.created_at}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
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
