import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Button as ButtonBack, Form } from 'react-bootstrap';
import ApplicationApproved from '../ApplicationApproved';
import TermsAndConditions from '../TermsAndConditions';
import { Store } from '../../../store';
import './ApplicationSummary.scss';
import Header from '../../../components/Header';
import { getAccountSummary, logOut } from '../../../store/actions';
import { getOnboardingAccountNumber } from '../../../utils/helpers/auth';
import { Button } from '../../../components/FormElements/';
import { saveAccountSummary } from '../../../store/actions/account';
import swal from 'sweetalert';

const ApplicationSummary = () => {
  const [modalShow, setModalShow] = useState(false);
  const [modalTShow, setModalTShow] = useState(false);
  const [checkboxTerms, setCheckboxTerms] = useState(false);

  const [summaryDescription, setSummaryDescription] = useState();
  const [accountSummary, setAccountSummary] = useState({});

  const onViewTC = () => {
    setModalTShow(true);
  };

  const {
    state: {
      auth: { isAuthenticated, authData },
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);

  const getAccSummary = async () => {
    const res = await dispatch(
      getAccountSummary(getOnboardingAccountNumber() || authData?.AccountNumber)
    );
    if (res?.accountNumber) {
      setAccountSummary(res);
    }
  };

  useEffect(() => {
    getAccSummary();
  }, []);

  const navigate = useNavigate();

  const handleOnClick = async () => {
    const res = await dispatch(saveAccountSummary(accountSummary?.accountNumber));
    if (isAuthenticated && res) {
      setSummaryDescription(res);
      if (accountSummary?.state === 'Lagos') {
        setModalShow(true);
      } else {
        swal({
          title: 'Account Onboarded Successfully ',
          text: `ZAC have not been profiled for ${accountSummary?.state} State. `,
          icon: 'success',
        });
        navigate('/dashboard');
      }
    } else if (!isAuthenticated && res) {
      if (accountSummary?.state === 'Lagos') {
        setModalShow(true);
      } else {
        swal({
          title: 'Account Onboarded Successfully ',
          text: `ZAC have not been profiled for ${accountSummary?.state} State. `,
          icon: 'success',
        });
        dispatch(logOut());
      }
    }
  };

  return (
    <>
      <Header height="100px" />

      <ButtonBack
        onClick={() => navigate('/onboarding/region-location/')}
        className="btn mb-1 d-inline-block d-lg-none btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </ButtonBack>

      <ButtonBack
        onClick={() => navigate('/onboarding/region-location/')}
        className="btn d-none d-lg-inline-block btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </ButtonBack>

      <div style={{ width: '100%' }} className="content-box-summary mx-auto">
        <div className="content-box-summary-title">
          <h3 className="content-box-heading">Application Summary</h3>
        </div>
        <div style={{ width: '100%', margin: '0 auto' }}>
          <Accordion className="mx-3" defaultActiveKey="0">
            <Accordion.Item className="accordion-item" eventKey="0">
              <Accordion.Header>
                Application ID
                <span
                  style={{ position: 'absolute', right: '40px' }}
                  className="application-id-text"
                >
                  {accountSummary?.accountNumber ? accountSummary?.accountNumber.slice(0, 8) : ''}
                </span>
              </Accordion.Header>
            </Accordion.Item>
            <Accordion.Item className="accordion-item" eventKey="1">
              <Accordion.Header>Email Verification</Accordion.Header>
              <Accordion.Body>
                Email
                <span className="accordion-body-span">
                  <br />
                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-3">
                    {accountSummary?.email} <span className="verified-text">Verified</span>
                  </div>
                </span>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item className="accordion-item" eventKey="2">
              <Accordion.Header>Personal Information</Accordion.Header>
              <div style={{ paddingLeft: '0px', display: 'flex' }} className="profile-content-left">
                <div className="d-flex justify-content-between w-100 px-sm-5">
                  <Accordion.Body>
                    First Name
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.firstName}
                    </span>
                    <br />
                    Username
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.userName}
                    </span>
                    <br />
                    Date of birth
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {new Date(accountSummary?.dob).toLocaleDateString()}
                    </span>
                    <br />
                    Second Number
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.secondPhoneNumber}
                    </span>
                    <br />
                    Agent Category
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.userRoleId === '7'
                        ? 'Aggregator'
                        : accountSummary?.userRoleId === '6'
                        ? 'Lead Aggregator'
                        : 'Agent'}
                    </span>
                    <br />
                  </Accordion.Body>
                  <Accordion.Body>
                    Last Name
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.lastName}
                    </span>
                    <br />
                    Gender
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.gender === 'M' ? 'Male' : 'Female'}
                    </span>
                    <br />
                    Telephone Number
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.phoneNumber}
                    </span>
                    <br />
                    Nationality
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.nationality ? accountSummary?.nationality : 'N/A'}
                    </span>
                    <br />
                    Highest Level Of Education
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.highestEducationalLevel}
                    </span>
                    <br />
                  </Accordion.Body>
                </div>
              </div>
            </Accordion.Item>
            <Accordion.Item className="accordion-item" eventKey="3">
              <Accordion.Header>Business Information</Accordion.Header>
              <div style={{ paddingLeft: '0px', display: 'flex' }} className="profile-content-left">
                <div className="d-flex justify-content-between w-100 px-sm-5">
                  <Accordion.Body>
                    Name Of Business
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.businessName}
                    </span>
                    <br />
                    Date of commencement of business
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {new Date(accountSummary?.commencementDate).toLocaleDateString()}
                    </span>
                    <br />
                    Nature of business
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.businessNature}
                    </span>
                    <br />
                  </Accordion.Body>
                  <Accordion.Body>
                    Business reg number (optional)
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.registrationNumber}
                    </span>
                    <br />
                    Business address
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.businessAddress}
                    </span>
                    <br />
                  </Accordion.Body>
                </div>
              </div>
            </Accordion.Item>
            <Accordion.Item className="accordion-item" eventKey="4">
              <Accordion.Header>Region/Location</Accordion.Header>
              <div style={{ paddingLeft: '0px', display: 'flex' }} className="profile-content-left">
                <div className="d-flex justify-content-between w-100 px-md-5">
                  <Accordion.Body>
                    State
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.state}
                    </span>
                    <br />
                    City
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.city}
                    </span>
                    <br />
                  </Accordion.Body>
                  <Accordion.Body>
                    LGA (Local government)
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.lga}
                    </span>
                    <br />
                    Address
                    <span className="accordion-body-span">
                      {' '}
                      <br />
                      {accountSummary?.regionAddress}
                    </span>
                    <br />
                  </Accordion.Body>
                </div>
              </div>
            </Accordion.Item>

            <div className="mx-auto w-100 px-3 px-md-5 mx-md-5">
              <div style={{ margin: '0 auto' }} className="mx-auto mx-sm-5 w-100">
                <Form.Check
                  className="pb-3 w-100"
                  value={checkboxTerms}
                  onChange={(e) => setCheckboxTerms(!checkboxTerms)}
                  type="checkbox"
                  id="checkbox"
                  label="By continuing, you accept our Terms and Privacy Policy"
                />
              </div>
            </div>

            <span className="cursor-pointer pt-5 mt-5 " onClick={onViewTC}>
              <span style={{ paddingTop: '100px' }} className="accordion-body-span">
                Click here to view Terms and Conditions
              </span>
            </span>
          </Accordion>
        </div>

        <div className="px-3 w-100">
          <Button
            type="button"
            onClick={handleOnClick}
            disabled={!accountSummary?.accountNumber || checkboxTerms === false}
            loading={isLoading}
            btnClass="button-start-process-applicationSummary"
            title="Submit Application"
          />
        </div>

        <ApplicationApproved
          show={modalShow}
          summary_description={summaryDescription}
          onHide={() => setModalShow(false)}
        />
        <TermsAndConditions show={modalTShow} onHide={() => setModalTShow(false)} />
      </div>
    </>
  );
};

export default ApplicationSummary;
