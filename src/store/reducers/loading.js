import actionTypes from "../actions/actionTypes";
const initialState = {
  loading: false,
};
const reducer = (state = initialState, action) => {
  const { type } = action;
  const regex = /(.*)_(REQUEST|SUCCESS|FAILURE)/;
  const matches = regex.exec(type);
  if (type === actionTypes.RESET_APP) {
    return initialState;
  }

  if (matches) {
    switch (matches[2]) {
      case "REQUEST": {
        return {
          loading: true,
        };
      }
      case "SUCCESS": {
        return {
          loading: false,
        };
      }
      case "FAILURE": {
        return {
          loading: false,
        };
      }
      default:
        return state;
    }
  }
  return state;
};
const loadingReducer = {
  initialState,
  reducer,
};
export default loadingReducer;
