import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { Form, Button } from 'react-bootstrap';
import { trackPromise } from 'react-promise-tracker';
import swal from 'sweetalert';
// import configData from "../../../../config/config.json"
// import "../../../../pages/Onboarding/PersonalInformation/PersonalInformation.scss"

const PersonalInformation = () => {
  // const baseUrI = configData.SERVER_URL
  const [value, onChange] = useState(new Date());
  const location = useLocation();
  const roleName = location.state.roleName;
  const stage = location.state.stage;
  const token = location.state.token;
  const navigation = useNavigate();
  let ACCOUNT_DETAILS = [];
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [otherName, setOtherName] = useState();
  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [maritalStatus, setMaritalStatus] = useState();
  const [countryOfBirth, setCountryOfBirth] = useState();
  const [countryOfResidence, setCountryOfResidence] = useState();
  const [maidenName, setMaidenName] = useState();
  const [postCode, setPostCode] = useState();
  const [typeOfVisa, setTypeOfVisa] = useState();
  const [permitIssueDate, setPermitIssueDate] = useState();
  const [regionLGA, setRegionLGA] = useState();
  const [residentPermitID, setResidentPermitID] = useState();
  const [taxNumber, setTaxNumber] = useState();
  const [accountPurpose, setAccountPurpose] = useState();
  const [stateOfOrigin, setStateOfOrigin] = useState();
  const [religion, setReligion] = useState();
  const [permitExpiryDate, setPermitExpiryDate] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [dateOfBirthISO, setDateOfBirthISO] = useState();
  const [mobileNumber, setMobileNumber] = useState();
  const [secondMobileNumber, setSecondMobileNumber] = useState();
  const [nationality, setNationality] = useState();
  const [agentType, setAgentType] = useState();
  const [userAccountEmailAddress, setUserAccountEmailAddress] = useState();
  const [biometricID, setBiometricID] = useState();
  const [branchCode, setBranchCode] = useState();
  const [agentRoleID, setAgentRoleID] = useState();
  const [brokerCode, setBrokerCode] = useState();
  const [accountTier, setAccountTier] = useState();
  const [accountOfficerCode, setAccountOfficerCode] = useState();
  const [highestEducationalLevel, setHighestEducationalLevel] = useState();
  const [accountDetailsList, setAccountDetailsList] = useState(ACCOUNT_DETAILS);
  const accountNumber = location.state.accountNumber;
  const email = location.state.email;
  const createdBy = location.state.createdBy;

  //Fetch User Account Details To Prefill Fields
  // const addAccountNumber = async () => {

  //     const res = await fetch(baseUrI + "Agent/GetAccountDetailsFromBankAPi?AccountNumber=" + accountNumber, {
  //     method: "GET",
  //     headers: {
  //         "Content-type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Headers": "X-Requested-With",
  //     },
  //     })

  //     const data = await res.json()
  //     ACCOUNT_DETAILS = data
  //     setAccountDetailsList(...[ACCOUNT_DETAILS])
  //     const [firstName, lastName, otherName] = accountDetailsList['data']['accountName'].split(' ')
  //     const gender = accountDetailsList['data']['sex']
  //     const dateOfBirth = accountDetailsList['data']['dateOfBirth'] // Switch to DD/MM Format
  //     const mobileNumber = accountDetailsList['data']['mobileNumber']
  //     const biometricID = accountDetailsList['data']['biometric_ID']
  //     const userAccountEmailAddress = accountDetailsList['data']['emailAddress']
  //     const branchCode = accountDetailsList['data']['branchCode']
  //     const brokerCode = accountDetailsList['data']['brokerCode']
  //     const accountOfficerCode = accountDetailsList['data']['accountOfficerCode']
  //     const accountTier = accountDetailsList['data']['tier']
  //     setFirstName(firstName)
  //     setLastName(lastName)
  //     setOtherName(otherName)
  //     setGender(gender)
  //     setDateOfBirth(dateOfBirth)
  //     setMobileNumber(mobileNumber)
  //     setBiometricID(biometricID)
  //     setBranchCode(branchCode)
  //     setBrokerCode(brokerCode)
  //     setAccountOfficerCode(accountOfficerCode)
  //     setAccountTier(accountTier)
  //     setUserAccountEmailAddress(userAccountEmailAddress)
  // }
  // useEffect(() => {
  //     addAccountNumber()
  // }, [ACCOUNT_DETAILS])

  // const onSubmit = (e) => {
  //     e.preventDefault()
  //     if (!firstName) {
  //         swal({
  //             title: "Oops!!!",
  //             text: "Please enter your first name",
  //             icon: "error",
  //           });
  //       return
  //     }
  //     if (!lastName) {
  //         swal({
  //             title: "Oops!!!",
  //             text: "Please enter your last name",
  //             icon: "error",
  //           });
  //         return
  //     } {/* Implement additional field validation */}
  //     submitPersonalInformation(firstName,
  //                               lastName,
  //                               otherName,
  //                               accountNumber,
  //                               mobileNumber,
  //                               email,
  //                               dateOfBirth,
  //                               gender,
  //                               secondMobileNumber,
  //                               nationality,
  //                               agentType,
  //                               highestEducationalLevel,
  //                               biometricID,
  //                               branchCode,
  //                               brokerCode,
  //                               accountOfficerCode,
  //                               createdBy,
  //                               accountTier,
  //                               title,
  //                               maritalStatus,
  //                               countryOfBirth,
  //                               maidenName,
  //                               countryOfResidence,
  //                               postCode,
  //                               typeOfVisa,
  //                               permitIssueDate,
  //                               permitExpiryDate,
  //                               regionLGA,
  //                               stateOfOrigin,
  //                               taxNumber,
  //                               residentPermitID,
  //                               accountPurpose,
  //                               religion,
  //                               agentRoleID)
  // }

  // Submit Personal Information
  // const submitPersonalInformation = async () => {

  //     const dateOfBirthISO = new Date(dateOfBirth).toISOString()
  //     setDateOfBirthISO(dateOfBirthISO)
  //     const res = await trackPromise(fetch(baseUrI + "PersonalInfo/SavePersonalInfo", {
  //     method: "POST",
  //     headers: {
  //         "Content-type": "application/json",
  //         "Access-Control-Allow-Origin": "*",
  //         "Access-Control-Allow-Headers": "X-Requested-With",
  //         "Authorization" : `Bearer ${token}`
  //     },
  //     body: JSON.stringify(
  //         {
  //         "otherName": otherName,
  //         "firstName": firstName,
  //         "lastName": lastName,
  //         "email": email,
  //         "accountNumber": accountNumber,
  //         "phoneNumber": mobileNumber,
  //         "gender": gender,
  //         "dob": dateOfBirthISO,
  //         "secondPhoneNumber": secondMobileNumber,
  //         "nationality": nationality,
  //         "agentType": "user-agent",
  //         "highestEducationalLevel": highestEducationalLevel,
  //         "bvn": biometricID,
  //         "createdBy": createdBy,
  //         "branch": branchCode,
  //         "brokerCode": brokerCode,
  //         "bankCode": branchCode,
  //         "tier": accountTier,
  //         "aoCode": accountOfficerCode,
  //         "userRoleId": agentRoleID
  //         })
  //     }))
  //     const data = await res.json()

  //     if (data["code"] === "00") {
  //         navigation("/onboarding/business-information/", {state :{ accountNumber : accountNumber, token:token}, replace:true})
  //     }
  //     else {
  //         alert(data["description"])
  //     }
  // }

  return (
    <>
      <Button onClick={() => navigation(-1)} className="btn btn-light btn-dark-xs">
        <span className="btn-light-xs-text">Back</span>
      </Button>
      <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Personal Information</h3>
        </div>
        <p className="content-box-text">
          Kindly fill in the appropriate information to create an FCMB account.
        </p>
        <Form>
          <div className="form-content-left">
            <Form.Group className="mb-9">
              <label>First name</label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First name"
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Other Name</label>
              <Form.Control
                type="text"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                placeholder="Enter Other name"
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Marital Status</label>
              <Form.Select
                size="lg"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option>Choose status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Married">Divorced</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Date Of Birth</label>
              <DatePicker onChange={onChange} value={dateOfBirth} />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Mother’s Maiden Name</label>
              <Form.Control
                type="text"
                placeholder="Enter Maiden name"
                value={maidenName}
                onChange={(e) => setMaidenName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Country of Residence</label>
              <Form.Select
                size="lg"
                value={countryOfResidence}
                onChange={(e) => setCountryOfResidence(e.target.value)}
              >
                <option value="nigeria">Nigeria</option>
                <option value="united-kingdom">United Kingdom</option>
                <option value="united-states">United States</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Post Code</label>
              <Form.Control
                type="text"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                placeholder="Enter Post code"
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Permit Issue Date</label>
              <DatePicker onChange={onChange} value={permitIssueDate} />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>L.G.A</label>
              <Form.Select
                size="lg"
                onChange={(e) => setRegionLGA(e.target.value)}
                value={regionLGA}
              >
                <option value="lga">Choose LGA</option>
                <option value="ajah">Ajah</option>
                <option value="ibeju-lekki">Ibeju-Lekki</option>
                <option value="isolo">Isolo</option>
                <option value="oshodi">Oshodi</option>
                <option value="yaba">Yaba</option>
                <option value="zubaya">Zubaya</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Tax Identification Number (TIN)</label>
              <Form.Control
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                placeholder="Enter TIN"
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Purpose of Account</label>
              <Form.Control
                type="text"
                placeholder="Enter use of the account"
                value={accountPurpose}
                onChange={(e) => setAccountPurpose(e.target.value)}
              />
            </Form.Group>
          </div>
          <div className="form-content-right">
            <Form.Group className="mb-9">
              <label>Last name</label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last name"
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Title</label>
              <Form.Select size="lg" value={title} onChange={(e) => setTitle(e.target.value)}>
                <option>Choose title</option>
                <option value="Miss">Miss</option>
                <option value="Ms">Ms.</option>
                <option value="Mr">Mr.</option>
                <option value="Mrs">Mrs.</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Gender</label>
              <Form.Select size="lg" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option>Choose gender</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Country Of Birth</label>
              <Form.Select
                size="lg"
                value={countryOfBirth}
                onChange={(e) => setCountryOfBirth(e.target.value)}
              >
                <option>Choose country</option>
                <option value="Nigeria">Nigeria</option>
                <option value="united-kingdom">United Kingdom</option>
                <option value="united-states">United States</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Nationality</label>
              <Form.Select
                size="lg"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
              >
                <option value="nigeria">Nigeria</option>
                <option value="united-kingdom">United Kingdom</option>
                <option value="united-states">United States</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Highest level of education</label>
              <Form.Select
                size="lg"
                value={highestEducationalLevel}
                onChange={(e) => setHighestEducationalLevel(e.target.value)}
              >
                <option value="level">Highest level of education</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
                <option value="others">Others</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Type of Visa</label>
              <Form.Select
                size="lg"
                value={typeOfVisa}
                onChange={(e) => setTypeOfVisa(e.target.value)}
              >
                <option>Choose Type of visa</option>
                <option value="1">Type I</option>
                <option value="2">Type II</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Permit Expiry Date</label>
              <DatePicker onChange={onChange} value={permitExpiryDate} />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>State of Origin</label>
              <Form.Select
                size="lg"
                onChange={(e) => setStateOfOrigin(e.target.value)}
                value={stateOfOrigin}
              >
                <option value="state">Choose State</option>
                <option value="abia">Abia</option>
                <option value="anambra">Anambra</option>
                <option value="akwa-ibom">Akwa-Ibom</option>
                <option value="enugu">Enugu</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja (FCT)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Resident Permit No.</label>
              <Form.Control
                type="text"
                value={residentPermitID}
                onChange={(e) => setResidentPermitID(e.target.value)}
                placeholder="Enter Permit No."
              />
            </Form.Group>
            <Form.Group className="mb-9">
              <label>Religion</label>
              <Form.Select size="lg" value={religion} onChange={(e) => setReligion(e.target.value)}>
                <option value="0">Choose religion</option>
                <option value="christianity">Christianity</option>
                <option value="islam">Islam</option>
                <option value="others">Others</option>
              </Form.Select>
            </Form.Group>
          </div>
          {/* <Button style={{ top: "calc(50% - 49px/2 + 620.5px)" }} onClick={onSubmit} className="button-start-process">Next</Button> */}
        </Form>
      </div>
    </>
  );
};

export default PersonalInformation;
