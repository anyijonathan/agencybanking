import { faCalendarDays, faCancel, faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Button, Form, Tab, Tabs } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import ReactDatePicker from 'react-datepicker';
import {
  filterData,
  getOtherAggregatorDashboardInfo,
  getSuperAdminAgentCalendarDashboardData,
  getSuperAdminDashboardData,
  getZacDashboardData,
  getOtherUsersAgentsCalendarDashboardData,
} from '../../../store/actions';
import Agents from './components/Agents/Agents';

const Agent = ({
  authData,
  dispatch,
  AGSStateList,
  setModalShow,
  ZASDetailsList,
  AGDetailsList,
  agentDetailsList,
  // subAgentDetailsList
}) => {
  const [isOpenAgent, setIsOpenAgent] = useState(false);
  const [agentStartDate, setAgentStartDate] = useState(new Date());
  const [agentEndDate, setAgentEndDate] = useState(null);
  const [checkedAgent, setCheckedAgent] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const stateValueRef = useRef(null);
  const [keyP, setKeyP] = useState('agent');

  const handleClickAgent = (e) => {
    e.preventDefault();
    setIsOpenAgent(!isOpenAgent);
  };

  const subAgentSearchItems = (agentSearchValue) => {
    dispatch(filterData({ dataType: 'agent', value: agentSearchValue }));
  };

  const handleSearchInput = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
    subAgentSearchItems(searchValue);
  };

  const handleAgentClearDateFilter = () => {
    if (authData?.RoleName === 'SuperAdmin') {
      dispatch(getSuperAdminAgentCalendarDashboardData(null, null));
    } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
      dispatch(getZacDashboardData(null, null));
    } else {
      dispatch(getOtherAggregatorDashboardInfo());
    }
    setSearchValue('');
    stateValueRef.current && (stateValueRef.current.value = 'Select State');
  };

  const handleChangeAgent = async (dates) => {
    const [startAgent, endAgent] = dates;
    setAgentStartDate(startAgent);
    setAgentEndDate(endAgent);
    if (dates[1]) {
      if (authData?.RoleName === 'SuperAdmin') {
        //   Date filter action for Super Admin

        const response = await dispatch(
          getSuperAdminAgentCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );

        if (response) {
          setAgentStartDate('');
          setAgentEndDate('');
        }
        setIsOpenAgent(!isOpenAgent);
      } else if (authData?.RoleName === 'Zonal Agent Cordinator') {
        //   Date filter action for Zonal Agent Cordinator
        const response = await dispatch(
          getZacDashboardData(format(dates[0], 'yyyy-MM-dd'), format(dates[1], 'yyyy-MM-dd'))
        );
        if (response) {
          setAgentStartDate('');
          setAgentEndDate('');
        }
        setIsOpenAgent(!isOpenAgent);
      } else {
        //   Date filter action for other users
        const response = await dispatch(
          getOtherUsersAgentsCalendarDashboardData(
            format(dates[0], 'yyyy-MM-dd'),
            format(dates[1], 'yyyy-MM-dd')
          )
        );
        if (response) {
          setAgentStartDate('');
          setAgentEndDate('');
        }
        setIsOpenAgent(!isOpenAgent);
      }
    }
  };

  const handleStateChange = (agState) => {
    if (agState) {
      dispatch(getSuperAdminDashboardData(null, null, agState));
    }
  };

  const handleStateValue = () => {
    stateValueRef.current && handleStateChange(stateValueRef?.current?.value);
  };

  const displayAgentTableListButton = () => {
    if (ZASDetailsList.length > 0 || agentDetailsList.length > 0) {
      if (checkedAgent.length > 0) {
        return (
          <CSVLink filename={'selected_agents_list.csv'} data={checkedAgent}>
            <Button className="button-download-report">
              <FontAwesomeIcon icon={faDownload} /> Download
            </Button>
          </CSVLink>
        );
      } else {
        return (
          <CSVLink
            filename={'agents_list.csv'}
            data={ZASDetailsList.length ? ZASDetailsList : agentDetailsList}
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
      <div className="dashboard-top-fragment">
        <span style={{ paddingLeft: '30px' }} className="dashboard-user-name-span">
          Agents
        </span>
      </div>
      <div className="mx-4">
        <span className="dashboard-overview-span ">
          Here is a list of all agents you have onboarded.
        </span>
      </div>

      <div className="dashboard-action-fragment w-100 px-2 d-flex flex-column flex-lg-row">
        <div className="d-flex flex-column flex-lg-row w-100">
          <div className="w-100">
            <Form onSubmit={(event) => event.preventDefault()} className="search-for-agents">
              <Form.Group>
                <Form.Control
                  onChange={handleSearchInput}
                  value={searchValue}
                  type="text"
                  className="search-for-agents-input"
                  placeholder="Search for agents"
                />
              </Form.Group>
            </Form>
          </div>
          <div className="w-100 px-3 gap-2 d-flex mt-lg-4">
            <Button onClick={handleClickAgent} className="btn dashboard-date-picker-button">
              <FontAwesomeIcon icon={faCalendarDays} />
              Select Period
            </Button>
            <Button
              style={{ width: '233px', marginLeft: '10px' }}
              onClick={handleAgentClearDateFilter}
              className="btn dashboard-date-picker-button"
            >
              <FontAwesomeIcon icon={faCancel} />
              Clear Filter
            </Button>
            {isOpenAgent && (
              <ReactDatePicker
                onClickOutside={() => setIsOpenAgent(false)}
                selected={agentStartDate}
                onChange={handleChangeAgent}
                startDate={agentStartDate}
                endDate={agentEndDate}
                selectsRange
                inline
                maxDate={new Date()}
              />
            )}
          </div>
        </div>

        <div className="mx-3">
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

          <Button onClick={() => setModalShow(true)} className="button-create-agent">
            <FontAwesomeIcon />{' '}
            <span className="btn-create-agent-text">
              <FontAwesomeIcon style={{ paddingTop: '6px' }} icon={faPlus} size="lg" /> Create Agent
            </span>
          </Button>

          {displayAgentTableListButton()}
        </div>
      </div>
      <Tabs id="controlled-tab-example" activeKey={keyP} onSelect={(k) => setKeyP(k)}>
        <Tab eventKey="agent" title="Agents">
          <div className="mx-auto w-100 px-3">
            <Agents setModalShow={setModalShow} />
          </div>
        </Tab>
      </Tabs>
    </>
  );
};

export default Agent;
