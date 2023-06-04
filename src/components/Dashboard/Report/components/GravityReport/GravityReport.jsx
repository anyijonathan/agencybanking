import { faCalendarDays, faCancel, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Alert, Button, Form, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactDatePicker from 'react-datepicker';
import {
  getSuperAdminGravityCalendarDashboardData,
  getZacDashboardData,
} from '../../../../../store/actions';

const GravityReport = ({ dispatch, authData, GravityReportDetailsList }) => {
  const [tier, setTier] = useState('');
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [gravityStartDate, setGravityStartDate] = useState(new Date());
  const [gravityEndDate, setGravityEndDate] = useState(null);
  const [checkedGravity, setCheckedGravity] = useState([]);

  const handleTierChange = (tier) => {
    setTier(tier);
    if (tier) {
      dispatch(getSuperAdminGravityCalendarDashboardData(tier, null, null));
    }
  };

  const handleReportClearDateFilter = () => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getSuperAdminGravityCalendarDashboardData(null));
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData(null, null));
    }
  };

  const handleClickReport = (e) => {
    e.preventDefault();
    setIsOpenReport(!isOpenReport);
  };

  const handleChangeGravity = async (dates) => {
    const [start, end] = dates;
    setGravityStartDate(start);
    setGravityEndDate(end);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        const response = await dispatch(
          getSuperAdminGravityCalendarDashboardData(
            tier,
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setGravityStartDate('');
          setGravityEndDate('');
        }
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setGravityStartDate('');
          setGravityEndDate('');
        }
      }
      setIsOpenReport(false);
      //setIsOpen(!isOpen);
    }
  };

  const handleGravityCheck = (event, dataObject) => {
    var updatedList = [...checkedGravity];
    if (event.target.checked) {
      updatedList = [...checkedGravity, dataObject];
    } else {
      updatedList = checkedGravity.filter((f) => f.accountNumber !== dataObject.accountNumber);
    }
    setCheckedGravity(updatedList);
  };

  const gravityReportTableList = GravityReportDetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>
          <input
            value={Object.values(info)}
            type="checkbox"
            onChange={(e) => handleGravityCheck(e, info)}
          />
        </td>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.phoneNumber}</td>
        <td>{info.tier}</td>
      </tr>
    );
  });

  return (
    <>
      <Alert className="agents-list-card-alert" variant="success">
        <span style={{ width: '400px' }} className="agents-list-span-heading">
          Gravity Report
        </span>
        <Form.Select
          onChange={(e) => handleTierChange(e.target.value)}
          style={{
            marginTop: '10px',
            height: '40px',
            width: '200px',
            marginLeft: '400px',
          }}
          aria-label="Select Tier"
        >
          <option>Select Tier</option>
          <option key="TIER1" value="TIER1">
            Tier 1
          </option>
          <option key="TIER2" value="TIER2">
            Tier 2
          </option>
          <option key="TIER3" value="TIER3">
            Tier 3
          </option>
        </Form.Select>
        <Button
          onClick={handleReportClearDateFilter}
          style={{ width: '300px', marginTop: '10px' }}
          className="button-download-report"
        >
          <FontAwesomeIcon icon={faCancel} />
          Clear Filter
        </Button>
        <Button
          onClick={handleClickReport}
          style={{ width: '350px', marginTop: '10px' }}
          className="btn dashboard-date-picker-button"
        >
          <FontAwesomeIcon icon={faCalendarDays} />
          Select Period
        </Button>
        {isOpenReport && (
          <ReactDatePicker
            onClickOutside={() => setIsOpenReport(false)}
            selected={gravityStartDate}
            onChange={handleChangeGravity}
            startDate={gravityStartDate}
            endDate={gravityEndDate}
            selectsRange
            maxDate={new Date()}
            inline
          />
        )}
        {checkedGravity.length > 0 && (
          <CSVLink filename={'selected_gravity_report.csv'} data={checkedGravity}>
            <Button style={{ marginTop: '10px' }} className="button-download-report">
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </CSVLink>
        )}
      </Alert>
      {authData?.RoleName === 'SuperAdmin' && (
        <Alert style={{ display: 'flex' }} className="agents-list-table-alert" variant="success">
          <Table hover className="agents-table-list">
            <thead className="agents-list-table-header">
              <tr>
                <th></th>
                <th>Name</th>
                <th></th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>{gravityReportTableList && gravityReportTableList}</tbody>
          </Table>
        </Alert>
      )}
    </>
  );
};

export default GravityReport;
