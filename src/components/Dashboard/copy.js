import { useEffect, useState, useContext } from 'react';
import { Tab, Tabs } from 'react-bootstrap';

import Header from '../Header';
import NewAgentOnboarding from './NewAgentOnboarding/NewAgentOnboarding';
import './Dashboard.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { Store } from '../../store';
import { getStoredToken } from '../../utils/helpers/auth';
import {
  getOtherAggregatorDashboardInfo,
  getStates,
  getSuperAdminDashboardData,
  getZacDashboardData,
} from '../../store/actions';
import LoadingIndicator from '../../components/LoadingIndicator';
import ZonalAgentCordinator from './ZonalAgentCordinator/ZonalAgentCordinator';
import FrontDeskRep from './FrontDeskRep/FrontDeskRep';
import AgentSupervisor from './AgentSupervisor/AgentSupervisor';
import Aggregator from './Aggregator/Aggregator';
import LeadAggregator from './LeadAggregator/LeadAggregator';
import Agent from './Agent/Agent';
import Report from './Report/Report';
import Home from './Home/Home';

let PageSize = 10;

const Dashboard = () => {
  const token = getStoredToken();
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
      dashboard: {
        ZACDetailsList,
        FDODetailsList,
        AGSDetailsList,
        ALGDetailsList,
        AGDetailsList,
        ZAGSDetailsList,
        ZAGGSDetailsList,
        ZASDetailsList,
        ZACDataPoints,
        aggregatorDetailsList,
        AGSStateList,
        numberOfZAGGSs,
        agentDetailsList,
      },
    },
    dispatch,
  } = useContext(Store);

  const [key, setKey] = useState('home');
  const [modalShow, setModalShow] = useState(false);

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

  useEffect(() => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getStates());
      dispatch(getSuperAdminDashboardData());
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData());
    } else {
      dispatch(getOtherAggregatorDashboardInfo());
    }
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header
        height="90px"
        marginTop="0px"
        accountNumber={authData?.AccountNumber}
        roleName={authData?.RoleName}
        stage={authData?.Stage}
        token={token}
      />
      <div className="tabs-container">
        <Tabs
          className="w-100 d-flex"
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
        >
          <Tab eventKey="home" title="Home">
            <Home setModalShow={setModalShow} chartOptions={chartOptions} />
          </Tab>
          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="zonal-agent-coordinator" title="Zonal Agent Coordinator">
              <ZonalAgentCordinator
                ZACDetailsList={ZACDetailsList}
                dispatch={dispatch}
                getSuperAdminDashboardData={getSuperAdminDashboardData}
                getZacDashboardData={getZacDashboardData}
                authData={authData}
              />
            </Tab>
          )}
          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="front-desk-rep" title="Front Desk Rep.">
              <FrontDeskRep FDODetailsList={FDODetailsList} />
            </Tab>
          )}
          {(authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator') && (
            <Tab eventKey="agent-supervisor" title="Agent Supervisor">
              <AgentSupervisor
                dispatch={dispatch}
                AGSStateList={AGSStateList}
                authData={authData}
                ZAGSDetailsList={ZAGSDetailsList}
                AGSDetailsList={AGSDetailsList}
              />
            </Tab>
          )}
          {(authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'LeadAggregator') && (
            <Tab eventKey="aggregator" title="Aggregator">
              <Aggregator
                dispatch={dispatch}
                AGSStateList={AGSStateList}
                authData={authData}
                ZAGGSDetailsList={ZAGGSDetailsList}
                numberOfZAGGSs={numberOfZAGGSs}
                aggregatorDetailsList={aggregatorDetailsList}
                setModalShow={setModalShow}
              />
            </Tab>
          )}

          {authData?.RoleName === 'SuperAdmin' && (
            <Tab eventKey="lead-aggregator" title="Lead Aggregator">
              <LeadAggregator
                dispatch={dispatch}
                AGSStateList={AGSStateList}
                authData={authData}
                ALGDetailsList={ALGDetailsList}
              />
            </Tab>
          )}

          <Tab eventKey="agents" title="Agent">
            <Agent
              authData={authData}
              dispatch={dispatch}
              AGSStateList={AGSStateList}
              setModalShow={setModalShow}
              ZASDetailsList={ZASDetailsList}
              AGDetailsList={AGDetailsList}
              agentDetailsList={agentDetailsList}
            />
          </Tab>

          {(authData?.RoleName === 'SuperAdmin' ||
            authData?.RoleName === 'Zonal Agent Cordinator') && (
            <Tab eventKey="report" title="Report">
              <Report setModalShow={setModalShow} PageSize={PageSize} />
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
