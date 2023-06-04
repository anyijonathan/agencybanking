import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Button } from 'react-bootstrap';
import Header from '../../../components/Header';
import './Requirements.scss';

export default class Requirements extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const createdBy = queryParams.get('createdBy');

    return (
      <>
        <Header height="100px" />
        <div className="content-box">
          <div className="content-box-title">
            <h3 className="content-box-heading">Onboarding Requirements</h3>
          </div>
          <div className="px-sm-4">
            <p className="content-box-text-requirement">
              You are required to provide the below in your onboarding process:
            </p>
            <div className="content-list-box ms-sm-3 mt-3">
              <ListGroup variant="flush">
                <ListGroup.Item>Personal Details</ListGroup.Item>
                <ListGroup.Item>FCMB Account Number</ListGroup.Item>
                <ListGroup.Item>Business Details (Optional)</ListGroup.Item>
                <ListGroup.Item>Means of Identification e.g NIMC, Voters' Card etc.</ListGroup.Item>
              </ListGroup>
            </div>
            <div className="mx-2 mt-5">
              <Link to="/registration/select-account/" state={{ createdBy: createdBy }}>
                <Button className="button-create-account-process">Start process</Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
