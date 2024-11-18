import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './form.css';


function Forms({datapoints, tabName, saveFormData, formData}) {
    const [localFormData, setLocalFormData] = useState(formData);
    useEffect(() => {
        setLocalFormData(formData);
      }, [formData]);
      const handleChange = (e, field) => {
        setLocalFormData((prevData) => ({
          ...prevData,
          [field.name]: e.target.value
        }));
      };
      const handleSave = () => {
        saveFormData(tabName, localFormData);
      };
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData); // Replace with API call or state management logic
    };
  
    return (
      <Form onSubmit={handleSubmit}>
        {datapoints.map((field) => (
          <Form.Group className="mb-3 input-group" key={field.name} controlId={field.name}>
            <Form.Label>{field.name}</Form.Label>
            {field.inputType === "textbox" ? (
              <Form.Control
                type="text"
                name={field.name}
                onChange={(e) => handleChange(e, field)}
                value={localFormData[field.name] || ''}
                required={field.isMandatory}
                className="input-field"
              />
            ) : field.inputType === "dropdown" ? (
              <Form.Control
                as="select"
                name={field.name}
                onChange={(e) => handleChange(e, field)}
                value={localFormData[field.name] || ''}
                required={field.isMandatory}
                className="input-field"
              >
                <option value="">Select an option</option>
                {field.listItems.map((item, index) => (
                  <option key={index} value={item}>{item}</option>
                ))}
              </Form.Control>
            ) : null}
          </Form.Group>
        ))}
        <Button variant="primary" type="submit" className="form-button">
        Submit
      </Button>
      <Button variant="secondary" onClick={handleSave} className="form-button">
        Save
      </Button>
      </Form>
    );
  }
  
  export default Forms;