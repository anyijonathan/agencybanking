import { Card } from 'react-bootstrap';
import CookieConsent from 'react-cookie-consent';
import './Footer.scss';

const Footer = () => {
  return (
    <div className="card-footer">
      <CookieConsent
        style={{ background: '#5C2682' }}
        buttonStyle={{
          background: '#FFB81C',
          color: '#000000',
          fontSize: '13px',
          borderRadius: '3px',
        }}
      >
        This website uses cookies to enhance the user experience.
      </CookieConsent>
      Copyright © {new Date().getFullYear()}. First City Monument Bank Limited. | www.fcmb.com
    </div>
  );
};

export default Footer;
