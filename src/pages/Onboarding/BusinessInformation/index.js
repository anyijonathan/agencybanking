import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import './BusinessInformation.scss';
import { Form, Button } from 'react-bootstrap';
import { Button as FormButton, Input, Select } from '../../../components/FormElements';
import { useFormik } from 'formik';
import { getBusinessInformation, saveBusinessInformation } from '../../../store/actions';
import { BusinessInfoValidation } from '../../../utils/constants/formikSchema';
import { Store } from '../../../store';
import { logOut } from '../../../store/actions';
import Header from '../../../components/Header/index';
import { businessNature } from '../../../utils/constants';
import {
  getOnboardingAccountNumber,
  storeOnboardingBusinessInfo,
} from '../../../utils/helpers/auth';
import LoadingIndicator from '../../../components/LoadingIndicator';
import swal from 'sweetalert';

const initialValues = {
  businessName: '',
  registrationNumber: '',
  businessNature: '',
  businessNatureOthers: '',
  businessAddress: '',
};

const BusinessInformation = () => {
  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData },
    },
    dispatch,
  } = useContext(Store);

  const navigate = useNavigate();

  const [commencementDate, setCommencementDate] = useState(new Date());

  const formik = useFormik({
    initialValues,
    validationSchema: BusinessInfoValidation,
    onSubmit: async (values) => {
      if (
        values.businessNature !== '' &&
        values.businessNature !== 'Tech' &&
        values.businessNature !== 'Food Services' &&
        values.businessNature !== 'Agriculture' &&
        values.businessNature !== 'Clothing'
      ) {
        let unKnownBusinessNature = values.businessNatureOthers.trim();
        if (!unKnownBusinessNature.length) {
          swal({
            title: 'Enter Business Nature',
            text: 'Kindly Enter your business nature',
            icon: 'error',
          });
          return;
        }
        delete values.businessNatureOthers;
        const res = await dispatch(
          saveBusinessInformation({
            ...values,
            businessNature: unKnownBusinessNature,
            commencementDate,
            accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
          })
        );

        if (res) {
          storeOnboardingBusinessInfo({ ...values, commencementDate });
          navigate('/onboarding/region-location/');
        }
      } else {
        delete values.businessNatureOthers;
        const res = await dispatch(
          saveBusinessInformation({
            ...values,
            commencementDate,
            accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
          })
        );
        if (res) {
          storeOnboardingBusinessInfo({ ...values, commencementDate });
          navigate('/onboarding/region-location/');
        }
      }
    },
  });

  const saveAndContinue = async () => {
    if (
      formik.values.businessNature !== '' &&
      formik.values.businessNature !== 'Tech' &&
      formik.values.businessNature !== 'Food Services' &&
      formik.values.businessNature !== 'Agriculture' &&
      formik.values.businessNature !== 'Clothing'
    ) {
      let unKnownBusinessNature = formik.values.businessNatureOthers.trim();
      if (!unKnownBusinessNature.length) {
        swal({
          title: 'Enter Business Nature',
          text: 'Kindly Enter your business nature',
          icon: 'error',
        });
        return;
      }
      delete formik.values.businessNatureOthers;
      const res = await dispatch(
        saveBusinessInformation({
          ...formik.values,
          businessNature: unKnownBusinessNature,
          commencementDate,
          accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
        })
      );

      if (res) {
        storeOnboardingBusinessInfo({ ...formik.values, commencementDate });
        dispatch(logOut());
      }
    } else {
      delete formik.values.businessNatureOthers;
      const res = await dispatch(
        saveBusinessInformation({
          ...formik.values,
          commencementDate,
          accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
        })
      );

      if (res) {
        storeOnboardingBusinessInfo({ ...formik.values, commencementDate });
        dispatch(logOut());
      }
    }
  };

  const getData = async () => {
    const busInfo = await dispatch(
      getBusinessInformation(getOnboardingAccountNumber() || authData?.AccountNumber)
    );

    if (busInfo?.businessName) {
      formik.setFieldValue('businessName', busInfo?.businessName);
      formik.setFieldValue('registrationNumber', busInfo?.registrationNumber);
      formik.setFieldValue('businessNature', busInfo?.businessNature);
      formik.setFieldValue('businessNatureOthers', busInfo?.businessNature);
      formik.setFieldValue('businessAddress', busInfo?.businessAddress);
      busInfo.commencementDate && setCommencementDate(busInfo?.commencementDate);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header height="100px" />

      <Button
        onClick={() => navigate('/onboarding/personal-information/')}
        className="btn mb-1 d-inline-block d-lg-none btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </Button>

      <Button
        onClick={() => navigate('/onboarding/personal-information/')}
        className="btn d-none d-lg-inline-block btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </Button>

      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Business Information</h3>
        </div>
        <p className="content-box-text ms-sm-5 ms-3">
          Kindly fill in the appropriate information to be onboarded as an FCMB agent.
        </p>
        <Form
          onSubmit={formik.handleSubmit}
          noValidate
          className="form-business-information mx-auto w-100"
        >
          <div className="px-2" style={{ width: '100%' }}>
            <div className="">
              <Input
                style={{ width: '100%' }}
                value={formik.values.businessName}
                name="businessName"
                label="Name of business"
                placeholder="Name of business"
                formik={formik}
              />
            </div>

            <Form.Group className="mb-9">
              <label>Date of commencement of business</label>
              <DatePicker
                dateFormat="dd/MM/yyyy"
                className="form-business-input"
                onChange={setCommencementDate}
                maxDate={new Date()}
                value={commencementDate}
              />
            </Form.Group>

            <div className="">
              <Input
                style={{ width: '100%' }}
                value={formik.values.registrationNumber}
                name="registrationNumber"
                label="Business reg number (optional)"
                placeholder="Business reg number"
                formik={formik}
              />
            </div>

            <div className="">
              <Select
                label="Nature of business"
                formik={formik}
                options={businessNature}
                value={
                  formik.values.businessNature !== '' &&
                  formik.values.businessNature !== 'Tech' &&
                  formik.values.businessNature !== 'Food Services' &&
                  formik.values.businessNature !== 'Agriculture' &&
                  formik.values.businessNature !== 'Clothing'
                    ? 'Others'
                    : formik.values.businessNature
                }
                name="businessNature"
              />
            </div>

            {formik.values.businessNature !== '' &&
              formik.values.businessNature !== 'Tech' &&
              formik.values.businessNature !== 'Food Services' &&
              formik.values.businessNature !== 'Agriculture' &&
              formik.values.businessNature !== 'Clothing' && (
                <div className="">
                  <Input
                    style={{ width: '100%' }}
                    value={formik.values.businessNatureOthers}
                    name="businessNatureOthers"
                    label="Enter nature of Business"
                    placeholder="Enter Nature of your Business"
                    formik={formik}
                  />
                </div>
              )}

            <div className="">
              <Input
                style={{ width: '100%' }}
                value={formik.values.businessAddress}
                name="businessAddress"
                label="Business Address"
                placeholder="Address"
                formik={formik}
              />
            </div>

            <div className="px-3">
              <FormButton
                loading={isLoading}
                title="Next"
                btnClass="button-start-process-businessInfo"
              />
            </div>
            <div className="cursor-pointer mt-3" onClick={() => saveAndContinue()}>
              <span style={{ marginLeft: '0px' }} className="registration-link">
                Save and Continue Later
              </span>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default BusinessInformation;
