import { useEffect, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faPhone, faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../../store';
import './ZACInformation.scss';
import Header from '../../../components/Header';
import { getZacInformation, logOut } from '../../../store/actions';
import { useNavigate } from 'react-router-dom';
import {
  getOnboardingAccountNumber,
  getOnboardingCreatedBy,
  removeOnboardingCred,
} from '../../../utils/helpers/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';

const ZACInformation = () => {
  const {
    state: {
      loading: { loading: isLoading },
      auth: { isAuthenticated, authData },
    },
    dispatch,
  } = useContext(Store);
  const [zacInformation, setZacInformation] = useState({});
  const navigate = useNavigate();

  const getZac = async () => {
    const res = await dispatch(
      getZacInformation(getOnboardingAccountNumber() || authData?.AccountNumber)
    );
    if (res?.email) {
      setZacInformation(res);
    }
  };

  useEffect(() => {
    getZac();
  }, []);

  const handleNavigateion = () => {
    removeOnboardingCred();
    navigate('/dashboard');
  };

  const handleLogOut = async () => {
    const res = await dispatch(logOut());
    if (res) {
      navigate('/login');
    }
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Zonal Agent Co-ordinator Info</h3>
        </div>
        <div className="content-zac-information mx-auto px-3">
          <label>
            <FontAwesomeIcon icon={faUserCheck} />
            Name -{' '}
            {zacInformation?.firstName &&
              `${zacInformation?.firstName} ${zacInformation?.lastName}`}
          </label>

          <label>
            <FontAwesomeIcon icon={faPhone} />
            Phone number - {zacInformation?.phoneNumber}
          </label>

          <label>
            <FontAwesomeIcon icon={faEnvelope} />
            Email address - {zacInformation?.email}
          </label>

          <label>
            <FontAwesomeIcon icon={faLocationDot} />
            Region -{' '}
            {zacInformation?.address && `${zacInformation?.address} ${zacInformation?.state}`}
          </label>
        </div>

        {isAuthenticated && getOnboardingCreatedBy() ? (
          <div className="cursor-pointer" onClick={handleNavigateion}>
            <span style={{ marginLeft: '0px' }} className="registration-link">
              Go back to dashboard
            </span>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={handleLogOut}>
            <span style={{ marginLeft: '0px' }} className="registration-link">
              Go back to Login Page
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default ZACInformation;
