import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderAndPatientInfo from './HeaderAndPatientInfo';
import StageSelector from './StageSelector';
import TabNavigation from './TabNavigation';
import AlertDisplay from './AlertDisplay';
import { Line } from 'react-chartjs-2';
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
  const [patientData, setPatientData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  //const [chartData, setChartData] = useState([]);

  const location = useLocation();
  const { patientName } = location.state || {};
  
  // Placeholder data for the chart
  const placeholderData = {
    labels: ['10:10', '10:15', '10:20', '10:25', '10:30', '10:35'],
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: [75, 80, 78, 82, 85, 83],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Blood Pressure (mmHg)',
        data: [120, 125, 122, 130, 128, 127],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'SpO2 (%)',
        data: [98, 97, 99, 97, 98, 96],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Placeholder Patient Monitoring Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Fetch patient data and monitor for alerts
  useEffect(() => {
    fetchPatientData();
    //fetchChartData();
  }, []);

  const fetchPatientData = async () => {
    const response = await fetch('/api/patient-info'); // Example API endpoint
    const data = await response.json();
    setPatientData(data);

    if (data.bp > 140) {
      setAlerts([...alerts, 'High Blood Pressure']);
    }
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
      <HeaderAndPatientInfo patient={patientData} patientName = {patientName}/>

      {/* Patient Monitoring Chart */}
      <div className="chart-container">
        <Line data={placeholderData} options={options} />
      </div>

      <StageSelector onStageSelect={handleStageSelect}/>
      <AlertDisplay alerts={alerts} />
      <TabNavigation selectedStage={selectedStage}/>
    </div>
  );
}

export default UserInterface;
