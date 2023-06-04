import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Login.scss';
import { Store } from '../../store';
import { login, logOut } from '../../store/actions';
import { AdminLoginValidation } from '../../utils/constants/formikSchema';
import { Button, Input } from '../../components/FormElements';
import { getStoredToken } from '../../utils/helpers/auth';
import TwoFactorAuth from './TwoFactorAuth';
import { loginAsAdmin } from '../../store/actions/auth';

const initialValues = {
  password: '',
  email: '',
  token: '',
};

const AdminLogin = () => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const [modalShow, setModalShow] = useState(false);
  const [accountNumber, setAccountNumber] = useState();
  const [passwordType, setPasswordType] = useState('password');
  const [tokenType, setTokenType] = useState('password');

  useEffect(() => {
    if (getStoredToken()) {
      dispatch(logOut());
    }
  }, []);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues,
    validationSchema: AdminLoginValidation,
    onSubmit: async (values) => {
      const res = await dispatch(loginAsAdmin({ ...values, IsFirst: false }));
      if (res) navigate('/');
    },
  });

  const togglePasswordType = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  const toggleTokenType = () => {
    if (tokenType === 'password') {
      setTokenType('text');
      return;
    }
    setTokenType('password');
  };

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Login</h3>
        </div>
        <div className="form-account-number mx-auto">
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
              className="mx-auto"
            />
            <Input
              style={{ width: '100%' }}
              formik={formik}
              name="password"
              label="Enter Password"
              passwordToggleFunction={togglePasswordType}
              type={passwordType}
              placeholder="Password"
            />
            <Input
              style={{ width: '100%' }}
              formik={formik}
              name="token"
              label="Enter Token"
              passwordToggleFunction={toggleTokenType}
              type={tokenType}
              placeholder="Token"
            />
            <div
              style={{
                width: '100%',
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: '20px',
              }}
            >
              <Button
                loading={isLoading}
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

export default AdminLogin;
