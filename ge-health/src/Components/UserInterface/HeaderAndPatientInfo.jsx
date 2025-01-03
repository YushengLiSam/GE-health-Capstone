import React from 'react';

function HeaderAndPatientInfo({ patient}) {
  return (
    <div className="header">
      <h2>{patient.name || 'Loading...'}</h2>
      <p>Bed: {patient.bed_number}</p>
      <p>Age: {patient.age}</p>
      <p>BP: {patient.bp} mmHg</p>
    </div>
  );
}

export default HeaderAndPatientInfo;
