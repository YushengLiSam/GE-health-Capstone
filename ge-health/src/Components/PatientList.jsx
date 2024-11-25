import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import './cssStyle.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  const navigate = useNavigate();
 

  useEffect(() => {
    fetch('http://127.0.0.1:5002/api/patients') // Replace with your API endpoint
      .then(response => response.json())
      .then((data) => {
        setPatients(data);
        // console.log(data)
      })
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  const navigateToDetail = (patient) => {
    navigate(`/admin/patient/${patient.id}`, { state: { patient } });
};
  const navigateToAddPatient = () => {
    navigate('/admin/add-patient');
  };

  return (
    <div className="patient-grid">
        <button className="add-patient-button" onClick={navigateToAddPatient}>Add New Patient</button>
      {patients.map(patient => (
        <div key={patient.id} className="patient-card" onClick={() => navigateToDetail(patient)}>
          <h3>{patient.name}</h3>
          <p><strong>Bed No:</strong> {patient.bed_number}</p>
          <p><strong>DOB:</strong> {patient.dob}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Fetal Count:</strong> {patient.fetal_count}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
