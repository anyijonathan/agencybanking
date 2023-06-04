import {
  faCircleCheck,
  faCircleUser,
  faClock,
  faDownload,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import background from '../../../assets/images/dashboard-summary-single-card.png';
import ReactDatePicker from 'react-datepicker';
import { Alert, Button, Form, Tab, Table, Tabs } from 'react-bootstrap';
import TopZonalAgentCordinator from './TopZonalAgentCordinator/TopZonalAgentCordinator';
import { Store } from '../../../store';
import TableHeader from '../../TableHeader/TableHeader';
import CanvasJSReact from '../../../utils/CanvasCharts/canvasjs.react';
import TopLeadAggregators from './TopLeadAggregators/TopLeadAggregators';
import TopAggregators from './TopAggregators/TopAggregators';
import TopAgentSupervisors from './TopAgentSupervisors/TopAgentSupervisors';
import { CSVLink } from 'react-csv';
import { filterData, getStates } from '../../../store/actions';

const Home = ({ setModalShow, chartOptions }) => {
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
      dashboard: {
        ZACDetailsList,
        AGSDetailsList,
        ALGDetailsList,
        AGGDetailsList,
        AGDetailsList,
        ZAGSDetailsList,
        ZLAGSDetailsList,
        ZAGGSDetailsList,
        ZACDataPoints,
        agentDetailsList,
        subAgentDetailsList,
        aggregatorDetailsList,
        subAggregatorDetailsList,
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
        numberOfZASs,
      },
    },
    dispatch,
  } = useContext(Store);
  let PageSize = 10;
  const [startDate, setStartDate] = useState(new Date());
  const [keyY, setKeyY] = useState('top-zac');
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [keyP, setKeyP] = useState('agent');
  const [checkedLeadAggregator, setCheckedLeadAggregator] = useState([]);
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const [currentPage, setCurrentPage] = useState(1);

  const [currentPage1, setCurrentPage1] = useState(1);

  useEffect(() => {
    dispatch(getStates());
  }, []);

  const aggregatorLeadTableList = subAggregatorDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>{info.phoneNumber}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
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

  const agentsTableList = subAgentDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
        <td>{info.phoneNumber}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.stage}
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

  const handleLeadAggregatorCheck = (event, dataObject) => {
    var updatedList = [...checkedLeadAggregator];
    if (event.target.checked) {
      updatedList = [...checkedLeadAggregator, dataObject];
    } else {
      updatedList = checkedLeadAggregator.filter(
        (f) => f.accountNumber !== dataObject.accountNumber
      );
    }
    setCheckedLeadAggregator(updatedList);
  };

  const leadAggregatorTableList = ALGDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={Object.values(info)}
            type="checkbox"
            onChange={(e) => handleLeadAggregatorCheck(e, info)}
          />
        </td>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.region}</td>
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

  return (
    <>
      <div className="mx-md-2 px-md-3">
        <div className="dashboard-top-fragment px-2">
          <span className="dashboard-user-name-span">Welcome {authData?.Name} 👋🏾</span>
          {isOpen && (
            <ReactDatePicker
              selected={startDate}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
            />
          )}
        </div>
        <div className="px-2">
          <span className="dashboard-overview-span">
            Here is an overview of new, pending, successful agents you have onboarded.
          </span>
        </div>

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
              <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faCircleUser} />
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
              <FontAwesomeIcon style={{ float: 'right', color: '#5C2682' }} icon={faCircleCheck} />
              {authData?.RoleName === 'SuperAdmin' ? (
                <span style={{ color: '#FFAA00' }} className="single-summary-card-span-1">
                  {numberOfAGSs > 0 ? <CountUp duration={5.75} end={numberOfAGSs} /> : '0'}
                </span>
              ) : (
                <span style={{ color: '#FFAA00' }} className="single-summary-card-span-1">
                  {totalCompleted > 0 ? <CountUp duration={3.75} end={totalCompleted} /> : '0'}
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
        {authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'Zonal Agent Cordinator' ? (
          <div></div>
        ) : (
          <div
            // className="dashboard-action-fragment"
            className="d-md-flex justify-content-md-between m-3 px-4"
            style={{ maxWidth: '1126px', marginBottom: '20px', width: '100%' }}
          >
            <Form onSubmit={(event) => event.preventDefault()} className="search-for-agents">
              <Form.Group className="mb-3"></Form.Group>
            </Form>
            <Button onClick={() => setModalShow(true)} className="button-create-agent">
              <span className="btn-create-agent-text">
                <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faPlus} size="lg" /> Create
                Agent
              </span>
            </Button>
          </div>
        )}
        {authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'Zonal Agent Cordinator' ? (
          <Tabs id="controlled-tab-example" activeKey={keyY} onSelect={(k) => setKeyY(k)}>
            {authData?.RoleName && authData?.RoleName === 'SuperAdmin' ? (
              <Tab eventKey="top-zac" title="Top Zonal Agent Coordinator">
                <TopZonalAgentCordinator
                  numberOfZACs={numberOfZACs}
                  ZACDetailsList={ZACDetailsList}
                  chartOptions={chartOptions}
                  setModalShow={setModalShow}
                />
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
                      <TableHeader
                        className={'agents-list-table-header'}
                        tableHeading={['First Name', 'Last Name', 'State', 'Stage', 'T/Agents']}
                      />
                      <tbody>
                        {ZAGSDetailsList.map((info, key) => {
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
                        })}
                      </tbody>
                    </Table>
                    <CanvasJSChart options={chartOptions} />
                  </Alert>
                ) : (
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                      <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                    </Button>
                  </Alert>
                )}
              </Tab>
            )}

            {(numberOfALGs || numberOfZLAGSs) && (
              <Tab eventKey="top-lead" title="Top Lead Aggregators">
                <TopLeadAggregators
                  authData={authData}
                  ALGDetailsList={ALGDetailsList}
                  ZLAGSDetailsList={ZLAGSDetailsList}
                  ZACDataPoints={ZACDataPoints}
                  numberOfALGs={numberOfALGs}
                  numberOfZLAGSs={numberOfZLAGSs}
                  PageSize={PageSize}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  chartOptions={chartOptions}
                />
              </Tab>
            )}

            {(numberOfAGGs || numberOfZAGGSs) && (
              <Tab eventKey="top-ag" title="Top Aggregators">
                <TopAggregators
                  numberOfZAGGSs={numberOfZAGGSs}
                  numberOfAGGs={numberOfAGGs}
                  setCurrentPage1={setCurrentPage1}
                  currentPage1={currentPage1}
                  PageSize={PageSize}
                  ZAGGSDetailsList={ZAGGSDetailsList}
                  AGGDetailsList={AGGDetailsList}
                  chartOptions={chartOptions}
                  authData={authData}
                  setModalShow={setModalShow}
                />
              </Tab>
            )}

            {numberOfAGSs > 0 && (
              <Tab eventKey="top-agent" title="Top Agent Supervisors">
                <TopAgentSupervisors
                  numberOfAGSs={numberOfAGSs}
                  AGSDetailsList={AGSDetailsList}
                  chartOptions={chartOptions}
                  setModalShow={setModalShow}
                />
              </Tab>
            )}
          </Tabs>
        ) : (
          <Tabs id="controlled-tab-example" activeKey={keyP} onSelect={(k) => setKeyP(k)}>
            <Tab eventKey="agent" title="Agents">
              <div style={{ maxWidth: '1126px' }} className="d-flex w-100 justify-content-end px-3">
                <CSVLink
                  filename={'agents_list.csv'}
                  data={AGDetailsList.length > 0 ? AGDetailsList : subAgentDetailsList}
                >
                  <Button
                    style={{ marginTop: '-180px' }}
                    className="button-download-report-one download-button-padding"
                    disabled={subAgentDetailsList.length <= 0}
                  >
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </Button>
                </CSVLink>
              </div>

              <div className="mx-auto w-100 px-3">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: '300px' }} className="agents-list-span-heading">
                    Sub-Agents
                  </span>
                </Alert>

                {subAgentDetailsList.length > 0 ? (
                  <Alert className="agents-list-table-alert" variant="success">
                    <Table style={{ width: '100%' }} hover className="agents-table-list">
                      <thead className="agents-list-table-header">
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email Address</th>
                          <th>Region</th>
                          <th>M/Number</th>
                          <th>Stage</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{agentsTableList}</tbody>
                    </Table>
                  </Alert>
                ) : (
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                      <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                    </Button>
                  </Alert>
                )}
              </div>
            </Tab>
            {authData?.RoleName === 'SuperAdmin' ||
              (authData?.RoleName === 'LeadAggregator' && (
                <Tab eventKey="aggregators" title="Aggregators">
                  {/* Aggregators Tab here */}

                  <div
                    style={{ maxWidth: '1126px' }}
                    className="d-flex w-100 justify-content-end px-3"
                  >
                    <CSVLink
                      filename={'agents_list.csv'}
                      data={AGGDetailsList.length > 0 ? AGGDetailsList : subAggregatorDetailsList}
                    >
                      <Button
                        style={{ marginTop: '-180px' }}
                        className="button-download-report-one download-button-padding"
                        disabled={subAggregatorDetailsList.length <= 0}
                      >
                        <FontAwesomeIcon icon={faDownload} /> Download
                      </Button>
                    </CSVLink>
                  </div>

                  <div className="mx-auto w-100 px-3">
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
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email Address</th>
                                <th>Region</th>
                                <th>M/Number</th>
                                <th>Stage</th>
                              </tr>
                            </thead>
                            <tbody>{AGGDetailsList}</tbody>
                          </Table>
                        ) : (
                          <Table style={{ width: '100%' }} hover className="agents-table-list">
                            <thead className="agents-list-table-header">
                              <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email Address</th>
                                <th>Region</th>
                                <th>M/Number</th>
                                <th>Stage</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>{aggregatorLeadTableList}</tbody>
                          </Table>
                        )}
                      </Alert>
                    ) : (
                      <Alert className="add-agent-alert" variant="success">
                        <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                        <p>No Sub-Agent Onboarded Yet</p>
                        <p>Agents you have onboarded will appear here.</p>
                        <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                          <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                        </Button>
                      </Alert>
                    )}
                  </div>
                </Tab>
              ))}

            {authData?.RoleName === 'SuperAdmin' && ALGDetailsList.length > 0 && (
              <Tab eventKey="lead-aggregators" title="Lead Aggregators">
                <Alert className="agents-list-card-alert" variant="success">
                  <span style={{ width: '300px' }} className="agents-list-span-heading">
                    Lead Aggregators
                  </span>
                </Alert>
                {ALGDetailsList.length > 0 ? (
                  <Alert className="agents-list-table-alert" variant="success">
                    <Table style={{ width: '100%' }} hover className="agents-table-list">
                      <thead className="agents-list-table-header">
                        <tr>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Email Address</th>
                          <th>Region</th>
                          <th>Stage</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{leadAggregatorTableList}</tbody>
                    </Table>
                  </Alert>
                ) : (
                  <Alert className="add-agent-alert" variant="success">
                    <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faCircleCheck} />
                    <p>No Sub-Agent Onboarded Yet</p>
                    <p>Agents you have onboarded will appear here.</p>
                    <Button onClick={() => setModalShow(true)} className="btn-account-set-save">
                      <span style={{ fontWeight: '700' }}>Onboard Agent</span>
                    </Button>
                  </Alert>
                )}
              </Tab>
            )}
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Home;
