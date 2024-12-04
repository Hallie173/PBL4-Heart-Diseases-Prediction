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
import History from "./components/HistoryHealthRecord.js/history";
import MeasurePrepare from "./components/NewMeasure/MeasurePrepare";
import MeasureStart from "./components/NewMeasure/MeasureStart";
import Account from "./components/Manage/Account";
import Guide from "./components/Guide/Guide";
import Manage from "./components/Manage/Manage";
import Contact from "./components/Contact/Contact";
import LookUp from "./components/LookUp/LookUp";
import EcgHistory from "./components/HistoryHealthRecord.js/EcgHistory";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {" "}
          {/*user */}
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
            path="/contact"
            element={
              <>
                <Navbar />
                <Contact />
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
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        <Routes>
          {" "}
          {/*admin*/}
          <Route
            path="/manage/*"
            element={
              <>
                <Manage />
                <Footer />
              </>
            }
          />
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
