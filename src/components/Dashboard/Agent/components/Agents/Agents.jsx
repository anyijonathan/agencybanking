import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import { Alert, Button, Tab, Table } from 'react-bootstrap';
import { Store } from '../../../../../store';

const Agents = ({ setModalShow }) => {
  const [checkedAgent, setCheckedAgent] = useState([]);
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
      dashboard: { ZASDetailsList, agentDetailsList, numberOfZASs },
    },
  } = useContext(Store);

  const agentsTableList = agentDetailsList.map((info, key) => {
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

  const handleAgentCheck = (event, dataObject) => {
    var updatedList = [...checkedAgent];
    if (event.target.checked) {
      updatedList = [...checkedAgent, dataObject];
    } else {
      updatedList = checkedAgent.filter((f) => f.accountNumber !== dataObject.accountNumber);
    }
    setCheckedAgent(updatedList);
  };

  const zonalAgentCoordinatorASTableList = ZASDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={Object.values(info)}
            type="checkbox"
            onChange={(e) => handleAgentCheck(e, info)}
          />
        </td>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
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
                  <th></th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>State</th>
                  <th>Location</th>
                  <th>Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{zonalAgentCoordinatorASTableList}</tbody>
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
              <tbody>{agentsTableList}</tbody>
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
    </>
  );
};

export default Agents;
