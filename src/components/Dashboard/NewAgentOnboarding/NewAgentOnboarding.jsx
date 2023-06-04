import { Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClone } from '@fortawesome/free-solid-svg-icons';
import './NewAgentOnboarding.scss';
import { storeOnboardingCreatedBy } from '../../../utils/helpers/auth';
import configData from '../../../config/config.json';

const NewAgentOnboarding = (props) => {
  const navigation = useNavigate();

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      alert('Copied!');
      navigation('/dashboard/home/');
    } catch (err) {
      alert('Failed to copy!');
    }
  };
  const handleNavigate = () => {
    storeOnboardingCreatedBy(props.account_number);
    navigation('/registration/create-account/');
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-agent-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="mx-auto" id="contained-agent-modal-title-vcenter">
          Onboard New Agent
        </Modal.Title>
      </Modal.Header>
      <div>
        <Modal.Body>
          <p className="new-agent-link-text">Kindly share link or onboard sub-agents directly</p>
        </Modal.Body>
      </div>

      <Modal.Footer>
        <div className="new-agent-footer-button-tray">
          <Button className="btn-email-verification-proceed" onClick={handleNavigate}>
            <span className="btn-email-verification-proceed-text">
              <FontAwesomeIcon style={{ color: '#FFFFFF' }} icon={faPlus} />
              Create Sub-Agent Account
            </span>
          </Button>

          {/* <Link to="#">
            <Button className="btn-email-verification-back" onClick={props.onHide}>
              <span className="btn-email-verification-back-text">
                <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faShareAlt} />
                Share Link to Sub-Agent
              </span>
            </Button>
          </Link> */}
          <Link to="#">
            <Button
              onClick={() =>
                copyToClipBoard(
                  `${
                    configData.BASE_URL +
                    'registration/create-account/?createdBy=' +
                    props.account_number
                  }`
                )
              }
              className="btn-email-verification-back"
            >
              <span className="btn-email-verification-back-text">
                <FontAwesomeIcon style={{ color: '#5C2682' }} icon={faClone} />
                Copy Link To Sub-Agent
              </span>
            </Button>
          </Link>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default NewAgentOnboarding;
