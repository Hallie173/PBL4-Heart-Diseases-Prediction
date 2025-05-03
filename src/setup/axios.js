import axios from "axios";
import { toast } from "react-toastify";

// Create Axios instances
const instance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

const instancePy = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// Function to apply interceptors
const applyInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      const status = (error && error.response && error.response.status) || 500;
      switch (status) {
        case 401:
          toast.error("Unauthorized the user. Please login...");
          break;
        case 403:
          toast.error(
            `You don't have the permission to access this resource...`
          );
          break;
        default:
          break;
      }
      return null;
    }
  );
};

// Apply interceptors
applyInterceptors(instance);
applyInterceptors(instancePy);

// Export instances
export { instance, instancePy };
