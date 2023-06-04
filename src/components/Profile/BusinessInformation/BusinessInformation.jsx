import { useEffect, useState } from 'react';
import axios from '../../../config/Axios';

const BusinessInformation = (props) => {
  //Fetch User Business Information

  const accountNumber = props.accountNumber;
  let BI_DETAILS = [];
  const [BIDetailsList, setBIDetailsList] = useState(BI_DETAILS);

  const fetchBusinessInformation = async () => {
    const res = await axios.get(
      'Agent/GetAgentSummaryByAccountNumber?AccountNumber=' + accountNumber
    );
    if (res.data.code === '00') {
      setBIDetailsList(res.data.data);
    }
  };
  useEffect(() => {
    fetchBusinessInformation();
  }, []);

  return (
    <div className="profile-card px-3">
      <div className="mx-auto w-100">
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Name of business</span>
              <br />
              <span className="profile-content-span-value">{BIDetailsList?.businessName}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Business reg number (optional)</span>
              <br />
              <span className="profile-content-span-value">
                {BIDetailsList?.registrationNumber}
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Date of commencement of business</span>
              <br />
              <span className="profile-content-span-value">
                {new Date(BIDetailsList?.commencementDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Business address</span>
              <br />
              <span className="profile-content-span-value">{BIDetailsList?.businessAddress}</span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Nature of business</span>
              <br />
              <span className="profile-content-span-value">{BIDetailsList?.businessNature}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInformation;
