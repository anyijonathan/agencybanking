import { useEffect, useState } from 'react';
import axios from '../../../config/Axios';

const RegionLocation = (props) => {
  //Fetch User Region-Location Information

  const accountNumber = props.accountNumber;
  let RI_DETAILS = [];
  const [RIDetailsList, setRIDetailsList] = useState(RI_DETAILS);

  const fetchRegionLocationInformation = async () => {
    const res = await axios.get(
      'Agent/GetAgentSummaryByAccountNumber?AccountNumber=' + accountNumber
    );
    if (res.data.code === '00') {
      setRIDetailsList(res.data.data);
    }
  };
  useEffect(() => {
    fetchRegionLocationInformation();
  }, []);

  return (
    <div className="profile-card px-3">
      <div className="mx-auto w-100">
        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">State</span>
              <br />
              <span className="profile-content-span-value">{RIDetailsList?.state}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">LGA (Local government)</span>
              <br />
              <span className="profile-content-span-value">{RIDetailsList?.lga}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">City</span>
              <br />
              <span className="profile-content-span-value">{RIDetailsList?.city}</span>
            </div>
          </div>
          <div class="col">
            <div className="profile-content-tray">
              <span className="profile-content-span-text">Address</span>
              <br />
              <span className="profile-content-span-value">{RIDetailsList?.regionAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionLocation;
