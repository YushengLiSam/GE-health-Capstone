import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

function PatientCareForm() {
  const [formData, setFormData] = useState({
    hourlyRounding: '',
    ivBloodWork: '',
    ivBagNumber: '',
    ivChange: '',
    ioInterventions: '',
    urineColor: '',
    positionChange: '',
    hygiene: '',
    amnioinfusion: '',
    procedures: '',
    fundalHeight: '',
    consults: '',
    oxygenMethod: '',
    oxygenAmount: '',
    bedsideGlucose: '',
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with API call or state management logic
  };

  return (
    <Form onSubmit={handleSubmit}>
      {Object.keys(formData).map((key) => (
        <Form.Group className="mb-3" key={key} controlId={key}>
          <Form.Label>{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
          <Form.Control
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
          />
        </Form.Group>
      ))}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default PatientCareForm;
