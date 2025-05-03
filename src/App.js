import React, { useState, useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";
import ECG from "./components/ECG/ECG";
import Footer from "./components/Footer";
import Heartrate from "./components/heartrate";
import History from "./components/HistoryHealthRecord.js/history";
import MeasurePrepare from "./components/NewMeasure/MeasurePrepare";
import MeasureStart from "./components/NewMeasure/MeasureStart";
import Account from "./components/Manage/Account/Account";
import Guide from "./components/Guide/Guide";
import Manage from "./components/Manage/Manage";
import LookUp from "./components/LookUp/LookUp";
import EcgHistory from "./components/HistoryHealthRecord.js/EcgHistory";
import { UserContext } from "./context/UserContext";
import Statistic from "./components/Manage/Statistic/Statistic";
import HospitalManage from "./components/Hospital/HospitalManage";
import DoctorManage from "./components/Doctor/DoctorManage";
import Appointment from "./components/Appointment";
import { RotatingTriangles } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Page404 from "./components/Page404/Page404";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};
  const isLoading = useSelector((state) => state.loading.isLoading) || false;

  useEffect(() => {
    switch (user?.account?.groupWithRoles?.name) {
      case "admin":
        navigate("/manage");
        break;
      case "hospital":
        navigate("/hospital");
        break;
      case "doctor":
        navigate("/doctor");
        break;
      default:
        navigate("/login");
        break;
    }
  }, [user]);

  const adminRoutes = (
    <>
      <Route
        path="/manage/*"
        element={
          <>
            <Manage />
            <Footer />
          </>
        }
      />
    </>
  );

  const hospitalRoutes = (
    <>
      <Route
        path="/hospital/*"
        element={
          <>
            <HospitalManage />
            <Footer />
          </>
        }
      />
    </>
  );

  const doctorRoutes = (
    <>
      <Route
        path="/doctor/*"
        element={
          <>
            <DoctorManage />
            <Footer />
          </>
        }
      />
    </>
  );

  const userRoutes = (
    <>
      <Route
        path="/guide"
        element={
          <>
            <Navbar />
            <Guide />
            <Footer />
          </>
        }
      />
      <Route
        path="/appointment"
        element={
          <>
            <Navbar />
            <Appointment patient={user.account} />
            <Footer />
          </>
        }
      />
      <Route
        path="/look-up"
        element={
          <>
            <Navbar />
            <LookUp />
            <Footer />
          </>
        }
      />
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Heartrate />
            <Footer />
          </>
        }
      />
      <Route
        path="/history"
        element={
          <>
            <Navbar />
            <History />
            <Footer />
          </>
        }
      />
      <Route
        path="/ecg-history"
        element={
          <>
            <Navbar />
            <EcgHistory />
            <Footer />
          </>
        }
      />
      <Route
        path="/account/*"
        element={
          <>
            <Navbar />
            <Account />
            <Footer />
          </>
        }
      />
      <Route
        path="/measure-prepare"
        element={
          <>
            <Navbar />
            <MeasurePrepare />
            <Footer />
          </>
        }
      />
    </>
  );

  return (
    <>
      {/* <Router> */}
      <Routes>
        {(() => {
          switch (user?.account?.groupWithRoles?.name) {
            case "admin":
              return adminRoutes;
            case "hospital":
              return hospitalRoutes;
            case "doctor":
              return doctorRoutes;
            case "user":
              return userRoutes;
            // default:
            //   return <Route path="*" element={<Page404 />} />;
          }
        })()}
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Page404 />} />;
      </Routes>
      {/* </Router> */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white"
          style={{ zIndex: 2000 }}
        >
          <RotatingTriangles
            visible={true}
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="rotating-triangles-loading"
          />
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default App;
