import React, { useContext, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Store } from '../store';
import { useIdleTimer } from 'react-idle-timer';
import { logOut } from '../store/actions';
import '../pages/Registration/Registration.scss';

const PrivateRoutes = lazy(() => import('./PrivateRoutes'));
const PublicRoutes = lazy(() => import('./PublicRoutes'));

const Routing = () => {
  const {
    state: {
      auth: { isAuthenticated, authData },
    },
    dispatch,
  } = useContext(Store);

  const handleOnIdle = () => {
    if (isAuthenticated) {
      dispatch(logOut());
    }
  };

  useIdleTimer({
    timeout: 1000 * 60 * 5,
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <>
      <Routes>
        {isAuthenticated && (
          <>
            <Route path="/*" element={<PrivateRoutes stage={authData?.Stage} />} />
          </>
        )}

        {!isAuthenticated && (
          <>
            <Route path="/*" element={<PublicRoutes />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Routing;
