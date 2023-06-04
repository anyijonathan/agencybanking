import { truncateString } from '../../utils/helpers';
import actionTypes from '../actions/actionTypes';

const initialState = {
  accountNumber: 0,
  accountDetails: {},
  states: [],
  lgas: [],
  regions: [],
  zacInformation: {},
  accountSummary: {},
  personalInformation: {},
  zacsByState: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.GENERATE_ACCOUNT_OTP.SUCCESS:
      return {
        ...state,
        accountNumber: payload,
      };

    case actionTypes.GET_ACCOUNT_DETAILS.SUCCESS:
      return {
        ...state,
        accountDetails: { ...payload },
      };
    case actionTypes.GET_STATES.SUCCESS:
      return {
        ...state,
        states: payload ? payload.map((state) => ({ label: state, value: state })) : [],
      };

    case actionTypes.GET_LGAS_BY_STATE.SUCCESS:
      return {
        ...state,
        lgas: payload ? payload.map((lga) => ({ label: lga, value: lga })) : [],
      };

    case actionTypes.GET_REGIONS_BY_STATE.SUCCESS:
      return {
        ...state,
        regions: payload ? payload.map((region) => ({ label: region, value: region })) : [],
      };

    case actionTypes.GET_ACCOUNT_SUMMARY.SUCCESS:
      return {
        ...state,
        accountSummary: { ...payload },
      };

    case actionTypes.GET_ZAC_INFORMATION.SUCCESS:
      return {
        ...state,
        zacInformation: { ...payload },
      };

    case actionTypes.GET_ZAC_INFO_BY_STATE.SUCCESS:
      return {
        ...state,
        zacsByState: payload
          ? payload.map((zac) => ({
              label: `${truncateString(`${zac?.firstName} ${zac?.lastName} `, 18)}...`,
              value: zac?.accountNumber,
            }))
          : [],
      };

    case actionTypes.GET_PERSONAL_INFORMATION.SUCCESS:
      return {
        ...state,
        personalInformation: { ...payload },
      };

    case actionTypes.RESET_APP:
      return initialState;

    default:
      return state;
  }
};

const accountReducer = {
  initialState,
  reducer,
};

export default accountReducer;
