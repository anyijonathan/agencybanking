import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Button, Input } from '../../../components/FormElements';
import { AccountOtpValidation } from '../../../utils/constants/formikSchema';
import Header from '../../../components/Header';
import { useFormik } from 'formik';
import { validateAccountOtp, resendOTP } from '../../../store/actions';
import './AccountVerification.scss';
import { Store } from '../../../store';
import { getOnboardingAccountNumber } from '../../../utils/helpers/auth';

const initialValues = {
  otp_value: '',
};

const AccountVerification = () => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();
  const uuid = require('uuid').v4();
  const formik = useFormik({
    initialValues,
    validationSchema: AccountOtpValidation,
    onSubmit: async (values) => {
      const res = await dispatch(
        validateAccountOtp({
          account_no: getOnboardingAccountNumber(),
          otp_value: values.otp_value.toString(),
          identifier: uuid,
        })
      );
      if (res) {
        navigate('/registration/verify-email/');
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
    const res = await dispatch(resendOTP({ AccountNumber: getOnboardingAccountNumber() }));
    if (res) {
      reset();
    }
  };

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Verify Account</h3>
        </div>

        <div style={{ maxWidth: '560px' }} className="form-account-number px-3 mx-auto w-100">
          <p className="content-box-text-account-verification account-text">Enter OTP</p>

          <Form style={{ width: '100%' }} onSubmit={formik.handleSubmit} noValidate>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Input
                style={{
                  width: '100%',
                }}
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
            </div>

            <Button
              loading={isLoading}
              disabled={isLoading}
              title="Verify"
              className="button-account-verify-process"
            />
          </Form>
        </div>
      </div>
    </>
  );
};

export default AccountVerification;
