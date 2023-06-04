import { Button, Modal } from "react-bootstrap"



const ErrorResponseModal = ( props ) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
            Oops!!! Something went wrong...
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="email-verification-text">
            {props.response}
        </p>
      </Modal.Body>
      <Modal.Footer>
          <div className="email-verification-footer-button-tray">
            <Button className="btn-email-verification-back" onClick={props.onHide}>
                <span className="btn-email-verification-back-text">
                    Go Back
                </span>
            </Button>
          </div>
      </Modal.Footer>
    </Modal>
  )
}

export default ErrorResponseModal