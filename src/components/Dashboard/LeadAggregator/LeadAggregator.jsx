import { faCalendarDays, faCancel, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactDatePicker from 'react-datepicker';
import {
  filterData,
  getSuperAdminDashboardData,
  getSuperAdminLeadAggregatorCalendarDashboardData,
  getZacDashboardData,
} from '../../../store/actions';
import {
  getOtherAggregatorDashboardInfo,
  getOtherUsersAggregatorsCalendarDashboardData,
  getOtherUsersLeadAggregatorsCalendarDashboardData,
} from '../../../store/actions/dashboard';

const LeadAggregator = ({ dispatch, AGSStateList, authData, ALGDetailsList }) => {
  const [isOpenLeadAggregator, setIsOpenLeadAggregator] = useState(false);
  const [leadAggregatorStartDate, setLeadAggregatorStartDate] = useState(new Date());
  const [leadAggregatorEndDate, setLeadAggregatorEndDate] = useState(null);
  const [checkedLeadAggregator, setCheckedLeadAggregator] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const stateValueRef = useRef(null);
  const [aggregatorEndDate, setAggregatorEndDate] = useState(null);
  const leadSearchItems = (leadSearchValue) => {
    dispatch(filterData({ dataType: 'leadSupervisor', value: leadSearchValue }));
  };

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
    leadSearchItems(searchValue);
  };

  const handleStateChange = (agState) => {
    if (agState) {
      dispatch(getSuperAdminDashboardData(null, null, agState));
    }
  };

  const handleStateValue = () => {
    stateValueRef.current && handleStateChange(stateValueRef?.current?.value);
  };

  const handleLeadAggregatorClearDateFilter = () => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getSuperAdminLeadAggregatorCalendarDashboardData(null, null));
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData(null, null));
    }
    setSearchValue('');
    stateValueRef.current && (stateValueRef.current.value = 'Select State');
  };

  const handleClickLeadAggregator = (e) => {
    e.preventDefault();
    setIsOpenLeadAggregator(!isOpenLeadAggregator);
  };

  const handleChangeLeadAggregator = async (dates) => {
    const [startLeadAggregator, endLeadAggregator] = dates;
    setLeadAggregatorStartDate(startLeadAggregator);
    setLeadAggregatorEndDate(endLeadAggregator);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        const response = await dispatch(
          getSuperAdminLeadAggregatorCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setLeadAggregatorStartDate('');
          setLeadAggregatorEndDate('');
        }
        setIsOpenLeadAggregator(!isOpenLeadAggregator);
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setLeadAggregatorStartDate('');
          setLeadAggregatorEndDate('');
        }
        setIsOpenLeadAggregator(!isOpenLeadAggregator);
      }
    }
  };

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

  const displayLeadAggregatorTableListButton = () => {
    if (ALGDetailsList.length > 0) {
      if (checkedLeadAggregator.length > 0) {
        return (
          <CSVLink filename={'selected_lead_aggregators_list.csv'} data={checkedLeadAggregator}>
            <Button className="button-download-report">
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </CSVLink>
        );
      } else {
        return (
          <CSVLink
            filename={'lead_aggregators_list.csv'}
            data={aggregatorEndDate ? ALGDetailsList : ALGDetailsList}
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

  return (
    <>
      <div className="dashboard-action-fragment">
        <Form
          onSubmit={(event) => event.preventDefault()}
          className="search-for-agents"
          style={{ paddingRight: '115px' }}
        >
          <Form.Group className="mb-3">
            <Form.Control
              value={searchValue}
              onChange={handleSearchInput}
              type="text"
              className="search-for-agents-input"
              placeholder="Search for lead aggregators"
            />
          </Form.Group>
        </Form>
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
          onClick={handleLeadAggregatorClearDateFilter}
          style={{ width: '200px', marginRight: '5px' }}
          className="button-download-report"
        >
          <FontAwesomeIcon icon={faCancel} />
          Clear Filter
        </Button>
        <Button
          onClick={handleClickLeadAggregator}
          style={{ marginTop: '20px', marginRight: '5px' }}
          className="btn dashboard-date-picker-button"
        >
          <FontAwesomeIcon icon={faCalendarDays} />
          Select Period
        </Button>
        {isOpenLeadAggregator && (
          <ReactDatePicker
            onClickOutside={() => setIsOpenLeadAggregator(false)}
            selected={leadAggregatorStartDate}
            onChange={handleChangeLeadAggregator}
            startDate={leadAggregatorStartDate}
            endDate={leadAggregatorEndDate}
            maxDate={new Date()}
            selectsRange
            inline
          />
        )}

        {displayLeadAggregatorTableListButton()}
      </div>
      <div className="mx-auto w-100 px-3">
        <Alert className="agents-list-card-alert" variant="success">
          <span style={{ width: '300px' }} className="agents-list-span-heading">
            Lead Aggregators
          </span>
        </Alert>
        <Alert className="agents-list-table-alert" variant="success">
          {ALGDetailsList.length > 0 ? (
            <Table style={{ width: '100%' }} hover className="agents-table-list">
              <thead className="agents-list-table-header">
                <tr>
                  <th></th>
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
          ) : (
            <Table style={{ width: '100%' }} hover className="agents-table-list">
              <thead className="agents-list-table-header">
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email Address</th>
                  <th>Region</th>
                  <th>Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{leadAggregatorTableList}</tbody>
            </Table>
          )}
        </Alert>
      </div>
    </>
  );
};

export default LeadAggregator;
