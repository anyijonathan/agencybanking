import { useContext, useMemo, useState } from 'react';
import { Alert, Button, Tab, Table } from 'react-bootstrap';
import CanvasJSReact from '../../../../utils/CanvasCharts/canvasjs.react';
import Pagination from '../../Pagination/Pagination';
import TableHeader from '../../../TableHeader/TableHeader';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TopLeadAggregators = ({
  authData,
  ALGDetailsList,
  ZLAGSDetailsList,
  ZACDataPoints,
  numberOfALGs,
  numberOfZLAGSs,
  PageSize,
  currentPage,
  setCurrentPage,
  chartOptions,
}) => {
  const [modalShow, setModalShow] = useState(false);

  const LAGSTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return ZLAGSDetailsList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  const zonalAgentCoordinatorLAGSDefaultTableList = ZLAGSDetailsList.map((info, key) => {
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

  return (
    <>
      <Alert className="agents-list-card-alert" variant="success">
        <span style={{ width: '600px' }} className="agents-list-span-heading">
          Top Lead Aggregators
        </span>
      </Alert>
      {numberOfALGs > 0 || numberOfZLAGSs > 0 ? (
        <Alert style={{ display: 'flex' }} className="agents-list-table-alert" variant="success">
          {numberOfZLAGSs > 0 ? (
            <>
              <Table style={{ width: '50%' }} hover className="agents-table-list">
                <TableHeader
                  className={'agents-list-table-header'}
                  tableHeading={['First Name', 'Last Name', 'State', 'Stage', 'T/Agents']}
                />
                <tbody>
                  {numberOfZLAGSs > 0 && zonalAgentCoordinatorLAGSTableList.length > 0
                    ? zonalAgentCoordinatorLAGSTableList
                    : zonalAgentCoordinatorLAGSDefaultTableList.slice(0, 10)}
                </tbody>
              </Table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={ZLAGSDetailsList.length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
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
                  <th>T/Agents</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{topLeadAggretatorTableList.length > 0 && topLeadAggretatorTableList}</tbody>
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

export default TopLeadAggregators;
