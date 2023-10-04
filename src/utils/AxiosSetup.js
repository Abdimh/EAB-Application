// import { CustomToast } from "@Utils/ToastHelpers";
import { CustomToast } from "../utils/CustomToast";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const instanceAxios = axios.create({
  baseURL: "https://localhost:7015/api/",
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  responseType: "json",
  // XSRF-TOKEN : will be not working, because it's false
  withCredentials: false,
});

instanceAxios.interceptors.request.use(
  function (config) {
    var isAuthorized = localStorage.getItem("isAuthorized");

    const data = JSON.parse(localStorage.getItem("user"));

    if (isAuthorized) {
      console.log("Axois", data["token"]);

      config.headers.Authorization = `Bearer ${data["token"]}`;
    } else {
      console.log("Please redirect");
    }

    return config;
  },
  function (err) {
    console.log("Request Error", err);

    return Promise.reject(err);
  }
);

instanceAxios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (axios.isAxiosError(error)) {
      const { response } = error;

      if (response?.status === 500) {
        CustomToast("Please Try Again, The Server is Down", false, "error");
      }

      const expectedError = error.response && error.response.status >= 422 && error.response.status < 500;

      // if (!expectedError) {
      //   console.log("Axios Setup - Unexpected Error", error);
      //   // CustomToast("Please Try Again, Network Failed", false, "error");
      // }

      if (response?.status === 401) {
        // UnAuthorized, LogOut
        console.log("Please Login Again", response);
      }
    }

    return Promise.reject(error);
  }
);

export default instanceAxios;
