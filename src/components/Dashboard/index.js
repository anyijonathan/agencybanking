import { useEffect, useState, useContext } from 'react';
import { Alert, Button, Form, Tab, Table, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCircleUser,
  faCircleCheck,
  faClock,
  faPlus,
  faArrowUpWideShort,
  faDownload,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import Header from '../Header';
import CanvasJSReact from '../../utils/CanvasCharts/canvasjs.react';
import CountUp from 'react-countup';
import DatePicker from 'react-datepicker';
import NewAgentOnboarding from './NewAgentOnboarding/NewAgentOnboarding';
import './Dashboard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import background from '../../assets/images/dashboard-summary-single-card.png';
import { Store } from '../../store';
import { getStoredToken } from '../../utils/helpers/auth';
import axios from '../../config/Axios';
import { useMemo } from 'react';
import { getZacDashboardData } from '../../store/actions';

const DF = null;
const DT = new Date().toISOString();

const Dashboard = () => {
  const token = getStoredToken();
  const {
    state: {
      auth: { authData },
    },
    dispatch,
  } = useContext(Store);

  const [key, setKey] = useState('home');
  const [keyP, setKeyP] = useState('agent');
  const [keyM, setKeyM] = useState('aggregator-agent');
  const [keyY, setKeyY] = useState('top-zac');
  const [modalShow, setModalShow] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [filteredZACResults, setFilteredZACResults] = useState([]);
  const [filteredFDOResults, setFilteredFDOResults] = useState([]);
  const [filteredAGSResults, setFilteredAGSResults] = useState([]);
  const [filteredAGGResults, setFilteredAGGResults] = useState([]);
  const [filteredZAGSResults, setFilteredZAGSResults] = useState([]);
  const [filteredZAGGResults, setFilteredZAGGResults] = useState([]);
  const [filteredZASResults, setFilteredZASResults] = useState([]);
  const [filteredaggregatorLeadResults, setFilteredaggregatorLeadResults] = useState([]);
  const [filteredAgentsResults, setFilteredAgentsResults] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dateFilter, setDateFIlter] = useState([]);
  const memoizeDateFilter = useMemo(() => dateFilter, [dateFilter]);

  useEffect(() => {
    if (memoizeDateFilter.length) {
      fetchZonalAGSs(memoizeDateFilter[0].toISOString(), memoizeDateFilter[1].toISOString());
    }
  }, [memoizeDateFilter]);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (dates[1]) {
      setDateFIlter(dates);
      // handleDateFilter(start.toISOString(), end.toISOString())
      setIsOpen(!isOpen);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const [ZACDetailsList, setZACDetailsList] = useState([]);
  const [FDODetailsList, setFDODetailsList] = useState([]);
  const [AGSDetailsList, setAGSDetailsList] = useState([]);
  const [ALGDetailsList, setALGDetailsList] = useState([]);
  const [AGGDetailsList, setAGGDetailsList] = useState([]);
  const [AGDetailsList, setAGDetailsList] = useState([]);
  const [ZAGSDetailsList, setZAGSDetailsList] = useState([]);
  const [ZLAGSDetailsList, setZLAGSDetailsList] = useState([]);
  const [ZAGGSDetailsList, setZAGGSDetailsList] = useState([]);
  const [ZASDetailsList, setZASDetailsList] = useState([]);
  const [ZACDataPoints, setZACDataPoints] = useState([]);
  const [agentDetailsList, setAgentDetailsList] = useState([]);
  const [aggregatorDetailsList, setAggregatorDetailsList] = useState([]);
  const [leadAggregatorDetailsList, setLeadAggregatorDetailsList] = useState([]);
  const [totalAgents, setTotalAgents] = useState();
  const [totalAggregators, setTotalAggregators] = useState();
  const [numberOfZACs, setNumberOfZACs] = useState();
  const [numberOfFDOs, setNumberOfFDOs] = useState();
  const [numberOfAGSs, setNumberOfAGSs] = useState();
  const [numberOfALGs, setNumberOfALGs] = useState();
  const [numberOfAGGs, setNumberOfAGGs] = useState();
  const [numberOfAGs, setNumberOfAGs] = useState();
  const [numberOfZAGSs, setNumberOfZAGSs] = useState();
  const [numberOfZLAGSs, setNumberOfZLAGSs] = useState();
  const [numberOfZAGGSs, setNumberOfZAGGSs] = useState();
  const [totalCompleted, setTotalCompleted] = useState();
  const [numberOfZASs, setNumberOfZASs] = useState();
  const [totalPending, setTotalPending] = useState();

  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const chartOptions = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: 'Top States',
      fontFamily: 'Gotham-Medium',
    },
    data: [
      {
        type: 'doughnut',
        startAngle: 75,
        toolTipContent: '<b>{label}</b>: {y}%',
        showInLegend: 'true',
        legendText: '{label}',
        indexLabelFontSize: 16,
        indexLabel: '{label} - {y}%',
        dataPoints: ZACDataPoints,
      },
    ],
  };

  const cChartOptions = {
    title: {
      text: 'Agent Onboarding Application',
      fontFamily: 'Gotham-Medium',
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: 'column',
        dataPoints: [
          { label: 'Completed Application', y: 50 },
          { label: 'Pending Application', y: 35 },
          { label: 'Closed Application', y: 15 },
        ],
      },
    ],
  };

  // ********* Super Admin Module ******** //

  //Get All ZACs

  const fetchZACs = async () => {
    const res = await axios.get('SuperAdmin/GetAllZac');
    if (res.data.code === '00') {
      setZACDetailsList(res.data.data || []);
      setNumberOfZACs(res.data.data.length || 0);
    }
  };

  //Get All Front Desk Officers

  const fetchFDOs = async () => {
    const res = await axios.get('SuperAdmin/GetAllFrontDesk');
    if (res.data.code === '00') {
      setFDODetailsList(res.data.data || []);
      setNumberOfFDOs(res.data.data.length || 0);
    }
  };

  //Get All Agent Supervisors

  const fetchAGSs = async () => {
    const res = await axios.get('SuperAdmin/GetAllAgentSupervisors');
    if (res.data.code === '00') {
      setAGSDetailsList(res.data.data || []);
      setNumberOfAGSs(res.data.data.length || 0);
    }
  };

  //Get All Lead Aggregators

  const fetchALGs = async () => {
    const res = await axios.get('SuperAdmin/GetAllLeadAggregator');
    if (res.data.code === '00') {
      setALGDetailsList(res.data.data || []);
      setNumberOfALGs(res.data.data.length || 0);
    }
  };

  //Get All Aggregators

  const fetchAGGs = async () => {
    const res = await axios.get('SuperAdmin/GetAllAggregators');
    if (res.data.code === '00') {
      setAGGDetailsList(res.data.data || []);
      setNumberOfAGGs(res.data.data.length || 0);
    }
  };

  //Get All Agents

  const fetchAGs = async () => {
    const res = await axios.get('SuperAdmin/GetAllAgents');
    if (res.data.code === '00') {
      setAGDetailsList(res.data.data || []);
      setNumberOfAGs(res.data.data.length || 0);
    }
  };

  // ********** End Of Super Admin ************* //

  // *********** Zonal Agent Cordinator ********* //

  //Get ZAC Chart Datapoints
  const fetchZACDataPoints = async () => {
    const res = await axios.get('ZonalAgent/GetTopStates');
    if (res.data.code === '00') {
      setZACDataPoints(res.data.data || []);
    }
  };

  //Get Agent Supervisors Under ZAC and Super Admin

  const fetchZonalAGSs = async (dateFrom = DF, dateTo = DT) => {
    const url =
      authData?.RoleName === 'SuperAdmin'
        ? 'SuperAdmin/GetAllAgentSupervisorWithFilter'
        : 'ZonalAgent/GetAllAgentSupervisorWithFilter';
    const res = await axios.post(url, { dateFrom, dateTo });
    if (res.data.code === '00') {
      const len = res.data.data.length;
      const data = res.data.data;
      setZAGSDetailsList(data);
      setNumberOfZAGSs(len);
    }
  };

  //Get Lead Aggregators Under ZAC

  const fetchZonalLAGSs = async (dateFrom = DF, dateTo = DT) => {
    const url =
      authData?.RoleName === 'SuperAdmin'
        ? 'SuperAdmin/GetAllLeadAggregatorPlusTotalAgent'
        : 'ZonalAgent/GetAllLeadAggregatorPlusTotalAgent';
    const res = await axios.post(url, { dateFrom, dateTo });
    if (res.data.code === '00') {
      setZLAGSDetailsList(res.data.data || []);
      setNumberOfZLAGSs(res.data.data.length || 0);
    }
  };

  //Get Aggregators Under ZAC and Super Admin

  const fetchZonalAGGSs = async (dateFrom = DF, dateTo = DT) => {
    const url =
      authData?.RoleName === 'SuperAdmin'
        ? 'SuperAdmin/GetAllAggregatorPlusTotalAgent'
        : 'ZonalAgent/GetAllAggregatorPlusTotalAgent';
    const res = await axios.post(url, { dateFrom, dateTo });
    if (res.data.code === '00') {
      setZAGGSDetailsList(res.data.data || []);
      setNumberOfZAGGSs(res.data.data.length || 0);
    }
  };

  //Get Agents Under ZAC

  const fetchZonalAGs = async (dateFrom = DF, dateTo = DT) => {
    const url =
      authData?.RoleName === 'SuperAdmin'
        ? 'SuperAdmin/GetAllAgentPlusFilter'
        : 'ZonalAgent/GetAllAgentPlusFilter';
    const res = await axios.post(url, { dateFrom, dateTo });
    if (res.data.code === '00') {
      setZASDetailsList(res.data.data || []);
      setNumberOfZASs(res.data.data.length || 0);
    }
  };

  const fetchAggregatorDashboardInformation = async () => {
    const res = await axios.get('Dashboards/GetDashboard');
    if (res.data.code === '00') {
      const data = res.data.data;
      setTotalAgents(data?.totalAgents || 0);
      setTotalCompleted(data?.totalCompleted || 0);
      setTotalPending(data?.totalPending || 0);
      setTotalAggregators(data?.totalAggregators || 0);
      setAgentDetailsList(data?.agentList || []);
      setAggregatorDetailsList(data?.aggregatorList || []);
      setLeadAggregatorDetailsList(data?.leadAggregatorList || []);
    }
  };

  useEffect(() => {
    // fetchAggregatorDashboardInformation()
    dispatch(getZacDashboardData(DF, DT));

    if (authData?.RoleName === 'SuperAdmin') {
      fetchZACs();
      fetchFDOs();
      fetchAGSs();
      fetchALGs();
      fetchAGGs();
      fetchAGs();

      fetchZonalAGSs();
      fetchZonalLAGSs();
      fetchZonalAGGSs();
      fetchZonalAGs();
      fetchZACDataPoints();
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      fetchZonalAGSs();
      fetchZonalLAGSs();
      fetchZonalAGGSs();
      fetchZonalAGs();
      fetchZACDataPoints();
    }
  }, []);

  const handleDateFilter = (start, end) => {
    fetchZonalAGSs(start, end);
    // fetchZonalLAGSs(start, end)
    // fetchZonalAGGSs(start, end)
    // fetchZonalAGs(start, end)
  };

  const agentTableList = AGDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const agentsTableList = agentDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const aggregatorLeadTableList = aggregatorDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const leadAggregatorTableList = leadAggregatorDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>
          <a href={'/dashboard/agent-information/?applicationID=' + info.accountNumber}>
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const topZonalAgentCoordinatorTableList = ZACDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>{info.totalagent}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const topFrontDeskOfficerTableList = FDODetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
      </tr>
    );
  });
  const topAgentSupervisorTableList = AGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>{info.phoneNumber}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const topLeadAggretatorTableList = ALGDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>{info.phoneNumber}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const topAggregatorTableList = AGGDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>{info.phoneNumber}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });
  const zonalAgentCoordinatorAGSTableList = ZAGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  const zonalAgentCoordinatorLAGSTableList = ZLAGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  const zonalAgentCoordinatorAGGSTableList = ZAGGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  const zonalAgentCoordinatorASTableList = ZASDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>{info.region}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
    if (searchValue !== '') {
      const filteredResults = AGDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredAgentsResults = agentDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredaggregatorLeadResults = aggregatorDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredZACResults = ZACDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredFDOResults = FDODetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredAGSResults = AGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredAGGResults = AGGDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredZAGSResults = ZAGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredZAGGResults = ZAGGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      const filteredZASResults = ZASDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValue);
      });

      setFilteredResults(filteredResults);
      setFilteredZACResults(filteredZACResults);
      setFilteredFDOResults(filteredFDOResults);
      setFilteredAGSResults(filteredAGSResults);
      setFilteredAGGResults(filteredAGGResults);
      setFilteredZAGSResults(filteredZAGSResults);
      setFilteredZAGGResults(filteredZAGGResults);
      setFilteredZASResults(filteredZASResults);
      setFilteredaggregatorLeadResults(filteredaggregatorLeadResults);
      setFilteredAgentsResults(filteredAgentsResults);
    } else {
      setFilteredResults([]);
      setFilteredZACResults([]);
      setFilteredFDOResults([]);
      setFilteredAGSResults([]);
      setFilteredAGGResults([]);
      setFilteredZAGSResults([]);
      setFilteredZAGGResults([]);
      setFilteredZASResults([]);
      setFilteredaggregatorLeadResults([]);
      setFilteredAgentsResults([]);
    }
  };

  const filteredAgentTableList = filteredResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const filteredAgentsTableList = filteredAgentsResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const filteredAgregatorLeadTableList = filteredaggregatorLeadResults.map((info) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.phoneNumber}
          </Alert>
        </td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const filteredZACDetailsList = filteredZACResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
        <td>{info.totalagent}</td>
        <td>
          <a
            href={
              '/dashboard/agent-information/?applicationID=' +
              info.accountNumber +
              '&uID=' +
              authData?.AccountNumber +
              '&uRoleID=' +
              authData?.RoleName +
              '&uTotalAgent=' +
              info.totalagent +
              '&uState=' +
              info.state
            }
          >
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const filteredFDODetailsList = filteredFDOResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
      </tr>
    );
  });

  const filteredAGSDetailsList = filteredAGSResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.phoneNumber}</td>
      </tr>
    );
  });

  const filteredAGGDetailsList = filteredAGGResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.phoneNumber}</td>
      </tr>
    );
  });

  const filteredZAGSDetailsList = filteredZAGSResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  const filteredZAGGDetailsList = filteredZAGGResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  const filteredZASDetailsList = filteredZASResults.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

  return (
    <>
      <Header
        height="90px"
        marginTop="0px"
        accountNumber={authData?.AccountNumber}
        roleName={authData?.RoleName}
        stage={authData?.Stage}
        token={token}
      />
      <div className="tabs-container">
        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="home" title="Home">
            <div className="dashboard-top-fragment">
              <span className="dashboard-user-name-span">Welcome {authData?.Name} 👋🏾</span>
              <Button onClick={handleClick} className="btn dashboard-date-picker-button">
                <FontAwesomeIcon icon={faCalendarDays} />
                Select Period
              </Button>
              {isOpen && (
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              )}
            </div>
            <span className="dashboard-overview-span">
              Here is an overview of new, pending, successful agents you have onboarded.
            </span>
            <div className="dashboard-summary-cards">
              <div className="single-summary-card">
                {authData?.RoleName === 'SuperAdmin' ? (
                  <span className="single-summary-card-span">Total Zonal Agent Coordinators</span>
                ) : (
                  <span className="single-summary-card-span">Total Number of Agents</span>
                )}
                <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faCircleUser} />
                {authData?.RoleName === 'SuperAdmin' ? (
                  <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                    {numberOfZACs > 0 ? <CountUp duration={5.75} end={numberOfZACs} /> : '0'}
                  </span>
                ) : authData?.RoleName === 'Zonal Agent Cordinator' ? (
                  <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                    <CountUp duration={3.75} end={numberOfZASs} />
                  </span>
                ) : (
                  <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                    {agentDetailsList.length > 0 ? (
                      <CountUp duration={3.75} end={agentDetailsList.length} />
                    ) : (
                      '0'
                    )}
                  </span>
                )}
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>
              {authData?.RoleName === 'Zonal Agent Cordinator' && (
                <div className="single-summary-card">
                  <span className="single-summary-card-span">Total Agent Supervisor</span>
                  <FontAwesomeIcon
                    style={{ float: 'right', color: '#5C2682' }}
                    icon={faCircleUser}
                  />
                  <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                    {numberOfZAGSs > 0 ? <CountUp duration={3.75} end={numberOfZAGSs} /> : '0'}
                  </span>
                  <img
                    src={background}
                    className="dashboard-summary-card-background"
                    alt="dashboard-summary-card-background"
                  />
                </div>
              )}
              <div className="single-summary-card">
                {authData?.RoleName === 'SuperAdmin' ? (
                  <span className="single-summary-card-span">Total Front Desk Reps.</span>
                ) : (
                  <span className="single-summary-card-span">Total Number of Aggregators</span>
                )}
                <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faCircleUser} />
                {authData?.RoleName === 'SuperAdmin' ? (
                  <span style={{ color: '#008C38' }} className="single-summary-card-span-1">
                    {numberOfFDOs > 0 ? <CountUp duration={5.75} end={numberOfFDOs} /> : '0'}
                  </span>
                ) : authData?.RoleName === 'Zonal Agent Cordinator' ? (
                  <span style={{ color: '#008C38' }} className="single-summary-card-span-1">
                    {numberOfZLAGSs > 0 ? <CountUp duration={3.75} end={numberOfZLAGSs} /> : '0'}
                  </span>
                ) : (
                  <span style={{ color: '#008C38' }} className="single-summary-card-span-1">
                    {aggregatorDetailsList.length > 0 ? (
                      <CountUp duration={3.75} end={aggregatorDetailsList.length} />
                    ) : (
                      '0'
                    )}
                  </span>
                )}
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>
              {authData?.RoleName === 'Zonal Agent Cordinator' ? (
                ''
              ) : (
                <div className="single-summary-card">
                  {authData?.RoleName === 'SuperAdmin' ? (
                    <span className="single-summary-card-span">Total Agent Supervisors</span>
                  ) : (
                    <span className="single-summary-card-span">Completed Forms</span>
                  )}
                  <FontAwesomeIcon
                    style={{ float: 'right', color: '#5C2682' }}
                    icon={faCircleCheck}
                  />
                  {authData?.RoleName === 'SuperAdmin' ? (
                    <span style={{ color: '#FFAA00' }} className="single-summary-card-span-1">
                      {numberOfAGSs > 0 ? <CountUp duration={5.75} end={numberOfAGSs} /> : '0'}
                    </span>
                  ) : (
                    <span style={{ color: '#FFAA00' }} className="single-summary-card-span-1">
                      {agentTableList.length > 0 ? (
                        <CountUp duration={3.75} end={totalCompleted} />
                      ) : (
                        '0'
                      )}
                    </span>
                  )}
                  <img
                    src={background}
                    className="dashboard-summary-card-background"
                    alt="dashboard-summary-card-background"
                  />
                </div>
              )}
            </div>
            <div className="dashboard-summary-cards">
              {authData?.RoleName === 'AgentSupervisor' ||
                (authData?.RoleName === 'SuperAdmin' && (
                  <div className="single-summary-card">
                    <span className="single-summary-card-span">Total Aggregators</span>
                    <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faClock} />
                    <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                      {numberOfAGGs > 0 ? <CountUp duration={3.75} end={numberOfAGGs} /> : '0'}
                    </span>
                    <img
                      src={background}
                      className="dashboard-summary-card-background"
                      alt="dashboard-summary-card-background"
                    />
                  </div>
                ))}
              {authData?.RoleName === 'AgentSupervisor' ||
                (authData?.RoleName === 'SuperAdmin' && (
                  <div className="single-summary-card">
                    <span className="single-summary-card-span">Total Agents</span>
                    <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faClock} />
                    <span style={{ color: '#5C2682' }} className="single-summary-card-span-1">
                      {numberOfAGs > 0 ? <CountUp duration={3.75} end={numberOfAGs} /> : '0'}
                    </span>
                    <img
                      src={background}
                      className="dashboard-summary-card-background"
                      alt="dashboard-summary-card-background"
                    />
                  </div>
                ))}
            </div>
            {authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator' ? (
              <div></div>
            ) : (
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => searchItems(e.target.value)}
                      type="text"
                      className="search-for-agents-input"
                      placeholder="Search for agents"
                    />
                  </Form.Group>
                </Form>
                <Button onClick={() => setModalShow(true)} className="button-create-agent">
                  <span className="btn-create-agent-text">
                    <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faPlus} size="lg" /> Create
                    Agent
                  </span>
                </Button>
                <CSVLink filename={'agents_list.csv'} data={agentDetailsList}>
                  <Button className="button-download-report">
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </Button>
                </CSVLink>
              </div>
            )}
            {authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator' ? (
              <Tabs
                id="controlled-tab-example"
                activeKey={keyY}
                style={{ paddingLeft: '100px' }}
                onSelect={(k) => setKeyY(k)}
              >
                {authData?.RoleName && authData?.RoleName === 'SuperAdmin' ? (
                  <Tab eventKey="top-zac" title="Top Zonal Agent Coordinator">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '700px' }} className="agents-list-span-heading">
                        Top Zonal Agent Coordinators
                      </span>
                    </Alert>
                    {numberOfZACs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '50%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email</th>
                              <th>State</th>
                              <th>T/Agents</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{numberOfZACs > 0 && topZonalAgentCoordinatorTableList}</tbody>
                        </Table>
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                ) : (
                  <Tab eventKey="top-zac" title="Top Agent Supervisors">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '700px' }} className="agents-list-span-heading">
                        Top Agent Supervisors
                      </span>
                    </Alert>
                    {numberOfZAGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '50%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>State</th>
                              <th>Status</th>
                              <th>T/Agents</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ZAGSDetailsList.map((info, key) => {
                              return (
                                <tr key={key}>
                                  <td>{info.firstName}</td>
                                  <td>{info.lastName}</td>
                                  <td>{info.state}</td>
                                  <td>
                                    <Alert className="alert-table-action" variant="success">
                                      {info.status}
                                    </Alert>
                                  </td>
                                  <td>{info.totalAgents}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(numberOfALGs || numberOfZLAGSs) && (
                  <Tab eventKey="top-lead" title="Top Lead Aggregators">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '600px' }} className="agents-list-span-heading">
                        Top Lead Aggregators
                      </span>
                    </Alert>
                    {numberOfALGs > 0 || numberOfZLAGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        {numberOfZLAGSs > 0 ? (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>State</th>
                                <th>Status</th>
                                <th>T/Agents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {numberOfZLAGSs > 0 && zonalAgentCoordinatorLAGSTableList}
                            </tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>Email</th>
                                <th>State</th>
                                <th>T/Agents</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topLeadAggretatorTableList.length > 0 && topLeadAggretatorTableList}
                            </tbody>
                          </Table>
                        )}
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(numberOfAGGs || numberOfZAGGSs) && (
                  <Tab eventKey="top-ag" title="Top Aggregators">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Top Aggregators
                      </span>
                    </Alert>
                    {numberOfAGGs > 0 || numberOfZAGGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        {numberOfZAGGSs > 0 ? (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>State</th>
                                <th>Status</th>
                                <th>T/Agents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {numberOfZAGGSs > 0 && zonalAgentCoordinatorAGGSTableList}
                            </tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>Email</th>
                                <th>State</th>
                                <th>M/Number</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topAggregatorTableList.length > 0 && topAggregatorTableList}
                            </tbody>
                          </Table>
                        )}
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {numberOfAGSs > 0 && (
                  <Tab eventKey="top-agent" title="Top Agent Supervisors">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Top Agent Supervisors
                      </span>
                    </Alert>
                    {numberOfAGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '50%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email</th>
                              <th>State</th>
                              <th>M/Number</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topAgentSupervisorTableList.length > 0 && topAgentSupervisorTableList}
                          </tbody>
                        </Table>
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
              </Tabs>
            ) : (
              <Tabs
                id="controlled-tab-example"
                activeKey={keyP}
                style={{ paddingLeft: '100px' }}
                onSelect={(k) => setKeyP(k)}
              >
                <Tab eventKey="agent" title="Agents">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: '300px' }} className="agents-list-span-heading">
                      Sub-Agents
                    </span>
                  </Alert>
                  {agentDetailsList.length > 0 ? (
                    <Alert className="agents-list-table-alert" variant="success">
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgentsTableList.length > 0
                            ? filteredAgentsTableList
                            : agentsTableList}
                        </tbody>
                      </Table>
                    </Alert>
                  ) : (
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded wil appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                        <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                      </Button>
                    </Alert>
                  )}
                </Tab>
                {authData?.RoleName === 'SuperAdmin' ||
                  (authData?.RoleName === 'LeadAggregator' && (
                    <Tab eventKey="aggregators" title="Aggregators">
                      <Alert className="agents-list-card-alert" variant="success">
                        <span className="agents-list-span-heading">Aggregators</span>
                      </Alert>
                      {authData?.RoleName === 'SuperAdmin' ||
                      authData?.RoleName === 'LeadAggregator' ? (
                        <Alert className="agents-list-table-alert" variant="success">
                          {authData?.RoleName === 'SuperAdmin' ? (
                            <Table style={{ width: '100%' }} hover className="agents-table-list">
                              <thead className="agents-list-table-header">
                                <tr>
                                  <th>Name</th>
                                  <th></th>
                                  <th>Email Address</th>
                                  <th>Region</th>
                                  <th>M/Number</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAGGDetailsList.length > 0
                                  ? filteredAGGDetailsList
                                  : AGGDetailsList}
                              </tbody>
                            </Table>
                          ) : (
                            <Table style={{ width: '100%' }} hover className="agents-table-list">
                              <thead className="agents-list-table-header">
                                <tr>
                                  <th>Name</th>
                                  <th></th>
                                  <th>Email Address</th>
                                  <th>Region</th>
                                  <th>M/Number</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAgregatorLeadTableList.length > 0
                                  ? filteredAgregatorLeadTableList
                                  : aggregatorLeadTableList}
                              </tbody>
                            </Table>
                          )}
                        </Alert>
                      ) : (
                        <Alert className="add-agent-alert" variant="success">
                          <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                          <p>No Sub-Agent Onboarded Yet</p>
                          <p>Agents you have onboarded wil appear here.</p>
                          <Button
                            onClick={() => setModalShow(true)}
                            className="btn-account-set-save"
                          >
                            <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                          </Button>
                        </Alert>
                      )}
                    </Tab>
                  ))}
                {leadAggregatorTableList.length > 0 && (
                  <Tab eventKey="lead-aggregators" title="Lead Aggregators">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Lead Aggregators
                      </span>
                    </Alert>
                    {leadAggregatorTableList.length > 0 ? (
                      <Alert className="agents-list-table-alert" variant="success">
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAgentTableList.length > 0
                              ? filteredAgentTableList
                              : leadAggregatorTableList}
                          </tbody>
                        </Table>
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
              </Tabs>
            )}
          </Tab>
          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="zonal-agent-coordinator" title="Zonal Agent Coordinator">
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => searchItems(e.target.value)}
                      type="text"
                      className="search-for-agents-input"
                      placeholder="Search for agents"
                    />
                  </Form.Group>
                </Form>
                <Button style={{ width: '190px' }} className="button-create-agent">
                  <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faArrowUpWideShort} /> Sort
                  by
                </Button>
                <Button
                  onClick={handleClick}
                  style={{ marginTop: '20px' }}
                  className="btn dashboard-date-picker-button"
                >
                  <FontAwesomeIcon icon={faCalendarDays} />
                  Select Period
                </Button>
                {isOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                )}
              </div>
              <Alert className="agents-list-card-alert" variant="success">
                <span style={{ width: '600px' }} className="agents-list-span-heading">
                  Zonal Agent Coordinator
                </span>
              </Alert>
              <Alert className="agents-list-table-alert" variant="success">
                <Table style={{ width: '100%' }} hover className="agents-table-list">
                  <thead className="agents-list-table-header">
                    <tr>
                      <th>Name</th>
                      <th></th>
                      <th>Email Address</th>
                      <th>State</th>
                      <th>Total Agents</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZACDetailsList.length > 0
                      ? filteredZACDetailsList
                      : topZonalAgentCoordinatorTableList}
                  </tbody>
                </Table>
              </Alert>
            </Tab>
          )}
          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="front-desk-rep" title="Front Desk Rep.">
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => searchItems(e.target.value)}
                      type="text"
                      className="search-for-agents-input"
                      placeholder="Search for agents"
                    />
                  </Form.Group>
                </Form>
                <Button style={{ width: '190px' }} className="button-create-agent">
                  <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faArrowUpWideShort} /> Sort
                  by
                </Button>
                <Button
                  onClick={handleClick}
                  style={{ marginTop: '20px' }}
                  className="btn dashboard-date-picker-button"
                >
                  <FontAwesomeIcon icon={faCalendarDays} />
                  Select Period
                </Button>
                {isOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                )}
              </div>
              <Alert className="agents-list-card-alert" variant="success">
                <span style={{ width: '600px' }} className="agents-list-span-heading">
                  Front Desk Representative
                </span>
              </Alert>
              <Alert className="agents-list-table-alert" variant="success">
                <Table style={{ width: '100%' }} hover className="agents-table-list">
                  <thead className="agents-list-table-header">
                    <tr>
                      <th>Name</th>
                      <th></th>
                      <th>Email Address</th>
                      <th>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFDODetailsList.length > 0
                      ? filteredFDODetailsList
                      : topFrontDeskOfficerTableList}
                  </tbody>
                </Table>
              </Alert>
            </Tab>
          )}
          {(authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator') && (
            <Tab eventKey="agent-supervisor" title="Agent Supervisor">
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => searchItems(e.target.value)}
                      type="text"
                      className="search-for-agents-input"
                      placeholder="Search for agents"
                    />
                  </Form.Group>
                </Form>
                <Button style={{ width: '190px' }} className="button-create-agent">
                  <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faArrowUpWideShort} /> Sort
                  by
                </Button>
                <Button
                  onClick={handleClick}
                  style={{ marginTop: '20px' }}
                  className="btn dashboard-date-picker-button"
                >
                  <FontAwesomeIcon icon={faCalendarDays} />
                  Select Period
                </Button>
                {isOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                )}
              </div>
              <Alert className="agents-list-card-alert" variant="success">
                <span style={{ width: '600px' }} className="agents-list-span-heading">
                  Agent Supervisor
                </span>
              </Alert>
              <Alert className="agents-list-table-alert" variant="success">
                {numberOfZAGSs > 0 ? (
                  <>
                    <Table style={{ width: '100%' }} hover className="agents-table-list">
                      <thead className="agents-list-table-header">
                        <tr>
                          <th>Name</th>
                          <th></th>
                          <th>State</th>
                          <th>Status</th>
                          <th>T/Agents</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredZAGSDetailsList.length > 0
                          ? filteredZAGSDetailsList
                          : zonalAgentCoordinatorAGSTableList}
                      </tbody>
                    </Table>
                    <Button className="btn-delete-agent">
                      <span className="btn-delete-agent-text">
                        <FontAwesomeIcon style={{ color: '#7F1D1D' }} icon={faTrashCan} /> Delete
                        Agent Supervisor
                      </span>
                    </Button>
                  </>
                ) : (
                  <Table style={{ width: '100%' }} hover className="agents-table-list">
                    <thead className="agents-list-table-header">
                      <tr>
                        <th>Name</th>
                        <th></th>
                        <th>Email Address</th>
                        <th>Region</th>
                        <th>M/Number</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAGSDetailsList.length > 0
                        ? filteredAGSDetailsList
                        : topAgentSupervisorTableList}
                    </tbody>
                  </Table>
                )}
              </Alert>
            </Tab>
          )}
          <Tab eventKey="aggregator" title="Aggregator">
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control
                    onChange={(e) => searchItems(e.target.value)}
                    type="text"
                    className="search-for-agents-input"
                    placeholder="Search for agents"
                  />
                </Form.Group>
              </Form>
              <Button style={{ width: '190px' }} className="button-create-agent">
                <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faArrowUpWideShort} /> Sort by
              </Button>
              <Button
                onClick={handleClick}
                style={{ marginTop: '20px' }}
                className="btn dashboard-date-picker-button"
              >
                <FontAwesomeIcon icon={faCalendarDays} />
                Select Period
              </Button>
              {isOpen && (
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              )}
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyM}
              style={{ paddingLeft: '100px' }}
              onSelect={(k) => setKeyM(k)}
            >
              {(authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'LeadAggregator') && (
                <Tab eventKey="aggregator" title="Aggregators">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span className="agents-list-span-heading">Aggregators</span>
                  </Alert>
                  {authData?.RoleName === 'SuperAdmin' ||
                  authData?.RoleName === 'LeadAggregator' ? (
                    <Alert className="agents-list-table-alert" variant="success">
                      {numberOfZAGGSs > 0 ? (
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>State</th>
                              <th>Status</th>
                              <th>T/Agents</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredZAGGDetailsList.length > 0
                              ? filteredZAGGDetailsList
                              : zonalAgentCoordinatorAGGSTableList}
                          </tbody>
                        </Table>
                      ) : (
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>M/Number</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredaggregatorLeadResults.length > 0
                              ? filteredAgregatorLeadTableList
                              : aggregatorLeadTableList}
                          </tbody>
                        </Table>
                      )}
                    </Alert>
                  ) : (
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded wil appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                        <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                      </Button>
                    </Alert>
                  )}
                </Tab>
              )}
              <Tab eventKey="aggregator-agent" title="Agents ">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: '300px' }} className="agents-list-span-heading">
                    Agents
                  </span>
                </Alert>
                {agentDetailsList.length > 0 || numberOfZASs > 0 ? (
                  <Alert className="agents-list-table-alert" variant="success">
                    {numberOfZASs > 0 ? (
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredZASDetailsList.length > 0
                            ? filteredZASDetailsList
                            : zonalAgentCoordinatorASTableList}
                        </tbody>
                      </Table>
                    ) : (
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgentsTableList.length > 0
                            ? filteredAgentsTableList
                            : agentsTableList}
                        </tbody>
                      </Table>
                    )}
                  </Alert>
                ) : (
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded wil appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                      <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                    </Button>
                  </Alert>
                )}
              </Tab>

              {leadAggregatorTableList.length > 0 && (
                <Tab eventKey="lead-aggregators" title="Lead Aggregators">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: '300px' }} className="agents-list-span-heading">
                      Lead Aggregators
                    </span>
                  </Alert>
                  {leadAggregatorTableList.length > 0 ? (
                    <Alert className="agents-list-table-alert" variant="success">
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgentTableList.length > 0
                            ? filteredAgentTableList
                            : leadAggregatorTableList}
                        </tbody>
                      </Table>
                    </Alert>
                  ) : (
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded wil appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                        <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                      </Button>
                    </Alert>
                  )}
                </Tab>
              )}
            </Tabs>
          </Tab>

          <Tab eventKey="agents" title="Agent">
            <div className="dashboard-top-fragment">
              <span style={{ paddingLeft: '30px' }} className="dashboard-user-name-span">
                Agents
              </span>
              <Button
                onClick={handleClick}
                style={{ marginLeft: '195px' }}
                className="btn dashboard-date-picker-button"
              >
                <FontAwesomeIcon icon={faCalendarDays} />
                Select Period
              </Button>
              {isOpen && (
                <DatePicker
                  selected={startDate}
                  onChange={handleChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              )}
            </div>
            <span style={{ paddingLeft: '102px' }} className="dashboard-overview-span">
              Here is a list of all agents you have onboarded.
            </span>
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control
                    onChange={(e) => searchItems(e.target.value)}
                    type="text"
                    className="search-for-agents-input"
                    placeholder="Search for agents"
                  />
                </Form.Group>
              </Form>
              <Button
                style={{ width: '190px' }}
                onClick={() => setModalShow(true)}
                className="button-create-agent"
              >
                <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faPlus} size="lg" /> Create
                Sub-Agent
              </Button>
              <CSVLink filename={'agents_list.csv'} data={agentDetailsList}>
                <Button className="button-download-report">
                  <FontAwesomeIcon icon={faDownload} /> Download
                </Button>
              </CSVLink>
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyP}
              style={{ paddingLeft: '100px' }}
              onSelect={(k) => setKeyP(k)}
            >
              <Tab eventKey="agent" title="Agents">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: '300px' }} className="agents-list-span-heading">
                    Agents
                  </span>
                </Alert>
                {agentsTableList.length > 0 || numberOfZASs > 0 ? (
                  <Alert className="agents-list-table-alert" variant="success">
                    {numberOfZASs > 0 ? (
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Location</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredZASDetailsList.length > 0
                            ? filteredZASDetailsList
                            : zonalAgentCoordinatorASTableList}
                        </tbody>
                      </Table>
                    ) : (
                      <Table style={{ width: '100%' }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAgentsTableList.length > 0
                            ? filteredAgentsTableList
                            : agentsTableList}
                        </tbody>
                      </Table>
                    )}
                  </Alert>
                ) : (
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded wil appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                      <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                    </Button>
                  </Alert>
                )}
              </Tab>
            </Tabs>
          </Tab>

          {(authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator') && (
            <Tab eventKey="report" title="Report">
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => searchItems(e.target.value)}
                      type="text"
                      className="search-for-agents-input"
                      placeholder="Search for agents"
                    />
                  </Form.Group>
                </Form>
                <Button style={{ width: '190px' }} className="button-create-agent">
                  <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faArrowUpWideShort} /> Sort
                  by
                </Button>
                <Button
                  onClick={handleClick}
                  style={{ marginTop: '20px' }}
                  className="btn dashboard-date-picker-button"
                >
                  <FontAwesomeIcon icon={faCalendarDays} />
                  Select Period
                </Button>
                {isOpen && (
                  <DatePicker
                    selected={startDate}
                    onChange={handleChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                  />
                )}
              </div>
              <Alert className="agents-list-card-alert" variant="success">
                <span style={{ width: '600px' }} className="agents-list-span-heading">
                  Report
                </span>
              </Alert>
              <Tabs
                id="controlled-tab-example"
                activeKey={keyY}
                style={{ paddingLeft: '100px' }}
                onSelect={(k) => setKeyY(k)}
              >
                {topZonalAgentCoordinatorTableList && (
                  <Tab eventKey="top-zac" title="Top Zonal Agent Coordinator">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '700px' }} className="agents-list-span-heading">
                        Top Zonal Agent Coordinators
                      </span>
                    </Alert>
                    {topZonalAgentCoordinatorTableList.length > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '50%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email</th>
                              <th>State</th>
                              <th>T/Agents</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topZonalAgentCoordinatorTableList.length > 0 &&
                              topZonalAgentCoordinatorTableList}
                          </tbody>
                        </Table>
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(topLeadAggretatorTableList || zonalAgentCoordinatorLAGSTableList) && (
                  <Tab eventKey="top-lead" title="Top Lead Aggregators">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '600px' }} className="agents-list-span-heading">
                        Top Lead Aggregators
                      </span>
                    </Alert>
                    {topLeadAggretatorTableList.length > 0 ||
                    zonalAgentCoordinatorLAGSTableList.length > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        {numberOfZLAGSs > 0 ? (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>State</th>
                                <th>Status</th>
                                <th>T/Agents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {numberOfZLAGSs > 0 && zonalAgentCoordinatorLAGSTableList}
                            </tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>Email</th>
                                <th>State</th>
                                <th>M/Number</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topLeadAggretatorTableList.length > 0 && topLeadAggretatorTableList}
                            </tbody>
                          </Table>
                        )}
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(topAggregatorTableList || numberOfZAGGSs) && (
                  <Tab eventKey="top-ag" title="Top Aggregators">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Top Aggregators
                      </span>
                    </Alert>
                    {topAggregatorTableList.length > 0 || numberOfZAGGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        {numberOfZAGGSs > 0 ? (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>State</th>
                                <th>Status</th>
                                <th>T/Agents</th>
                              </tr>
                            </thead>
                            <tbody>
                              {numberOfZAGGSs > 0 && zonalAgentCoordinatorAGGSTableList}
                            </tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>Email</th>
                                <th>State</th>
                                <th>M/Number</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topAggregatorTableList.length > 0 && topAggregatorTableList}
                            </tbody>
                          </Table>
                        )}
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(topAgentSupervisorTableList || numberOfZAGSs) && (
                  <Tab eventKey="top-agent" title="Top Agent Supervisors">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Top Agent Supervisors
                      </span>
                    </Alert>
                    {topAgentSupervisorTableList.length > 0 || numberOfZAGSs > 0 ? (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        {numberOfZAGSs > 0 ? (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>State</th>
                                <th>Status</th>
                                <th>T/Agents</th>
                              </tr>
                            </thead>
                            <tbody>{numberOfZAGSs > 0 && zonalAgentCoordinatorAGSTableList}</tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '50%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>Name</th>
                                <th></th>
                                <th>Email</th>
                                <th>State</th>
                                <th>M/Number</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topAgentSupervisorTableList.length > 0 &&
                                topAgentSupervisorTableList}
                            </tbody>
                          </Table>
                        )}
                        <CanvasJSChart
                          options={chartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded wil appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </Tab>
                )}
                {(authData?.RoleName === 'SuperAdmin' ||
                  authData?.RoleName === 'Zonal Agent Cordinator') && (
                  <Tab eventKey="app-stats" title="Application Stats.">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: '300px' }} className="agents-list-span-heading">
                        Application Stats.
                      </span>
                    </Alert>
                    {(authData?.RoleName === 'SuperAdmin' ||
                      authData?.RoleName === 'Zonal Agent Cordinator') && (
                      <Alert
                        style={{ display: 'flex' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <CanvasJSChart
                          style={{ width: '100%' }}
                          options={cChartOptions} /* onRef={ref => this.chart = ref} */
                        />
                      </Alert>
                    )}
                  </Tab>
                )}
              </Tabs>
            </Tab>
          )}
        </Tabs>
      </div>
      <NewAgentOnboarding
        show={modalShow}
        account_number={authData?.AccountNumber}
        onHide={() => setModalShow(false)}
      />
    </>
  );
};

export default Dashboard;
//
