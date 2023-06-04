import axios from "../../config/Axios";
import actionTypes from "./actionTypes";
import { decrypt, encrypt } from "../../utils/helpers/auth";
import { isEmpty } from "../../utils/helpers";


export const login = (payload) => {
  return async (dispatch) => {
    const data = { encryptedString: encrypt(payload) };
    dispatch({ type: actionTypes.LOGIN.REQUEST });
    try {
      let response = await axios.post(`Auth/EncryptLogin`, data);
      if (response.data.code === "00") {
        const payload = decrypt(response.data.data);
        dispatch({ type: actionTypes.LOGIN.SUCCESS, payload: { authData: payload, token: response.data.token } });
        return payload
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.LOGIN.FAILURE,
        });
      }
    }
  };
};

export const regeneratePassword = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.REGENERATE_PASSWORD.REQUEST });
    try {
      let response = await axios.get(`Auth/RegeneratePassword`, { params: payload });
      if (response.data.code === "00") {
        dispatch({ type: actionTypes.REGENERATE_PASSWORD.SUCCESS });
        return true
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.REGENERATE_PASSWORD.FAILURE,
        });
      }
    }
  };
};

export const resendOTP = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.RESEND_OTP.REQUEST });
    try {
      let response = await axios.get(`Auth/GenerateAccountOTP`, { params: payload });
      if (response.data.code === "00") {
        dispatch({ type: actionTypes.RESEND_OTP.SUCCESS });
        return true
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.RESEND_OTP.FAILURE,
        });
      }
    }
  };
};



export const changePassword = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.CHANGE_PASSWORD.REQUEST });
    try {
      let response = await axios.post(`Auth/ChangePassword`, payload);
      if (response.data.code === "00") {
        dispatch({ type: actionTypes.CHANGE_PASSWORD.SUCCESS });
        return true
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.CHANGE_PASSWORD.FAILURE,
        });
      }
    }
  };
};


export const setAuthData = (payload) => {
  return async (dispatch) => {
    if (!isEmpty(payload)) {
      dispatch({ type: actionTypes.SET_AUTH_DATA, payload });
    }
  };
};


export const logOut = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.LOGOUT.REQUEST });
    try {
      let response = await axios.get(`Auth/Logout`);
      if (response.data.code === "00") {
        dispatch({ type: actionTypes.LOGOUT.SUCCESS });
        return true
      }
    } catch (error) {
      dispatch({
        type: actionTypes.LOGOUT.FAILURE,
      });
    }
  };
};


export const setXframmeOptions = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SET_XFRAME_OPTIONS.REQUEST });
    try {
      let response = await axios.get(`Agent/OpenXframe`);
      if (response.data.code === "00") {
        dispatch({ type: actionTypes.SET_XFRAME_OPTIONS.SUCCESS });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SET_XFRAME_OPTIONS.FAILURE,
      });
    }
  };
};


export const twoFAOTPValidate = (payload) => {
  return async (dispatch) => {
    const data = { encryptedString: encrypt(payload) };
    dispatch({ type: actionTypes.VALIDATE_ACCOUNT_OTP.REQUEST });
    try {
      let response = await axios.post(`Auth/TWOFALoginOTP`, data);
      if (response.data.code === "00") {
        const payload = decrypt(response.data.data);
        dispatch({ type: actionTypes.VALIDATE_ACCOUNT_OTP.SUCCESS, payload: { authData: payload, token: response.data.token } });
        return payload
      }
    } catch (error) {
      dispatch({
        type: actionTypes.VALIDATE_ACCOUNT_OTP.FAILURE,
      });
    }
  };
};

export const loginAsAdmin = (payload) => {
  return async (dispatch) => {
    const data = { encryptedString: encrypt(payload) };
    dispatch({ type: actionTypes.ADMIN_LOGIN.REQUEST });
    try {
      let response = await axios.post(`AdminAuth/EncryptLogin`, data);
      if (response.data.code === "00") {
        const payload = decrypt(response.data.data);
        dispatch({ type: actionTypes.ADMIN_LOGIN.SUCCESS, payload: { authData: payload, token: response.data.token } });
        return payload
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.ADMIN_LOGIN.FAILURE,
        });
      }
    }
  };
};
