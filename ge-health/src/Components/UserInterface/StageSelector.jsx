import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

function StageSelector({ onStageSelect }) {
  const [selectedStage, setSelectedStage] = useState('Select Stage'); // Default state

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
    setSelectedStage(eventKey); // Update the selected stage in state
    if (onStageSelect) onStageSelect(eventKey); // Pass the selected stage to parent if provided
  };

  return (
    <Dropdown onSelect={handleSelect} className="stage-selector">
      <Dropdown.Toggle 
        variant="secondary" 
        id="stage-dropdown" 
        className="stage-dropdown-toggle"
      >
        {selectedStage}
      </Dropdown.Toggle>

      <Dropdown.Menu className="stage-dropdown-menu">
        {stages.map((stage, index) => (
          <Dropdown.Item 
            key={index} 
            eventKey={stage} 
            className="stage-dropdown-item"
            active={selectedStage === stage} // Highlight active item
          >
            {stage}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
    
  );
  
}

export default StageSelector;
