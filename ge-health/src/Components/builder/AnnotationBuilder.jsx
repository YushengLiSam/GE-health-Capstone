import React, { useState, useRef } from 'react';
import styles from './AnnotationBuilder.module.css'; // Import the CSS module
import EditableDropdown from './EditableDropdown';

function AnnotationBuilder() {
  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null); // Reference for the hidden file input

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
    {
      name: 'Monitor Mode', type: 'List', listItems: [
        'External US', 'Internal Scalp Electrode', 'Auscultation', 'Fetoscope', 'Doppler', 'Telemetry'
      ]
    }
  ];

  const dataTypeOptions = ['Float', 'String', 'List'];


  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.categories) {
            const formattedCategories = importedData.categories.map(category => {
              const selectedCategory = categoryOptions.includes(category.name.trim()) ? category.name.trim() : 'Other';
              const customCategory = selectedCategory === 'Other' ? category.name.trim() : '';

              return {
                selectedCategory,
                customCategory,
                subcategories: category.subcategories.map(subcategory => {
                  const selectedSubcategory = subcategoryOptions.includes(subcategory.name.trim()) ? subcategory.name.trim() : 'Other';
                  const customSubcategory = selectedSubcategory === 'Other' ? subcategory.name.trim() : '';

                  return {
                    selectedSubcategory,
                    customSubcategory,
                    datapoints: subcategory.datapoints.map(datapoint => {
                      const selectedDatapoint = datapointOptions.some(dp => dp.name === datapoint.name.trim()) ? datapoint.name.trim() : 'Other';
                      const customDatapoint = selectedDatapoint === 'Other' ? datapoint.name.trim() : '';
                      const dataType = datapoint.datatype;
                      const isMandatory = datapoint.isMandatory || false;
                      const listItems = datapoint.listItems || [];

                      return {
                        selectedDatapoint,
                        customDatapoint,
                        type: dataType,
                        isMandatory,
                        listItems,
                      };
                    })
                  };
                })
              };
            });

            setCategories(formattedCategories);
          } else {
            alert("Invalid format: Missing 'categories' field");
          }
        } catch (error) {
          alert("Error parsing JSON file");
        }

        event.target.value = null;
      };
      reader.readAsText(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  const exportData = () => {
    // Format the current state data into the JSON structure
    const dataToExport = {
      categories: categories.map(category => ({
        name: category.selectedCategory === 'Other' ? category.customCategory : category.selectedCategory,
        subcategories: category.subcategories.map(subcategory => ({
          name: subcategory.selectedSubcategory === 'Other' ? subcategory.customSubcategory : subcategory.selectedSubcategory,
          datapoints: subcategory.datapoints.map(datapoint => ({
            name: datapoint.selectedDatapoint === 'Other' ? datapoint.customDatapoint : datapoint.selectedDatapoint,
            datatype: datapoint.type,
            inputType: datapoint.inputType || 'Textbox', // Default to 'Textbox' if no inputType is specified
            isMandatory: datapoint.isMandatory,
            listItems: datapoint.listItems || []
          }))
        }))
      }))
    };

    // Convert the data to a JSON string
    const json = JSON.stringify(dataToExport, null, 2); // Pretty-print with 2-space indentation

    // Create a blob from the JSON and a download link
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create an anchor element to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'annotation_data.json'; // Default file name
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  };

  const handleCustomCategoryChange = (categoryIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].customCategory = value;
    setCategories(updatedCategories);
  };

  const handleCustomSubcategoryChange = (categoryIndex, subcategoryIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].customSubcategory = value;
    setCategories(updatedCategories);
  };

  const handleCustomDatapointChange = (categoryIndex, subcategoryIndex, datapointIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].customDatapoint = value;
    setCategories(updatedCategories);
  };

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

  const handleCategoryChange = (categoryIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].selectedCategory = value;
    setCategories(updatedCategories);
  };

  const handleSubcategoryChange = (categoryIndex, subcategoryIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].selectedSubcategory = value;
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

  const handleDatapointChange = (categoryIndex, subcategoryIndex, datapointIndex, value) => {
    const updatedCategories = [...categories];
    const selectedDatapoint = datapointOptions.find(option => option.name === value);

    if (selectedDatapoint) {
      updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex] = {
        selectedDatapoint: selectedDatapoint.name,
        type: selectedDatapoint.type,
        listItems: selectedDatapoint.listItems || []
      };
    } else {
      updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex] = {
        selectedDatapoint: value, // if value is unmatched, just set the raw input value
        type: '',
        listItems: []
      };
    }

    setCategories(updatedCategories);
  };

  const handleDataTypeChange = (categoryIndex, subcategoryIndex, datapointIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].type = value || '';
    setCategories(updatedCategories);
  };



  const handleMandatoryChange = (categoryIndex, subcategoryIndex, datapointIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].isMandatory = !updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].isMandatory;
    setCategories(updatedCategories);
  };

  const handleSave = async () => {
    const formattedData = categories.map(category => ({
      name: category.selectedCategory === 'Other' ? category.customCategory : category.selectedCategory,
      subcategories: category.subcategories.map(subcategory => ({
        name: subcategory.selectedSubcategory === 'Other' ? subcategory.customSubcategory : subcategory.selectedSubcategory,
        datapoints: subcategory.datapoints.map(datapoint => ({
          name: datapoint.selectedDatapoint === 'Other' ? datapoint.customDatapoint : datapoint.selectedDatapoint,
          datatype: datapoint.type,
          inputType: datapoint.inputType || 'Textbox',
          isMandatory: datapoint.isMandatory || false,
          listItems: datapoint.listItems || []
        }))
      }))
    }));

    try {
      console.log(formattedData);
      const response = await fetch('http://127.0.0.1:5000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ categories: formattedData })
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        console.log("status code is:", response.status);
        alert("Failed to save data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

  // Handler for the Cancel button
  const handleCancel = () => {
    // Reset categories to an empty array
    setCategories([]);
  };


  return (
    <div className={styles['annotation-builder']}>
      <div className={styles.header}>
        <h1>Annotation Builder</h1>
        <div className={styles['export-import-buttons']}>
          <button className={styles['export-button']} onClick={exportData}>Export Data</button>
          <button className={styles['import-button']} onClick={triggerFileInput}>Import Data</button>
          <input
            type="file"
            accept="application/json"
            onChange={handleImportData}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <button onClick={addCategory} className={styles['add-category']}>Add Category</button>
      <div>
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className={styles.category}>
            <div className={styles.categoryRow}>
              <EditableDropdown
                options={categoryOptions}
                value={category.selectedCategory}
                customValue={category.customCategory}
                onChange={(value) => handleCategoryChange(categoryIndex, value)}
                onCustomChange={(customValue) => handleCustomCategoryChange(categoryIndex, customValue)}
                placeholder="Select a category"
              />

              <button onClick={() => addSubcategory(categoryIndex)} className={styles.subcategoryButton}>Add Subcategory</button>
              <button onClick={() => removeCategory(categoryIndex)} className={styles.categoryButton}>Remove Category</button>
            </div>

            {category.subcategories.map((subcategory, subcategoryIndex) => (
              <div key={subcategoryIndex} className={styles.subcategory}>
                <div className={styles.subcategoryRow}>
                  <EditableDropdown
                    options={subcategoryOptions}
                    value={subcategory.selectedSubcategory}
                    customValue={subcategory.customSubcategory}
                    onChange={(value) => handleSubcategoryChange(categoryIndex, subcategoryIndex, value)}
                    onCustomChange={(customValue) => handleCustomSubcategoryChange(categoryIndex, subcategoryIndex, customValue)}
                    placeholder="Select a subcategory"
                  />
                  <button onClick={() => addDatapoint(categoryIndex, subcategoryIndex)} className={styles.datapointButton}>Add Datapoint</button>
                  <button onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)} className={styles.subcategoryButton}>Remove Subcategory</button>
                </div>

                {subcategory.datapoints.map((datapoint, datapointIndex) => (
                  <div key={datapointIndex} className={styles.datapoint}>


                    <div className={styles['datapoint-row']}>
                      <EditableDropdown
                        options={datapointOptions.map(dp => dp.name)}
                        value={datapoint.selectedDatapoint}
                        customValue={datapoint.customDatapoint}
                        onChange={(value) => handleDatapointChange(categoryIndex, subcategoryIndex, datapointIndex, value)}
                        onCustomChange={(customValue) => handleCustomDatapointChange(categoryIndex, subcategoryIndex, datapointIndex, customValue)}
                        placeholder="Select a datapoint"
                      />

                      <EditableDropdown
                        options={dataTypeOptions}
                        value={datapoint.type}
                        onChange={(value) => handleDataTypeChange(categoryIndex, subcategoryIndex, datapointIndex, value)}
                        className={styles['data-type-dropdown']}
                      />
                      <label className={styles.mandatoryLabel}>
                        <input
                          type="checkbox"
                          checked={datapoint.isMandatory}
                          onChange={() => handleMandatoryChange(categoryIndex, subcategoryIndex, datapointIndex)}
                        />
                        Mandatory
                      </label>
                    </div>

                    <button onClick={() => removeDatapoint(categoryIndex, subcategoryIndex, datapointIndex)}>Remove</button>
                  </div>

                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSave} className={styles.save}>Save</button>
      <button onClick={handleCancel} className={styles.cancel}>Cancel</button>
    </div>
  );
}

export default AnnotationBuilder;

