import axios from '../../config/Axios';
import actionTypes from './actionTypes';

//----- Zonal Cordinator Dashboard Actions Start ------

export const getZacDashboardData = (dateFrom, dateTo) => {
  const requests = [
    axios.post('ZonalAgent/GetAllAgentSupervisorWithFilter', { dateFrom, dateTo }),
    axios.post('ZonalAgent/GetAllLeadAggregatorPlusTotalAgent', { dateFrom, dateTo }),
    axios.post('ZonalAgent/GetAllAggregatorPlusTotalAgent', { dateFrom, dateTo }),
    axios.post('ZonalAgent/GetAllAgentPlusFilter', { dateFrom, dateTo }),
    axios.get('ZonalAgent/GetTopStates'),
  ];

  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_ZAC_DASHBOARD_DATA.REQUEST });
    try {
      const res = await Promise.all(requests);
      const [data1, data2, data3, data4, data5] = res;
      dispatch({
        type: actionTypes.GET_ZAC_DASHBOARD_DATA.SUCCESS,
        payload: {
          ZAGSDetailsList: data1.data?.data || [],
          allZAGSDetailsList: data1.data?.data || [],
          numberOfZAGSs: data1.data?.data.length || 0,
          ZLAGSDetailsList: data2.data?.data || [],
          numberOfZLAGSs: data2.data?.data.length || 0,
          ZAGGSDetailsList: data3.data?.data || [],
          allZAGGSDetailsList: data3.data?.data || [],
          numberOfZAGGSs: data3.data?.data.length || 0,
          ZASDetailsList: data4.data?.data || [],
          allZASDetailsList: data4.data?.data || [],
          numberOfZASs: data2.data?.data.length || 0,
          ZACDataPoints: data5.data?.data || [],
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_ZAC_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

export const getSuperAdminAgentCalendarDashboardData = (
  dateFrom = '2020-10-06T13:37:57.914Z',
  dateTo = new Date(),
  agState,
  tier
) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await axios.post('SuperAdmin/GetAllAgentPlusFilter', { dateFrom, dateTo });

      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          ZASDetailsList: res.data?.data,
          allZASDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

export const getSuperAdminAggregatorCalendarDashboardData = (
  dateFrom = '2020-10-06T13:37:57.914Z',
  dateTo = new Date(),
  agState,
  tier
) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await axios.post('SuperAdmin/GetAllAggregatorPlusTotalAgent', {
        dateFrom,
        dateTo,
      });
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          ZAGGSDetailsList: res.data?.data,
          allZAGGSDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

export const getSuperAdminLeadAggregatorCalendarDashboardData = (
  dateFrom = '2020-10-06T13:37:57.914Z',
  dateTo = new Date(),
  agState,
  tier
) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await axios.post('SuperAdmin/GetAllLeadAggregatorPlusTotalAgent', {
        dateFrom,
        dateTo,
      });
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          ALGDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

export const getSuperAdminSupervisorCalendarDashboardData = (
  dateFrom = '2020-10-06T13:37:57.914Z',
  dateTo = new Date(),
  agState,
  tier
) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await axios.post('SuperAdmin/GetAllAgentSupervisorWithFilter', {
        dateFrom,
        dateTo,
      });
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          ZAGSDetailsList: res.data?.data,
          allZAGSDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

export const getOtherUsersAgentsCalendarDashboardData = (dateFrom, dateTo, roleId = 4) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.REQUEST });
    try {
      const res = await axios.get(
        `Agent/GetSubAgents?dateFrom=${dateFrom}&dateTo=${dateTo}&userroleid=${roleId}`
      );
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.SUCCESS,
        payload: {
          agentDetailsList: res.data?.data,
          subAgentDetailsList: res.data?.data,
          allagentDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.FAILURE,
      });
    }
  };
};

export const getOtherUsersAggregatorsCalendarDashboardData = (dateFrom, dateTo, roleId = 7) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.REQUEST });
    try {
      const res = await axios.get(
        `Agent/GetSubAgents?dateFrom=${dateFrom}&dateTo=${dateTo}&userroleid=${roleId}`
      );
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.SUCCESS,
        payload: {
          aggregatorDetailsList: res.data?.data,
          allaggregatorDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.FAILURE,
      });
    }
  };
};

export const getOtherUsersLeadAggregatorsCalendarDashboardData = (dateFrom, dateTo, roleId = 6) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.REQUEST });
    try {
      const res = await axios.get(
        `Agent/GetSubAgents?dateFrom=${dateFrom}&dateTo=${dateTo}&userroleid=${roleId}`
      );
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.SUCCESS,
        payload: {
          leadAggregatorDetailsList: res.data?.data,
          ALGDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.FAILURE,
      });
    }
  };
};

export const getSuperAdminGravityCalendarDashboardData = (tier, dateFrom, dateTo) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await axios.get(
        `SuperAdmin/GetGravityReportByDateFilter?tier=${tier}&dateFrom=${
          dateFrom ? dateFrom : ''
        }&dateTo=${dateTo ? dateTo : ''}`
      );
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          GravityReportDetailsList: res.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

//----- SuperAdmin Dashboard Actions Start ------

export const getSuperAdminDashboardData = (
  dateFrom = '2020-10-06T13:37:57.914Z',
  dateTo = new Date(),
  agState,
  tier
) => {
  const requests = [
    axios.post('SuperAdmin/GetAllAgentSupervisorWithFilter', { dateFrom, dateTo }),
    axios.post('SuperAdmin/GetAllLeadAggregatorPlusTotalAgent', { dateFrom, dateTo }),
    axios.post('SuperAdmin/GetAllAggregatorPlusTotalAgent', { dateFrom, dateTo }),
    axios.post('SuperAdmin/GetAllAgentPlusFilter', { dateFrom, dateTo }),
    axios.get('ZonalAgent/GetTopStates'),

    axios.get('SuperAdmin/GetAllZac'),
    axios.get('SuperAdmin/GetAllFrontDesk'),
    axios.get('SuperAdmin/GetAllAgentSupervisors'),
    axios.get('SuperAdmin/GetAllLeadAggregator'),
    axios.get('SuperAdmin/GetAllAggregators'),
    axios.get('SuperAdmin/GetAllAgents'),
    axios.get('SuperAdmin/GetAllStatesofAgentSupervisor'),
    axios.get('SuperAdmin/GetAgentSupervisorsByState?Statename=' + agState),
    axios.get('SuperAdmin/GetAllAggregatorByState?Statename=' + agState),
    axios.get('SuperAdmin/GetAllAgentByState?Statename=' + agState),
    axios.get('SuperAdmin/GetReportSummaryChart'),
    axios.get('SuperAdmin/GetGravityReportByDateFilter?tier=' + tier),
  ];

  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.REQUEST });
    try {
      const res = await Promise.all(requests);
      const [
        data1,
        data2,
        data3,
        data4,
        data5,
        data6,
        data7,
        data8,
        data9,
        data10,
        data11,
        data12,
        data13,
        data14,
        data15,
        data16,
        data17,
      ] = res;
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.SUCCESS,
        payload: {
          ZAGSDetailsList: data1.data?.data,
          allZAGSDetailsList: data1.data?.data,
          numberOfZAGSs: data1.data?.data.length,

          ZLAGSDetailsList: data2.data?.data,
          numberOfZLAGSs: data2.data?.data.length,

          ZAGGSDetailsList: data3.data?.data,
          allZAGGSDetailsList: data3.data?.data,
          numberOfZAGGSs: data3.data?.data.length,

          ZASDetailsList: data4.data?.data,
          allZASDetailsList: data4.data?.data,
          numberOfZASs: data2.data?.data.length,

          ZACDataPoints: data5.data?.data,

          ZACDetailsList: data6.data?.data,
          allZACDetailsList: data6.data?.data,
          numberOfZACs: data6.data?.data.length,

          FDODetailsList: data7.data?.data,
          numberOfFDOs: data7.data?.data.length,

          AGSDetailsList: data8.data?.data,
          allAGSDetailsList: data8.data?.data,
          numberOfAGSs: data8.data?.data.length,

          ALGDetailsList: data9.data?.data,
          allALGDetailsList: data9.data?.data,
          numberOfALGs: data9.data?.data.length,

          AGGDetailsList: data10.data?.data,
          numberOfAGGs: data10.data?.data.length,

          AGDetailsList: data11.data?.data,
          numberOfAGs: data11.data?.data.length,

          AGSStateList: data12.data?.data,

          AGSDetailsStateList: data13.data?.data,

          AGGDetailsStateList: data14.data?.data,

          AGDetailsStateList: data15.data?.data,

          ReportSummaryChart: data16.data?.data,

          GravityReportDetailsList: data17.data?.data,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: actionTypes.GET_SUPER_ADMIN_DASHBOARD_DATA.FAILURE,
      });
    }
  };
};

// Other Users Dashboard

export const getOtherAggregatorDashboardInfo = () => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.REQUEST });
    try {
      let response = await axios.get(`Dashboards/GetDashboard`);
      if (response.data.code === '00' || response.data.code === '97') {
        const data = response.data.data;

        dispatch({
          type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.SUCCESS,
          payload: {
            totalAgents: data?.totalAgents || 0,
            totalCompleted: data?.totalCompleted || 0,
            totalPending: data?.totalPending || 0,
            totalAggregators: data?.totalAggregators || 0,
            agentDetailsList: data?.agentList || [],
            subAgentDetailsList: data?.agentList || [],
            allagentDetailsList: data?.agentList || [],
            aggregatorDetailsList: data?.aggregatorList || [],
            subAggregatorDetailsList: data?.aggregatorList || [],
            allaggregatorDetailsList: data?.aggregatorList || [],
            leadAggregatorDetailsList: data?.leadAggregatorList || [],
          },
        });
      }
    } catch (error) {
      dispatch({
        type: actionTypes.GET_OTHER_USERS_DASHBOARD_INFO.FAILURE,
      });
    }
  };
};

export const filterData = (payload) => {
  return async (dispatch) => {
    dispatch({ type: actionTypes.FILTER_DASHBOARD_DATA, payload });
  };
};
