import React from 'react';
import { Alert, Table } from 'react-bootstrap';
import TableHeader from '../../TableHeader/TableHeader';

const FrontDeskRep = ({ FDODetailsList }) => {
  const topFrontDeskOfficerTableList = FDODetailsList.map((info, key) => {
    return (
      <tr key={key}>
        <td>{info.firstName}</td>
        <td>{info.lastName}</td>
        <td>{info.email}</td>
        <td>{info.state}</td>
      </tr>
    );
  });
  return (
    <>
      <div className="dashboard-action-fragment"></div>
      <div className="mx-auto w-100 px-3">
        <Alert className="agents-list-card-alert" variant="success">
          <span style={{ width: '600px' }} className="agents-list-span-heading">
            Front Desk Representative
          </span>
        </Alert>
        <Alert className="agents-list-table-alert" variant="success">
          <Table style={{ width: '100%' }} hover className="agents-table-list">
            <TableHeader
              className="agents-list-table-header"
              tableHeading={['First Name', 'Last Name', 'Email Address', 'Region']}
            />

            <tbody>{topFrontDeskOfficerTableList}</tbody>
          </Table>
        </Alert>
      </div>
    </>
  );
};

export default FrontDeskRep;
