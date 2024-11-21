import React, { useState, useEffect } from 'react';
import {  useParams,useLocation } from 'react-router-dom';
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
  // const [patientData, setPatientData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [selectedStage, setSelectedStage] = useState();
  const { patient_id } = useParams();
  const [error, setError] = useState(null);
  //const [chartData, setChartData] = useState([]);
  const location = useLocation();
  const { patient } = location.state || {}; 

  
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
      <HeaderAndPatientInfo patient={patient}/>

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
