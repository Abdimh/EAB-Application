// import { CustomToast } from "@Utils/ToastHelpers";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { CustomToast } from "../utils/CustomToast";
import { ToastContainer } from "react-toastify";
import axios from "axios";

const instanceAxios = axios.create({
  baseURL: "/api/",
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
    console.log(isAuthorized);
    const data = JSON.parse(localStorage.getItem("user"));

    if (isAuthorized) {
      console.log("Axois", data["token"]);

      config.headers.Authorization = `Bearer ${data["token"]}`;
    } else {
      <Redirect to="/auth-login" />;
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

        <Redirect to="/auth-login" />;
      }
    }

    return Promise.reject(error);
  }
);

export default instanceAxios;
