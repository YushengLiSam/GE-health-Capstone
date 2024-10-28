import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderAndPatientInfo from './HeaderAndPatientInfo';
import StageSelector from './StageSelector';
import TabNavigation from './TabNavigation';
import AlertDisplay from './AlertDisplay';
import './style.css';

function UserInterface() {
  const [patientData, setPatientData] = useState({});
  const [alerts, setAlerts] = useState([]);

  const location = useLocation();
  const { patientName } = location.state || {};
  console.log(patientName)

  // Fetch patient data and monitor for alerts
  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    const response = await fetch('/api/patient-info'); // Example API endpoint
    const data = await response.json();
    setPatientData(data);

    if (data.bp > 140) {
      setAlerts([...alerts, 'High Blood Pressure']);
    }
  };

  return (
    <div className="container">
      <HeaderAndPatientInfo patient={patientData} />
      <StageSelector />
      <AlertDisplay alerts={alerts} />
      <TabNavigation />
    </div>
  );
}

export default UserInterface;
