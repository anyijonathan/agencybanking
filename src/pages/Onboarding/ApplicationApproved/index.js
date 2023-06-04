import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import './ApplicationApproved.scss';
import icon from '../../../assets/icons/icon-success.png';

const ApplicationApproved = (props) => {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="mx-auto" id="contained-modal-title-vcenter-app">
          Application Approved
        </Modal.Title>
      </Modal.Header>
      <img className="icon-success" src={icon} alt="icon-success" />
      <Modal.Body>
        <p className="email-verification-text">
          Congratulations
          <br />
          We have sent a notification to your email address😊
        </p>
        <div className="mx-auto">
          <p className="account-creation-message pt-3" style={{ textAlign: 'center' }}>
            {props.summary_description}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="email-verification-footer-button-tray">
          <Link
            to="/onboarding/zac-information/"
            state={{ account_number: props.account_number, token: props.token }}
          >
            <Button className="btn-email-verification-proceed">
              <span className="btn-email-verification-proceed-text">
                View Zonal Agent Co-ordinator
              </span>
            </Button>
          </Link>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ApplicationApproved;
