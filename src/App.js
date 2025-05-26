import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { RotatingTriangles } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import AppRoutes from "./Routes/appRoutes";
import { setLoading, setUnLoading } from "./redux/reducer/loading";
import { Buffer } from "buffer";
import process from "process";

window.Buffer = Buffer;

if (typeof global === "undefined") {
  window.global = window;
}

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user) || {};
  const token = localStorage.getItem("jwt");
  const isLoading = useSelector((state) => state.loading.isLoading) || false;

  useEffect(() => {
    dispatch(setLoading());
    if (!token) {
      navigate("/login");
    }
    dispatch(setUnLoading());
  }, [token]);

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
