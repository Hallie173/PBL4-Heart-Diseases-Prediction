import { Route } from "react-router-dom";
import DoctorManage from "../components/Doctor/DoctorManage";
import Appointment from "../components/Doctor/Appointment/Appointment";
import MedicalRecord from "../components/Doctor/MedicalRecord/MedicalRecord";
import { userState } from "../redux/types/user.type";
import Chat from "../components/Chat/Chat";

const doctorRoutes = (Layouts: () => React.JSX.Element, user: userState) => {
  /* Doctor Routes */
  const doctorID = user.account.id;
  return (
    <Route path="/doctor" element={<Layouts />}>
      <Route index element={<DoctorManage />} />
      <Route path="" element={<DoctorManage />}>
        <Route
          path="appointment"
          element={<Appointment doctorID={doctorID} />}
        />
        <Route
          path="medical-record"
          element={<MedicalRecord doctorID={doctorID} />}
        />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Route>
  );
};

export default doctorRoutes;
