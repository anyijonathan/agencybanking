import React from 'react';
import PropTypes from 'prop-types';

const TableHeader = ({ className, tableHeading }) => {
  return (
    <>
      <thead className={className}>
        <tr>
          {tableHeading?.map((heading, key) => {
            return <th key={key}>{heading}</th>;
          })}
        </tr>
      </thead>
    </>
  );
};

TableHeader.propTypes = {
  className: PropTypes.string,
  tableHeading: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TableHeader;
