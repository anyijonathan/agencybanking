import React from 'react';
import { Alert } from 'react-bootstrap';
import CanvasJSReact from '../../../../../utils/CanvasCharts/canvasjs.react';

const ApplicationStats = ({ authData, cChartOptions }) => {
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  return (
    <>
      <Alert className="agents-list-card-alert" variant="success">
        <span style={{ width: '300px' }} className="agents-list-span-heading">
          Application Stats.
        </span>
      </Alert>
      {(authData?.RoleName === 'SuperAdmin' || authData?.RoleName === 'Zonal Agent Cordinator') && (
        <Alert style={{ display: 'flex' }} className="agents-list-table-alert" variant="success">
          <CanvasJSChart style={{ width: '100%' }} options={cChartOptions} />
        </Alert>
      )}
    </>
  );
};

export default ApplicationStats;
