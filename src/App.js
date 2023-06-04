import React, { Suspense } from 'react';
import StoreProvider from './store';
import Routes from './routes';
import AuthInit from './AuthInit';
import LoadingIndicator from './components/LoadingIndicator';
import useGoogleAnalytics from './utils/helpers/useGoogleAnalytics';

export default function App() {
  useGoogleAnalytics();

  return (
    <StoreProvider>
      <Suspense fallback={<LoadingIndicator />} />
      <AuthInit>
        <Routes />
      </AuthInit>
    </StoreProvider>
  );
}
