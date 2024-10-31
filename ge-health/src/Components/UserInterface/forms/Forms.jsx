import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './form.css';

const formFields = [
    {
      name: "Contraction frequency",
      datatype: "Numeric",
      inputType: "Textbox",
      isMandatory: true
    },
    {
      name: "Quality",
      datatype: "List",
      inputType: "Dropdown",
      isMandatory: false,
      listItems: ["Mild", "Moderate", "Strong"]
    }
  ];
  

function FHRForm() {
    const [formData, setFormData] = useState({});
  
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
        {formFields.map((field) => (
          <Form.Group className="mb-3 input-group" key={field.name} controlId={field.name}>
            <Form.Label>{field.name}</Form.Label>
            {field.inputType === "Textbox" ? (
              <Form.Control
                type="text"
                name={field.name}
                onChange={handleChange}
                required={field.isMandatory}
                className="input-field"
              />
            ) : field.inputType === "Dropdown" ? (
              <Form.Control
                as="select"
                name={field.name}
                onChange={handleChange}
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    );
  }
  
  export default FHRForm;