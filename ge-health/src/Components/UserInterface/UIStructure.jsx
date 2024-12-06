import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HeaderAndPatientInfo from './HeaderAndPatientInfo';
import StageSelector from './StageSelector';
import TabNavigation from './TabNavigation';
import AlertDisplay from './AlertDisplay';
import { Line } from 'react-chartjs-2';
import PatientMonitoringCarousel from './PatientMonitoringCarousel';
import './carousel.css';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './style.css';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function UserInterface() {
  // const [patientData, setPatientData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  const { patient_id } = useParams();
  const [error, setError] = useState(null);
  //const [chartData, setChartData] = useState([]);
  const location = useLocation();
  const { patient } = location.state || {};
  const fetal_count = patient?.fetal_count || 1; // Replace with dynamic data when available
  console.log("fetal count is: ", fetal_count);

  // Fetch patient data and monitor for alerts
  useEffect(() => {
    fetchPatientData();
    //fetchChartData();
  }, [patient_id]);

  console.log(patient_id)
  const fetchPatientData = async () => {
    // cause backend dump
    // try {
    //   // Perform GET request to the API endpoint
    //   const response = await fetch(`http://127.0.0.1:5002/api/patients/${patient_id}`);

    //   // Check if the response is successful
    //   if (!response.ok) {
    //     throw new Error(`Error fetching patient data: ${response.status} ${response.statusText}`);
    //   }

    //   // Parse JSON response
    //   const data = await response.json();
    //   console.log(data);
    //   setPatientData(data); // Update the state with patient data
    // } catch (error) {
    //   setError(error.message); // Handle errors
    // }
  };

  // const fetchChartData = async () => {
  //   const response = await fetch('/api/chart-data'); // Example API endpoint for chart data
  //   const data = await response.json();
  //   setChartData(data);
  // };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage); // Update selected stage
  };

  return (
    <div className="container">
      <HeaderAndPatientInfo patient={patient} />
      <PatientMonitoringCarousel fetalCount={fetal_count} />
      <StageSelector onStageSelect={handleStageSelect} />
      <AlertDisplay alerts={alerts} />
      <TabNavigation selectedStage={selectedStage} patient_id={patient_id} />
    </div>
  );
}

export default UserInterface;
