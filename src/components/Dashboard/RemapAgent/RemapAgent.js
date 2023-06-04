import React from 'react'
import { Button, Modal } from "react-bootstrap"

const RemapAgent = () => {
  return (
    <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter-app">
                    Application Approved
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="email-verification-text">
                    Congratulations<br />
                    We have sent a notification to your email address😊
                </p>
                <small>
                    New Message
                </small>
            </Modal.Body>
            <Modal.Footer>
                <div className="email-verification-footer-button-tray">
                    <Button className="btn-email-verification-proceed">
                        <span className="btn-email-verification-proceed-text">
                            View Zonal Agent Co-ordinator
                        </span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
  )
}

export default RemapAgent