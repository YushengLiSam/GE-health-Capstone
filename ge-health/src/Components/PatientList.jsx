import React, { useState, useEffect } from 'react';
import { Navigate ,useNavigate} from 'react-router-dom';
import './cssStyle.css';

const PatientList = () => {
  const [patients, setPatients] = useState([
    {
      "id": "1",
      "name": "Alice Johnson",
      "bedNo": "101A",
      "dob": "1985-05-14",
      "age": 38,
      "fetalCount": 1
    },
    {
      "id": "2",
      "name": "Bob Smith",
      "bedNo": "102B",
      "dob": "1992-11-20",
      "age": 31,
      "fetalCount": 2
    },
    {
      "id": "3",
      "name": "Carol Martinez",
      "bedNo": "103C",
      "dob": "1988-03-05",
      "age": 36,
      "fetalCount": 1
    },
    {
      "id": "4",
      "name": "David Lee",
      "bedNo": "104D",
      "dob": "1979-12-17",
      "age": 44,
      "fetalCount": 1
    },
    {
      "id": "5",
      "name": "Eva Kim",
      "bedNo": "105E",
      "dob": "1995-07-30",
      "age": 29,
      "fetalCount": 3
    },
    {
      "id": "6",
      "name": "Frank Brown",
      "bedNo": "106F",
      "dob": "1982-10-02",
      "age": 42,
      "fetalCount": 1
    },
    {
      "id": "7",
      "name": "Grace Wilson",
      "bedNo": "107G",
      "dob": "2001-06-22",
      "age": 23,
      "fetalCount": 1
    },
    {
      "id": "8",
      "name": "Henry Clark",
      "bedNo": "108H",
      "dob": "1990-09-18",
      "age": 34,
      "fetalCount": 2
    },
    {
      "id": "9",
      "name": "Isabella Lopez",
      "bedNo": "109I",
      "dob": "1987-02-11",
      "age": 37,
      "fetalCount": 1
    },
    {
      "id": "10",
      "name": "Jack Harris",
      "bedNo": "110J",
      "dob": "1980-08-09",
      "age": 44,
      "fetalCount": 2
    }
  ]
  );

  const navigate = useNavigate();
 

  useEffect(() => {
    fetch('/api/patients') // Replace with your API endpoint
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(error => console.error('Error fetching patients:', error));
  }, []);

  const navigateToDetail = (id) => {
    navigate(`/patient/${id}`);
  };
  const navigateToAddPatient = () => {
    navigate('/add-patient');
  };

  return (
    <div className="patient-grid">
        <button className="add-patient-button" onClick={navigateToAddPatient}>Add New Patient</button>
      {patients.map(patient => (
        <div key={patient.id} className="patient-card" onClick={() => navigateToDetail(patient.id)}>
          <h3>{patient.name}</h3>
          <p><strong>Bed No:</strong> {patient.bedNo}</p>
          <p><strong>DOB:</strong> {patient.dob}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Fetal Count:</strong> {patient.fetalCount}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientList;
