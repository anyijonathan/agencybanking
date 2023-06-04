import { useEffect, useState } from 'react';
import axios from '../../../config/Axios';

const PersonalInformation = (props) => {
  //Fetch User Personal Information

  const accountNumber = props.accountNumber;
  let PI_DETAILS = [];
  const [PIDetailsList, setPIDetailsList] = useState(PI_DETAILS);

  const fetchPersonalInformation = async () => {
    const res = await axios.get(
      'Agent/GetAgentSummaryByAccountNumber?AccountNumber=' + accountNumber
    );
    if (res.data.code === '00') {
      setPIDetailsList(res.data.data);
    }
  };

  useEffect(() => {
    fetchPersonalInformation();
  }, []);

  return (
    <div className="profile-card px-3">
      <div className="mx-auto w-100">
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">First name</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.firstName}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Last name</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.lastName}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Username</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.userName}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Gender</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.gender}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Date of birth</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.dob}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Telephone number</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Second number</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.secondPhoneNumber}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Nationality</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.nationality}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Agent category</span>
              <br />
              <span className="profile-content-span-value">{PIDetailsList?.agentType}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Highest Level of Education</span>
              <br />
              <span className="profile-content-span-value">
                {PIDetailsList?.highestEducationalLevel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
