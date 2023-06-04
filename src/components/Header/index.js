import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dropdown, Navbar, Nav, Button, Modal, Stack } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';
import { logOut } from '../../store/actions';
import { Store } from '../../store';
import { Button as FormButton } from '../FormElements';
import NewAgentOnboarding from '../Dashboard/NewAgentOnboarding/NewAgentOnboarding';
import logo from '../../assets/images/logo.svg';
import NewAdminOnboarding from '../../pages/Onboarding/NewAdminOnboarding/NewAdminOnboardingModal';
import { formatRoleName } from '../../utils/helpers';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';

const Header = ({ height, marginTop, accountNumber, roleName, stage, token }) => {
  const location = useLocation();

  const [agentModalShow, setAgentModalShow] = useState(false);
  const [adminModalShow, setAdminModalShow] = useState(false);

  const {
    state: {
      loading: { loading: isLoading },
      auth: { authData, isAuthenticated },
    },
    dispatch,
  } = useContext(Store);

  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Navbar style={{ height: height, marginTop: marginTop }} bg="light" variant="light">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <div>
            <Link to="/home">
              <Navbar.Brand>
                <img
                  src={logo}
                  width="50"
                  height="50"
                  className="d-inline-block align-top"
                  alt="FCMB logo"
                />
              </Navbar.Brand>
            </Link>
          </div>
          <Nav className="me-auto">
            {location.pathname.includes('/registration/') && (
              <Navbar.Text className="me-auto-text">Agent Banking Application Form</Navbar.Text>
            )}
            {location.pathname.includes('/onboarding/') && (
              <Navbar.Text className="me-auto-text">Agent Banking Application Form</Navbar.Text>
            )}
            {(location.pathname.includes('/dashboard') ||
              location.pathname === '/user/profile/') && (
              <Navbar.Text className="me-auto-text">Agent Dashboard</Navbar.Text>
            )}
          </Nav>
          {/* <div className="mobile-navbar"> */}
          <div
            onClick={() => setOpenNav(!openNav)}
            className="d-block d-md-none"
            style={{ fontSize: '30px' }}
          >
            {<GiHamburgerMenu />}
          </div>
          <div className="d-none d-md-block">
            {location.pathname.includes('/dashboard') || location.pathname === '/user/profile/' ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    <FontAwesomeIcon className="fa-angle-down" icon={faUserTie} />
                    <span className="span-user-profile-name">
                      {authData?.Name}{' '}
                      <FontAwesomeIcon className="fa-angle-down" icon={faAngleDown} />
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/user/profile/">
                      <span id="dropdown-item">Profile</span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setAgentModalShow(true)}>
                      <span id="dropdown-item">Create Agent</span>
                    </Dropdown.Item>

                    {authData?.RoleName === 'SuperAdmin' && (
                      <Dropdown.Item onClick={() => setAdminModalShow(true)}>
                        <span id="dropdown-item">Create Admin</span>
                      </Dropdown.Item>
                    )}

                    <Dropdown.Item onClick={() => dispatch(logOut())}>
                      <span id="dropdown-item">Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="mx-4">
                  <small className="role-header-text">{formatRoleName(authData?.RoleName)}</small>
                </div>
              </>
            ) : (
              <Nav>
                <Nav.Link to="/contact-us/" href="/contact-us/">
                  Contact Us
                </Nav.Link>
                {location.pathname === '/' && (
                  <Link to="/registration/create-account/">
                    <Button variant="primary">Create Account</Button>
                  </Link>
                )}
                <section>
                  {isAuthenticated ? (
                    <FormButton
                      loading={isLoading}
                      title="Logout"
                      btnClass="primary login text-white"
                      onClick={() => dispatch(logOut())}
                    />
                  ) : (
                    <Link to="/login/">
                      <Button variant="primary login">Login</Button>
                    </Link>
                  )}
                </section>
              </Nav>
            )}
          </div>
          {/* </div> */}
        </div>

        {/* Mmobile Navigation */}
        <div className={openNav ? `mobile-navbar--open` : `mobile-navbar`}>
          <Stack gap={5}>
            <div className="d-flex justify-content-between">
              <Link to="/home">
                <Navbar.Brand>
                  <img
                    src={logo}
                    width="50"
                    height="50"
                    className="d-inline-block align-top"
                    alt="FCMB logo"
                  />
                </Navbar.Brand>
              </Link>
              <div onClick={() => setOpenNav(!openNav)} style={{ fontSize: '30px' }}>
                {openNav && <AiOutlineClose />}
              </div>
            </div>
            <div className="nav">
              <div className="d-block d-md-none">
                {location.pathname.includes('/dashboard') ||
                location.pathname === '/user/profile/' ? (
                  <>
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <FontAwesomeIcon className="fa-angle-down" icon={faUserTie} />
                        <span className="span-user-profile-name">
                          {authData?.Name}
                          <FontAwesomeIcon className="fa-angle-down" icon={faAngleDown} />
                        </span>
                      </Dropdown.Toggle>

                      <div className="mt-3 mx-3">
                        <small className="role-header-text">
                          {formatRoleName(authData?.RoleName)}
                        </small>
                      </div>
                      <Dropdown.Menu>
                        <Dropdown.Item href="/user/profile/">
                          <span id="dropdown-item">Profile</span>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setAgentModalShow(true)}>
                          <span id="dropdown-item">Create Agent</span>
                        </Dropdown.Item>

                        {authData?.RoleName === 'SuperAdmin' && (
                          <Dropdown.Item onClick={() => setAdminModalShow(true)}>
                            <span id="dropdown-item">Create Admin</span>
                          </Dropdown.Item>
                        )}

                        <Dropdown.Item onClick={() => dispatch(logOut())}>
                          <span id="dropdown-item">Logout</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <Nav>
                    <div>
                      {location.pathname === '/' && (
                        <Link to="/registration/create-account/">
                          <Button variant="primary">Create Account</Button>
                        </Link>
                      )}
                      <section onClick={() => setOpenNav(!openNav)}>
                        {isAuthenticated ? (
                          <FormButton
                            loading={isLoading}
                            title="Logout"
                            btnClass="primary login text-white"
                            onClick={() => dispatch(logOut())}
                          />
                        ) : (
                          <Link to="/login/">
                            <Button variant="primary login">Login</Button>
                          </Link>
                        )}
                      </section>
                      <Nav.Link
                        onClick={() => setOpenNav(!openNav)}
                        to="/contact-us/"
                        href="/contact-us/"
                      >
                        Contact Us
                      </Nav.Link>
                    </div>
                  </Nav>
                )}
              </div>
            </div>
          </Stack>
        </div>

        {/* Mmobile Navigation */}
      </Navbar>

      <NewAgentOnboarding
        show={agentModalShow}
        account_number={accountNumber}
        onHide={() => setAgentModalShow(false)}
      />
      <NewAdminOnboarding
        show={adminModalShow}
        account_number={accountNumber}
        onHide={() => setAdminModalShow(false)}
        setAdminModalShow={setAdminModalShow}
      />
    </>
  );
};

export default Header;
