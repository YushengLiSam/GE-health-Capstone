import React, { useState, useRef } from 'react';
import styles from './AnnotationBuilder.module.css'; // Import the CSS module
import makeAnimated from 'react-select/animated';
import Creatable from 'react-select/creatable';

const animatedComponents = makeAnimated();

function AnnotationBuilder() {
  const [categories, setCategories] = useState([]);
  const [foldedCategories, setFoldedCategories] = useState({});
  const [foldedSubcategories, setFoldedSubcategories] = useState({});
  const fileInputRef = useRef(null); // Reference for the hidden file input

  const categoryOptions = [
    'Pre-Admission', 'Early Labor', 'Active Labor', 'Transition', 'Pushing/Delivery', 'Expulsion of Placenta'
  ].map(option => ({ value: option, label: option }));

  const subcategoryOptions = [
    'Patient interventions', 'FHR', 'Contractions', 'Blood work', 'I/O Interventions', 'Medication Administration',
    'Pain Management', 'Membrane Status', 'Fetal Position', 'Epidural Placement', 'Vitals'
  ].map(option => ({ value: option, label: option }));

  const datapointOptions = [
    { value: 'HR', label: 'HR', type: 'Float' },
    { value: 'B/p', label: 'B/p', type: 'String' },
    { value: 'Respirations', label: 'Respirations', type: 'String' },
    { value: 'SpO2', label: 'SpO2', type: 'Float' },
    { value: 'Temp', label: 'Temp', type: 'Float' },
    { value: 'Pulse Ox', label: 'Pulse Ox', type: 'String' }
  ];

  const dataTypeOptions = ['Float', 'String', 'Numeric', 'Boolean', 'List'].map(option => ({ value: option, label: option }));
  const inputTypeOptions = ['Textbox', 'Dropdown', 'Checkbox'].map(option => ({ value: option, label: option }));


  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (importedData.categories) {
            const formattedCategories = importedData.categories.map(category => ({
              selectedCategory: category.name,
              customCategory: '',
              subcategories: category.subcategories.map(subcategory => ({
                selectedSubcategory: subcategory.name,
                customSubcategory: '',
                datapoints: subcategory.datapoints.map(datapoint => ({
                  selectedDatapoint: datapoint.name,
                  type: datapoint.datatype,
                  inputType: datapoint.inputType,
                  isMandatory: datapoint.isMandatory || false,
                  listItems: datapoint.listItems || []
                }))
              }))
            }));
            setCategories(formattedCategories);
          } else {
            alert("Invalid format: Missing 'categories' field");
          }
        } catch (error) {
          alert("Error parsing JSON file");
        }
        // Reset file input to allow re-import of the same file
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
    const dataToExport = {
      categories: categories.map(category => ({
        name: category.selectedCategory,
        subcategories: category.subcategories.map(subcategory => ({
          name: subcategory.selectedSubcategory,
          datapoints: subcategory.datapoints.map(datapoint => ({
            name: datapoint.selectedDatapoint,
            datatype: datapoint.type,
            inputType: datapoint.inputType,
            isMandatory: datapoint.isMandatory,
            listItems: datapoint.listItems
          }))
        }))
      }))
    };

    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'annotation_data.json';
    link.click();
    URL.revokeObjectURL(url);
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
    updatedCategories[categoryIndex].selectedCategory = value?.value || '';
    setCategories(updatedCategories);
  };

  const handleSubcategoryChange = (categoryIndex, subcategoryIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].selectedSubcategory = value?.value || '';
    setCategories(updatedCategories);
  };

  const addDatapoint = (categoryIndex, subcategoryIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints.push({
      selectedDatapoint: '',
      type: '',
      inputType: 'Textbox',
      listItems: [],
      isMandatory: false
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
    const selectedDatapoint = datapointOptions.find(option => option.value === value?.value);
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex] = {
      selectedDatapoint: value?.value || '',
      type: selectedDatapoint?.type || ''
    };
    setCategories(updatedCategories);
  };

  const handleDataTypeChange = (categoryIndex, subcategoryIndex, datapointIndex, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].type = value?.value || '';
    setCategories(updatedCategories);
  };

  const handleMandatoryChange = (categoryIndex, subcategoryIndex, datapointIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].isMandatory = !updatedCategories[categoryIndex].subcategories[subcategoryIndex].datapoints[datapointIndex].isMandatory;
    setCategories(updatedCategories);
  };

  const handleInputTypeChange = (categoryIndex, subcategoryIndex, datapointIndex, newValue) => {
    const updatedCategories = [...categories];
    const datapoint = updatedCategories[categoryIndex]?.subcategories[subcategoryIndex]?.datapoints[datapointIndex];

    if (!datapoint) return;

    datapoint.inputType = newValue?.value || '';
    if (datapoint.inputType !== 'Dropdown') {
      datapoint.listItems = []; // Clear listItems if not Dropdown
    }

    setCategories(updatedCategories);
  };


  const handleListItemsChange = (categoryIndex, subcategoryIndex, datapointIndex, newValue) => {
    const updatedCategories = [...categories];
    const datapoint = updatedCategories[categoryIndex]?.subcategories[subcategoryIndex]?.datapoints[datapointIndex];

    if (!datapoint) return;

    datapoint.listItems = newValue ? newValue.map(option => option.value) : [];
    setCategories(updatedCategories);
  };

  const toggleCategoryFold = (index) => {
    setFoldedCategories(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSubcategoryFold = (categoryIndex, subcategoryIndex) => {
    setFoldedSubcategories(prev => ({
      ...prev,
      [`${categoryIndex}-${subcategoryIndex}`]: !prev[`${categoryIndex}-${subcategoryIndex}`]
    }));
  };

  const handleSave = async () => {
    // Format the data to match the backend requirements
    const formattedData = categories.map((category) => ({
      name: category.selectedCategory || category.customCategory,
      subcategories: category.subcategories.map((subcategory) => ({
        name: subcategory.selectedSubcategory || subcategory.customSubcategory,
        datapoints: subcategory.datapoints.map((datapoint) => ({
          name: datapoint.selectedDatapoint || datapoint.customDatapoint,
          datatype: datapoint.type,
          inputType: datapoint.inputType || 'Textbox', // Default to 'Textbox' if undefined
          isMandatory: datapoint.isMandatory || false,
          listItems: datapoint.inputType === 'Dropdown' ? datapoint.listItems || [] : undefined, // Include listItems only for Dropdown
        })),
      })),
    }));

    try {
      console.log('Saving data:', formattedData);

      const response = await fetch('http://127.0.0.1:5002/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: formattedData }),
      });

      if (response.ok) {
        alert('Data saved successfully!');
      } else {
        console.error(`Failed to save data. Status: ${response.status}`);
        alert('Failed to save data. Please try again.');
      }
    } catch (error) {
      console.error('Error while saving data:', error);
      alert('An error occurred while saving data. Please check your network or server.');
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
              {/* Up/Down Caret for Category */}
              <div
                className={`${styles.caretButton} ${foldedCategories[categoryIndex] ? styles.folded : ''}`}
                onClick={() => toggleCategoryFold(categoryIndex)}
              >
                {foldedCategories[categoryIndex] ? '▼' : '▲'}
              </div>
              <Creatable
                options={categoryOptions}
                value={category.selectedCategory ? { value: category.selectedCategory, label: category.selectedCategory } : null}
                onChange={(value) => handleCategoryChange(categoryIndex, value)}
                placeholder="Select or create a category"
              />
              <button onClick={() => addSubcategory(categoryIndex)} className={styles.subcategoryButton}>Add Subcategory</button>
              <button
                className={styles.removeButton}
                onClick={() => removeCategory(categoryIndex)}
              >
                <span className={styles.removeIcon}>✖</span>
                REMOVE
              </button>
            </div>

            {!foldedCategories[categoryIndex] && category.subcategories.map((subcategory, subcategoryIndex) => (
              <div key={subcategoryIndex} className={styles.subcategory}>
                <div className={styles.subcategoryRow}>
                  {/* Up/Down Caret for Subcategory */}
                  <div
                    className={`${styles.caretButton} ${foldedSubcategories[`${categoryIndex}-${subcategoryIndex}`] ? styles.folded : ''}`}
                    onClick={() => toggleSubcategoryFold(categoryIndex, subcategoryIndex)}
                  >
                    {foldedSubcategories[`${categoryIndex}-${subcategoryIndex}`] ? '▼' : '▲'}
                  </div>
                  <Creatable
                    options={subcategoryOptions}
                    value={subcategory.selectedSubcategory ? { value: subcategory.selectedSubcategory, label: subcategory.selectedSubcategory } : null}
                    onChange={(value) => handleSubcategoryChange(categoryIndex, subcategoryIndex, value)}
                    placeholder="Select or create a subcategory"
                  />
                  <button onClick={() => addDatapoint(categoryIndex, subcategoryIndex)}>Add Datapoint</button>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)}
                  >
                    <span className={styles.removeIcon}>✖</span>
                    REMOVE
                  </button>
                </div>

                {!foldedSubcategories[`${categoryIndex}-${subcategoryIndex}`] && subcategory.datapoints.map((datapoint, datapointIndex) => (
                  <div key={datapointIndex} className={styles.datapoint}>
                    <Creatable
                      options={datapointOptions}
                      value={datapoint.selectedDatapoint ? { value: datapoint.selectedDatapoint, label: datapoint.selectedDatapoint } : null}
                      onChange={(value) => handleDatapointChange(categoryIndex, subcategoryIndex, datapointIndex, value)}
                      placeholder="Select or create a datapoint"
                    />
                    <Creatable
                      options={dataTypeOptions}
                      value={datapoint.type ? { value: datapoint.type, label: datapoint.type } : null}
                      onChange={(value) => handleDataTypeChange(categoryIndex, subcategoryIndex, datapointIndex, value)}
                      placeholder="Select a data type"
                    />
                    <Creatable
                      options={inputTypeOptions}
                      value={datapoint.inputType ? { value: datapoint.inputType, label: datapoint.inputType } : null}
                      onChange={(value) => handleInputTypeChange(categoryIndex, subcategoryIndex, datapointIndex, value)}
                      placeholder="Select input type"
                    />
                    {datapoint.inputType === 'Dropdown' && (
                      <Creatable
                        components={animatedComponents}
                        isMulti
                        options={datapoint.listItems?.map(item => ({ value: item, label: item }))}
                        value={datapoint.listItems?.map(item => ({ value: item, label: item }))}
                        onChange={(value) =>
                          handleListItemsChange(categoryIndex, subcategoryIndex, datapointIndex, value)
                        }
                        placeholder="Add dropdown items"
                      />
                    )}
                    <label className={styles.mandatoryLabel}>
                      <input
                        type="checkbox"
                        checked={datapoint.isMandatory}
                        onChange={() => handleMandatoryChange(categoryIndex, subcategoryIndex, datapointIndex)}
                      />
                      Mandatory
                    </label>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeDatapoint(categoryIndex, subcategoryIndex, datapointIndex)}
                    >
                      <span className={styles.removeIcon}>✖</span>
                      REMOVE
                    </button>
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

