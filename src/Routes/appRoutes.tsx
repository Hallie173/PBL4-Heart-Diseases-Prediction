import { Routes, Route } from "react-router-dom";
import UserLayout from "../Layouts/UserLayout";
import AdminLayout from "../Layouts/AdminLayout";
import DoctorLayout from "../Layouts/DoctorLayout";
import HospitalLayout from "../Layouts/HospitalLayout";

import { userState } from "../redux/types/user.type";
import adminRoutes from "./adminRoutes";
import hospitalRoutes from "./hospitalRoutes";
import doctorRoutes from "./doctorRoutes";
import userRoutes from "./userRoutes";
import LogIn from "../components/LogIn/LogIn";
import SignUp from "../components/SignUp/SignUp";
import Page404 from "../components/Page404/Page404";
import StaffLayout from "../Layouts/StaffLayout";
import staffRoutes from "./staffRoutes";

interface AppRoutesProps {
  user: userState;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user }) => (
  <Routes>
    {(() => {
      switch (user?.account?.groupWithRoles?.name) {
        case "admin":
          return adminRoutes(AdminLayout);
        case "hospital":
          return hospitalRoutes(HospitalLayout, user);
        case "doctor":
          return doctorRoutes(DoctorLayout, user);
        case "user":
          return userRoutes(UserLayout, user);
        case "staff":
          return staffRoutes(StaffLayout, user);
      }
    })()}
    <Route path="/login" element={<LogIn />} />
    <Route path="/signup" element={<SignUp />} />
    {/* <Route path="/chat" element={<Chat userId={user.account.id}/>} /> */}
    <Route path="*" element={<Page404 />} />;
  </Routes>
);

export default AppRoutes;
