import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Accordion, Button, Tab, Table, Tabs, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import Header from '../../Header';
import './AgentInformation.scss';
import RemapAgent from '../RemapAgent/RemapAgent';
import axios from '../../../config/Axios';
import { Store } from '../../../store';
import { formatApplicationStatus } from '../../../utils/helpers';

const AgentInformation = () => {
  const [key, setKey] = useState('home');
  const [checked, setChecked] = useState([]);
  const [updatedList, setUpdatedList] = useState([]);
  const [updatedList1, setUpdatedList1] = useState([]);
  const [applicationDetails, setApplicationDetails] = useState({});
  const [ASDetailsList, setASDetailsList] = useState([]);
  const [LAGDetailsList, setLAGDetailsList] = useState([]);
  const [AGGDetailsList, setAGGDetailsList] = useState([]);
  const [AGDetailsList, setAGDetailsList] = useState([]);
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const {
    state: {
      auth: { authData },
    },
    dispatch,
  } = useContext(Store);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* Dashboard Agent Information Required Account Number Parse */
  const queryParams = new URLSearchParams(window.location.search);
  const accountNumber = queryParams.get('applicationID');
  const userAccountNumber = authData?.AccountNumber;
  const userRoleName = authData?.RoleName;
  const totalAgents = queryParams.get('uTotalAgent');
  const zacState = queryParams.get('uState');

  const showRemapModal = () => {
    setIsModalOpen(true);
  };

  const closeRemapModal = () => {
    setIsModalOpen(false);
  };

  // Add/Remove checked item from list
  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
    setUpdatedList(updatedList);
  };

  // Generate string of checked items
  const checkedItems = checked.length
    ? checked.reduce((total, info) => {
        return total + ', ' + info;
      })
    : '';

  // Add/Remove checked account from agent list to Remap
  const handleCheckAgentAccount = (event) => {
    var updatedList1 = [...checked];
    if (event.target.checked) {
      updatedList1 = [...checked, event.target.value];
    } else {
      updatedList1.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList1);
    setUpdatedList1(updatedList1);
  };

  // Generate string of agent account for Remap
  const checkedAgents = checked.length
    ? checked.reduce((total, info) => {
        return total + ', ' + info;
      })
    : '';

  // Fetch User Personal Details
  const fetchAgentInformation = async () => {
    const res = await axios.get(
      'Agent/GetAgentSummaryByAccountNumber?AccountNumber=' + accountNumber
    );
    if (res.data.code === '00') {
      setApplicationDetails(res.data.data || {});
    }
  };

  // Fetch AS Details
  const fetchASDetails = async () => {
    const res = await axios.get(
      'SuperAdmin/GetAllAgentUnderZacByRole?ZACAccountNumber=' + accountNumber + '&userroleid=5'
    );
    if (res.data.code === '00') {
      setASDetailsList(res.data.data || []);
    }
  };

  // Fetch LAG Details
  const fetchLAGDetails = async () => {
    const res = await axios.get(
      'SuperAdmin/GetAllAgentUnderZacByRole?ZACAccountNumber=' + accountNumber + '&userroleid=6'
    );
    if (res.data.code === '00') {
      setLAGDetailsList(res.data.data || []);
    }
  };

  // Fetch AGG Details
  const fetchAGGDetails = async () => {
    const res = await axios.get(
      'SuperAdmin/GetAllAgentUnderZacByRole?ZACAccountNumber=' + accountNumber + '&userroleid=7'
    );
    if (res.data.code === '00') {
      setAGGDetailsList(res.data.data || []);
    }
  };

  // Fetch AG Details
  const fetchAGDetails = async () => {
    const res = await axios.get(
      'SuperAdmin/GetAllAgentUnderZacByRole?ZACAccountNumber=' + accountNumber + '&userroleid=4'
    );
    if (res.data.code === '00') {
      setAGDetailsList(res.data.data || []);
    }
  };

  // Delete Agent
  const deleteAgent = async () => {
    Swal.fire({
      title: 'Disable Agent',
      text: 'Are you sure you want to disable agent',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: 'No, cancel it!',
      closeOnConfirm: false,
      closeOnCancel: true,
      allowOutsideClick: false,
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then(
      (result) => {
        if (result.isConfirmed) {
          const url = 'SuperAdmin/ChangeAgentStatus';
          const newStatus = 'Disable';
          const AgentAccountNumber = accountNumber;
          const res = axios.post(url, { newStatus, AgentAccountNumber });

          // Confirm with Admin account
          if (res) {
            swal({
              title: 'Congratulations',
              text: 'You have successfully disabled agent',
              icon: 'success',
              allowOutsideClick: false,
              closeOnEsc: false,
            }).then(() => {
              window.location.reload();
            });
          }
        }
        return;
      },
      function () {
        return false;
      }
    );
  };

  // Remap Agent
  const reMapAgent = async () => {
    if (updatedList1.length > 0 && updatedList.length > 0) {
      const url = 'SuperAdmin/RemapAGentToSupervisor';
      const newSupervisorAccoutNumber = updatedList[1];
      const AgentAccountNumber = updatedList1[0];
      //const AgentAccountNumber = accountNumber
      const res = axios.post(url, { newSupervisorAccoutNumber, AgentAccountNumber });
      closeRemapModal();
    } else {
      closeRemapModal();
      swal({
        title: '',
        text: 'select agent and supervisor to proceed',
        icon: 'error',
        allowOutsideClick: false,
        closeOnEsc: false,
      });
    }
  };

  useEffect(() => {
    fetchAgentInformation();
    if (authData?.RoleName === 'SuperAdmin') {
      fetchASDetails();
      fetchLAGDetails();
      fetchAGGDetails();
      fetchAGDetails();
    }
  }, []);

  const ASTableList = ASDetailsList.map((info, key) => {
    return (
      <tr>
        <td>
          <input value={info.accountNumber} type="checkbox" onChange={handleCheck} />
        </td>
        <td>{info.firstName.toLowerCase()}</td>
        <td>{info.lastName.toLowerCase()}</td>
        <td>{info.email.toLowerCase()}</td>
        <td>{info.state}</td>
        <td>{info.region}</td>
        <td>
          <a href={'/dashboard/agent-information/?applicationID=' + info.accountNumber}>
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const LAGTableList = LAGDetailsList.map((info, key) => {
    return (
      <tr>
        <td>
          <input value={info.accountNumber} type="checkbox" onChange={handleCheck} />
        </td>
        <td>{info.firstName.toLowerCase()}</td>
        <td>{info.lastName.toLowerCase()}</td>
        <td>{info.email.toLowerCase()}</td>
        <td>{info.state}</td>
        <td>{info.region}</td>
        <td>
          <a href={'/dashboard/agent-information/?applicationID=' + info.accountNumber}>
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const AGGTableList = AGGDetailsList.map((info, key) => {
    return (
      <tr>
        <td>
          <input value={info.accountNumber} type="checkbox" onChange={handleCheck} />
        </td>
        <td>{info.firstName.toLowerCase()}</td>
        <td>{info.lastName.toLowerCase()}</td>
        <td>{info.email.toLowerCase()}</td>
        <td>{info.state}</td>
        <td>{info.region}</td>
        <td>
          <a href={'/dashboard/agent-information/?applicationID=' + info.accountNumber}>
            View Details
          </a>
        </td>
      </tr>
    );
  });

  const AGTableList = AGDetailsList.map((info, key) => {
    return (
      <tr>
        <td>
          <input value={info.accountNumber} type="checkbox" onChange={handleCheckAgentAccount} />
        </td>
        <td>{info.firstName.toLowerCase()}</td>
        <td>{info.lastName.toLowerCase()}</td>
        <td>{info.email.toLowerCase()}</td>
        <td>{info.state}</td>
        <td>{info.region}</td>
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
      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={isModalOpen}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Remap Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p className="email-verification-text">Are you sure you want to remap agent?</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="email-verification-footer-button-tray">
            <Button className="btn-email-verification-back" onClick={closeRemapModal}>
              <span className="btn-email-verification-back-text">Cancel</span>
            </Button>
            <Button className="btn-email-verification-proceed" onClick={reMapAgent}>
              <span className="btn-email-verification-proceed-text">Proceed</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Header
        height="90px"
        marginTop="0px"
        accountNumber={userAccountNumber}
        roleName={userRoleName}
      />
      <Button onClick={() => navigate(-1)} className="btn btn-light btn-dark-xs">
        <span className="btn-light-xs-text">Back to Home</span>
      </Button>
      <div className="tabs-container">
        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="home" title="Agent Information">
            <div
              style={{ maxWidth: '800px' }}
              className="mt-5 d-flex flex-column flex-md-row w-100 mx-auto justify-content-between"
            >
              <p className="agent-info-title ms-3">
                {applicationDetails.roleName === 'Zonal Agent Cordinator'
                  ? 'Zonal Agent Coordinator'
                  : 'Application Summary'}{' '}
                ({applicationDetails?.firstName} {applicationDetails?.lastName})
              </p>

              {applicationDetails.roleName === 'Zonal Agent Cordinator' ? (
                ''
              ) : (
                <Button
                  className="agent-info-button ms-3"
                  variant={
                    formatApplicationStatus(applicationDetails?.status) === 'Disabled'
                      ? `danger`
                      : 'success'
                  }
                >
                  {formatApplicationStatus(applicationDetails?.status)}
                </Button>
              )}
            </div>

            <div
              style={{
                maxWidth: '1000px',
                width: '100%',
                marginLeft: '10px',
                marginRight: '10px',
              }}
              className="content-box-summary mx-auto px-3"
            >
              <Accordion style={{ paddingTop: '50px', width: '100%' }} defaultActiveKey="0">
                {applicationDetails.roleName === 'Zonal Agent Cordinator' && (
                  <Accordion.Item style={{ width: '100%' }} className="accordion-item" eventKey="0">
                    <Accordion.Header>
                      Total Agents (
                      <span className="application-id-text">
                        {totalAgents ? totalAgents : 'N/A'}
                      </span>
                      )
                    </Accordion.Header>
                  </Accordion.Item>
                )}

                <Accordion.Item className="accordion-item" eventKey="1">
                  <Accordion.Header>
                    {applicationDetails.roleName === 'Zonal Agent Cordinator'
                      ? 'State/Location'
                      : 'Personal Information'}
                  </Accordion.Header>
                  <div
                    style={{
                      paddingLeft: '0px',
                      display: 'flex',
                    }}
                    className="px-2"
                  >
                    {applicationDetails.roleName === 'Zonal Agent Cordinator' ? (
                      <div className="d-flex justify-content-between w-100 px-sm-5">
                        <Accordion.Body>
                          State
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {zacState}
                          </span>
                        </Accordion.Body>
                      </div>
                    ) : (
                      <div className="d-flex w-100 px-sm-5">
                        <Accordion.Body>
                          First name
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.firstName}
                            <br />
                          </span>
                          Username
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {applicationDetails?.userName || 'N/A'}
                          </span>
                          <br />
                          Email
                          <span style={{ fontSize: '10px' }} className="accordion-body-span">
                            <br />
                            {applicationDetails?.email}
                            <br />
                          </span>
                          Date Of Birth
                          <span className="accordion-body-span">
                            <br />
                            {new Date(applicationDetails?.dob).toLocaleDateString() || 'N/A'}
                          </span>
                          <br />
                          Second Phone Number
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.secondPhoneNumber || 'N/A'}
                          </span>
                          <br />
                          Agent Category
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.roleName}
                          </span>
                        </Accordion.Body>
                        <Accordion.Body>
                          Last name
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.lastName}
                          </span>
                          <br />
                          Gender
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.gender === 'M' ? 'Male' : 'Female'}
                          </span>
                          <br />
                          Telephone Number
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.phoneNumber}
                          </span>
                          <br />
                          Nationality
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.nationality}
                          </span>
                          <br />
                          Highest Level Of Education
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.highestEducationalLevel !== 'N/A'
                              ? applicationDetails?.highestEducationalLevel
                              : 'Tertiary'}
                          </span>
                        </Accordion.Body>
                      </div>
                    )}
                  </div>
                </Accordion.Item>

                <Accordion.Item className="accordion-item" eventKey="2">
                  <Accordion.Header>
                    {applicationDetails.roleName === 'Zonal Agent Cordinator'
                      ? 'Agent Supervisor'
                      : 'Business Information'}
                  </Accordion.Header>
                  {applicationDetails.roleName === 'Zonal Agent Cordinator' ? (
                    <Accordion.Body>
                      <span
                        style={{ fontSize: '15px', paddingLeft: '0px' }}
                        className="agent-info-title"
                      >
                        Agent Supervisor Working Directly With {applicationDetails?.firstName}{' '}
                        {applicationDetails?.lastName}
                      </span>
                      <br />
                      <span
                        style={{ fontSize: '13px', paddingLeft: '0px' }}
                        className="dashboard-overview-span"
                      >
                        Here is a list of all the agent supervisors working directly with{' '}
                        {applicationDetails?.firstName} {applicationDetails?.lastName}.
                      </span>
                      <Alert
                        style={{ width: '100%' }}
                        className="super-list-card-alert"
                        variant="success"
                      >
                        <span style={{ width: '600px' }} className="agents-list-span-heading">
                          Agent Supervisors
                        </span>
                        {/*<span className="super-total-list">Total Agent Supervisors - 30</span>*/}
                      </Alert>
                      <Alert
                        style={{ left: '0px', width: '100%' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '70%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>State</th>
                              <th>Location</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{ASTableList}</tbody>
                        </Table>
                      </Alert>
                    </Accordion.Body>
                  ) : (
                    <div
                      style={{
                        paddingLeft: '0px',
                        display: 'flex',
                      }}
                      className="px-2"
                    >
                      <div className="d-flex w-100 px-sm-5">
                        <Accordion.Body>
                          Name of business
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {applicationDetails?.businessName}
                          </span>
                          <br />
                          Date of commencement
                          <span className="accordion-body-span">
                            <br />
                            {new Date(applicationDetails?.commencementDate).toLocaleDateString()}
                          </span>
                          <br />
                          Nature of business
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.businessNature}
                          </span>
                        </Accordion.Body>
                        <Accordion.Body>
                          Commencement Date
                          <span className="accordion-body-span">
                            <br />
                            {new Date(applicationDetails?.commencementDate).toLocaleDateString()}
                          </span>
                          <br />
                          Business reg number
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.registrationNumber}
                          </span>
                          <br />
                          Business address
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {applicationDetails?.businessAddress}
                          </span>
                        </Accordion.Body>
                      </div>
                    </div>
                  )}
                </Accordion.Item>

                <Accordion.Item className="accordion-item" eventKey="3">
                  <Accordion.Header>
                    {applicationDetails.roleName === 'Zonal Agent Cordinator'
                      ? 'Lead Aggregator'
                      : 'Region/Location'}
                  </Accordion.Header>
                  {applicationDetails.roleName === 'Zonal Agent Cordinator' ? (
                    <Accordion.Body>
                      <span
                        style={{ fontSize: '15px', paddingLeft: '0px' }}
                        className="agent-info-title"
                      >
                        Lead Aggregator
                      </span>
                      <br />
                      <span
                        style={{ fontSize: '13px', paddingLeft: '0px' }}
                        className="dashboard-overview-span"
                      >
                        Here is a list of all the lead aggregators working in Lagos region.
                      </span>
                      <Alert
                        style={{ width: '100%' }}
                        className="super-list-card-alert"
                        variant="success"
                      >
                        <span style={{ width: '600px' }} className="agents-list-span-heading">
                          Lead Aggregators
                        </span>
                        {/*<span className="super-total-list">Total Agent Supervisors - 30</span>*/}
                      </Alert>
                      <Alert
                        style={{ left: '0px', width: '100%' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>Location</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{LAGTableList}</tbody>
                        </Table>
                      </Alert>
                    </Accordion.Body>
                  ) : (
                    <div
                      style={{
                        paddingLeft: '0px',
                        display: 'flex',
                      }}
                      className="px-2"
                    >
                      <div className="d-flex w-100 px-sm-5">
                        <Accordion.Body>
                          State
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {applicationDetails?.state}
                          </span>
                          <br />
                          City
                          <span className="accordion-body-span">
                            {' '}
                            <br />
                            {applicationDetails?.city}
                          </span>
                        </Accordion.Body>
                        <Accordion.Body>
                          LGA
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.lga}
                          </span>
                          <br />
                          Address
                          <span className="accordion-body-span">
                            <br />
                            {applicationDetails?.regionAddress}
                          </span>
                        </Accordion.Body>
                      </div>
                    </div>
                  )}
                </Accordion.Item>

                <Accordion.Item className="accordion-item" eventKey="4">
                  <Accordion.Header>
                    {applicationDetails.roleName === 'Zonal Agent Cordinator'
                      ? 'Aggregator'
                      : 'Terms and Conditions'}
                  </Accordion.Header>
                  {applicationDetails.roleName === 'Zonal Agent Cordinator' ? (
                    <Accordion.Body>
                      <span
                        style={{ fontSize: '15px', paddingLeft: '0px' }}
                        className="agent-info-title"
                      >
                        Aggregator
                      </span>
                      <br />
                      <span
                        style={{ fontSize: '13px', paddingLeft: '0px' }}
                        className="dashboard-overview-span"
                      >
                        Here is a list of all the aggregators working in Lagos region.
                      </span>
                      <Alert
                        style={{ width: '100%' }}
                        className="super-list-card-alert"
                        variant="success"
                      >
                        <span style={{ width: '600px' }} className="agents-list-span-heading">
                          Aggregators
                        </span>
                        {/*<span className="super-total-list">Total Agent Supervisors - 30</span>*/}
                      </Alert>
                      <Alert
                        style={{ left: '0px', width: '100%' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>Location</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{AGGTableList}</tbody>
                        </Table>
                      </Alert>
                    </Accordion.Body>
                  ) : (
                    <Accordion.Body>
                      <span className="accordion-body-span">
                        {' '}
                        <br />
                        {applicationDetails?.firstName} accepted terms and conditions
                      </span>
                    </Accordion.Body>
                  )}
                </Accordion.Item>

                {applicationDetails.roleName === 'Zonal Agent Cordinator' && (
                  <Accordion.Item className="accordion-item" eventKey="5">
                    <Accordion.Header>Agent</Accordion.Header>
                    <Accordion.Body>
                      <span
                        style={{ fontSize: '15px', paddingLeft: '0px' }}
                        className="agent-info-title"
                      >
                        All Agents
                      </span>
                      <br />
                      <span
                        style={{ fontSize: '13px', paddingLeft: '0px' }}
                        className="dashboard-overview-span"
                      >
                        Here is a list of all the agents working in Lagos region.
                      </span>
                      <Alert
                        style={{ width: '100%' }}
                        className="super-list-card-alert"
                        variant="success"
                      >
                        <span style={{ width: '600px' }} className="agents-list-span-heading">
                          Agents
                        </span>
                        {/*<span className="super-total-list">Total Agent Supervisors - 30</span>*/}
                      </Alert>
                      <Alert
                        style={{ left: '0px', width: '100%' }}
                        className="agents-list-table-alert"
                        variant="success"
                      >
                        <Table style={{ width: '100%' }} hover className="agents-table-list">
                          <thead className="agents-list-table-header">
                            <tr>
                              <th></th>
                              <th>Name</th>
                              <th></th>
                              <th>Email Address</th>
                              <th>Region</th>
                              <th>Location</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>{AGTableList}</tbody>
                        </Table>
                      </Alert>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                <Accordion.Item className="accordion-item" eventKey="6">
                  <Accordion.Header>Actions</Accordion.Header>
                  <Accordion.Body>
                    <>
                      {(userRoleName === 'SuperAdmin' ||
                        userRoleName === 'Zonal Agent Cordinator') && (
                        <Button onClick={showRemapModal} className="btn-remap-agent mt-2">
                          <span className="btn-remap-agent-text">
                            <FontAwesomeIcon style={{ color: '#FFFFFF' }} icon={faEdit} /> Remap
                            Agent
                          </span>
                        </Button>
                      )}
                      {applicationDetails?.status === 'Active' ? (
                        <Button onClick={deleteAgent} className="btn-delete-agent mt-2">
                          <span className="btn-delete-agent-text">
                            <FontAwesomeIcon style={{ color: '#7F1D1D' }} icon={faTrashCan} />{' '}
                            Disable Agent
                          </span>
                        </Button>
                      ) : (
                        <span className="btn-delete-agent-text">
                          <FontAwesomeIcon style={{ color: '#7F1D1D' }} icon={faTrashCan} />{' '}
                          Application Disabled. Contact Support Center.
                        </span>
                      )}
                    </>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </Tab>
        </Tabs>
      </div>
      <RemapAgent show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default AgentInformation;
