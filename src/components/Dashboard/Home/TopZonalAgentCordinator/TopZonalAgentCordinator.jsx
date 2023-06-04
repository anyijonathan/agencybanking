import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import CanvasJSReact from '../../../../utils/CanvasCharts/canvasjs.react';
import TableHeader from '../../../TableHeader/TableHeader';

const TopZonalAgentCordinator = ({ numberOfZACs, ZACDetailsList, chartOptions, setModalShow }) => {
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
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
  return (
    <>
      <Alert className="agents-list-card-alert" variant="success">
        <span style={{ width: '700px' }} className="agents-list-span-heading">
          Top Zonal Agent Coordinators
        </span>
      </Alert>
      {numberOfZACs > 0 ? (
        <Alert style={{ display: 'flex' }} className="agents-list-table-alert" variant="success">
          <Table style={{ width: '50%' }} hover className="agents-table-list">
            <TableHeader
              className={'agents-list-table-header'}
              tableHeading={['First Name', 'Last Name', 'Email', 'State', 'T/Agents', 'Action']}
            />

            <tbody>{numberOfZACs > 0 && topZonalAgentCoordinatorTableList}</tbody>
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
    </>
  );
};

export default TopZonalAgentCordinator;
