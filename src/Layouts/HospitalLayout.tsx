import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const HospitalLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

export default HospitalLayout;
