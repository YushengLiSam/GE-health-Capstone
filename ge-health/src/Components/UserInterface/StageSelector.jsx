import React, { useState, useEffect } from 'react';
import './StageSelector.css'; // Custom CSS for styling

function StageSelector({ onStageSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState('Select Stage');

  const [stages,setStages] = useState([]);

  const user_id = sessionStorage.getItem('userID');

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5002/api/categories?user_id=${user_id}`);
      const data = await response.json();
      setStages(data.categories);
      console.log(data.categories);
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  }

    useEffect(() => {
      fetchCategories()
     }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (stage) => {
    setSelectedStage(stage.name); 
    setIsOpen(false);
    if (onStageSelect) onStageSelect(stage.id);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selectedStage} <span className="caret">&#9660;</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {stages.map((stage) => (
            <li
              key={stage.id}
              className={`dropdown-item ${selectedStage === stage.name ? 'active' : ''}`}
              onClick={() => handleSelect(stage)}
            >
              {stage.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StageSelector;
