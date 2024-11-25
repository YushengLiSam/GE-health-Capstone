import React, { useState, useEffect } from 'react';
import styles from './PatientInformation.module.css';
import { useNavigate } from 'react-router-dom';


const PatientInformation = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    bed_number: '',
    dob: '',
    fetal_count: "1", // default value for fetal count
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isNameValid = patientData.name.trim() !== '';
    const isAgeValid = patientData.age > 0;
    const isDOBValid = patientData.dob !== '';
    
    // Set form validity based on checks
    setIsFormValid(isNameValid && isAgeValid && isDOBValid);
  }, [patientData]);

  // Handle input change for form fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setPatientData({
      ...patientData,
      [id]: value,
    });
  };

  // TODO api implement
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(patientData);
    
    // API call to store the patient info
    try {
      const response = await fetch('http://127.0.0.1:5002/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      if (response.ok) {
        const data = await response.json();

        // Access the patient_id
        console.log('Patient ID:', data.patient_id);
  
        // Navigate to the new page with the patient ID
        navigate(`/admin/patient/${data.patient_id}`, {
          state: { patient: patientData },
        });
      } else {
        console.error('Error storing patient information');
      }
    } catch (error) {
      console.error('API error:', error);
    }
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
            <label htmlFor="name">Bed Number</label>
            <input
              type="text"
              id="bed_number"
              value={patientData.bed_number}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter Bed Number"
              aria-label="bed"
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="fetalCount">Fetal Count</label>
            <input
              type="number"
              id="fetal_count"
              value={patientData.fetal_count}
              onChange={handleChange}
              className={styles.inputField}
              aria-label="Fetal Count"
            />
          </div>

          
          {/* Submit Button */}
          <button type="submit" disabled={!isFormValid}>
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default PatientInformation;
