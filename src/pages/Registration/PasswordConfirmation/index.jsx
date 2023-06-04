import React from 'react'
import { Link } from "react-router-dom"
import { Modal, Button } from "react-bootstrap"

const PasswordConfirmation = (props) => {
    return (
        <Modal
          {...props}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Email Verification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="email-verification-text">
              A Password has been sent to Your Email Address.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <div className="email-verification-footer-button-tray">
              <Button className="btn-email-verification-back" onClick={props.onHide}>
                <span className="btn-email-verification-back-text">
                  Close
                </span>
              </Button>
              <Link to="/login/">
                <Button className="btn-email-verification-proceed">
                  <span className="btn-email-verification-proceed-text">
                    Proceed To Login
                  </span>
                </Button>
              </Link>
            </div>
          </Modal.Footer>
        </Modal>
  )
}

export default PasswordConfirmation