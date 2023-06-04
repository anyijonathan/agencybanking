import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Contact from '../components/Contact/Contact';
import Requirements from '../pages/Registration/Requirements';
import AccountSelection from '../pages/Registration/AccountSelection/';
import AccountDetails from '../pages/Registration/AccountDetails';
import AccountVerification from '../pages/Registration/AccountVerification';
import EmailVerification from '../pages/Registration/EmailVerification';
import AccountCredentials from '../pages/Registration/AccountCredentials';
import AccountCreation from '../pages/Registration/AccountCreation';
import AccountBVNVerification from '../pages/Registration/AccountBVNVerification';
import PersonalInformation from '../pages/Registration/PersonalInformation';
import PasswordReset from '../pages/Registration/PasswordReset';
import AdminLogin from '../pages/Login/AdminLogin';

const ShowEntry = () => {
  const userRole = localStorage.getItem('userRole');
  if (!userRole) {
    return <Navigate to="home" />;
  }
  if (userRole === 'SuperAdmin') {
    return <Navigate to="admin/login" />;
  } else {
    return <Navigate to="login" />;
  }
};

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowEntry />} />
      <Route exact path="/home" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/contact-us" element={<Contact />} />
      {/* User Account Opening Routes */}
      <Route path="/registration/create-account/" element={<Requirements />} />
      <Route path="/registration/select-account/" element={<AccountSelection />} />
      <Route path="/registration/account-details/" element={<AccountDetails />} />
      <Route path="/registration/verify-account/" element={<AccountVerification />} />
      <Route path="/registration/verify-email/" element={<EmailVerification />} />
      <Route path="/registration/account-credentials/" element={<AccountCredentials />} />
      <Route path="/registration/new-account/" element={<AccountCreation />} />
      <Route path="/registration/verify-account-details/" element={<AccountBVNVerification />} />
      <Route path="/registration/personal-information/" element={<PersonalInformation />} />
      {/* Unauthenticated User */}
      <Route path="/user/forgot-password/" element={<PasswordReset />} />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to={'/'} />} />
    </Routes>
  );
};

export default PublicRoutes;
