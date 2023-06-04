import {
  authRemoveAsyncData,
  authStoreAsyncData,
} from "../../utils/helpers/auth";
import actionTypes from "../actions/actionTypes";

const initialState = {
  authData: {},
  isAuthenticated: false,
  error: {},
  success: ""
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.SET_AUTH_DATA:
      return {
        ...state,
        authData: payload,
        isAuthenticated: true,
      };
    case actionTypes.VALIDATE_ACCOUNT_OTP.SUCCESS:
      if (payload?.token) {
        authStoreAsyncData(payload);
        
        return {
          ...state,
          authData: payload?.authData,
          isAuthenticated: true,
        };
      } else {
        return { ...state }
      }

    case actionTypes.LOGIN.SUCCESS:
      if (payload?.token) {
        authStoreAsyncData(payload);
        return {
          ...state,
          authData: payload?.authData,
          isAuthenticated: true,
        };
      } else {
        return { ...state }
      }
    
      case actionTypes.ADMIN_LOGIN.SUCCESS:
        if (payload?.token) {
          authStoreAsyncData(payload);
          return {
            ...state,
            authData: payload?.authData,
            isAuthenticated: true,
          };
        } else {
          return { ...state }
        }

    case actionTypes.LOGOUT.SUCCESS:
      authRemoveAsyncData();
      return {
        ...state,
        authData: null,
        isAuthenticated: false,
      };
    case actionTypes.RESET_APP:
      return initialState;
    default:
      return state;
  }
};

const authReducer = {
  initialState,
  reducer,
};

export default authReducer;
