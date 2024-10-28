import React from 'react';

function HeaderAndPatientInfo({ patient,patientName }) {
  return (
    <div className="header">
      <h2>{patientName || 'Loading...'}</h2>
      <p>Bed: {patient.bed}</p>
      <p>BP: {patient.bp} mmHg</p>
    </div>
  );
}

export default HeaderAndPatientInfo;
