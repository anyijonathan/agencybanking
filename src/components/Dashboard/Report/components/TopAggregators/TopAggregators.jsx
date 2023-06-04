import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import CanvasJSReact from '../../../../../utils/CanvasCharts/canvasjs.react';
import Pagination from '../../../Pagination/Pagination';

const TopAggregators = ({
  AGGDetailsList,
  numberOfZAGGSs,
  ZAGGSTableData,
  ZAGGSDetailsList,
  authData,
  chartOptions,
  setModalShow,
  setCurrentPage1,
  currentPage1,
}) => {
  const [checkedAggregator, setCheckedAggregator] = useState([]);
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  let PageSize = 10;
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

  return (
    <>
      <Alert className="agents-list-card-alert" variant="success">
        <span style={{ width: '300px' }} className="agents-list-span-heading">
          Top Aggregators
        </span>
      </Alert>
      {topAggregatorTableList.length > 0 || numberOfZAGGSs > 0 ? (
        <Alert style={{ display: 'flex' }} className="agents-list-table-alert" variant="success">
          {numberOfZAGGSs > 0 ? (
            <>
              <Table style={{ width: '50%' }} hover className="agents-table-list">
                <thead className="agents-list-table-header">
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>State</th>
                    <th>Stage</th>
                    <th>T/Agents</th>
                  </tr>
                </thead>
                <tbody>
                  {numberOfZAGGSs > 0 && zonalAgentCoordinatorAGGSTableList.length > 0
                    ? zonalAgentCoordinatorAGGSTableList
                    : zonalAgentCoordinatorAGGSDefaultTableList.slice(0, 10)}
                </tbody>
              </Table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPage1}
                totalCount={ZAGGSDetailsList.length}
                pageSize={PageSize}
                onPageChange={(page1) => setCurrentPage1(page1)}
              />
            </>
          ) : (
            <Table style={{ width: '50%' }} hover className="agents-table-list">
              <thead className="agents-list-table-header">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>State</th>
                  <th>M/Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{topAggregatorTableList.length > 0 && topAggregatorTableList}</tbody>
            </Table>
          )}
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
    </>
  );
};

export default TopAggregators;
