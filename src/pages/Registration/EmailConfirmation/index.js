import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './EmailConfirmation.scss';

const EmailConfirmation = (props) => {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header style={{ textAlign: 'center', width: '100%' }} closeButton>
        <Modal.Title
          style={{ marginRight: 'auto', marginLeft: 'auto', width: '100%', textAlign: 'center' }}
          id="contained-modal-title-vcenter"
        >
          Email Verification
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p className="email-verification-text">
          A Password has been sent to Your Email Address for Confirmation.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div className="email-verification-footer-button-tray">
          <Button className="btn-email-verification-back" onClick={props.onHide}>
            <span className="btn-email-verification-back-text">Go Back</span>
          </Button>
          <Link
            to="/registration/account-credentials/"
            state={{ email: props.email, accountNumber: props.account_number }}
          >
            <Button className="btn-email-verification-proceed">
              <span className="btn-email-verification-proceed-text">Proceed</span>
            </Button>
          </Link>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailConfirmation;
