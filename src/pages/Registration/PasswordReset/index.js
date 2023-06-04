import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import EmailConfirmation from '../EmailConfirmation/';
import { EmailAddressValidation } from '../../../utils/constants/formikSchema';
import { useFormik } from 'formik';
import { Store } from '../../../store';
import { Input, Button } from '../../../components/FormElements';
import { regeneratePassword } from '../../../store/actions';
import Header from '../../../components/Header';
import './__PasswordReset.scss';
import PasswordConfirmation from '../PasswordConfirmation';

const initialValues = {
  email: '',
};

const PasswordReset = () => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const [modalShow, setModalShow] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: EmailAddressValidation,
    onSubmit: async (values) => {
      const res = await dispatch(regeneratePassword(values));
      if (res) {
        setModalShow(true);
      }
    },
  });

  return (
    <>
      {/* <LoadingIndicator /> */}
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Email Verification</h3>
        </div>
        <p className="content-box-text-password-reset text-center">
          Kindly fill in the appropriate information to reset your password.
        </p>
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

            <Button
              style={{ marginTop: '20px' }}
              loading={isLoading}
              type="submit"
              className="button-login-process"
              title="Reset Password"
            />
          </Form>
        </div>
        <PasswordConfirmation show={modalShow} onHide={() => setModalShow(false)} />
      </div>
    </>
  );
};

export default PasswordReset;
