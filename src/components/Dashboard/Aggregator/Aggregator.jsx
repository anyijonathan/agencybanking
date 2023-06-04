import {
  faCalendarDays,
  faCancel,
  faCircleCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactDatePicker from 'react-datepicker';
import {
  filterData,
  getSuperAdminAggregatorCalendarDashboardData,
  getSuperAdminDashboardData,
  getZacDashboardData,
  getOtherAggregatorDashboardInfo,
} from '../../../store/actions';
import { getOtherUsersAggregatorsCalendarDashboardData } from '../../../store/actions/dashboard';

const Aggregator = ({
  dispatch,
  AGSStateList,
  authData,
  ZAGGSDetailsList,
  numberOfZAGGSs,
  aggregatorDetailsList,
  setModalShow,
}) => {
  const [isOpenAggregator, setIsOpenAggregator] = useState(false);
  const [aggregatorStartDate, setAggregatorStartDate] = useState(new Date());
  const [aggregatorEndDate, setAggregatorEndDate] = useState(null);
  const [checkedAggregator, setCheckedAggregator] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const stateValueRef = useRef(null);
  const aggregatorSearchItems = (aggregatorSearchValue) => {
    dispatch(filterData({ dataType: 'aggregator', value: aggregatorSearchValue }));
  };

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
    aggregatorSearchItems(searchValue);
  };

  const handleAggregatorClearDateFilter = () => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getSuperAdminAggregatorCalendarDashboardData(null, null));
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData, (null, null));
    } else {
      dispatch(getOtherAggregatorDashboardInfo());
    }
    setSearchValue('');
    stateValueRef.current && (stateValueRef.current.value = 'Select State');
  };
  const handleStateChange = (agState) => {
    if (agState) {
      dispatch(getSuperAdminDashboardData(null, null, agState));
    }
  };

  const handleStateValue = () => {
    stateValueRef.current && handleStateChange(stateValueRef?.current?.value);
  };

  const handleClickAggregator = (e) => {
    e.preventDefault();
    setIsOpenAggregator(!isOpenAggregator);
  };

  const handleChangeAggregator = async (dates) => {
    const [startAggregator, endAggregator] = dates;
    setAggregatorStartDate(startAggregator);
    setAggregatorEndDate(endAggregator);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        const response = await dispatch(
          getSuperAdminAggregatorCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setAggregatorStartDate('');
          setAggregatorEndDate('');
        }
        setIsOpenAggregator(!isOpenAggregator);
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setAggregatorStartDate('');
          setAggregatorEndDate('');
        }
        setIsOpenAggregator(!isOpenAggregator);
      } else {
        const response = await dispatch(
          getOtherUsersAggregatorsCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setAggregatorStartDate('');
          setAggregatorEndDate('');
        }
        setIsOpenAggregator(!isOpenAggregator);
      }
    }
  };

  const handleAggregatorCheck = (event, dataObject) => {
    var updatedList = [...checkedAggregator];
    if (event.target.checked) {
      updatedList = [...checkedAggregator, dataObject];
    } else {
      updatedList = checkedAggregator.filter((f) => f.accountNumber !== dataObject.accountNumber);
    }
    setCheckedAggregator(updatedList);
  };

  const displayAggregatorTableListButton = () => {
    if (ZAGGSDetailsList.length > 0 || aggregatorDetailsList.length > 0) {
      if (checkedAggregator.length > 0) {
        return (
          <CSVLink filename={'selected_aggregators_list.csv'} data={checkedAggregator}>
            <Button className="button-download-report">
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </CSVLink>
        );
      } else {
        return (
          <CSVLink
            filename={'aggregators_list.csv'}
            data={ZAGGSDetailsList.length ? ZAGGSDetailsList : aggregatorDetailsList}
          >
            <Button className="button-download-report">
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </CSVLink>
        );
      }
    } else {
      return (
        <Button disabled="disabled" className="button-download-report">
          <FontAwesomeIcon icon={faDownload} /> Download
        </Button>
      );
    }
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

  const aggregatorLeadTableList = aggregatorDetailsList.map((info, key) => {
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

  return (
    <>
      <div className="d-flex flex-lg-row mb-4 mb-lg-0 flex-column">
        <div className="w-100 pe-3">
          <Form onSubmit={(event) => event.preventDefault()} className="search-for-agents">
            <Form.Group className="mb-3">
              <Form.Control
                value={searchValue}
                onChange={handleSearchInput}
                type="text"
                className="search-for-agents-input"
                placeholder="Search for aggregators"
              />
            </Form.Group>
          </Form>
        </div>

        <div
          style={{ maxWidth: '700px' }}
          className="d-flex px-4 flex-column align-items-end flex-sm-row mb-5 w-100"
        >
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
            onClick={handleAggregatorClearDateFilter}
            style={{ width: '200px', marginRight: '5px' }}
            className="button-download-report"
          >
            <FontAwesomeIcon icon={faCancel} />
            Clear Filter
          </Button>
          <Button
            onClick={handleClickAggregator}
            style={{ marginTop: '20px', marginRight: '5px' }}
            className="btn dashboard-date-picker-button"
          >
            <FontAwesomeIcon icon={faCalendarDays} />
            Select Period
          </Button>
          {isOpenAggregator && (
            <div>
              <ReactDatePicker
                onClickOutside={() => setIsOpenAggregator(false)}
                selected={aggregatorStartDate}
                onChange={handleChangeAggregator}
                startDate={aggregatorStartDate}
                endDate={aggregatorEndDate}
                maxDate={new Date()}
                selectsRange
                inline
              />
            </div>
          )}

          {displayAggregatorTableListButton()}
        </div>
      </div>
      <div className="mx-auto w-100 px-3">
        <Alert className="agents-list-card-alert" variant="success">
          <span style={{ width: '600px' }} className="agents-list-span-heading">
            Aggregators
          </span>
        </Alert>
        {authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'LeadAggregator' ? (
          <Alert className="agents-list-table-alert" variant="success">
            {numberOfZAGGSs > 0 ? (
              <Table style={{ width: '100%' }} hover className="agents-table-list">
                <thead className="agents-list-table-header">
                  <tr>
                    <th></th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>State</th>
                    <th>Stage</th>
                    <th>T/Agents</th>
                  </tr>
                </thead>
                <tbody>{zonalAgentCoordinatorAGGSDefaultTableList}</tbody>
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
    </>
  );
};

export default Aggregator;
