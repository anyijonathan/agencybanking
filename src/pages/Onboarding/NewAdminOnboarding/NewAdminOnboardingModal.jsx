import { Col, Form, Modal, Row } from 'react-bootstrap';
import './NewAdminOnboardingModal.scss';
import { Input, Select } from '../../../components/FormElements';
import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import {
  getRegionByState,
  getZacInfoByState,
  saveOnboardAdminUserInfo,
} from '../../../store/actions';
import { Button } from '../../../components/FormElements';
import { Store } from '../../../store';
import swal from 'sweetalert';
import { AdminOnboardingInfoValidation } from '../../../utils/constants/formikSchema';
import { userTypes } from '../../../utils/constants';

const NewAdminOnboarding = (props) => {
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    userRoleId: '',
    staffId: '',
    branch: '',
    state: '',
    region: '',
    zac: '',
  };

  const {
    state: {
      loading: { loading: isLoading },
      account: { states, regions, zacsByState },
    },
    dispatch,
  } = useContext(Store);

  const closeModal = () => {
    props.setAdminModalShow(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: AdminOnboardingInfoValidation,
    onSubmit: async (values, { resetForm }) => {
      const res = await dispatch(saveOnboardAdminUserInfo(values));
      if (res) {
        swal({
          title: 'Congratulations',
          text: `You have successfully onboarded ${formik.values.firstName} ${formik.values.lastName}`,
          icon: 'success',
          allowOutsideClick: false,
          closeOnEsc: false,
        });
        closeModal();
        resetForm(initialValues);
      }
    },
  });

  useEffect(() => {
    if (formik.values.state) {
      dispatch(getRegionByState(formik.values.state));
      dispatch(getZacInfoByState(formik.values.state));
    }
  }, [formik.values.state]);

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-agent-modal-title-vcenter"
        className="modal-content-admin-form new-admin-form"
      >
        <div className="modal-content new-admin-form">
          <Modal.Header closeButton>
            <Modal.Title id="contained-agent-modal-title-vcenter">
              Onboard New Admin Roles
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body new-admin-form">
            <Form className="new-onboarding-admin" onSubmit={formik.handleSubmit} noValidate>
              <div className="form-content-wrapper new-admin-form ">
                <Row>
                  <Col>
                    <Input
                      name="firstName"
                      value={formik.values.firstName}
                      label="First name"
                      placeholder="Enter First Name"
                      formik={formik}
                    />
                  </Col>
                  <Col>
                    <Input
                      label="Last Name"
                      value={formik.values.lastName}
                      name="lastName"
                      placeholder="Enter Last Name"
                      formik={formik}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Input
                      name="email"
                      value={formik.values.email}
                      label="Email Address"
                      placeholder="Enter Email Address"
                      formik={formik}
                    />
                  </Col>
                  <Col>
                    <Input
                      label="Phone Number"
                      value={formik.values.phoneNumber}
                      name="phoneNumber"
                      placeholder="Enter Phone Number"
                      formik={formik}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Select
                      label="Select User Role"
                      formik={formik}
                      options={userTypes}
                      value={formik.values.userRoleId}
                      name="userRoleId"
                    />
                  </Col>
                  <Col>
                    <Input
                      label="Staff ID"
                      value={formik.values.staffId}
                      name="staffId"
                      placeholder="Enter Staff ID"
                      formik={formik}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Select
                      label="Select State"
                      formik={formik}
                      options={states}
                      value={formik.values.state}
                      name="state"
                    />
                  </Col>
                  <Col>
                    <Select
                      label="Select Region"
                      formik={formik}
                      options={regions}
                      value={formik.values.region}
                      name="region"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Input
                      name="branch"
                      label="Branch Name"
                      formik={formik}
                      placeholder="Enter Branch Name"
                      value={formik.values.branch}
                    />
                  </Col>
                  <Col>
                    <Select
                      label="Select ZAC"
                      formik={formik}
                      options={zacsByState}
                      value={formik.values.zac}
                      name="zac"
                    />
                  </Col>
                </Row>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                className="btn-email-verification-proceed onboard-admin-submit"
                title="Submit"
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default NewAdminOnboarding;
