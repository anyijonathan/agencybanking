import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import PersonalInformation from '../pages/Onboarding/PersonalInformation';
import BusinessInformation from '../pages/Onboarding/BusinessInformation';
import RegionLocation from '../pages/Onboarding/RegionLocation';
import ApplicationSummary from '../pages/Onboarding/ApplicationSummary';
import ZACInformation from '../pages/Onboarding/ZACInformation';
import AgentInformation from '../components/Dashboard/AgentInformation/AgentInformation';
import Dashboard from '../components/Dashboard/copy';

import Requirements from '../pages/Registration/Requirements';
import AccountSelection from '../pages/Registration/AccountSelection/';
import AccountDetails from '../pages/Registration/AccountDetails';
import AccountVerification from '../pages/Registration/AccountVerification';
import EmailVerification from '../pages/Registration/EmailVerification';
import AccountCredentials from '../pages/Registration/AccountCredentials';
import AccountCreation from '../pages/Registration/AccountCreation';
import AccountBVNVerification from '../pages/Registration/AccountBVNVerification';
import Login from '../pages/Login';
import Profile from '../components/Profile/Profile';
import PasswordReset from '../pages/Registration/PasswordReset';
import AdminLogin from '../pages/Login/AdminLogin';
import SuperAdminDashboard from '../components/Dashboard/SuperAdminDashboard';

const RegistrationStage = ({ stage }) => {
  if (stage === 'Completed') {
    return <Navigate to="dashboard" />;
  } else if (stage === 'LoginInfo' || stage === 'PersonalInfo') {
    return <Navigate to="onboarding/personal-information" />;
  } else if (stage === 'BusinessInfo') {
    return <Navigate to="onboarding/business-information" />;
  } else if (stage === 'RegionInfo') {
    return <Navigate to="onboarding/region-location" />;
  } else if (stage === 'CompletedPending') {
    return <Navigate to="onboarding/region-location" />;
  } else {
    return <Navigate to="onboarding/personal-information" />;
  }
};

const PrivateRoutes = ({ stage }) => {
  return (
    <Routes>
      {/* Onboarding Routes */}
      <Route path="/" element={<RegistrationStage stage={stage} />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/onboarding/personal-information/" element={<PersonalInformation />} />
      <Route path="/onboarding/business-information/" element={<BusinessInformation />} />
      <Route path="/onboarding/region-location/" element={<RegionLocation />} />
      <Route path="/onboarding/application-summary/" element={<ApplicationSummary />} />
      <Route path="/onboarding/zac-information/" element={<ZACInformation />} />
      {/* Dashboard Routes */}
      <Route path="/dashboard/home/" element={<Dashboard />} />
      <Route path="/dashboard/agent-information/" element={<AgentInformation />} />
      <Route path="/admin/dashboard/" element={<SuperAdminDashboard />} />

      <Route path="/registration/create-account/" element={<Requirements />} />
      <Route path="/registration/select-account/" element={<AccountSelection />} />
      <Route path="/registration/account-details/" element={<AccountDetails />} />
      <Route path="/registration/verify-account/" element={<AccountVerification />} />
      <Route path="/registration/verify-email/" element={<EmailVerification />} />
      <Route path="/registration/account-credentials/" element={<AccountCredentials />} />
      <Route path="/registration/new-account/" element={<AccountCreation />} />
      <Route path="/registration/verify-account-details/" element={<AccountBVNVerification />} />
      <Route path="/registration/personal-information/" element={<PersonalInformation />} />
      <Route path="*" element={<Navigate to={'/'} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/user/profile/" element={<Profile />} />
      <Route path="/user/forgot-password/" element={<PasswordReset />} />
    </Routes>
  );
};

export default PrivateRoutes;
