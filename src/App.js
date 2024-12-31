// import React, { useState, useContext, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import { ToastContainer } from "react-toastify";
// import Navbar from "./components/Navbar";
// import SignUp from "./components/SignUp/SignUp";
// import LogIn from "./components/LogIn/LogIn";
// import ECG from "./components/ECG/ECG";
// import Footer from "./components/Footer";
// import Heartrate from "./components/heartrate";
// import History from "./components/HistoryHealthRecord.js/history";
// import MeasurePrepare from "./components/NewMeasure/MeasurePrepare";
// import MeasureStart from "./components/NewMeasure/MeasureStart";
// import Account from "./components/Manage/Account";
// import Guide from "./components/Guide/Guide";
// import Manage from "./components/Manage/Manage";
// import Contact from "./components/Contact/Contact";
// import LookUp from "./components/LookUp/LookUp";
// import EcgHistory from "./components/HistoryHealthRecord.js/EcgHistory";
// import { UserContext } from "./context/UserContext";

// function App() {
//   const { user } = useContext(UserContext);
//   useEffect(() => {
//     console.log(user.account.groupWithRoles.name);
//   });

//   return (
//     <>
//       <Router>
//         {user &&
//         user.account &&
//         user.account.groupWithRoles &&
//         user.account.groupWithRoles.name === "admin" ? (
//           <Routes>
//             {" "}
//             {/*admin*/}
//             <Route
//               path="/manage/*"
//               element={
//                 <>
//                   <Manage />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route path="/login" element={<LogIn />} />
//             <Route path="/signup" element={<SignUp />} />
//           </Routes>
//         ) : (
//           <Routes>
//             {" "}
//             {/*user */}
//             <Route
//               path="/guide"
//               element={
//                 <>
//                   <Navbar />
//                   <Guide />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/look-up"
//               element={
//                 <>
//                   <Navbar />
//                   <LookUp />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/contact"
//               element={
//                 <>
//                   <Navbar />
//                   <Contact />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/"
//               element={
//                 <>
//                   <Navbar />
//                   <Heartrate />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/history"
//               element={
//                 <>
//                   <Navbar />
//                   <History />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/ecg-history"
//               element={
//                 <>
//                   <Navbar />
//                   <EcgHistory />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/account/*"
//               element={
//                 <>
//                   <Navbar />
//                   <Account />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route
//               path="/measure-prepare"
//               element={
//                 <>
//                   <Navbar />
//                   <MeasurePrepare />
//                   <Footer />
//                 </>
//               }
//             />
//             <Route path="/login" element={<LogIn />} />
//             <Route path="/signup" element={<SignUp />} />
//           </Routes>
//         )}
//       </Router>
//       <ToastContainer
//         position="bottom-center"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </>
//   );
// }

// export default App;

import React, { useState, useContext, useEffect } from "react";
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
import LookUp from "./components/LookUp/LookUp";
import EcgHistory from "./components/HistoryHealthRecord.js/EcgHistory";
import { UserContext } from "./context/UserContext";
import Statistic from "./components/Manage/Statistic";

function App() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user?.account?.groupWithRoles?.name) {
      console.log(user.account.groupWithRoles.name);
    } else {
      console.log("User data is incomplete or undefined");
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
      <Router>
        {user &&
          user.account &&
          user.account.groupWithRoles &&
          user.account.groupWithRoles.name === "admin" ? (
          <Routes>
            {adminRoutes}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        ) : (
          <Routes>
            {userRoutes}
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        )}
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
