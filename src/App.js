import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { RotatingTriangles } from "react-loader-spinner";
import { useSelector } from "react-redux";
import AppRoutes from "./Routes/appRoutes";

function App() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};
  const isLoading = useSelector((state) => state.loading.isLoading) || false;

  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else navigate("/login");
  //   switch (user?.account?.groupWithRoles?.name) {
  //     case "admin":
  //       navigate("/manage");
  //       break;
  //     case "hospital":
  //       navigate("/hospital");
  //       break;
  //     case "doctor":
  //       navigate("/doctor");
  //       break;
  //     case "user":
  //       navigate("/");
  //       break;
  //     default:
  //       navigate("/login");
  //       break;
  //   }
  // }, [user]);

  return (
    <>
      {/* <Router> */}
      <AppRoutes user={user} />

      {/* <ToastContainer> */}
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
      {/* <Loading web> */}
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
