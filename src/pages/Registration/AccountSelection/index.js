import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import Header from '../../../components/Header';
import './AccountSelection.scss';
import icon from '../../../assets/icons/icon-arrow-right.png';
import swal from 'sweetalert';

const AccountSelection = () => {
  const comingSoon = () =>
    swal({
      title: 'COMING SOON!!!',
      icon: 'info',
    });

  return (
    <>
      <Header height="100px" />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Select Account</h3>
        </div>

        <div className="w-100 px-3">
          <p className="content-box-text-select-account ms-sm-5 ms-3">Are you an FCMB Customer?</p>

          <div className="mt-md-4">
            <Link className="link-account-true" to="/registration/account-details/">
              <Alert className="alert-tray-box alert-tray-text mx-auto">
                I have an account with FCMB
                <img className="icon-arrow-right" src={icon} alt="icon-arrow-right" />
              </Alert>
            </Link>
          </div>
          <div className="mt-4 w-100 cursor-pointer">
            <span className="link-account-true" onClick={comingSoon}>
              <Alert className="alert-tray-box alert-tray-text mx-auto">
                I don't have an account with FCMB
                <img className="icon-arrow-right" src={icon} alt="icon-arrow-right" />
              </Alert>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSelection;

/* <Link className="link-account-true" to="/registration/new-account/">
<Alert className="alert-tray-box alert-tray-text">
I don't have an account with FCMB  
<img className="icon-arrow-right" src={ icon } alt="icon-arrow-right" />
</Alert>
</Link>  */
