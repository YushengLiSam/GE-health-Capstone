import React from 'react';

function AlertDisplay({ alerts }) {
  return (
    <div className="alert-container">
      {alerts.map((alert, index) => (
        <div key={index} className="alert alert-danger">
          {alert}
        </div>
      ))}
    </div>
  );
}

export default AlertDisplay;
