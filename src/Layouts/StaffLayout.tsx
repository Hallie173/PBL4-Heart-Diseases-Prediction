import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const StaffLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

export default StaffLayout;
