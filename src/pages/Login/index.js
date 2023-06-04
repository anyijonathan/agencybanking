import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import './Login.scss';
import { Store } from '../../store';
import { login } from '../../store/actions';
import { LoginValidation } from '../../utils/constants/formikSchema';
import { Button, Input } from '../../components/FormElements';
import TwoFactorAuth from './TwoFactorAuth';

const initialValues = {
  password: '',
  email: '',
};

const Login = () => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const [modalShow, setModalShow] = useState(false);
  const [accountNumber, setAccountNumber] = useState();
  const [passwordType, setPasswordType] = useState('password');

  const formik = useFormik({
    initialValues,
    validationSchema: LoginValidation,
    onSubmit: async (values) => {
      const res = await dispatch(login({ ...values, IsFirst: false }));
      if (res) {
        setAccountNumber(res);
        setModalShow(true);
      }
    },
  });

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
          <h3 className="content-box-heading">Login</h3>
        </div>
        <div className="form-account-number">
          <Form
            style={{ paddingLeft: '20px', paddingRight: '20px', width: '100%' }}
            className="form-login"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <Input
              style={{ width: '100%' }}
              formik={formik}
              name="email"
              label="Enter Email Address"
              type="email"
              placeholder="Email address"
            />

            <Input
              style={{ width: '100%' }}
              formik={formik}
              name="password"
              label="Enter Password"
              type={passwordType}
              placeholder="Password"
              passwordToggleFunction={togglePasswordType}
            />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
              <Link to="/user/forgot-password/">
                <span className="registration-link">Forgot Password?</span>
              </Link>
              <Link to="/registration/create-account/">
                <span className="registration-link">
                  Don’t have an account? Create an Agent Account
                </span>
              </Link>
            </div>

            <div
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '10px',
              }}
            >
              <Button
                loading={isLoading}
                disabled={isLoading}
                type="submit"
                className="button-login-process"
                title="Login"
              />
            </div>
          </Form>
        </div>
        <TwoFactorAuth
          show={modalShow}
          onHide={() => setModalShow(false)}
          account_number={accountNumber}
        />
      </div>
    </>
  );
};

export default Login;
