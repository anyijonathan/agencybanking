import { useEffect, useState, useContext, useMemo } from "react"
import { Alert, Button, Form, FormSelect, Tab, Table, Tabs } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarDays, faCircleUser, faCircleCheck, faClock, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons'
import { CSVLink } from "react-csv"
import Header from "../../Header"
import CanvasJSReact from "../../../utils/CanvasCharts/canvasjs.react"
import CountUp from "react-countup"
import DatePicker from "react-datepicker"
import NewAgentOnboarding from "../NewAgentOnboarding/NewAgentOnboarding"
import "../Dashboard.scss"
import "react-datepicker/dist/react-datepicker.css"
import background from "../../../assets/images/dashboard-summary-single-card.png"
import { Store } from "../../../store"
import { getStoredToken } from "../../../utils/helpers/auth"
import { getOtherAggregatorDashboardInfo, getSuperAdminDashboardData, getZacDashboardData } from "../../../store/actions"
import LoadingIndicator from "../../../components/LoadingIndicator"
import Pagination from "../Pagination/Pagination"

let PageSize = 10;

const Dashboard = () => {
  const token = getStoredToken()
  const { state: { loading: { loading: isLoading }, auth: { authData },
    dashboard: {
      ZACDetailsList,
      FDODetailsList,
      AGSDetailsList,
      ALGDetailsList,
      AGGDetailsList,
      AGDetailsList,
      ZAGSDetailsList,
      ZLAGSDetailsList,
      ZAGGSDetailsList,
      ZASDetailsList,
      ZACDataPoints,
      agentDetailsList,
      aggregatorDetailsList,
      leadAggregatorDetailsList,
      AGSStateList,
      AGSDetailsStateList,
      AGGDetailsStateList,
      AGDetailsStateList,
      numberOfZACs,
      numberOfFDOs,
      numberOfAGSs,
      numberOfALGs,
      numberOfAGGs,
      numberOfAGs,
      numberOfZAGSs,
      numberOfZLAGSs,
      numberOfZAGGSs,
      totalCompleted,
      totalAgents,
      totalPending,
      totalAggregators,
      numberOfZASs,
      ReportSummaryChart
    }

  }, dispatch } = useContext(Store)


  const [key, setKey] = useState('home')
  const [keyP, setKeyP] = useState('agent')
  const [keyM, setKeyM] = useState('aggregator-agent')
  const [keyY, setKeyY] = useState('top-zac')
  const [modalShow, setModalShow] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [checked, setChecked] = useState([]);
  const [filteredResults, setFilteredResults] = useState([])
  const [filteredZACResults, setFilteredZACResults] = useState([])
  const [filteredFDOResults, setFilteredFDOResults] = useState([])
  const [filteredAGSResults, setFilteredAGSResults] = useState([])
  const [filteredAGGResults, setFilteredAGGResults] = useState([])
  const [filteredZAGSResults, setFilteredZAGSResults] = useState([])
  const [filteredZAGGResults, setFilteredZAGGResults] = useState([])
  const [filteredZASResults, setFilteredZASResults] = useState([])
  const [filteredaggregatorLeadResults, setFilteredaggregatorLeadResults] = useState([])
  const [filteredAgentsResults, setFilteredAgentsResults] = useState([]) 
  const [filteredLAGGResults, setFilteredLAGGResults] = useState([])

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);


    // Add/Remove checked item from list
    const handleCheck = (event) => {
      var updatedList = [...checked];
      if (event.target.checked) {
        updatedList = [...checked, event.target.value];
      } else {
        updatedList.splice(checked.indexOf(event.target.value), 1);
      }
      setChecked(updatedList);
    };
  
    // Generate string of checked items
    const checkedItems = checked.length
      ? checked.reduce((total, info) => {
          return total + ".\n" + info;
        })
      : "";
  

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (dates[1]) {
      if (authData?.RoleName === "SuperAdmin") {
        dispatch(getSuperAdminDashboardData(dates[0].toISOString(), dates[1].toISOString()))
      } else if (authData?.RoleName === "Zonal Agent Cordinator") {
        dispatch(getZacDashboardData(dates[0].toISOString(), dates[1].toISOString()))
      }
      setIsOpen(!isOpen);
    }
  };

  const handleStateChange = (agState) => {
    if (agState) {
        dispatch(getSuperAdminDashboardData(null, null, agState))
      }
  };


  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };


  var CanvasJSChart = CanvasJSReact.CanvasJSChart


  const chartOptions = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Top States",
      fontFamily: "Gotham-Medium"
    },
    data: [{
      type: "doughnut",
      startAngle: 75,
      toolTipContent: "<b>{label}</b>: {y}%",
      showInLegend: "true",
      legendText: "{label}",
      indexLabelFontSize: 16,
      indexLabel: "{label} - {y}%",
      dataPoints: ZACDataPoints
    }]
  }

  const cChartOptions = {
    title: {
      text: "Agent Onboarding Application",
      fontFamily: "Gotham-Medium"
    },
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
          { label: "Active Applications", y: ReportSummaryChart?.activeApplications },
          { label: "Closed Applications", y: ReportSummaryChart?.closedApplication },
          { label: "Completed Applications", y: ReportSummaryChart?.completedApplication },
          { label: "Pending Applications", y: ReportSummaryChart?.pendingApplication },
          { label: "Total Applications", y: ReportSummaryChart?.totalApplication }
        ]
      }
    ]
  }


  useEffect(() => {
    if (authData?.RoleName === "SuperAdmin") {
      dispatch(getSuperAdminDashboardData())
    } else if (authData?.RoleName === "Zonal Agent Cordinator") {
      dispatch(getZacDashboardData())
    } else {
      dispatch(getOtherAggregatorDashboardInfo())
    }
  }, [])


  const agentTableList = AGDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.region}</td>
          <td><Alert className="alert-table-action" variant="success">{info.phoneNumber}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName}>View Details</a></td>
        </tr>
      )
    }
  )

  const agentsTableList = agentDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.region}</td>
          <td>{info.phoneNumber}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName}>View Details</a></td>
        </tr>
      )
    }
  )


  const aggregatorLeadTableList = aggregatorDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.region}</td>
          <td>{info.phoneNumber}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName}>View Details</a></td>
        </tr>
      )
    }
  )


  const leadAggregatorTableList = ALGDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td><input value={Object.values(info)} type="checkbox" onChange={handleCheck} /></td>
          <td>{info.firstName}</td>
          <td>{info.email}</td>
          <td>{info.region}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber}>View Details</a></td>
        </tr>
      )
    }
  )

  const topFrontDeskOfficerTableList = FDODetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
        </tr>
      )
    }
  )
  const topAgentSupervisorTableList = AGSDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td>{info.phoneNumber}</td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber}>View Details</a></td>
        </tr>
      )
    }
  )

  const topLeadAggretatorTableList = ALGDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td>{info.phoneNumber}</td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )


  const topAggregatorTableList = AGGDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td>{info.phoneNumber}</td>
          <td>{info.stage}</td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )
  const zonalAgentCoordinatorAGSTableList = ZAGSDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const topZonalAgentCoordinatorTableList = ZACDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td>{info.totalagent}</td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )

  const [currentPage, setCurrentPage] = useState(1);
  const LAGSTableData = useMemo(() => {
  const firstPageIndex = (currentPage - 1) * PageSize;
  const lastPageIndex = firstPageIndex + PageSize;
    return ZLAGSDetailsList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);


  const zonalAgentCoordinatorLAGSTableList = LAGSTableData.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const zonalAgentCoordinatorLAGSDefaultTableList = ZLAGSDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )
  
  const [currentPage1, setCurrentPage1] = useState(1);
  const ZAGGSTableData = useMemo(() => {
  const firstPageIndex1 = (currentPage1 - 1) * PageSize;
  const lastPageIndex1 = firstPageIndex1 + PageSize;
    return ZAGGSDetailsList.slice(firstPageIndex1, lastPageIndex1);
  }, [currentPage1]);

  const zonalAgentCoordinatorAGGSTableList = ZAGGSTableData.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const zonalAgentCoordinatorAGGSDefaultTableList = ZAGGSDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td><input value={Object.values(info)} type="checkbox" onChange={handleCheck} /></td>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const zonalAgentCoordinatorASTableList = ZASDetailsList.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td><input value={Object.values(info)} type="checkbox" onChange={handleCheck} /></td>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td>{info.region}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber}>View Details</a></td>
         </tr>
      )
    }
  )


  const searchItems = (searchValue) => {
    const searchValueLower = searchValue.toLowerCase()
    const searchValueUpper = searchValue.toUpperCase()
    const searchValueCapitalize = searchValue[0].toUpperCase() + searchValue.slice(1)
    if (searchValue !== '') {
      const filteredResults = AGDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredAgentsResults = agentDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredaggregatorLeadResults = aggregatorDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredZACResults = ZACDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredFDOResults = FDODetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredAGSResults = AGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredAGGResults = AGGDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredZAGSResults = ZAGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredZAGGResults = ZAGGSDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredZASResults = ZASDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      const filteredLAGGResults = ALGDetailsList.filter((info) => {
        return Object.values(info).join('').includes(searchValueCapitalize) || Object.values(info).join('').includes(searchValueUpper) || Object.values(info).join('').includes(searchValueLower)
      })

      setFilteredResults(filteredResults)
      setFilteredZACResults(filteredZACResults)
      setFilteredFDOResults(filteredFDOResults)
      setFilteredAGSResults(filteredAGSResults)
      setFilteredAGGResults(filteredAGGResults)
      setFilteredZAGSResults(filteredZAGSResults)
      setFilteredZAGGResults(filteredZAGGResults)
      setFilteredZASResults(filteredZASResults)
      setFilteredaggregatorLeadResults(filteredaggregatorLeadResults)
      setFilteredAgentsResults(filteredAgentsResults)
      setFilteredLAGGResults(filteredLAGGResults)
    }
    else {
      setFilteredResults([])
      setFilteredZACResults([])
      setFilteredFDOResults([])
      setFilteredAGSResults([])
      setFilteredAGGResults([])
      setFilteredZAGSResults([])
      setFilteredZAGGResults([])
      setFilteredZASResults([])
      setFilteredaggregatorLeadResults([])
      setFilteredAgentsResults([])
      setFilteredLAGGResults([])
    }
  }

  const filteredLAGGTableList = filteredLAGGResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.email}</td>
          <td>{info.region}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber}>View Details</a></td>
        </tr>
      )
    }
  )

  const filteredAgentTableList = filteredResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.phoneNumber}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )

  const filteredAgentsTableList = filteredAgentsResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.phoneNumber}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )

  const filteredAgregatorLeadTableList = filteredaggregatorLeadResults.map(
    (info) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.phoneNumber}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )

  const filteredZACDetailsList = filteredZACResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
          <td>{info.totalagent}</td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber + "&uID=" + authData?.AccountNumber + "&uRoleID=" + authData?.RoleName + "&uTotalAgent=" + info.totalagent + "&uState=" + info.state}>View Details</a></td>
        </tr>
      )
    }
  )

  const filteredFDODetailsList = filteredFDOResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.state}</td>
        </tr>
      )
    }
  )

  const filteredAGSDetailsList = filteredAGSResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.phoneNumber}</td>
        </tr>
      )
    }
  )

  const filteredAGGDetailsList = filteredAGGResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.email}</td>
          <td>{info.phoneNumber}</td>
          <td>{info.stage}</td>
        </tr>
      )
    }
  )

  const filteredZAGSDetailsList = filteredZAGSResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const filteredZAGGDetailsList = filteredZAGGResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td>{info.totalAgents}</td>
        </tr>
      )
    }
  )

  const filteredZASDetailsList = filteredZASResults.map(
    (info, key) => {
      return (
        <tr key={key}>
          <td><input value={Object.values(info)} type="checkbox" onChange={handleCheck} /></td>
          <td>{info.firstName}</td>
          <td>{info.lastName}</td>
          <td>{info.state}</td>
          <td>{info.region}</td>
          <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
          <td><a href={"/dashboard/agent-information/?applicationID=" + info.accountNumber}>View Details</a></td>
         </tr>
      )
    }
  )
  
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header height="90px" marginTop="0px" accountNumber={authData?.AccountNumber} roleName={authData?.RoleName} stage={authData?.Stage} token={token} />
      <div className="tabs-container">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="home" title="Home">
            <div className="dashboard-top-fragment">
              <span className="dashboard-user-name-span">Welcome {authData?.Name} 👋🏾</span>
              {/**<Button onClick={handleClick} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />
                Select Period</Button>**/}
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}
            </div>
            <span className="dashboard-overview-span">Here is an overview of new, pending, successful agents you have onboarded.</span>
            <div className="dashboard-summary-cards">
              <div className="single-summary-card">
                {authData?.RoleName === "SuperAdmin" ? <span className="single-summary-card-span">Total Zonal Agent Coordinators</span> : <span className="single-summary-card-span">Total Number of Agents</span>}
                <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faCircleUser} />
                {authData?.RoleName === "SuperAdmin" ? <span style={{ color: "#5C2682" }} className="single-summary-card-span-1">{numberOfZACs > 0 ? <CountUp duration={5.75} end={numberOfZACs} /> : "0"}</span> :
                  authData?.RoleName === "Zonal Agent Cordinator" ? <span style={{ color: "#5C2682" }} className="single-summary-card-span-1"><CountUp duration={3.75} end={numberOfZASs} /></span> :
                    <span style={{ color: "#5C2682" }} className="single-summary-card-span-1">{agentDetailsList.length > 0 ? <CountUp duration={3.75} end={agentDetailsList.length} /> : "0"}</span>}
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>
              {authData?.RoleName === "Zonal Agent Cordinator" &&
                <div className="single-summary-card">
                  <span className="single-summary-card-span">Total Agent Supervisor</span>
                  <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faCircleUser} />
                  <span style={{ color: "#5C2682" }} className="single-summary-card-span-1">{numberOfZAGSs > 0 ? <CountUp duration={3.75} end={numberOfZAGSs} /> : "0"}</span>
                  <img
                    src={background}
                    className="dashboard-summary-card-background"
                    alt="dashboard-summary-card-background"
                  />
                </div>
              }
              <div className="single-summary-card">
                {authData?.RoleName === "SuperAdmin" ? <span className="single-summary-card-span">Total Front Desk Reps.</span> : <span className="single-summary-card-span">Total Number of Aggregators</span>}
                <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faCircleUser} />
                {authData?.RoleName === "SuperAdmin" ? <span style={{ color: "#008C38" }} className="single-summary-card-span-1">{numberOfFDOs > 0 ? <CountUp duration={5.75} end={numberOfFDOs} /> : "0"}</span>
                  :
                  authData?.RoleName === "Zonal Agent Cordinator" ?
                    <span style={{ color: "#008C38" }} className="single-summary-card-span-1">
                      {numberOfZLAGSs > 0 ? <CountUp duration={3.75} end={numberOfZLAGSs} /> : "0"}</span>
                    :
                    <span style={{ color: "#008C38" }} className="single-summary-card-span-1">
                      {aggregatorDetailsList.length > 0 ? <CountUp duration={3.75} end={aggregatorDetailsList.length} /> : "0"}</span>}
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>
              {authData?.RoleName === "Zonal Agent Cordinator" ?
                ""
                :
                <div className="single-summary-card">
                  {authData?.RoleName === "SuperAdmin" ? <span className="single-summary-card-span">Total Agent Supervisors</span> : <span className="single-summary-card-span">Completed Forms</span>}
                  <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faCircleCheck} />
                  {authData?.RoleName === "SuperAdmin" ? <span style={{ color: "#FFAA00" }} className="single-summary-card-span-1">{numberOfAGSs > 0 ? <CountUp duration={5.75} end={numberOfAGSs} /> : "0"}</span>
                    : <span style={{ color: "#FFAA00" }} className="single-summary-card-span-1">{totalCompleted > 0 ? <CountUp duration={3.75} end={totalCompleted} /> : "0"}</span>}
                  <img
                    src={background}
                    className="dashboard-summary-card-background"
                    alt="dashboard-summary-card-background"
                  />
                </div>
              }
            </div>
            <div className="dashboard-summary-cards">
              {authData?.RoleName === "AgentSupervisor" || authData?.RoleName === "SuperAdmin" && <div className="single-summary-card">
                <span className="single-summary-card-span">Total Aggregators</span>
                <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faClock} />
                <span style={{ color: "#5C2682" }} className="single-summary-card-span-1">{numberOfAGGs > 0 ? <CountUp duration={3.75} end={numberOfAGGs} /> : "0"}</span>
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>}
              {authData?.RoleName === "AgentSupervisor" || authData?.RoleName === "SuperAdmin" && <div className="single-summary-card">
                <span className="single-summary-card-span">Total Agents</span>
                <FontAwesomeIcon style={{ float: "right", color: "#5C2682" }} icon={faClock} />
                <span style={{ color: "#5C2682" }} className="single-summary-card-span-1">{numberOfAGs > 0 ? <CountUp duration={3.75} end={numberOfAGs} /> : "0"}</span>
                <img
                  src={background}
                  className="dashboard-summary-card-background"
                  alt="dashboard-summary-card-background"
                />
              </div>}
            </div>
            {authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator" ? <div></div> :
              <div className="dashboard-action-fragment">
                <Form className="search-for-agents">
                  <Form.Group className="mb-3">
                    <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                  </Form.Group>
                </Form>
                <Button onClick={() => setModalShow(true)} className="button-create-agent"><span className="btn-create-agent-text"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faPlus} size="lg" /> Create Agent</span></Button>
                {/*{checkedItems.length > 0 ?
                <CSVLink filename={"selected_agents_list.csv"} data={checkedItems} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                :
                <CSVLink filename={"agents_list.csv"} data={AGDetailsList.length > 0 ? AGDetailsList : agentDetailsList} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                }*/}
                </div>
            }
            {authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator" ?
              <Tabs
                id="controlled-tab-example"
                activeKey={keyY}
                style={{ paddingLeft: "100px" }}
                onSelect={(k) => setKeyY(k)}
              >
                {authData?.RoleName && authData?.RoleName === "SuperAdmin" ? <Tab eventKey="top-zac" title="Top Zonal Agent Coordinator">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "700px" }} className="agents-list-span-heading">Top Zonal Agent Coordinators</span>
                  </Alert>
                  {numberOfZACs > 0 ?
                    <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
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

                          {numberOfZACs > 0 && topZonalAgentCoordinatorTableList}

                        </tbody>
                      </Table>
                      <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab> :
                  <Tab eventKey="top-zac" title="Top Agent Supervisors">
                    <Alert className="agents-list-card-alert" variant="success">
                      <span style={{ width: "700px" }} className="agents-list-span-heading">Top Agent Supervisors</span>
                    </Alert>
                    {numberOfZAGSs > 0 ?
                      <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                        <Table style={{ width: "50%" }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>State</th>
                              <th>Stage</th>
                              <th>T/Agents</th>
                            </tr>
                          </thead>
                          <tbody>

                            {
                              ZAGSDetailsList.map(
                                (info, key) => {
                                  return (
                                    <tr key={key}>
                                      <td>{info.firstName}</td>
                                      <td>{info.lastName}</td>
                                      <td>{info.state}</td>
                                      <td><Alert className="alert-table-action" variant="success">{info.stage}</Alert></td>
                                      <td>{info.totalAgents}</td>
                                    </tr>
                                  )
                                }
                              )
                            }

                          </tbody>
                        </Table>
                        <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                      </Alert> :
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded will appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                      </Alert>
                    }
                  </Tab>
                }
                {(numberOfALGs || numberOfZLAGSs) && <Tab eventKey="top-lead" title="Top Lead Aggregators">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "600px" }} className="agents-list-span-heading">Top Lead Aggregators</span>
                  </Alert>
                  {numberOfALGs > 0 || numberOfZLAGSs > 0 ?
                    <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                      {numberOfZLAGSs > 0 ?
                        <>
                        <Table style={{ width: "50%" }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>State</th>
                              <th>Stage</th>
                              <th>T/Agents</th>
                            </tr>
                          </thead>
                          <tbody>

                            {numberOfZLAGSs > 0 && zonalAgentCoordinatorLAGSTableList.length > 0 ? zonalAgentCoordinatorLAGSTableList : zonalAgentCoordinatorLAGSDefaultTableList.slice(0, 10)}

                          </tbody>
                        </Table>
                        <Pagination
                          className="pagination-bar"
                          currentPage={currentPage}
                          totalCount={ZLAGSDetailsList.length}
                          pageSize={PageSize}
                          onPageChange={page => setCurrentPage(page)}
                      />
                      </>
                        :
                        <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                        </Table>}
                      <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                }
                {(numberOfAGGs || numberOfZAGGSs) && <Tab eventKey="top-ag" title="Top Aggregators">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "300px" }} className="agents-list-span-heading">Top Aggregators</span>
                  </Alert>
                  {numberOfAGGs > 0 || numberOfZAGGSs > 0 ?
                    <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                      {numberOfZAGGSs > 0 ?
                        <>
                        <Table style={{ width: "50%" }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>State</th>
                              <th>Stage</th>
                              <th>T/Agents</th>
                            </tr>
                          </thead>
                          <tbody>

                            {numberOfZAGGSs > 0 && zonalAgentCoordinatorAGGSTableList.length > 0 ? zonalAgentCoordinatorAGGSTableList : zonalAgentCoordinatorAGGSDefaultTableList.slice(0, 10)}

                          </tbody>
                        </Table>
                        <Pagination
                          className="pagination-bar"
                          currentPage={currentPage1}
                          totalCount={ZAGGSDetailsList.length}
                          pageSize={PageSize}
                          onPageChange={page1 => setCurrentPage1(page1)}
                      />
                      </>
                        :
                        <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                        </Table>}
                      <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                }
                {numberOfAGSs > 0 && <Tab eventKey="top-agent" title="Top Agent Supervisors">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "300px" }} className="agents-list-span-heading">Top Agent Supervisors</span>
                  </Alert>
                  {numberOfAGSs > 0 ?
                    <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                      <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                }
              </Tabs>
              :
              <Tabs
                id="controlled-tab-example"
                activeKey={keyP}
                style={{ paddingLeft: "100px" }}
                onSelect={(k) => setKeyP(k)}
              >
                <Tab eventKey="agent" title="Agents">
                <CSVLink filename={"agents_list.csv"} data={AGDetailsList.length > 0 ? AGDetailsList : agentDetailsList} ><Button style={{marginLeft:"933px", marginTop:"-180px"}} className="button-download-report-one"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "300px" }} className="agents-list-span-heading">Sub-Agents</span>
                  </Alert>
                  {agentDetailsList.length > 0 ?
                    <Alert className="agents-list-table-alert" variant="success">
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredAgentsTableList.length > 0 ? filteredAgentsTableList : agentsTableList}

                        </tbody>
                      </Table>
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                {authData?.RoleName === "SuperAdmin" || authData?.RoleName === "LeadAggregator" && <Tab eventKey="aggregators" title="Aggregators">
                <CSVLink filename={"aggregators_list.csv"} data={AGGDetailsList.length > 0 ? AGGDetailsList : aggregatorDetailsList} ><Button style={{marginLeft:"933px", marginTop:"-180px"}} className="button-download-report-one"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                  <Alert className="agents-list-card-alert" variant="success">
                    <span className="agents-list-span-heading">Aggregators</span>
                  </Alert>
                  {authData?.RoleName === "SuperAdmin" || authData?.RoleName === "LeadAggregator" ?
                    <Alert className="agents-list-table-alert" variant="success">
                      {authData?.RoleName === "SuperAdmin" ?
                        <Table style={{ width: "100%" }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>M/Number</th>
                              <th>Stage</th>
                            </tr>
                          </thead>
                          <tbody>

                            {filteredAGGDetailsList.length > 0 ? filteredAGGDetailsList : AGGDetailsList}

                          </tbody>
                        </Table>
                        :
                        <Table style={{ width: "100%" }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>M/Number</th>
                              <th>Stage</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>

                            {filteredAgregatorLeadTableList.length > 0 ? filteredAgregatorLeadTableList : aggregatorLeadTableList}

                          </tbody>
                        </Table>
                      }
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                }
                {ALGDetailsList.length > 0 && <Tab eventKey="lead-aggregators" title="Lead Aggregators">
                  <Alert className="agents-list-card-alert" variant="success">
                    <span style={{ width: "300px" }} className="agents-list-span-heading">Lead Aggregators</span>
                  </Alert>
                  {ALGDetailsList.length > 0 ?
                    <Alert className="agents-list-table-alert" variant="success">
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredAgentTableList.length > 0 ? filteredAgentTableList : leadAggregatorTableList}

                        </tbody>
                      </Table>
                    </Alert> :
                    <Alert className="add-agent-alert" variant="success">
                      <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                      <p>No Sub-Agent Onboarded Yet</p>
                      <p>Agents you have onboarded will appear here.</p>
                      <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                    </Alert>
                  }
                </Tab>
                }
              </Tabs>
            }
          </Tab>
          {authData?.RoleName === "SuperAdmin" && <Tab eventKey="zonal-agent-coordinator" title="Zonal Agent Coordinator">
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              
              {/*<Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button> */}
              <Button onClick={handleClick} style={{ marginTop: "20px", marginRight: "100px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}
            </div>
            <Alert className="agents-list-card-alert" variant="success">
              <span style={{ width: "600px" }} className="agents-list-span-heading">Zonal Agent Coordinator</span>
            </Alert>
            <Alert className="agents-list-table-alert" variant="success">
              <Table style={{ width: "100%" }} hover className="agents-table-list">
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
                  {filteredZACDetailsList.length > 0 ? filteredZACDetailsList : topZonalAgentCoordinatorTableList}

                </tbody>
              </Table>
            </Alert>
          </Tab>
          }
          {authData?.RoleName === "SuperAdmin" && <Tab eventKey="front-desk-rep" title="Front Desk Rep.">
            <div className="dashboard-action-fragment">
              {/*<Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              <Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button>
              <Button onClick={handleClick} style={{ marginTop: "20px", marginRight: "100px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )} */}
            </div>
            <Alert className="agents-list-card-alert" variant="success">
              <span style={{ width: "600px" }} className="agents-list-span-heading">Front Desk Representative</span>
            </Alert>
            <Alert className="agents-list-table-alert" variant="success">
              <Table style={{ width: "100%" }} hover className="agents-table-list">
                <thead className="agents-list-table-header">
                  <tr>
                    <th>Name</th>
                    <th></th>
                    <th>Email Address</th>
                    <th>Region</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFDODetailsList.length > 0 ? filteredFDODetailsList : topFrontDeskOfficerTableList}
                </tbody>
              </Table>
            </Alert>
          </Tab>
          }
          {(authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator") && <Tab eventKey="agent-supervisor" title="Agent Supervisor">
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              {/*<Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button>*/}
              <Form.Select onChange={(e) => handleStateChange(e.target.value)} style={{ marginTop: "20px", height: "40px", width:"200px" }} aria-label="Select State">
                <option>Select State</option>
                { AGSStateList && AGSStateList.map((s, key)=> (
                <option key={key} value={s.state}>{s.state}</option>
                ))}
              </Form.Select>

              <Button onClick={handleClick} style={{ marginTop: "20px", marginRight: "100px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}
            </div>
            <Alert className="agents-list-card-alert" variant="success">
              <span style={{ width: "600px" }} className="agents-list-span-heading">Agent Supervisor</span>
            </Alert>
            <Alert className="agents-list-table-alert" variant="success">
              {numberOfZAGSs > 0 ?
                <>
                  <Table style={{ width: "100%" }} hover className="agents-table-list">
                    <thead className="agents-list-table-header">
                      <tr>
                        <th>Name</th>
                        <th></th>
                        <th>State</th>
                        <th>Stage</th>
                        <th>T/Agents</th>
                      </tr>
                    </thead>
                    <tbody>

                      {filteredZAGSDetailsList.length > 0 ? filteredZAGSDetailsList : zonalAgentCoordinatorAGSTableList}

                    </tbody>
                  </Table>
                </>
                :
                <Table style={{ width: "100%" }} hover className="agents-table-list">
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
                    {filteredAGSDetailsList.length > 0 ? filteredAGSDetailsList : topAgentSupervisorTableList}
                  </tbody>
                </Table>}
            </Alert>
          </Tab>
          }
          <Tab eventKey="aggregator" title="Aggregator">
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents" style={{paddingRight: "300px"}}>
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              <Form.Select onChange={(e) => handleStateChange(e.target.value)} style={{ marginTop: "20px", height: "40px", width:"200px" }} aria-label="Select State">
                <option>Select State</option>
                { AGSStateList && AGSStateList.map((s, key)=> (
                <option key={key} value={s.state}>{s.state}</option>
                ))}
              </Form.Select>
              {
                checkedItems.length > 0 ?
                <CSVLink filename={"selected_aggregators_list.csv"} data={checkedItems} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                :
                <CSVLink filename={"aggregators_list.csv"} data={AGGDetailsList.length > 0 ? AGGDetailsList : aggregatorDetailsList} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
              }
              {/*<Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button>*/}
              {/*<FormSelect style={{ marginTop: "20px", height: "40px", width:"200px" }} /> */}
              <Button onClick={handleClick} style={{ marginTop: "20px", marginRight: "100px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}
            </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyM}
              style={{ paddingLeft: "100px" }}
              onSelect={(k) => setKeyM(k)}
            >
              {(authData?.RoleName === "SuperAdmin" || authData?.RoleName === "LeadAggregator") && <Tab eventKey="aggregator" title="Aggregators">
                <Alert className="agents-list-card-alert" variant="success">
                  <span className="agents-list-span-heading">Aggregators</span>
                </Alert>
                {authData?.RoleName === "SuperAdmin" || authData?.RoleName === "LeadAggregator" ?
                  <Alert className="agents-list-table-alert" variant="success">
                    {numberOfZAGGSs > 0 ?
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Stage</th>
                            <th>T/Agents</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredZAGGDetailsList.length > 0 ? filteredZAGGDetailsList : zonalAgentCoordinatorAGGSDefaultTableList}

                        </tbody>
                      </Table>
                      :
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredaggregatorLeadResults.length > 0 ? filteredAgregatorLeadTableList : aggregatorLeadTableList}

                        </tbody>
                      </Table>}
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
              <Tab eventKey="aggregator-agent" title="Agents ">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Agents</span>
                </Alert>
                {agentDetailsList.length > 0 || numberOfZASs > 0 ?
                  <Alert className="agents-list-table-alert" variant="success">
                    {numberOfZASs > 0 ?
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th></th>
                            <th>Location</th>
                            <th>State</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredZASDetailsList.length > 0 ? filteredZASDetailsList : zonalAgentCoordinatorASTableList}

                        </tbody>
                      </Table>
                      :
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredAgentsTableList.length > 0 ? filteredAgentsTableList : agentsTableList}

                        </tbody>
                      </Table>}
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>

              {leadAggregatorTableList.length > 0 && <Tab eventKey="lead-aggregators" title="Lead Aggregators">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Lead Aggregators</span>
                </Alert>
                {leadAggregatorTableList.length > 0 ?
                  <Alert className="agents-list-table-alert" variant="success">
                    <Table style={{ width: "100%" }} hover className="agents-table-list">
                      <thead className="agents-list-table-header">
                        <tr>
                          <th></th>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Region</th>
                          <th>Stage</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>

                        {filteredLAGGTableList.length > 0 ? filteredLAGGTableList : leadAggregatorTableList}

                      </tbody>
                    </Table>
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
            </Tabs>

          </Tab>


          <Tab eventKey="agents" title="Agent">
            <div className="dashboard-top-fragment">
              <span style={{ paddingLeft: "30px" }} className="dashboard-user-name-span">Agents</span>
              <Button onClick={handleClick} style={{ marginLeft: "195px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}
            </div>
            <span style={{ paddingLeft: "102px" }} className="dashboard-overview-span">Here is a list of all agents you have onboarded.</span>
            <div className="dashboard-action-fragment">
              <Form className="search-for-agents" style={{paddingRight:"300px"}}>
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              <Form.Select onChange={(e) => handleStateChange(e.target.value)} style={{ marginTop: "20px", height: "40px", width:"200px" }} aria-label="Select State">
                <option>Select State</option>
                { AGSStateList && AGSStateList.map((s, key)=> (
                <option key={key} value={s.state}>{s.state}</option>
                ))}
              </Form.Select>
              <Button onClick={() => setModalShow(true)} className="button-create-agent"><FontAwesomeIcon/> <span className="btn-create-agent-text"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faPlus} size="lg" /> Create Agent</span></Button>
              {checkedItems.length > 0 ?
                <CSVLink filename={"selected_agents_list.csv"} data={checkedItems} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                :
                <CSVLink filename={"agents_list.csv"} data={AGDetailsList.length > 0 ? AGDetailsList : agentDetailsList} ><Button className="button-download-report"><FontAwesomeIcon icon={faDownload} /> Download</Button></CSVLink>
                }
              </div>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyP}
              style={{ paddingLeft: "100px" }}
              onSelect={(k) => setKeyP(k)}
            >
              <Tab eventKey="agent" title="Agents">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Agents</span>
                </Alert>
                {agentsTableList.length > 0 || numberOfZASs > 0 ?
                  <Alert className="agents-list-table-alert" variant="success">
                    {numberOfZASs > 0 ?
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Location</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredZASDetailsList.length > 0 ? filteredZASDetailsList : zonalAgentCoordinatorASTableList}

                        </tbody>
                      </Table>
                      :
                      <Table style={{ width: "100%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>Email Address</th>
                            <th>Region</th>
                            <th>M/Number</th>
                            <th>Stage</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>

                          {filteredAgentsTableList.length > 0 ? filteredAgentsTableList : agentsTableList}

                        </tbody>
                      </Table>}
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
            </Tabs>
          </Tab>

          {(authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator") && <Tab eventKey="report" title="Report">
            <div className="dashboard-action-fragment">
              {/*<Form className="search-for-agents">
                <Form.Group className="mb-3">
                  <Form.Control onChange={(e) => searchItems(e.target.value)} type="text" className="search-for-agents-input" placeholder="Search for agents" />
                </Form.Group>
              </Form>
              <Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button>
              <Button onClick={handleClick} style={{ marginTop: "20px", marginRight:"100px" }} className="btn dashboard-date-picker-button"><FontAwesomeIcon icon={faCalendarDays} />Select Period</Button>
              {isOpen && (
                <DatePicker selected={startDate} onChange={handleChange} startDate={startDate} endDate={endDate} selectsRange inline />
              )}*/}
            </div>
            <Alert className="agents-list-card-alert" variant="success">
              <span style={{ width: "600px" }} className="agents-list-span-heading">Report</span>
            </Alert>
            <Tabs
              id="controlled-tab-example"
              activeKey={keyY}
              style={{ paddingLeft: "100px" }}
              onSelect={(k) => setKeyY(k)}
            >
              {topZonalAgentCoordinatorTableList && <Tab eventKey="top-zac" title="Top Zonal Agent Coordinator">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "700px" }} className="agents-list-span-heading">Top Zonal Agent Coordinators</span>
                </Alert>
                {topZonalAgentCoordinatorTableList.length > 0 ?
                  <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                    <Table style={{ width: "50%" }} hover className="agents-table-list">
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

                        {topZonalAgentCoordinatorTableList.length > 0 && topZonalAgentCoordinatorTableList}

                      </tbody>
                    </Table>
                    <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
              {(topLeadAggretatorTableList || zonalAgentCoordinatorLAGSTableList) && <Tab eventKey="top-lead" title="Top Lead Aggregators">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "600px" }} className="agents-list-span-heading">Top Lead Aggregators</span>
                </Alert>
                {topLeadAggretatorTableList.length > 0 || zonalAgentCoordinatorLAGSTableList.length > 0 ?
                  <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                    {numberOfZLAGSs > 0 ?
                      <>
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Stage</th>
                            <th>T/Agents</th>
                          </tr>
                        </thead>
                        <tbody>

                        {numberOfZLAGSs > 0 && zonalAgentCoordinatorLAGSTableList.length > 0 ? zonalAgentCoordinatorLAGSTableList : zonalAgentCoordinatorLAGSDefaultTableList.slice(0, 10)}

                        </tbody>
                      </Table>
                      <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={ZLAGSDetailsList.length}
                      pageSize={PageSize}
                      onPageChange={page => setCurrentPage(page)}
                  />
                  </>
                      :
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                      </Table>}
                    <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
              {(topAggregatorTableList || numberOfZAGGSs) && <Tab eventKey="top-ag" title="Top Aggregators">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Top Aggregators</span>
                </Alert>
                {topAggregatorTableList.length > 0 || numberOfZAGGSs > 0 ?
                  <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                    {numberOfZAGGSs > 0 ?
                      <>
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Stage</th>
                            <th>T/Agents</th>
                          </tr>
                        </thead>
                        <tbody>

                        {numberOfZAGGSs > 0 && zonalAgentCoordinatorAGGSTableList.length > 0 ? zonalAgentCoordinatorAGGSTableList : zonalAgentCoordinatorAGGSDefaultTableList.slice(0, 10)}

                        </tbody>
                      </Table>
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPage1}
                        totalCount={ZAGGSDetailsList.length}
                        pageSize={PageSize}
                        onPageChange={page1 => setCurrentPage1(page1)}
                      />
                      </>
                      :
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                      </Table>}
                    <CanvasJSChart options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
              {(topAgentSupervisorTableList || numberOfZAGSs) && <Tab eventKey="top-agent" title="Top Agent Supervisors">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Top Agent Supervisors</span>
                </Alert>
                {topAgentSupervisorTableList.length > 0 || numberOfZAGSs > 0 ?
                  <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                    {numberOfZAGSs > 0 ?
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
                        <thead className="agents-list-table-header">
                          <tr>
                            <th>Name</th>
                            <th></th>
                            <th>State</th>
                            <th>Stage</th>
                            <th>T/Agents</th>
                          </tr>
                        </thead>
                        <tbody>

                          {numberOfZAGSs > 0 && zonalAgentCoordinatorAGSTableList}

                        </tbody>
                      </Table>
                      :
                      <Table style={{ width: "50%" }} hover className="agents-table-list">
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
                      </Table>}
                    <CanvasJSChart style={{width: "100%"}} options={chartOptions} /* onRef={ref => this.chart = ref} */ />
                  </Alert> :
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: "#5C2682" }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save"><span style={{ fontWeight: "700" }}>Onboard Agent</span></Button>
                  </Alert>
                }
              </Tab>
              }
              {(authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator") && <Tab eventKey="app-stats" title="Application Stats.">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: "300px" }} className="agents-list-span-heading">Application Stats.</span>
                </Alert>
                {(authData?.RoleName === "SuperAdmin" || authData?.RoleName === "Zonal Agent Cordinator") &&
                  <Alert style={{ display: "flex" }} className="agents-list-table-alert" variant="success">
                    <CanvasJSChart style={{ width: "100%" }} options={cChartOptions} /* onRef={ref => this.chart = ref} */ />
                  </Alert>
                }
              </Tab>
              }
            </Tabs>
          </Tab>
          }
        </Tabs>
      </div>
      <NewAgentOnboarding
        show={modalShow}
        account_number={authData?.AccountNumber}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}

export default Dashboard