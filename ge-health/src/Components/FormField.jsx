import React from 'react';
import styles from './PatientInformation.module.css';

const FormField = ({ label, id, type = 'text', value }) => {
  return (
    <div className={styles.formField}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <input
        type={type}
        id={id}
        className={styles.input}
        value={value}
        readOnly
        aria-label={label}
      />
    </div>
  );
};

export default FormField;