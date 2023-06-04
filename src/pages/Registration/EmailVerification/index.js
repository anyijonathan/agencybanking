import { Form } from 'react-bootstrap';
import { useEffect, useState, useContext } from 'react';
import Header from '../../../components/Header';
import EmailConfirmation from '../EmailConfirmation';
import { useFormik } from 'formik';
import { EmailAddressValidation } from '../../../utils/constants/formikSchema';
import { getAccountDetailsEmailOnly, verifyEmailAddress } from '../../../store/actions';
import { getOnboardingAccountNumber, storeOnboardingEmail } from '../../../utils/helpers/auth';
import { Button, Input } from '../../../components/FormElements';
import { Store } from '../../../store';
import './EmailVerification.scss';

const initialValues = {
  email: '',
};

const EmailVerification = () => {
  const [modalShow, setModalShow] = useState(false);

  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const setEmailAddress = async () => {
    const res = await dispatch(
      getAccountDetailsEmailOnly(getOnboardingAccountNumber(getOnboardingAccountNumber()))
    );
    if (res?.emailAddress) {
      formik.setFieldValue('email', res?.emailAddress);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema: EmailAddressValidation,
    onSubmit: async (values) => {
      const res = await dispatch(
        verifyEmailAddress({
          email: values.email.toLowerCase(),
          accountNumber: getOnboardingAccountNumber(),
        })
      );
      if (res) {
        storeOnboardingEmail(values.email);
        setModalShow(true);
      }
    },
  });

  useEffect(() => {
    setEmailAddress();
  }, []);

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Email Verification</h3>
        </div>
        <p className="content-box-text-email-verification mx-sm-5 mx-3">
          Kindly fill in the appropriate information to be onboarded as an FCMB agent.
        </p>
        <p style={{ width: '100%' }} className="account-text text-start text-sm-center mx-3">
          Confirm Email Address
        </p>

        <div style={{ maxWidth: '500px' }} className="form-account-number px-2 mx-auto">
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-9">
              <Input
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
                value={formik.values.email}
                type="email"
                name="email"
                disabled={true}
                formik={formik}
              />
            </Form.Group>
            <Button loading={isLoading} className="button-account-verify-process" title="Next" />
          </Form>
        </div>
        <EmailConfirmation
          show={modalShow}
          email={formik.values.email}
          account_number={getOnboardingAccountNumber()}
          onHide={() => setModalShow(false)}
        />
      </div>
    </>
  );
};

export default EmailVerification;
