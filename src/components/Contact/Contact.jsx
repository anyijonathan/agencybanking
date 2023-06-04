import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCommentDots,
  faPhone,
  faEnvelope,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import './_Contact.scss';

const Contact = () => {
  return (
    <>
      <Header />
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Contact Us</h3>
        </div>
        <p className="content-box-text mx-3" style={{ color: '#2F0248' }}>
          For more information on our products and services, please call our 24/7 contact centre on:
        </p>
        <div className="mx-md-5 mx-3 gap-5 d-flex flex-column align-items-start">
          <div className="d-flex align-items-center gap-2" style={{ color: '#2F0248' }}>
            <FontAwesomeIcon icon={faPhone} />
            Phone number one - 07003290000
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color: '#2F0248' }}>
            <FontAwesomeIcon icon={faPhone} />
            Phone number two - 012798800
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color: '#2F0248' }}>
            <FontAwesomeIcon icon={faCommentDots} />
            Chat with us via WhatsApp one - (+234) 090 999 99814
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color: '#2F0248' }}>
            <FontAwesomeIcon icon={faCommentDots} />
            Chat with us via WhatsApp two - (+234) 090 999 99814
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color: '#2F0248' }}>
            <FontAwesomeIcon icon={faEnvelope} />
            Email address - customerservice@fcmb.com
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
