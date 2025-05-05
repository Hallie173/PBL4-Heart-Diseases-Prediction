import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const AdminLayout = () => (
  <>
    <Outlet />
    <Footer />
  </>
);

export default AdminLayout;
