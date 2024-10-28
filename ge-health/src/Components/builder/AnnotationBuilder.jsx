import React, { useState } from 'react';
import styles from './AnnotationBuilder.module.css'; // Import the CSS module

function AnnotationBuilder() {
  const [categories, setCategories] = useState([]);

  const categoryOptions = [
    'Pre-Admission', 'Early Labor', 'Active Labor', 'Transition', 'Pushing/Delivery', 'Expulsion of Placenta'
  ];

  const subcategoryOptions = [
    'Patient interventions', 'FHR', 'Contractions', 'Blood work', 'I/O Interventions', 'Medication Administration',
    'Pain Management', 'Membrane Status', 'Fetal Position', 'Epidural Placement', 'Vitals', 'Delivery time of infant',
    'Time of delivery of Placenta', 'Estimated Blood Loss (EBL)', 'Blood type', 'Reason for Admission'
  ];

  const datapointOptions = [
    { name: 'HR', type: 'Float' },
    { name: 'B/p', type: 'String' },
    { name: 'Respirations', type: 'String' },
    { name: 'SpO2', type: 'Float' },
    { name: 'Temp', type: 'Float' },
    { name: 'Pulse Ox', type: 'String' },
    { name: 'Dilation', type: 'Float' },
    { name: 'Monitor Mode', type: 'List', listItems: [
      'External US', 'Internal Scalp Electrode', 'Auscultation', 'Fetoscope', 'Doppler', 'Telemetry'
    ]}
  ];

  const dataTypeOptions = ['Float', 'String', 'List'];

  const addCategory = () => {
    setCategories([...categories, { selectedCategory: '', subcategories: [] }]);
  };

  const removeCategory = (categoryIndex) => {
    setCategories(categories.filter((_, index) => index !== categoryIndex));
  };

  const addSubcategory = (categoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories.push({ selectedSubcategory: '', datapoints: [] });
    setCategories(updatedCategories);
  };

  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories = updatedCategories[categoryIndex].subcategories.filter(
      (_, index) => index !== subcategoryIndex
    );
    setCategories(updatedCategories);
  };

  const addDatapoint = (categoryIndex, subcategoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints.push({
      selectedDatapoint: '', type: '', listItems: []
    });
    setCategories(updatedCategories);
  };

  const removeDatapoint = (categoryIndex, subcategoryIndex, datapointIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints = updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints.filter(
      (_, index) => index !== datapointIndex
    );
    setCategories(updatedCategories);
  };

  const handleDatapointChange = (categoryIndex, subcategoryIndex, datapointIndex, event) => {
    const updatedCategories = [...categories];
    const selectedDatapoint = datapointOptions.find(option => option.name === event.target.value);
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex] = {
      selectedDatapoint: selectedDatapoint.name,
      type: selectedDatapoint.type,
      listItems: selectedDatapoint.listItems || []
    };
    setCategories(updatedCategories);
  };

  const handleDataTypeChange = (categoryIndex, subcategoryIndex, datapointIndex, event) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].type = event.target.value;
    setCategories(updatedCategories);
  };

  return (
    <div className={styles['annotation-builder']}>
      <div className={styles.header}>
        <h1>Annotation Builder</h1>
        <div className={styles['export-import-buttons']}>
          <button className={styles['export-button']}>Export Data</button>
          <button className={styles['import-button']}>Import Data</button>
        </div>
      </div>
      <button onClick={addCategory} className={styles['add-category']}>Add Category</button>
      <div>
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className={styles.category}>
            <select
              value={category.selectedCategory}
              onChange={(e) => {
                const updatedCategories = [...categories];
                updatedCategories[categoryIndex].selectedCategory = e.target.value;
                setCategories(updatedCategories);
              }}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            <button onClick={() => addSubcategory(categoryIndex)}>Add Subcategory</button>
            <button onClick={() => removeCategory(categoryIndex)}>Remove Category</button>
            {category.subcategories.map((subcategory, subcategoryIndex) => (
              <div key={subcategoryIndex} className={styles.subcategory}>
                <select
                  value={subcategory.selectedSubcategory}
                  onChange={(e) => {
                    const updatedCategories = [...categories];
                    updatedCategories[categoryIndex].subcategories[subcategoryIndex].selectedSubcategory = e.target.value;
                    setCategories(updatedCategories);
                  }}
                >
                  <option value="">Select Subcategory</option>
                  {subcategoryOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
                <button onClick={() => addDatapoint(categoryIndex, subcategoryIndex)}>Add Datapoint</button>
                <button onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)}>Remove Subcategory</button>
                {subcategory.datapoints.map((datapoint, datapointIndex) => (
                  <div key={datapointIndex} className={styles.datapoint}>
                    <select
                      value={datapoint.selectedDatapoint}
                      onChange={(e) => handleDatapointChange(categoryIndex, subcategoryIndex, datapointIndex, e)}
                    >
                      <option value="">Select Datapoint</option>
                      {datapointOptions.map((option, index) => (
                        <option key={index} value={option.name}>{option.name}</option>
                      ))}
                    </select>
                    <select
                      value={datapoint.type}
                      onChange={(e) => handleDataTypeChange(categoryIndex, subcategoryIndex, datapointIndex, e)}
                      className={styles['data-type-dropdown']}
                    >
                      <option value="">Select Data Type</option>
                      {dataTypeOptions.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                    <button onClick={() => removeDatapoint(categoryIndex, subcategoryIndex, datapointIndex)}>Remove</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className={styles.save}>Save</button>
      <button className={styles.cancel}>Cancel</button>
    </div>
  );
}

export default AnnotationBuilder;
