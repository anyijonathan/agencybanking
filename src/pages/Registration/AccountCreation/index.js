import React, { Component } from "react"
import { Link } from "react-router-dom"
import { ListGroup, Button } from "react-bootstrap"
import "../Requirements/Requirements.scss"


export default class AccountCreation extends Component {  
  render() {
    return (
      <div className="content-box">
      <div className="content-box-title">
        <h3 className="content-box-heading">Account Opening Requirements</h3>
      </div>
      <p className="content-box-text">
        In other to create an account with FCMB, there are some informations we will require of you to provide which are listed below.
      </p>
      <div style={{paddingTop:"50px"}} className="content-list-box">
        <ListGroup style={{paddingLeft:"45px"}} variant="flush">
          <ListGroup.Item>Valid Id card, Any of (National id card/Voters' registration/International Passport/Driver's license)</ListGroup.Item>
          <ListGroup.Item>Utility bill</ListGroup.Item>
          <ListGroup.Item>Passport photograph</ListGroup.Item>
        </ListGroup>
      </div>
        <Link to="/registration/verify-account-details/">
          <Button className="button-start-process">Start process</Button>
        </Link>
    </div>
    )
  }
}