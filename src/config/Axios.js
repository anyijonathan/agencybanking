/* eslint-disable no-throw-literal */

import axios from "axios";
import { getStoredToken, authRemoveAsyncData } from "../utils/helpers/auth";
import config from "./config.json"
import swal from "sweetalert"
import { handleErrorMessage } from "../utils/helpers";

const Instance = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Ocp-Apim-Subscription-Key': process.env.REACT_APP_SUB_KEY
  }
});

Instance.interceptors.request.use(
  (config) => {

    if (!navigator.onLine) {
      throw {
        response: {
          data: { description: "Please check your Internet Connection" },
        },
      };
    }

    if (config.url === "Auth/EncryptLogin" && !getStoredToken()) {
      delete config.headers["Authorization"];
    } else {
      config.headers["Authorization"] = `Bearer ${getStoredToken()
        }`;
    }
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error

  }
);

Instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        swal({
          title: "Session Time-Out!",
          text: "Kindly login again to continue",
          icon: "error",
        }).then(() => {
          authRemoveAsyncData()
          window.location.reload()
        });
       

      } catch (_error) {
        return Promise.reject(_error);
      }
    } else {
      swal({
        title: "Oops!!!",
        text: handleErrorMessage(err),
        icon: "error",
      });
    }
    return Promise.reject(err);
  }
);

export default Instance;