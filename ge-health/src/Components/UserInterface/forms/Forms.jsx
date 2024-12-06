import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import './form.css';


function Forms({datapoints, tabName, saveFormData, formData, highlightedDatapoint}) {
    const [localFormData, setLocalFormData] = useState(formData);
    useEffect(() => {
        setLocalFormData(formData);
      }, [formData]);
      const handleChange = (e, field) => {
        const { type, checked, value, name } = e.target;
      
        setLocalFormData((prevData) => ({
          ...prevData,
          [name]: type === 'checkbox' ? checked : value, // Handle checkbox and other input types
        }));
      };
      const handleSave = () => {
        saveFormData(tabName, localFormData);
      };
    
  
      return (
        <Form>
          {datapoints.map((field, index) => {
            const isHighlighted = highlightedDatapoint === field.id; // Check if this datapoint is highlighted
            return (
              <Form.Group
                className={`mb-3 input-group ${isHighlighted ? 'highlighted' : ''}`} // Apply 'highlighted' class
                key={field?.name || index}
                controlId={field?.name || `field-${index}`}
              >
                <Form.Label>{field?.name || `Field ${index + 1}`}</Form.Label>
                {field?.inputType === 'textbox' ? (
                  <Form.Control
                    type="text"
                    name={field?.name || `field-${index}`}
                    onChange={(e) => handleChange(e, field)}
                    value={localFormData[field?.name] || ''}
                    required={field?.isMandatory || false}
                    className="input-field"
                  />
                ) : field?.inputType === 'dropdown' ? (
                  <Form.Control
                    as="select"
                    name={field?.name || `field-${index}`}
                    onChange={(e) => handleChange(e, field)}
                    value={localFormData[field?.name] || ''}
                    required={field?.isMandatory || false}
                    className="input-field"
                  >
                    <option value="">Select an option</option>
                    {(field?.listItems || []).map((item, idx) => (
                      <option key={idx} value={item}>
                        {item}
                      </option>
                    ))}
                  </Form.Control>
                ) : field?.inputType === 'checkbox' ? (
                  <Form.Check
                    type="checkbox"
                    name={field?.name || `field-${index}`}
                    onChange={(e) => handleChange(e, field)}
                    checked={localFormData[field?.name] || false}
                    required={field?.isMandatory || false}
                    className="input-field"
                    label={field?.label || 'Check this'}
                  />
                ) : (
                  <span>Unsupported field type</span>
                )}
              </Form.Group>
            );
          })}
          <Button variant="secondary" onClick={handleSave} className="form-button">
            Save
          </Button>
        </Form>
      );
    }
    
    export default Forms;