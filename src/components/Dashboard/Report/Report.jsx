import React, { useContext, useMemo, useState } from 'react';
import { Alert, Tab, Tabs } from 'react-bootstrap';

import { Store } from '../../../store';
import CanvasJSReact from '../../../utils/CanvasCharts/canvasjs.react';
import ApplicationStats from './components/ApplicationStats/ApplicationStats';
import GravityReport from './components/GravityReport/GravityReport';
import TopAgentSupervisors from './components/TopAgentSupervisors/TopAgentSupervisors';
import TopAggregators from './components/TopAggregators/TopAggregators';
import TopLeadAggregators from './components/TopLeadAggregators/TopLeadAggregators';
import TopZonalAgentCordinator from './components/TopZonalAgentCordinator/TopZonalAgentCordinator';

const Report = ({ setModalShow, PageSize }) => {
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
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
        ReportSummaryChart,
        GravityReportDetailsList,
      },
    },
    dispatch,
  } = useContext(Store);
  const [keyY, setKeyY] = useState('top-zac');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedAggregator, setCheckedAggregator] = useState([]);
  const LAGSTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return ZLAGSDetailsList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  const [currentPage1, setCurrentPage1] = useState(1);

  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const ZAGGSTableData = useMemo(() => {
    const firstPageIndex1 = (currentPage1 - 1) * PageSize;
    const lastPageIndex1 = firstPageIndex1 + PageSize;
    return ZAGGSDetailsList.slice(firstPageIndex1, lastPageIndex1);
  }, [currentPage1]);

  const zonalAgentCoordinatorAGGSTableList = ZAGGSTableData.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
      </tr>
    );
  });

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

  const zonalAgentCoordinatorLAGSTableList = LAGSTableData.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
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
        <td>{info.stage}</td>
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

  const handleAggregatorCheck = (event, dataObject) => {
    var updatedList = [...checkedAggregator];
    if (event.target.checked) {
      updatedList = [...checkedAggregator, dataObject];
    } else {
      updatedList = checkedAggregator.filter((f) => f.accountNumber !== dataObject.accountNumber);
    }
    setCheckedAggregator(updatedList);
  };

  const zonalAgentCoordinatorAGGSDefaultTableList = ZAGGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={Object.values(info)}
            type="checkbox"
            onChange={(e) => handleAggregatorCheck(e, info)}
          />
        </td>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
          </Alert>
        </td>
        <td>{info.totalAgents}</td>
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
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
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
          { label: 'Active Applications', y: ReportSummaryChart?.activeApplications },
          { label: 'Closed Applications', y: ReportSummaryChart?.closedApplication },
          { label: 'Completed Applications', y: ReportSummaryChart?.completedApplication },
          { label: 'Pending Applications', y: ReportSummaryChart?.pendingApplication },
          { label: 'Total Applications', y: ReportSummaryChart?.totalApplication },
        ],
      },
    ],
  };

  return (
    <>
      <div className="dashboard-action-fragment"></div>
      <div className="mx-auto w-100 px-3">
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
              <TopZonalAgentCordinator
                ZACDetailsList={ZACDetailsList}
                chartOptions={chartOptions}
                setModalShow={setModalShow}
              />
            </Tab>
          )}
          {(topLeadAggretatorTableList || zonalAgentCoordinatorLAGSTableList) && (
            <Tab eventKey="top-lead" title="Top Lead Aggregators">
              <TopLeadAggregators
                ALGDetailsList={ALGDetailsList}
                authData={authData}
                ZLAGSDetailsList={ZLAGSDetailsList}
                numberOfZLAGSs={numberOfZLAGSs}
                chartOptions={chartOptions}
                setModalShow={setModalShow}
              />
            </Tab>
          )}
          {(topAggregatorTableList || numberOfZAGGSs) && (
            <Tab eventKey="top-ag" title="Top Aggregators">
              <TopAggregators
                AGGDetailsList={AGGDetailsList}
                numberOfZAGGSs={numberOfZAGGSs}
                ZAGGSTableData={ZAGGSTableData}
                ZAGGSDetailsList={ZAGGSDetailsList}
                authData={authData}
                chartOptions={chartOptions}
                setModalShow={setModalShow}
                currentPage1={currentPage1}
                setCurrentPage1={setCurrentPage1}
              />
            </Tab>
          )}

          {(topAgentSupervisorTableList || numberOfZAGSs) && (
            <Tab eventKey="top-agent" title="Top Agent Supervisors">
              <TopAgentSupervisors
                AGSDetailsList={AGSDetailsList}
                numberOfZAGSs={numberOfZAGSs}
                ZAGSDetailsList={ZAGSDetailsList}
                chartOptions={chartOptions}
                setModalShow={setModalShow}
              />
            </Tab>
          )}

          {(authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator') && (
            <Tab eventKey="app-stats" title="Application Stats.">
              <ApplicationStats authData={authData} cChartOptions={cChartOptions} />
            </Tab>
          )}

          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="gravity-report" title="Gravity Report">
              <GravityReport
                dispatch={dispatch}
                authData={authData}
                GravityReportDetailsList={GravityReportDetailsList}
              />
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Report;
