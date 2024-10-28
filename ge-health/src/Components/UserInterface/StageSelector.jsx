import React, { useState } from 'react';
import './StageSelector.css'; // Custom CSS for styling

function StageSelector({ onStageSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('Select Stage');

  const stages = [
    'Early/Latent Labor',
    'Active Labor',
    'Transition',
    'Pushing/Delivery',
    'Expulsion of Placenta',
    'Pre-Admission',
    'Customized',
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (stage) => {
    setSelectedStage(stage);
    setIsOpen(false);
    if (onStageSelect) onStageSelect(stage);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedStage} <span className="caret">&#9660;</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {stages.map((stage, index) => (
            <li
              key={index}
              className={`dropdown-item ${selectedStage === stage ? 'active' : ''}`}
              onClick={() => handleSelect(stage)}
            >
              {stage}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StageSelector;
