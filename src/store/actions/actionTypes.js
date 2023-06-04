import entities from '../../utils/constants/entities';

const makeAPIAction = (actionName) => {
  return {
    REQUEST: `@@API_${actionName}_REQUEST`,
    SUCCESS: `@@API_${actionName}_SUCCESS`,
    FAILURE: `@@API_${actionName}_FAILURE`,
  };
};

const LOGIN = makeAPIAction(entities.auth.LOGIN);
const LOGOUT = makeAPIAction(entities.auth.LOGOUT);
const REGENERATE_PASSWORD = makeAPIAction(entities.auth.REGENERATE_PASSWORD);
const RESEND_OTP = makeAPIAction(entities.auth.RESEND_OTP)
const CHANGE_PASSWORD = makeAPIAction(entities.auth.CHANGE_PASSWORD);
const ADMIN_LOGIN = makeAPIAction(entities.auth.ADMIN_LOGIN);

const RESET_APP = 'RESET_APP';
const SET_AUTH_DATA = 'SET_AUTH_DATA';
const FILTER_DASHBOARD_DATA = 'FILTER_DASHBOARD_DATA';

// Account Registration
const GENERATE_ACCOUNT_OTP = makeAPIAction(entities.account.GENERATE_ACCOUNT_OTP);
const VALIDATE_ACCOUNT_OTP = makeAPIAction(entities.account.VALIDATE_ACCOUNT_OTP);
const GET_ACCOUNT_DETAILS = makeAPIAction(entities.account.GET_ACCOUNT_DETAILS);
const VERIFY_EMAIL_ADDRESS = makeAPIAction(entities.account.VERIFY_EMAIL_ADDRESS);
const GET_PERSONAL_INFORMATION = makeAPIAction(entities.account.GET_PERSONAL_INFORMATION);
const SAVE_PERSONAL_INFORMATION = makeAPIAction(entities.account.SAVE_PERSONAL_INFORMATION);
const SAVE_BUSINESS_INFORMATION = makeAPIAction(entities.account.SAVE_BUSINESS_INFORMATION);
const SAVE_REGION_INFORMATION = makeAPIAction(entities.account.SAVE_REGION_INFORMATION);
const GET_STATES = makeAPIAction(entities.account.GET_STATES);
const GET_LGAS_BY_STATE = makeAPIAction(entities.account.GET_LGAS_BY_STATE);
const GET_REGIONS_BY_STATE = makeAPIAction(entities.account.GET_REGIONS_BY_STATE);
const GET_ACCOUNT_SUMMARY = makeAPIAction(entities.account.GET_ACCOUNT_SUMMARY);
const SAVE_ACCOUNT_SUMMARY = makeAPIAction(entities.account.SAVE_ACCOUNT_SUMMARY);
const GET_ZAC_INFORMATION = makeAPIAction(entities.account.GET_ZAC_INFORMATION);
const GET_BUSINESS_INFORMATION = makeAPIAction(entities.account.GET_BUSINESS_INFORMATION);
const GET_REGION_INFORMATION = makeAPIAction(entities.account.GET_REGION_INFORMATION);

// Dashboard
// SuperAdmin
const GET_SUPER_ADMIN_DASHBOARD_DATA = makeAPIAction(
  entities.dashboard.superAdmin.GET_SUPER_ADMIN_DASHBOARD_DATA
);

const GET_ZAC_INFO_BY_STATE = makeAPIAction(entities.dashboard.superAdmin.GET_ZAC_INFO_BY_STATE);
const SAVE_ONBOARD_ADMIN_USER = makeAPIAction(
  entities.dashboard.superAdmin.SAVE_ONBOARD_ADMIN_USER
);

const GET_ZAC_DASHBOARD_DATA = makeAPIAction(
  entities.dashboard.zonalCordinator.GET_ZAC_DASHBOARD_DATA
);

const GET_OTHER_USERS_DASHBOARD_INFO = makeAPIAction(
  entities.dashboard.general.GET_OTHER_USERS_DASHBOARD_INFO
);

const SET_XFRAME_OPTIONS = makeAPIAction(entities.xFrame.SET_XFRAME_OPTIONS);

const actionTypes = {
  LOGIN,
  LOGOUT,
  RESET_APP,
  SET_AUTH_DATA,
  GENERATE_ACCOUNT_OTP,
  VALIDATE_ACCOUNT_OTP,
  GET_ACCOUNT_DETAILS,
  VERIFY_EMAIL_ADDRESS,
  GET_PERSONAL_INFORMATION,
  SAVE_PERSONAL_INFORMATION,
  SAVE_BUSINESS_INFORMATION,
  SAVE_REGION_INFORMATION,
  GET_LGAS_BY_STATE,
  GET_ZAC_INFO_BY_STATE,
  GET_STATES,
  GET_REGIONS_BY_STATE,
  GET_ACCOUNT_SUMMARY,
  SAVE_ACCOUNT_SUMMARY,
  SAVE_ONBOARD_ADMIN_USER,
  GET_ZAC_INFORMATION,

  GET_SUPER_ADMIN_DASHBOARD_DATA,
  GET_ZAC_DASHBOARD_DATA,
  GET_OTHER_USERS_DASHBOARD_INFO,
  SET_XFRAME_OPTIONS,

  GET_BUSINESS_INFORMATION,
  GET_REGION_INFORMATION,
  REGENERATE_PASSWORD,
  CHANGE_PASSWORD,
  ADMIN_LOGIN,
  FILTER_DASHBOARD_DATA,
  RESEND_OTP
};

export default actionTypes;
