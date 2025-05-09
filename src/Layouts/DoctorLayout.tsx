import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const DoctorLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

export default DoctorLayout;
