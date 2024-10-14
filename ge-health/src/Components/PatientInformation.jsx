import React, { useState } from 'react';
import styles from './PatientInformation.module.css';
import FormField from './FormField';

const PatientInformation = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    dob: '',
    fetalCount: '2', // default value for fetal count
  });

  // Handle input change for form fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setPatientData({
      ...patientData,
      [id]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (e.g., sending data to backend or validation)
    console.log('Submitted Patient Data:', patientData);
  };

  return (
    <main className={styles.patientInfo}>
      <section className={styles.container}>
        <h1 className={styles.title}>Patient Information</h1>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          {/* Map through patient data fields */}
          <div className={styles.formField}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={patientData.name}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter name"
              aria-label="Name"
            />
          </div>
          
          <div className={styles.formField}>
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              value={patientData.age}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter age"
              aria-label="Age"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="dob">DOB</label>
            <input
              type="date"
              id="dob"
              value={patientData.dob}
              onChange={handleChange}
              className={styles.inputField}
              aria-label="Date of Birth"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="dob">Fetal Count</label>
            <input
              type="number"
              id="fetalCount"
              value={patientData.fetalCount}
              onChange={handleChange}
              className={styles.inputField}
              aria-label="Fetal Count"
            />
          </div>

          
          {/* Submit Button */}
          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default PatientInformation;
