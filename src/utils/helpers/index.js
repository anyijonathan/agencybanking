export const handleErrorMessage = (error) => {
  return error?.response?.data?.description || 'Something went wrong, please try again later.';
};

export function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

export function combineReducers(reducers) {
  let state = Object.keys(reducers).reduce((acc, key) => ({ ...acc, [key]: reducers[key][0] }), {});
  const dispatch = async (action) =>
    typeof action === 'function'
      ? await action(dispatch, state)
      : Object.keys(reducers).forEach((key) => {
          return reducers[key][1](action);
        });

  return [state, dispatch];
}

export function removeEmptyKeys(data) {
  const obj = {};
  if (typeof data === 'object') {
    for (const keys of Object.keys(data)) {
      if (!isEmpty(data[keys])) obj[keys] = data[keys];
    }
    return obj;
  }
  return data;
}

function matchesAnyPropValue(obj, search) {
  return Object.values(obj).some((value) =>
    Array.isArray(value)
      ? value.some((v) => matchesAnyPropValue(v, search))
      : String(value)?.toLocaleLowerCase()?.includes(search)
  );
}

// Apply the given filter to the given array
function applySearch(arr, filters) {
  const search = filters.toLocaleLowerCase();
  return arr.filter((entry) => matchesAnyPropValue(entry, search));
}

export const filterHelper = (data, value) => {
  if (value === '' || !data) return data;
  return applySearch(data, value);
};

export const formatRoleName = (roleName) => {
  switch (roleName) {
    case 'LeadAggregator':
      return 'Lead Aggregator';
    case 'SuperAdmin':
      return 'Super Admin';
    case 'FrontDesk':
      return 'FrontDesk';
    case 'Zonal Agent Cordinator':
      return 'Zonal Agent Cordinator';
    case 'AgentSupervisor':
      return 'Agent Supervisor';
    case 'Agent':
      return 'Agent';
    case 'Lead aggregator':
      return 'Lead Aggregator';
    case 'Aggregator':
      return 'Aggregator';
    default:
      return roleName;
  }
};

export const truncateString = (str, length) => {
  if (typeof str !== 'string' && typeof length !== 'number') return;
  const myTruncatedString = str.substring(0, length);
  return myTruncatedString;
};

export const formatApplicationStatus = (status) => {
  switch (status) {
    case 'Active':
      return 'Active';
    case 'Disable':
      return 'Disabled';
    default:
      return status;
  }
};

export const removeTrailingSlash = (str) => {
  return str.replace(/\/$/, '');
};
