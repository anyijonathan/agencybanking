import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Store } from '../../store';
import { Button, Input } from '../../components/FormElements';
import { resendOTP, twoFAOTPValidate } from '../../store/actions';
import { twoFAOTPValidation } from '../../utils/constants/formikSchema';
import LoadingIndicator from '../../components/LoadingIndicator/index';
import './TwoFactorAuth.scss';

const initialValues = {
  otp_value: '',
  account_no: '',
};

const TwoFactorAuth = (props) => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues,
    validationSchema: twoFAOTPValidation,
    onSubmit: async (values) => {
      const res = await dispatch(
        twoFAOTPValidate({
          account_no: props.account_number,
          otp_value: values.otp_value.toString(),
        })
      );
      if (res) {
        navigate('/');
      }
    },
  });

  const [time, setTime] = useState({ seconds: 0, minutes: 2 });

  useEffect(() => {
    let timer;
    timer = setInterval(() => {
      setTime((time) => ({ ...time, seconds: time.seconds - 1 }));
      if (time.seconds === 0) {
        setTime((time) => ({
          ...time,
          minutes: time.minutes - 1,
          seconds: 59,
        }));
      }
      if (time.minutes === 0 && time.seconds === 0) {
        setTime((time) => ({ ...time, minutes: 0, seconds: 0 }));
        return;
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  const reset = () => {
    setTime((time) => ({ ...time, minutes: 2, seconds: 0 }));
  };

  const handleResetOtp = async () => {
    const res = await dispatch(resendOTP({ AccountNumber: props.account_number }));
    if (res) {
      reset();
    }
  };

  return (
    <>
      <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
        {isLoading && <LoadingIndicator />}
        <Modal.Header closeButton>
          <Modal.Title style={{ margin: '0 auto' }} id="contained-modal-title-vcenter">
            Two-Factor Log In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="email-verification-text">
            An OTP has been sent to the registered phone number. Kindly enter below
          </p>
          <Form onSubmit={formik.handleSubmit} noValidate>
            <div className="d-flex flex-column">
              <Input
                className="twoFA-form-input"
                name="otp_value"
                formik={formik}
                placeholder="OTP"
                type="number"
              />
              <span className="text-danger font-bold d-block mt-2 cursor-pointer">
                {time.seconds <= 0 && time.minutes <= 0 ? (
                  <span onClick={handleResetOtp}>Resend OTP </span>
                ) : (
                  <>
                    Code expires in{' '}
                    <span className="text-error-color">
                      {time.minutes < 10 ? '0' + time.minutes : time.minutes}:
                      {time.seconds < 10 ? '0' + time.seconds : time.seconds}
                    </span>
                  </>
                )}
              </span>
              <Button
                // loading={isLoading}
                title="Verify"
                className="button-account-verify-process"
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default TwoFactorAuth;
