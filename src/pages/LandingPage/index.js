import { useContext } from 'react';
import Header from '../../components/Header';
import Main from '../../components/Main';
import Footer from '../../components/Footer';
import { Store } from '../../store';
import LoadingIndicator from '../../components/LoadingIndicator';
import { setXframmeOptions } from '../../store/actions';
import { useEffect } from 'react';

function LandingPage() {
  const {
    state: {
      loading: { loading: isLoading },
    },
    dispatch,
  } = useContext(Store);
  useEffect(() => {
    dispatch(setXframmeOptions());
  }, []);
  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="App">
        <Header height="100px" />
        <Main />
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
