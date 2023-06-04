import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faCircleUser,
  faCircleCheck,
  faClock,
  faPlus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import PersonalInformation from './PersonalInformation/PersonalInformation';
import './Profile.scss';
import background from '../../assets/images/dashboard-summary-single-card.png';
import BusinessInformation from './BusinessInformation/BusinessInformation';
import RegionLocation from './RegionLocation/RegionLocation';
import AccountSettings from './AccountSettings/AccountSettings';
import LoadingIndicator from '../../utils/LoadingIndicator/LoadingIndicator';
import { Store } from '../../store';

const Profile = () => {
  //const token = getStoredToken()
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
    },
    dispatch,
  } = useContext(Store);

  const [key, setKey] = useState('home');
  const navigate = useNavigate();
  const [value, setValue] = useState('personal-information');
  const queryParams = new URLSearchParams(window.location.search);
  const accountNumber = authData?.AccountNumber;
  const roleName = authData?.RoleName;
  const token = authData?.token;

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header
        height="90px"
        marginTop="0px"
        accountNumber={authData?.AccountNumber}
        roleName={authData?.RoleName}
        stage={authData?.Stage}
        token={token}
      />

      <div className="ms-3">
        <Button onClick={() => navigate(-1)} className="btn btn-light btn-dark-xs">
          <span className="btn-light-xs-text">Back to home</span>
        </Button>
      </div>

      <div className="tabs-container">
        <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
          <Tab eventKey="home" title="Profile"></Tab>
        </Tabs>
        <div className="profile-container mx-md-5">
          <span className="profile-heading ms-md-0 ms-4">Profile</span>
          <Tabs id="controlled-tab-example" activeKey={value} onSelect={(k) => setValue(k)}>
            <Tab eventKey="personal-information" title="Personal Information">
              <PersonalInformation accountNumber={accountNumber} />
            </Tab>
            <Tab eventKey="business-information" title="Business Information">
              <BusinessInformation accountNumber={accountNumber} />
            </Tab>
            <Tab eventKey="region-location" title="Region/Location">
              <RegionLocation accountNumber={accountNumber} />
            </Tab>
            <Tab eventKey="account-settings" title="Account Settings">
              <AccountSettings accountNumber={accountNumber} token={token} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;
