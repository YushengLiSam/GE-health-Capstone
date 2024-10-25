import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NewPage.module.css';

const NewPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('preLabor');
  const [formData, setFormData] = useState({
    fetalCount: '2',
    bp: '145/95 mmHg (High)',
    fhrFetusA: '',
    fhrFetusB: '',
    summary: '',
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update the summary based on selected tab and form data (mock summary here)
    setFormData((prevData) => ({
      ...prevData,
      summary: `Current Tab: ${tab} | FHR A: ${prevData.fhrFetusA}, FHR B: ${prevData.fhrFetusB}`,
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSave = () => {
    // API call placeholder
    console.log('Data saved:', formData);
    // After saving, navigate to the next page (adjust this path as needed)
    navigate('/nextPage');
  };

  const handleClearData = () => {
    setFormData({
      fetalCount: '2',
      bp: '145/95 mmHg (High)',
      fhrFetusA: '',
      fhrFetusB: '',
      summary: '',
    });
  };

  const handleCancel = () => {
    navigate('/'); // Navigate back to the patient info page
  };

  return (
    <div className={styles.newPage}>
      <div className={styles.tabs}>
        <button
          className={activeTab === 'preLabor' ? styles.activeTab : ''}
          onClick={() => handleTabChange('preLabor')}
        >
          Pre Labor
        </button>
        <button
          className={activeTab === 'fhr' ? styles.activeTab : ''}
          onClick={() => handleTabChange('fhr')}
        >
          FHR
        </button>
        <button
          className={activeTab === 'contraction' ? styles.activeTab : ''}
          onClick={() => handleTabChange('contraction')}
        >
          Contraction
        </button>
        <button
          className={activeTab === 'pain' ? styles.activeTab : ''}
          onClick={() => handleTabChange('pain')}
        >
          Pain
        </button>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formSection}>
          <label>Fetal Count</label>
          <input
            type="text"
            id="fetalCount"
            value={formData.fetalCount}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>

        <div className={styles.formSection}>
          <label>BP</label>
          <input
            type="text"
            id="bp"
            value={formData.bp}
            readOnly
            className={styles.readOnlyInput}
          />
        </div>

        {/* Placeholder for Monitor Mode */}
        <div className={styles.formSection}>
          <label>Monitor Mode (Placeholder)</label>
          <div className={styles.placeholder}>Monitor Mode Section</div>
        </div>

        {/* FHR Baseline Rate */}
        <div className={styles.formSection}>
          <label>FHR Baseline Rate - Fetus A</label>
          <input
            type="text"
            id="fhrFetusA"
            value={formData.fhrFetusA}
            onChange={handleInputChange}
            placeholder="Enter FHR for Fetus A"
          />
        </div>

        <div className={styles.formSection}>
          <label>FHR Baseline Rate - Fetus B</label>
          <input
            type="text"
            id="fhrFetusB"
            value={formData.fhrFetusB}
            onChange={handleInputChange}
            placeholder="Enter FHR for Fetus B"
          />
        </div>

        <div className={styles.scrollSection}>
          {/* This section will have a scrollbar if content overflows */}
          <div className={styles.scrollContent}>Additional Information (scrollable)</div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={handleClearData}>Clear all data</button>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>

      <div className={styles.summary}>
        <h3>Summary</h3>
        <p>{formData.summary}</p>
      </div>
    </div>
  );
};

export default NewPage;
