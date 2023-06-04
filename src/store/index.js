import React from "react";
import { combineReducers } from "../utils/helpers/";
import authReducer from "./reducers/auth";
import loadingReducer from "./reducers/loading";
import accountReducer from "./reducers/account";
import dashboardReducer from "./reducers/dashboard";
export const Store = React.createContext();



export default function StoreProvider(props) {
  const [state, dispatch] = combineReducers({
    auth: React.useReducer(authReducer.reducer, authReducer.initialState),
    loading: React.useReducer(
      loadingReducer.reducer,
      loadingReducer.initialState
    ),

    account: React.useReducer(
      accountReducer.reducer,
      accountReducer.initialState
    ),

    dashboard: React.useReducer(
      dashboardReducer.reducer,
      dashboardReducer.initialState
    ),
  });

  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
}
