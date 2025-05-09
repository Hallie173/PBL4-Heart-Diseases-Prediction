import { Route } from "react-router-dom";
import DoctorManage from "../components/Doctor/DoctorManage";
import Appointment from "../components/Doctor/Appointment/Appointment";
import MedicalRecord from "../components/Doctor/MedicalRecord/MedicalRecord";
import { userState } from "../redux/types/user.type";
import ChatPage from "../components/Chat/ChatPage";

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
        <Route
          path="chat"
          element={
            <ChatPage
              userB="67f47b8d62af3aca126d0efc"
            />
          }
        />
      </Route>
    </Route>
  );
};

export default doctorRoutes;
