import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp/SignUp";
import LogIn from "./components/LogIn/LogIn";
import ECG from "./components/ECG/ECG";
import Footer from "./components/Footer";
import Heartrate from "./components/heartrate";
import History from "./components/history";
import MeasurePrepare from "./components/NewMeasure/MeasurePrepare";
import MeasureStart from "./components/NewMeasure/MeasureStart";
import Account from "./components/Account/Account";
import Intro from "./components/Introduction/Intro";

function App() {
  const userType = "user"; // Hoặc "admin"

  return (
    <>
      <Router>
        <Routes>
          {userType === "user" ? (
            // Luồng dành cho User
            <>
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
            </>
          ) : (
            // Luồng dành cho Admin
            <>
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
            </>
          )}
          {/* Các route chung cho cả User và Admin */}
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
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
    </>
  );
}

export default App;
