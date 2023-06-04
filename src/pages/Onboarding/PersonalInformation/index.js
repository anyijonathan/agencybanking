import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import './PersonalInformation.scss';
import {
  getAccountDetails,
  getPersonalInformation,
  savePersonalInformation,
} from '../../../store/actions';
import { Store } from '../../../store';
import { logOut } from '../../../store/actions';
import Header from '../../../components/Header/index';
import { useFormik } from 'formik';
import { Button, Select } from '../../../components/FormElements';
import { PersonalInfoValidation } from '../../../utils/constants/formikSchema';
import {
  agentTypes,
  aggregatorAgentTypes,
  educationLevels,
  gender,
  leadAggregatorAgentTypes,
  nationalities,
} from '../../../utils/constants';
import { getOnboardingAccountNumber } from '../../../utils/helpers/auth';
import '../../../pages/Onboarding/Onboarding.scss';
import LoadingIndicator from '../../../components/LoadingIndicator';

const initialValues = {
  userName: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  userRoleId: '',
  accountNumber: '',
  gender: '',
  dob: '',
  presentAddressDateOfEntry: '',
  highestEducationalLevel: '',
  identificationType: '',
  secondPhoneNumber: '',
  bankCode: '',
  bvn: '',
  address: '',
  nationality: '',
  branch: '',
  schemeCode: '',
  agentType: '',
  description: '',
  extraInfo: '',
  tier: '',
  aoCode: '',
  brokerCode: '',
  createdBy: '',
  AccountNumber: '',
};

const PersonalInformation = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: PersonalInfoValidation,
    onSubmit: async (values) => {
      const res = await dispatch(savePersonalInformation(values));
      if (res) {
        navigate('/onboarding/business-information/');
      }
    },
  });

  const saveAndContinue = async () => {
    const res = await dispatch(savePersonalInformation(formik.values));
    if (res) {
      dispatch(logOut());
    }
  };

  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
    },
    dispatch,
  } = useContext(Store);

  const getData = async () => {
    const res = await dispatch(
      getPersonalInformation(getOnboardingAccountNumber() || authData?.AccountNumber)
    );
    if (res?.accountNumber) {
      const dateOfBirthISO = new Date(res?.dob).toLocaleDateString();
      formik.setFieldValue('firstName', res?.firstName);
      formik.setFieldValue('lastName', res?.lastName);
      formik.setFieldValue('email', res?.email);
      formik.setFieldValue('userName', res?.userName || '');
      formik.setFieldValue('phoneNumber', res?.phoneNumber || '');
      formik.setFieldValue('dob', dateOfBirthISO);
      formik.setFieldValue('gender', res?.gender);
      formik.setFieldValue('bvn', res?.bvn);
      formik.setFieldValue('address', res?.address);
      formik.setFieldValue('schemeCode', res?.schemeCode);
      formik.setFieldValue('tier', res?.tier);
      formik.setFieldValue('brokerCode', res?.brokerCode);
      formik.setFieldValue(
        'AccountNumber',
        getOnboardingAccountNumber() || authData?.AccountNumber
      );
      formik.setFieldValue('nationality', res?.nationality);
      formik.setFieldValue('userRoleId', res?.userRoleId);
      formik.setFieldValue('highestEducationalLevel', res?.highestEducationalLevel);
      formik.setFieldValue('secondPhoneNumber', res?.secondPhoneNumber || '');
    } else {
      const response = await dispatch(
        getAccountDetails(getOnboardingAccountNumber() || authData?.AccountNumber)
      );
      if (response?.emailAddress) {
        const accountNames = response?.accountName.split(' ');
        const dateOfBirthISO = new Date(response?.dateOfBirth).toLocaleDateString();
        formik.setFieldValue('firstName', accountNames[0]);
        formik.setFieldValue('lastName', accountNames[1]);
        formik.setFieldValue('email', response?.emailAddress);
        formik.setFieldValue('phoneNumber', response?.mobileNumber);
        formik.setFieldValue('dob', dateOfBirthISO);
        formik.setFieldValue('gender', response?.sex);
        formik.setFieldValue('bvn', response?.biometric_ID);
        formik.setFieldValue('address', response?.address1);
        formik.setFieldValue('schemeCode', response?.schemeCode);
        formik.setFieldValue('tier', response?.tier);
        formik.setFieldValue('brokerCode', response?.brokerCode);
        formik.setFieldValue(
          'AccountNumber',
          getOnboardingAccountNumber() || authData?.AccountNumber
        );
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Personal Information</h3>
        </div>
        <p className="content-box-text ms-sm-3 ms-3">
          Kindly fill in the appropriate information to be onboarded as an FCMB agent.
        </p>

        <Form
          className="form-padding"
          style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div style={{ width: '100%' }}>
            <div className="d-sm-flex gap-1 gap-md-3 mx-auto px-2">
              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="firstName">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  name="firstName"
                  style={{ height: '50px' }}
                  value={formik.values.firstName}
                  label="First name"
                  disabled
                  placeholder="Enter First Name"
                  formik={formik}
                />
              </Form.Group>

              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  label="Last Name"
                  style={{ height: '50px' }}
                  value={formik.values.lastName}
                  name="lastName"
                  disabled
                  placeholder="Enter Last Name"
                  formik={formik}
                />
              </Form.Group>
            </div>
            <div className="d-sm-flex gap-1 gap-md-3 mx-auto px-2">
              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="userName">
                <Form.Label>Username (optional)</Form.Label>
                <Form.Control
                  formik={formik}
                  onChange={formik.handleChange}
                  style={{ height: '50px' }}
                  name="userName"
                  label="Username (optional)"
                  placeholder="Enter Username"
                  value={formik.values.userName}
                />
              </Form.Group>

              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  label="Gender"
                  style={{ height: '50px' }}
                  value={formik.values.gender}
                  formik={formik}
                  options={gender}
                  name="gender"
                  disabled
                />
              </Form.Group>
            </div>

            <div className="d-sm-flex gap-1 gap-md-3 mx-auto px-2">
              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="dob">
                <Form.Label>Date Of Birth</Form.Label>
                <Form.Control
                  name="dob"
                  style={{ height: '50px' }}
                  value={formik.values.dob}
                  label="Date Of Birth"
                  disabled
                  placeholder="Date Of Birth"
                  formik={formik}
                />
              </Form.Group>

              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="phoneNumber">
                <Form.Label>Telephone Number</Form.Label>
                <Form.Control
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                  style={{ height: '50px' }}
                  label="Telephone Number"
                  name="phoneNumber"
                  placeholder="e.g 08145678901"
                  formik={formik}
                />
              </Form.Group>
            </div>

            <div className="d-sm-flex gap-1 gap-md-3 mx-auto px-2">
              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="secondPhoneNumber">
                <Form.Label>Second number (optional)</Form.Label>
                <Form.Control
                  showError={true}
                  style={{ height: '50px' }}
                  onChange={formik.handleChange}
                  className="form-control"
                  value={formik.values.secondPhoneNumber}
                  formik={formik}
                  name="secondPhoneNumber"
                  label="Second number (optional)"
                  placeholder="e.g 08145678901"
                />
              </Form.Group>

              <Form.Group style={{ width: '100%' }} controlId="nationality">
                <Form.Label>Nationality</Form.Label>
                <Select
                  style={{ marginTop: '8px' }}
                  formik={formik}
                  options={nationalities}
                  name="nationality"
                  value={formik.values.nationality}
                />
              </Form.Group>
            </div>

            <div className="d-sm-flex gap-1 gap-md-3 mx-auto px-2">
              <Form.Group style={{ width: '100%' }} className="mb-1" controlId="userRoleId">
                {authData?.RoleName === 'Aggregator' && (
                  <Select
                    style={{ marginTop: '8px' }}
                    label="Choose agent category"
                    formik={formik}
                    options={aggregatorAgentTypes}
                    name="userRoleId"
                    value={formik.values.userRoleId}
                  />
                )}

                {authData?.RoleName === 'LeadAggregator' && (
                  <Select
                    style={{ marginTop: '8px' }}
                    label="Choose agent category"
                    formik={formik}
                    options={leadAggregatorAgentTypes}
                    name="userRoleId"
                    value={formik.values.userRoleId}
                  />
                )}

                {(authData?.RoleName === 'AgentSupervisor' ||
                  authData?.RoleName === 'SuperAdmin' ||
                  authData?.RoleName === 'Agent') && (
                  <Select
                    style={{ marginTop: '8px' }}
                    label="Choose agent category"
                    formik={formik}
                    options={agentTypes}
                    name="userRoleId"
                    value={formik.values.userRoleId}
                  />
                )}
              </Form.Group>

              <Form.Group style={{ width: '100%' }} controlId="highestEducationalLevel">
                <Select
                  style={{ marginTop: '8px' }}
                  label="Highest level of education"
                  formik={formik}
                  options={educationLevels}
                  name="highestEducationalLevel"
                  value={formik.values.highestEducationalLevel}
                />
              </Form.Group>
            </div>
          </div>

          <div className="px-3">
            <Button loading={isLoading} btnClass="button-start-process-personalInfo" title="Next" />
          </div>

          <div className="cursor-pointer mt-5" onClick={() => saveAndContinue()}>
            <span style={{ marginLeft: '0px' }} className="registration-link">
              Save and Continue Later
            </span>
          </div>
        </Form>
      </div>
    </>
  );
};

export default PersonalInformation;
