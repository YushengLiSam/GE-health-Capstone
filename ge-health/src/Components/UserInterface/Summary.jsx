import React from 'react';

function Summary({ data, formData }) {
    return (
      <div className="summary">
        <h3>Summary</h3>
        <ul>
          {data.datapoints.map((point, index) => (
            <li key={index}>
              <strong>{point.name}:</strong> {formData[point.name] || "Not entered"}
            </li>
          ))}
        </ul>
      </div>
    );
  }
export default Summary;
