import React, { useState } from 'react';
import styles from './EditableDropdown.module.css';

function EditableDropdown({ options, value, customValue, onChange, onCustomChange, placeholder = "Select an option" }) {
  const isOtherSelected = value === 'Other';

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
    if (selectedValue !== 'Other') {
      onCustomChange(''); // Clear custom input if not "Other"
    }
  };

  const handleCustomInputChange = (e) => {
    onCustomChange(e.target.value);
  };

  return (
    <div className={styles.editableDropdownContainer}>
      <select value={value} onChange={handleSelectChange}>
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>{option}</option>
        ))}
        <option value="Other">Other</option>
      </select>
      {isOtherSelected && (
        <input
          type="text"
          value={customValue}
          onChange={handleCustomInputChange}
          placeholder="Enter custom value"
          className={styles.customInput}
        />
      )}
    </div>
  );
}

export default EditableDropdown;
