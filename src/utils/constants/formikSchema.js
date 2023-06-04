import * as Yup from 'yup';

export const LoginValidation = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const ChangePasswordValidation = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string().required('New Password is required'),
  confirmNewPassword: Yup.string()
    .when('newPassword', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'New and Cofirm New Password need to be the same'
      ),
    })
    .required('Confirm New Password is Required'),
});

export const GenerateAccountOtpValidation = Yup.object().shape({
  accountNumber: Yup.string()
    .min(10, 'Invalid Account Number')
    .max(10, 'Invalid Account Number')
    .required('Account Number is required'),
});

export const AccountOtpValidation = Yup.object().shape({
  otp_value: Yup.string().min(3, 'Invalid OTP').max(6, 'Invalid OTP').required('OTP is required'),
});

export const twoFAOTPValidation = Yup.object().shape({
  otp_value: Yup.string().min(3, 'Invalid OTP').max(6, 'Invalid OTP').required('OTP is required'),
});

export const EmailAddressValidation = Yup.object().shape({
  email: Yup.string().email().required('OTP is required'),
});

export const PasswordValidation = Yup.object().shape({
  password: Yup.string().required('Password is required'),
});

export const PersonalInfoValidation = Yup.object().shape({
  highestEducationalLevel: Yup.string().required('Highest Educational Level is required'),
  userRoleId: Yup.string().required('Agent Type is required'),
  nationality: Yup.string().required('Nationality is required'),
  phoneNumber: Yup.string(),
  secondPhoneNumber: Yup.number().typeError('Second Phone Number must be a number'),
});

export const BusinessInfoValidation = Yup.object().shape({
  businessName: Yup.string().required('Business Name is required'),
  businessNature: Yup.string().required('Business Nature is required'),
  businessAddress: Yup.string().required('Business Address is required'),
});

export const RegionInfoValidation = Yup.object().shape({
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  regionAddress: Yup.string().required('Region Address is required'),
  region: Yup.string().required('Region is required'),
  lga: Yup.string().required('LGA is required'),
});

export const AdminLoginValidation = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
  token: Yup.string().required('Token is required'),
});

export const AdminOnboardingInfoValidation = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phoneNumber: Yup.string().required('Phone Number is required'),
  userRoleId: Yup.string().required('User Role Id is required'),
  staffId: Yup.string().required('Staff ID is required'),
  state: Yup.string().required('State is required'),
  region: Yup.string(),
  branch: Yup.string().required('State is required'),
  zac: Yup.string(),
});
