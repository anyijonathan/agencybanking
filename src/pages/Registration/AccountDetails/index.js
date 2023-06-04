import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Store } from '../../../store';
import { useFormik } from 'formik';
import './AccountDetails.scss';
import Header from '../../../components/Header';
import { GenerateAccountOtpValidation } from '../../../utils/constants/formikSchema';
import { generateAccountOtp } from '../../../store/actions';
import { Input, Button } from '../../../components/FormElements';
import { storeOnboardingAccountNumber } from '../../../utils/helpers/auth';

const initialValues = {
  accountNumber: '',
};
const AccountDetails = () => {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const navigate = useNavigate();
  const validate = (values) => {
    const errors = {};
    if (!values.accountNumber) {
      errors.accountNumber = 'Account Number is Required';
    } else if (values?.accountNumber.match(/[a-zA-Z]/)) {
      errors.accountNumber = 'Account Number must be a number';
    } else if (values?.accountNumber.toString().length > 10) {
      errors.accountNumber = 'Account Number must be 10 characters';
    }
    return errors;
  };
  const formik = useFormik({
    initialValues,
    validate,
    validationSchema: GenerateAccountOtpValidation,
    onSubmit: async (values) => {
      const res = await dispatch(generateAccountOtp(values.accountNumber));
      if (res) {
        storeOnboardingAccountNumber(values.accountNumber);
        navigate('/registration/verify-account/');
      }
    },
  });

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Account Details</h3>
        </div>
        <p className="content-box-text-requirement account-text ms-sm-5 ms-3">
          Enter Account Number
        </p>
        <div className="form-account-number w-100 mx-auto px-3">
          <Form onSubmit={formik.handleSubmit} noValidate>
            <Input
              style={{ maxWidth: '500px', width: '100%' }}
              className="mx-auto"
              name="accountNumber"
              formik={formik}
              inputmode="numeric"
              placeholder="Account Number"
              type="tel"
              pattern="[0-9]*"
              maxlength="10"
            />
            <div className="pt-1">
              {formik.errors.accountNumber ? (
                <span className=" text-danger text-start">{formik.errors.accountNumber}</span>
              ) : null}
            </div>

            <Button
              loading={isLoading}
              disabled={isLoading}
              className="button-account-verify-process"
              title="Next"
            />
          </Form>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
