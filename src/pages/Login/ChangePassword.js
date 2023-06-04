import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useContext } from 'react'
import { Modal, Form } from "react-bootstrap"
import { useFormik } from 'formik'
import { Store } from "../../store"
import { Button, Input } from "../../components/FormElements"
import { changePassword } from "../../store/actions"
import { ChangePasswordValidation, twoFAOTPValidation } from "../../utils/constants/formikSchema"


const initialValues = {
  otp_value: "",
  account_no: "",
}


const ChangePassword = (props) => {
  const { state: { loading: { loading: isLoading } }, dispatch } = useContext(Store)
  const navigate = useNavigate()
  const [passwordType, setPasswordType] = useState('password');
  
  const formik = useFormik({
    initialValues,
    validationSchema: ChangePasswordValidation,
    onSubmit: async (values) => {
      const res = await dispatch(changePassword({ account_no: props.account_number, otp_value: values.otp_value.toString() }))
      if (res) {
        navigate("/")
      }
    },
  })

  const togglePasswordType = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  return (
    <Form className="account-set-form" onSubmit={formik.handleSubmit} noValidate >
        <div className="profile-content-left">
            <div className="profile-content-tray">
                <Form.Group className="mb-9">
                    <Input style={{width:"250px"}} formik={formik} name="oldPassword" passwordToggleFunction={togglePasswordType} type={passwordType} label="Enter Old Password" placeholder="Old Password" />
                </Form.Group>
            </div>
        </div>
        <div className="profile-content-right">
            <div className="profile-content-tray">
            <Form.Group className="mb-9">
                <Input style={{width:"250px"}} formik={formik} name="newPassword" label="Enter New Password" passwordToggleFunction={togglePasswordType} type={passwordType} placeholder="New Password" />
            </Form.Group>
            <Form.Group className="mb-9">
                <Input style={{width:"250px"}} formik={formik} name="confirmNewPassword" label="Confirm New Password" passwordToggleFunction={togglePasswordType} type={passwordType} placeholder="Confirm New Password" showError={true} />
            </Form.Group>
            </div>
            <div className="account-set-button-tray">
                <Button type='submit' className="btn-account-set-save">Save Changes</Button>
            </div>
        </div>
    </Form>
  )
}

export default ChangePassword