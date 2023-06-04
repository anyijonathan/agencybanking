import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { trackPromise } from "react-promise-tracker"
import { Form, Button } from "react-bootstrap"
import swal from "sweetalert"
// import configData from "../../../../config/config.json"

import "../AccountVerification/AccountVerification.scss"




const AccountBVNVerification = () => {

  // const baseUrI = configData.SERVER_URL
  const [accountBVNNumber, setAccountBVNNumber] = useState("")
  const navigation = useNavigate()

  const location = useLocation() 
  const createdBy = location.state.createdBy

  // const onSubmit = (e) => {
  //   e.preventDefault()
  //   if (!accountBVNNumber) {
  //     swal({
  //       title: "Oops!!!",
  //       text: "Please enter your BVN number",
  //       icon: "error",
  //     });
  //     return
  //   }

  //   addAccountBVNNumber(accountBVNNumber)
  //   setAccountBVNNumber(e.target.value)
  // }

  // // Verify BVN Number
  // const addAccountBVNNumber = async (accountBVNNumber) => {
    
  //   const res = await trackPromise(fetch(baseUrI + "Auth/GenerateAccountOTP?AccountNumber=" + accountBVNNumber, {
  //     method: "GET",
  //     headers: {
  //       "Content-type": "application/json",
  //       "Access-Control-Allow-Origin": "*",
  //       "Access-Control-Allow-Headers": "X-Requested-With",
  //     },
  //   }))

  //   const data = await res.json()
    
  //   if (data["code"] === "00") {
  //     setAccountBVNNumber([...accountBVNNumber, data])
  //     navigation("/registration/personal-information/", {state :{ accountBVNNumber : accountBVNNumber, createdBy : createdBy}, replace:true})
  //   }
  //   else {
  //     navigation("/registration/personal-information/", {state :{ accountBVNNumber : accountBVNNumber, createdBy : createdBy}, replace:true})
  //     //alert(data["description"])
  //     //<ErrorResponseModal response={data["description"]} />
  //   }
  // }

  return (
    <div className="content-box">
        <div className="content-box-title">
          <h3 className="content-box-heading">Bank Verification Number</h3>
        </div>
        <p className="content-box-text">
            Kindly Input your Bank Verification Number for validation in other to proceed with registration.
        </p>
        <p style={{paddingTop:"70px"}} className="content-box-text account-text">Bank Verification Number</p>
         <div className="form-account-number">
          <Form>
              <Form.Group className="mb-9">
                  <Form.Control 
                    type="number" 
                    placeholder="Bank verification number"
                    value={accountBVNNumber}
                    onChange={(e) => setAccountBVNNumber(e.target.value)} />
              </Form.Group>
              {/* <Button onClick={onSubmit} style={{ top: "calc(50% - 49px/2 + 20.5px)" }} className="button-start-process">Next</Button> */}
          </Form>
        </div>
    </div>
  )
}

export default AccountBVNVerification