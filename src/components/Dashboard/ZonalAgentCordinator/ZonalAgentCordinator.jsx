import { format } from 'date-fns';
import React, { useState } from 'react';
import { Alert, Form, Table } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { filterData } from '../../../store/actions';
import TableHeader from '../../TableHeader/TableHeader';

const ZonalAgentCordinator = ({
  ZACDetailsList,
  dispatch,
  getSuperAdminDashboardData,
  getZacDashboardData,
  authData,
}) => {
  const [zonalStartDate, setZonalStartDate] = useState(new Date());
  const [zonalEndDate, setZonalEndDate] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isOpenZonal, setIsOpenZonal] = useState(false);
  const handleClickZonal = (e) => {
    e.preventDefault();
    setIsOpenZonal(!isOpenZonal);
  };

  const zonalSearchItems = (zonalSearchValue) => {
    dispatch(filterData({ dataType: 'zonal', value: zonalSearchValue }));
  };

  const handleChangeZonal = async (dates) => {
    const [startZonal, endZonal] = dates;
    setZonalStartDate(startZonal);
    setZonalEndDate(endZonal);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        const response = await dispatch(
          getSuperAdminDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setZonalStartDate('');
          setZonalEndDate('');
        }
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setZonalStartDate('');
          setZonalEndDate('');
        }
      }
    }
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
  return (
    <>
      <div className="dashboard-action-fragment">
        <Form onSubmit={(event) => event.preventDefault()} className="search-for-agents">
          <Form.Group className="mb-3">
            <Form.Control
              onChange={(e) => zonalSearchItems(e.target.value)}
              type="text"
              className="search-for-agents-input"
              placeholder="Search for agents"
            />
          </Form.Group>
        </Form>

        {isOpenZonal && (
          <DatePicker
            onClickOutside={() => setIsOpenZonal(false)}
            selected={startDate}
            onChange={handleChangeZonal}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        )}
      </div>
      <div className="mx-auto w-100 px-3">
        <Alert className="agents-list-card-alert" variant="success">
          <span style={{ width: '600px' }} className="agents-list-span-heading">
            Zonal Agent Coordinator
          </span>
        </Alert>
        <Alert className="agents-list-table-alert" variant="success">
          <Table style={{ width: '100%' }} hover className="agents-table-list">
            <TableHeader
              className="agents-list-table-header"
              tableHeading={[
                'First Name',
                'Last Name',
                'Email Address',
                'State',
                'Total Agents',
                'Action',
              ]}
            />

            <tbody>{topZonalAgentCoordinatorTableList}</tbody>
          </Table>
        </Alert>
      </div>
    </>
  );
};

export default ZonalAgentCordinator;
