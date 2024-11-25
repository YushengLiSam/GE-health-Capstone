import React from 'react';
import {Button } from 'react-bootstrap';

function Summary({ data, formData, handleSubmit }) {
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
        <Button variant="primary" type="submit" className="form-button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    );
  }
export default Summary;
