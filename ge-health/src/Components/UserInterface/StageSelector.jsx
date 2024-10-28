import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function StageSelector({ onStageSelect }) {
  const [selectedStage, setSelectedStage] = useState('Select Stage');

  const stages = [
    'Early/Latent Labor (Closed-4cm)',
    'Active Labor (5cm-8cm)',
    'Transition (8cm-10cm)',
    'Pushing/Delivery',
    'Expulsion of Placenta',
    'Pre-Admission',
    'Customized',
  ];

  const handleSelect = (eventKey) => {
    setSelectedStage(eventKey);
    if (onStageSelect) onStageSelect(eventKey);
  };

  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="primary" id="stage-dropdown">
        {selectedStage}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {stages.map((stage, index) => (
          <Dropdown.Item key={index} eventKey={stage} active={selectedStage === stage}>
            {stage}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default StageSelector;
