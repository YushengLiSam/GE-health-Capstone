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
  const [selectedStage, setSelectedStage] = useState('Select Stage');

  const location = useLocation();
  const { patientName } = location.state || {};
  

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

  const handleStageSelect = (stage) => {
    setSelectedStage(stage); // Update selected stage
  };
  
  return (
    <div className="container">
      <HeaderAndPatientInfo patient={patientData} patientName = {patientName}/>
      <StageSelector onStageSelect={handleStageSelect}/>
      <AlertDisplay alerts={alerts} />
      <TabNavigation selectedStage={selectedStage}/>
    </div>
  );
}

export default UserInterface;
