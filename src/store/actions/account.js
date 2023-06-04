import axios from '../../config/Axios';
import { removeEmptyKeys } from '../../utils/helpers';
import { decrypt, encrypt, getOnboardingCreatedBy } from '../../utils/helpers/auth';
import actionTypes from './actionTypes';

export const generateAccountOtp = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GENERATE_ACCOUNT_OTP.REQUEST });
    try {
      let response = await axios.get(`Auth/GenerateAccountOTP`, { params: { AccountNumber } });
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.GENERATE_ACCOUNT_OTP.SUCCESS, payload: AccountNumber });
        return true;
      }
    } catch (error) {
      if (error.response) {
        dispatch({
          type: actionTypes.GENERATE_ACCOUNT_OTP.FAILURE,
        });
      }
    }
  };
};

export const validateAccountOtp = (payload) => {
  return async (dispatch) => {
    const data = { encryptedString: encrypt(payload) };
    const uniqueIdentifier = payload.identifier;
    dispatch({ type: actionTypes.VALIDATE_ACCOUNT_OTP.REQUEST });
    try {
      let response = await axios.post(`Auth/ValidateAccountOTP`, data);
      if (response.status === 200) {
        const payload = decrypt(response.data);
        if (payload.code === '00' && payload.identifier === uniqueIdentifier) {
          dispatch({ type: actionTypes.VALIDATE_ACCOUNT_OTP.SUCCESS, payload });
          return true;
        }
      }
    } catch (error) {
      dispatch({
        type: actionTypes.VALIDATE_ACCOUNT_OTP.FAILURE,
      });
    }
  };
};

export const getAccountDetails = (AccountNumber) => {
  return async (dispatch) => {
    const data = { encryptedString: encrypt({ account_no: AccountNumber }) };
    dispatch({ type: actionTypes.GET_ACCOUNT_DETAILS.REQUEST });
    try {
      let response = await axios.post(`Agent/GetAccountDetailsFromBankAPiEncrypt`, data);
      if (response.status === 200) {
        const decryptedPayload = decrypt(response.data);
        const checkAccountNumber = decryptedPayload?.data?.accountNumber;
        if (checkAccountNumber === AccountNumber) {
          const payload = decryptedPayload?.data;
          dispatch({ type: actionTypes.GET_ACCOUNT_DETAILS.SUCCESS, payload });
          return payload;
        }
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ACCOUNT_DETAILS.FAILURE,
      });
    }
  };
};

export const verifyEmailAddress = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.VERIFY_EMAIL_ADDRESS.REQUEST });
    try {
      let response = await axios.post(`Auth/VerifyEmailAddress`, payload);
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.VERIFY_EMAIL_ADDRESS.SUCCESS });
        return true;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.VERIFY_EMAIL_ADDRESS.FAILURE,
      });
    }
  };
};

export const savePersonalInformation = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SAVE_PERSONAL_INFORMATION.REQUEST });
    try {
      let response = await axios.post(
        `PersonalInfo/SavePersonalInfo`,
        removeEmptyKeys({
          ...payload,
          secondPhoneNumber: payload?.secondPhoneNumber ? payload?.secondPhoneNumber : '',
          createdBy: getOnboardingCreatedBy() || '',
        })
      );
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.SAVE_PERSONAL_INFORMATION.SUCCESS });
        return true;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_PERSONAL_INFORMATION.FAILURE,
      });
    }
  };
};

export const getPersonalInformation = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_PERSONAL_INFORMATION.REQUEST });
    try {
      let response = await axios.get(`PersonalInfo/GetPersonalInfo`, { params: { AccountNumber } });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_PERSONAL_INFORMATION.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_PERSONAL_INFORMATION.FAILURE,
      });
    }
  };
};

export const getBusinessInformation = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_BUSINESS_INFORMATION.REQUEST });
    try {
      let response = await axios.get(`BusinessInfo/GetBusinessInfo`, { params: { AccountNumber } });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_BUSINESS_INFORMATION.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_BUSINESS_INFORMATION.FAILURE,
      });
    }
  };
};

export const getRegionInformation = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_REGION_INFORMATION.REQUEST });
    try {
      let response = await axios.get(`RegionInfo/GetRegionInfo`, { params: { AccountNumber } });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_REGION_INFORMATION.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_REGION_INFORMATION.FAILURE,
      });
    }
  };
};

export const saveBusinessInformation = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SAVE_BUSINESS_INFORMATION.REQUEST });
    try {
      let response = await axios.post(`BusinessInfo/SaveBusinessInfo`, payload);
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.SAVE_BUSINESS_INFORMATION.SUCCESS });
        return true;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_BUSINESS_INFORMATION.FAILURE,
      });
    }
  };
};

export const saveRegionInformation = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SAVE_REGION_INFORMATION.REQUEST });
    try {
      let response = await axios.post(`RegionInfo/SaveRegionInfo`, removeEmptyKeys(payload));
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.SAVE_REGION_INFORMATION.SUCCESS });
        return true;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_REGION_INFORMATION.FAILURE,
      });
    }
  };
};

export const getStates = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_STATES.REQUEST });
    try {
      let response = await axios.get(`Agent/GetStates`);
      if (response.status === 200) {
        const payload = response.data;
        dispatch({ type: actionTypes.GET_STATES.SUCCESS, payload });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_STATES.FAILURE,
      });
    }
  };
};

export const getLgasByState = (state) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_LGAS_BY_STATE.REQUEST });
    try {
      let response = await axios.get(`Agent/GetLgaByState`, { params: { state } });
      if (response.status === 200) {
        const payload = response.data;
        dispatch({ type: actionTypes.GET_LGAS_BY_STATE.SUCCESS, payload });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_LGAS_BY_STATE.FAILURE,
      });
    }
  };
};

export const getZacInfoByState = (region) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_ZAC_INFO_BY_STATE.REQUEST });
    try {
      let response = await axios.get('SuperAdmin/GetZacInfoByState', { params: { region } });
      if (response.status === 200) {
        const payload = response?.data?.data;
        dispatch({ type: actionTypes.GET_ZAC_INFO_BY_STATE.SUCCESS, payload });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ZAC_INFO_BY_STATE.FAILURE,
      });
    }
  };
};

export const getRegionByState = (state) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_REGIONS_BY_STATE.REQUEST });
    try {
      let response = await axios.get(`Agent/GetRegionByState`, { params: { state } });
      if (response.status === 200) {
        const payload = response.data;
        dispatch({ type: actionTypes.GET_REGIONS_BY_STATE.SUCCESS, payload });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_REGIONS_BY_STATE.FAILURE,
      });
    }
  };
};

export const getAccountSummary = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_ACCOUNT_SUMMARY.REQUEST });
    try {
      let response = await axios.get(`Agent/GetAgentSummaryByAccountNumber`, {
        params: { AccountNumber },
      });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_ACCOUNT_SUMMARY.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ACCOUNT_SUMMARY.FAILURE,
      });
    }
  };
};

export const saveAccountSummary = (accountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SAVE_ACCOUNT_SUMMARY.REQUEST });
    try {
      let response = await axios.post(`Agent/FinalSubmit`, { accountNumber });
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.SAVE_ACCOUNT_SUMMARY.SUCCESS });
        return response.data?.description;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_ACCOUNT_SUMMARY.FAILURE,
      });
    }
  };
};

export const getZacInformation = (AccountNumber = '') => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_ZAC_INFORMATION.REQUEST });
    try {
      let response = await axios.get(`Agent/GetMyZACInfo`, { params: { AccountNumber } });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_ZAC_INFORMATION.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ZAC_INFORMATION.FAILURE,
      });
    }
  };
};

export const getAccountDetailsEmailOnly = (AccountNumber) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_ACCOUNT_DETAILS.REQUEST });
    try {
      let response = await axios.get(`Agent/GetEmailAddressByAccountNumber`, {
        params: { AccountNumber },
      });
      if (response.data.code === '00') {
        const payload = response.data.data;
        dispatch({ type: actionTypes.GET_ACCOUNT_DETAILS.SUCCESS, payload });
        return payload;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ACCOUNT_DETAILS.FAILURE,
      });
    }
  };
};

export const saveOnboardAdminUserInfo = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.SAVE_ONBOARD_ADMIN_USER.REQUEST });
    try {
      let response = await axios.post(`SuperAdmin/SaveAdminInfo`, payload);
      if (response.data.code === '00') {
        dispatch({ type: actionTypes.SAVE_ONBOARD_ADMIN_USER.SUCCESS });
        return response.data?.description;
      }
    } catch (error) {
      dispatch({
        type: actionTypes.SAVE_ONBOARD_ADMIN_USER.FAILURE,
      });
    }
  };
};
