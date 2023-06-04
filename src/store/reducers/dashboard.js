import { filterHelper } from '../../utils/helpers';
import actionTypes from '../actions/actionTypes';

const initialState = {
  ZACDetailsList: [],
  FDODetailsList: [],
  AGSDetailsList: [],
  ALGDetailsList: [],
  AGGDetailsList: [],
  AGDetailsList: [],
  ZAGSDetailsList: [],
  ZLAGSDetailsList: [],
  ZAGGSDetailsList: [],
  ZASDetailsList: [],
  ZACDataPoints: [],
  agentDetailsList: [],
  subAgentDetailsList: [],
  aggregatorDetailsList: [],
  subAggregatorDetailsList: [],
  leadAggregatorDetailsList: [],
  GravityReportDetailsList: [],
  AGSStateList: [],
  numberOfZACs: 0,
  numberOfFDOs: 0,
  numberOfAGSs: 0,
  numberOfALGs: 0,
  numberOfAGGs: 0,
  numberOfAGs: 0,
  numberOfZAGSs: 0,
  numberOfZLAGSs: 0,
  numberOfZAGGSs: 0,
  totalCompleted: 0,
  totalAgents: 0,
  totalPending: 0,
  totalAggregators: 0,
  numberOfZASs: 0,
  allAGSDetailsList: [],
  allZAGSDetailsList: [],
  allaggregatorDetailsList: [],
  allALGDetailsList: [],
  allZAGGSDetailsList: [],
  allagentDetailsList: [],
  allZASDetailsList: [],
  allZACDetailsList: [],
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.GET_ZAC_DASHBOARD_DATA.SUCCESS:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.SUCCESS:
      return {
        ...state,
        ...payload,
      };

    case actionTypes.FILTER_DASHBOARD_DATA:
      let data = {};

      if (payload.dataType === 'supervisor') {
        data = {
          AGSDetailsList: filterHelper(state.allAGSDetailsList, payload.value),
          ZAGSDetailsList: filterHelper(state.allZAGSDetailsList, payload.value),
        };
      } else if (payload.dataType === 'aggregator') {
        data = {
          aggregatorDetailsList: filterHelper(state.allaggregatorDetailsList, payload.value),
          ZAGGSDetailsList: filterHelper(state.allZAGGSDetailsList, payload.value),
        };
      } else if (payload.dataType === 'subAggregator') {
        data = {
          subAggregatorDetailsList: filterHelper(state.allaggregatorDetailsList, payload.value),
          ZAGGSDetailsList: filterHelper(state.allZAGGSDetailsList, payload.value),
        };
      } else if (payload.dataType === 'leadSupervisor') {
        data = {
          ALGDetailsList: filterHelper(state.allALGDetailsList, payload.value),
        };
      } else if (payload.dataType === 'agent') {
        data = {
          agentDetailsList: filterHelper(state.allagentDetailsList, payload.value),
          ZASDetailsList: filterHelper(state.allZASDetailsList, payload.value),
        };
      } else if (payload.dataType === 'subAgent') {
        data = {
          subAgentDetailsList: filterHelper(state.allagentDetailsList, payload.value),
          ZASDetailsList: filterHelper(state.allZASDetailsList, payload.value),
        };
      } else if (payload.dataType === 'zonal') {
        data = {
          ZACDetailsList: filterHelper(state.allZACDetailsList, payload.value),
        };
      }

      return {
        ...state,
        ...payload,
        ...data,
      };

    case actionTypes.RESET_APP:
      return initialState;

    default:
      return state;
  }
};

const dashboardReducer = {
  initialState,
  reducer,
};

export default dashboardReducer;
