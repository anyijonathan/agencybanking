import { Modal, Button } from "react-bootstrap"
import "../ApplicationApproved/ApplicationApproved.scss"
import doc from "../../../assets/docs/terms-and-conditions.pdf"

const TermsAndConditions = (props) => {

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter-app">
                    Terms And Conditions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <iframe title="Terms and Conditions" src={doc} style={{ width: "100%", height: "100%" }} frameBorder="0"></iframe>
            </Modal.Body>
            <Modal.Footer>
                <div className="email-verification-footer-button-tray">
                    <Button onClick={props.onHide} className="btn-email-verification-proceed">
                        <span className="btn-email-verification-proceed-text">
                            Go Back
                        </span>
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default TermsAndConditions