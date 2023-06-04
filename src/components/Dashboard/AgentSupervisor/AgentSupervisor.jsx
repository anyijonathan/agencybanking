import { faCalendarDays, faCancel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import {
  filterData,
  getSuperAdminDashboardData,
  getSuperAdminSupervisorCalendarDashboardData,
  getZacDashboardData,
} from '../../../store/actions';

const AgentSupervisor = ({ dispatch, AGSStateList, authData, ZAGSDetailsList, AGSDetailsList }) => {
  const [isOpenSupervisor, setIsOpenSupervisor] = useState(false);
  const [supervisorStartDate, setSupervisorStartDate] = useState(new Date());
  const [supervisorEndDate, setSupervisorEndDate] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const stateValueRef = useRef(null);
  const supervisorSearchItems = (supervisorSearchValue) => {
    dispatch(filterData({ dataType: 'supervisor', value: supervisorSearchValue }));
  };

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
    supervisorSearchItems(searchValue);
  };

  const handleStateChange = (agState) => {
    if (agState) {
      dispatch(getSuperAdminDashboardData(null, null, agState));
    }
  };

  const handleStateValue = () => {
    stateValueRef.current && handleStateChange(stateValueRef?.current?.value);
  };

  const handleClickSupervisor = (e) => {
    e.preventDefault();
    setIsOpenSupervisor(!isOpenSupervisor);
  };

  const handleSupervisorClearDateFilter = () => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getSuperAdminSupervisorCalendarDashboardData(null, null));
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData(null, null));
    }
    setSearchValue('');
    stateValueRef.current && (stateValueRef.current.value = 'Select State');
  };

  const handleChangeSupervisor = async (dates) => {
    const [startSupervisor, endSupervisor] = dates;
    setSupervisorStartDate(startSupervisor);
    setSupervisorEndDate(endSupervisor);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        const response = await dispatch(
          getSuperAdminSupervisorCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setSupervisorStartDate('');
          setSupervisorEndDate('');
        }
        setIsOpenSupervisor(!isOpenSupervisor);
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setSupervisorStartDate('');
          setSupervisorEndDate('');
        }
        setIsOpenSupervisor(!isOpenSupervisor);
      }
    }
  };

  const zonalAgentCoordinatorAGSTableList = ZAGSDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.state}</td>
        <td>
          <Alert className="alert-table-action" variant="success">
            {info.status}
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

  return (
    <>
      <div className="dashboard-action-fragment">
        <Form
          onSubmit={(event) => event.preventDefault()}
          className="search-for-agents"
          style={{ paddingRight: '200px' }}
        >
          <Form.Group className="mb-3">
            <Form.Control
              value={searchValue}
              onChange={handleSearchInput}
              type="text"
              className="search-for-agents-input"
              placeholder="Search for agent supervisors"
            />
          </Form.Group>
        </Form>
        {/*<Button style={{ width: "190px" }} className="button-create-agent"><FontAwesomeIcon style={{ paddingTop: "6px" }} icon={faArrowUpWideShort} /> Sort by</Button>*/}
        {authData?.RoleName === 'SuperAdmin' && (
          <Form.Select
            onChange={handleStateValue}
            ref={stateValueRef}
            style={{ marginTop: '20px', height: '40px', width: '200px' }}
            aria-label="Select State"
          >
            <option>Select State</option>
            {AGSStateList &&
              AGSStateList.map((s, key) => (
                <option key={key} value={s.state}>
                  {s.state}
                </option>
              ))}
          </Form.Select>
        )}
        <Button
          onClick={handleSupervisorClearDateFilter}
          style={{ width: '300px', marginRight: '5px' }}
          className="button-download-report"
        >
          <FontAwesomeIcon icon={faCancel} />
          Clear Filter
        </Button>
        <Button
          onClick={handleClickSupervisor}
          style={{ marginTop: '20px', marginRight: '100px' }}
          className="btn dashboard-date-picker-button"
        >
          <FontAwesomeIcon icon={faCalendarDays} />
          Select Period
        </Button>
        {isOpenSupervisor && (
          <ReactDatePicker
            onClickOutside={() => setIsOpenSupervisor(false)}
            selected={supervisorStartDate}
            onChange={handleChangeSupervisor}
            startDate={supervisorStartDate}
            endDate={supervisorEndDate}
            maxDate={new Date()}
            selectsRange
            inline
          />
        )}
      </div>

      <div className="mx-auto w-100 px-3">
        <Alert className="agents-list-card-alert" variant="success">
          <span style={{ width: '600px' }} className="agents-list-span-heading">
            Agent Supervisor
          </span>
        </Alert>
        <Alert className="agents-list-table-alert" variant="success">
          {authData?.RoleName === 'SuperAdmin' ||
          authData?.RoleName === 'Zonal Agent Cordinator' ? (
            <>
              <Table style={{ width: '100%' }} hover className="agents-table-list">
                <thead className="agents-list-table-header">
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>State</th>
                    <th>Stage</th>
                    <th>T/Agents</th>
                  </tr>
                </thead>
                <tbody>{zonalAgentCoordinatorAGSTableList}</tbody>
              </Table>
            </>
          ) : (
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
              <tbody>{topAgentSupervisorTableList}</tbody>
            </Table>
          )}
        </Alert>
      </div>
    </>
  );
};

export default AgentSupervisor;
