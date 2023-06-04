import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import {
  getLgasByState,
  getRegionByState,
  getRegionInformation,
  getStates,
  saveRegionInformation,
} from '../../../store/actions';
import './RegionLocation.scss';
import { getOnboardingAccountNumber } from '../../../utils/helpers/auth';
import Header from '../../../components/Header/index';
import { logOut } from '../../../store/actions';
import { RegionInfoValidation } from '../../../utils/constants/formikSchema';
import { useFormik } from 'formik';
import { Store } from '../../../store';
import { Button as FormButton, Input, Select } from '../../../components/FormElements';
import LoadingIndicator from '../../../components/LoadingIndicator';

const initialValues = {
  city: '',
  state: '',
  regionAddress: '',
  region: '',
  lga: '',
};

const RegionLocation = () => {
  const {
    state: {
      auth: { authData },
      loading: { loading: isLoading },
      account: { states, lgas, regions },
    },
    dispatch,
  } = useContext(Store);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: RegionInfoValidation,
    onSubmit: async (values) => {
      const res = await dispatch(
        saveRegionInformation({
          ...values,
          accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
        })
      );
      if (res) {
        navigate('/onboarding/application-summary/');
      }
    },
  });

  const saveAndContinue = async () => {
    const res = await dispatch(
      saveRegionInformation({
        ...formik.values,
        accountNumber: getOnboardingAccountNumber() || authData?.AccountNumber,
      })
    );
    if (res) {
      dispatch(logOut());
    }
  };

  useEffect(() => {
    if (formik.values.state) {
      dispatch(getLgasByState(formik.values.state));
      dispatch(getRegionByState(formik.values.state));
    }
  }, [formik.values.state]);

  const getData = async () => {
    const regionInfo = await dispatch(
      getRegionInformation(getOnboardingAccountNumber() || authData?.AccountNumber)
    );
    if (regionInfo?.state) {
      formik.setFieldValue('city', regionInfo?.city);
      formik.setFieldValue('state', regionInfo?.state);
      formik.setFieldValue('regionAddress', regionInfo?.regionAddress);
      formik.setFieldValue('region', regionInfo?.region);
      formik.setFieldValue('lga', regionInfo?.lga);
    }
  };

  useEffect(() => {
    dispatch(getStates());
    getData();
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <Header height="100px" />

      <Button
        onClick={() => navigate('/onboarding/business-information/')}
        className="btn mb-1 d-inline-block d-lg-none btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </Button>

      <Button
        onClick={() => navigate('/onboarding/business-information/')}
        className="btn d-none d-lg-inline-block btn-light btn-light-xs"
      >
        <span className="btn-light-xs-text">Back</span>
      </Button>

      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Region-Location</h3>
        </div>
        <p className="content-box-text ms-sm-5 ms-3">
          Kindly fill in the appropriate information to be onboarded as an FCMB agent.
        </p>
        <Form
          onSubmit={formik.handleSubmit}
          noValidate
          className="form-business-information mx-auto w-100 px-2"
        >
          <Select
            style={{ width: '100%' }}
            label="State"
            formik={formik}
            options={states}
            name="state"
            value={formik.values.state}
          />

          <Select
            label="Enter LGA (Local government area)"
            formik={formik}
            options={lgas}
            name="lga"
            value={formik.values.lga}
          />
          <Select
            label="Region"
            formik={formik}
            options={regions}
            name="region"
            value={formik.values.region}
          />
          <Input
            style={{ width: '100%' }}
            name="city"
            label="City"
            placeholder="Enter City"
            formik={formik}
            value={formik.values.city}
          />
          <Input
            style={{ width: '100%' }}
            name="regionAddress"
            label="Address"
            placeholder="Enter Address"
            formik={formik}
            value={formik.values.regionAddress}
          />
          <div className="px-3">
            <FormButton
              loading={isLoading}
              title="Next"
              btnClass="button-start-process-regionLocation"
            />
          </div>

          <div className="cursor-pointer mt-3" onClick={() => saveAndContinue()}>
            <span style={{ marginLeft: '0px' }} className="registration-link">
              Save and Continue Later
            </span>
          </div>
        </Form>
      </div>
    </>
  );
};

export default RegionLocation;
