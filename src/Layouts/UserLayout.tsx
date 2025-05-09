import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const UserLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

export default UserLayout;
