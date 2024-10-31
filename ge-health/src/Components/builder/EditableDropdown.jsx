import React, { useState } from 'react';

function EditableDropdown({ options, value, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSelectChange = (e) => {
    if (e.target.value === 'Other') {
      setIsEditing(true);
    } else {
      setInputValue(e.target.value);
      onChange(e.target.value);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Enter custom value"
          autoFocus
        />
      ) : (
        <select value={inputValue} onChange={handleSelectChange}>
          <option value="" disabled>Select an option</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      )}
    </div>
  );
}

export default EditableDropdown;
