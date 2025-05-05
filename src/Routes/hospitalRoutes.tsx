import { Route } from "react-router-dom";
import HospitalManage from "../components/Hospital/HospitalManage";
import Doctor from "../components/Hospital/Doctor/Doctor";
import Falculty from "../components/Hospital/Falculty/Falculty";
import Staff from "../components/Hospital/Staff/Staff";
import MedicalRecord from "../components/Hospital/MedicalRecord/MedicalRecord";
import { userState } from "../redux/types/user.type";

const hospitalRoutes = (Layouts: () => React.JSX.Element, user: userState) => {
  /* Hospital Routes */
  return (
    <Route path="/hospital/*" element={<Layouts />}>
      <Route index element={<HospitalManage />} />
      <Route path="" element={<HospitalManage />}>
        <Route
          path="doctor"
          element={<Doctor hospitalID={user.account.id} />}
        />
        <Route path="staff" element={<Staff hospitalID={user.account.id} />} />
        <Route
          path="faculty"
          element={<Falculty hospitalID={user.account.id} />}
        />
        <Route
          path="medical-record"
          element={<MedicalRecord hospitalID={user.account.id} />}
        />
      </Route>
    </Route>
  );
};

export default hospitalRoutes;
