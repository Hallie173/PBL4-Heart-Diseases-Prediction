import { Route } from "react-router-dom";
import StaffManage from "../components/Staff/StaffManage";
import { userState } from "../redux/types/user.type";
import Chat from "../components/Chat/Chat";
import Patient from "../components/Staff/Patient/Patient";

const staffRoutes = (Layouts: () => React.JSX.Element, user: userState) => {
  /* Doctor Routes */
  const doctorID = user.account.id;
  return (
    <Route path="/staff" element={<Layouts />}>
      <Route index element={<StaffManage />} />
      <Route path="" element={<StaffManage />}>
        <Route
          path="patients"
          element={<Patient/>}
        />
      </Route>
    </Route>
  );
};

export default staffRoutes;
