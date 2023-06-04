import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Main.scss';
import background from '../../assets/images/shallow-focus.png';

const Main = () => {
  return (
    <div className="px-md-5 px-3 min-vh-73">
      <div className="row">
        <div className="col-md">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            className="min-vh-73"
          >
            <h1 className="card-title mt-5 mt-md-0">
              FCMB Agent <br /> Banking
            </h1>
            <h2 className="card-text">
              Open an Agent Account from anywhere in the world and get your account number
              instantly.
            </h2>
            <div>
              <Link to="/registration/create-account/">
                <Button variant="primary">Create Agent Account</Button>
              </Link>
            </div>
            <h2 className="card-text">
              Already have an account? <Link to="/login">Login here</Link>
            </h2>
          </div>
        </div>
        <div className="col-md">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            className="min-vh-73"
          >
            <div>
              <img
                src={background}
                width="100%"
                height="100%"
                className="d-inline-block align-top"
                alt="LandingImage"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
