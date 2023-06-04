import React, { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import './AccountSettings.scss';
import { Input } from '../../FormElements';
import { useFormik } from 'formik';
import { changePassword } from '../../../store/actions';
import { ChangePasswordValidation } from '../../../utils/constants/formikSchema';
import { Store } from '../../../store';
import LoadingIndicator from '../../LoadingIndicator';

const initialValues = {
  newPassword: '',
  confirmNewPassword: '',
  oldPassword: '',
};

const AccountSettings = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [newPasswordType, setNewPasswordType] = useState('password');
  const [confirmNewPasswordType, setConfirmNewPasswordType] = useState('password');

  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  const formik = useFormik({
    initialValues,
    validationSchema: ChangePasswordValidation,
    onSubmit: async (values, { resetForm }) => {
      const res = await dispatch(
        changePassword({ newPassword: values.newPassword, oldPassword: values.oldPassword })
      );
      if (res) {
        swal({
          title: 'Congratulations',
          text: 'Your password has been successfully updated',
          icon: 'success',
        });

        resetForm(initialValues);
      }
    },
  });

  const toggleOldPassword = useCallback(() => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  }, [passwordType]);

  const toggleNewPassword = useCallback(() => {
    if (newPasswordType === 'password') {
      setNewPasswordType('text');
      return;
    }
    setNewPasswordType('password');
  }, [newPasswordType]);

  const toggleConfirmNewPassword = useCallback(() => {
    if (confirmNewPasswordType === 'password') {
      setConfirmNewPasswordType('text');
      return;
    }
    setConfirmNewPasswordType('password');
  }, [confirmNewPasswordType]);

  return (
    <>
      <div className="profile-card">
        <div className="mx-auto w-100 px-4 pb-3">
          <Form className="mx-auto w-100" onSubmit={formik.handleSubmit} noValidate>
            <Form.Group className="mb-9">
              <Input
                style={{ maxWidth: '250px' }}
                value={formik.values.oldPassword || ''}
                formik={formik}
                name="oldPassword"
                label="Enter Old Password"
                passwordToggleFunction={toggleOldPassword}
                type={passwordType}
                placeholder="Old Password"
              />
            </Form.Group>

            <Form.Group className="mb-9">
              <Input
                style={{ maxWidth: '250px' }}
                value={formik.values.newPassword || ''}
                formik={formik}
                name="newPassword"
                label="Enter New Password"
                passwordToggleFunction={toggleNewPassword}
                type={newPasswordType}
                placeholder="New Password"
              />
            </Form.Group>
            <Form.Group className="mb-9 w-100">
              <Input
                formik={formik}
                value={formik.values.confirmNewPassword || ''}
                style={{ maxWidth: '250px' }}
                name="confirmNewPassword"
                label="Confirm New Password"
                passwordToggleFunction={toggleConfirmNewPassword}
                type={confirmNewPasswordType}
                placeholder="Confirm New Password"
                showError={true}
              />
            </Form.Group>
            <div className="mt-4">
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-account-set-cancel btn-email-verification-back-text"
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-account-set-save">
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </div>
      {isLoading && <LoadingIndicator />}
    </>
  );
};

export default AccountSettings;
