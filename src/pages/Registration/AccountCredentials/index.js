import { useContext, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Store } from '../../../store';
import { Input, Button } from '../../../components/FormElements';
import Header from '../../../components/Header';
import { useFormik } from 'formik';
import { login, regeneratePassword } from '../../../store/actions';
import { PasswordValidation } from '../../../utils/constants/formikSchema';
import { useNavigate } from 'react-router-dom';
import { getOnboardingEmail } from '../../../utils/helpers/auth';
import './AccountCredentials.scss';
const initialValues = {
  password: '',
};

const AccountCredentials = () => {
  const {
    state: {
      auth: { isAuthenticated },
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    validationSchema: PasswordValidation,
    onSubmit: async (values) => {
      if (isAuthenticated) {
        navigate('/onboarding/personal-information/');
      } else {
        const res = await dispatch(
          login({ email: getOnboardingEmail(), password: values.password, IsFirst: true })
        );
        if (res) navigate('/onboarding/personal-information/');
      }
    },
  });

  const [time, setTime] = useState({ seconds: 0, minutes: 2 });

  const [passwordType, setPasswordType] = useState('password');

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

  const handleRegeneratePassword = async () => {
    const res = await dispatch(regeneratePassword({ Email: getOnboardingEmail() }));
    if (res) {
      reset();
    }
  };

  const togglePasswordType = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Email Verification</h3>
        </div>
        <p className="content-box-text-account-credentials ms-sm-5 ms-3">
          Kindly fill in the appropriate information to be onboarded as an FCMB agent.
        </p>
        <p className="account-text">Enter password sent to you.</p>
        <div className="form-account-number px-3">
          <Form onSubmit={formik.handleSubmit} noValidate>
            <div style={{ maxWidth: '500px' }} className="mx-auto">
              <Input
                style={{ width: '100%' }}
                formik={formik}
                name="password"
                placeholder="Enter password"
                type={passwordType}
                passwordToggleFunction={togglePasswordType}
              />
              <span className="text-danger font-bold d-block mt-2 cursor-pointer">
                {time.seconds <= 0 && time.minutes <= 0 ? (
                  <span onClick={handleRegeneratePassword}>Regenerate Password </span>
                ) : (
                  <>
                    Regenerate password after{' '}
                    <span className="text-error-color">
                      {time.minutes < 10 ? '0' + time.minutes : time.minutes}:
                      {time.seconds < 10 ? '0' + time.seconds : time.seconds}
                    </span>
                  </>
                )}
              </span>
            </div>

            <Button loading={isLoading} className="button-account-verify-process" title="Next" />
          </Form>
        </div>
      </div>
    </>
  );
};

export default AccountCredentials;
