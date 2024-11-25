import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import HeaderAndPatientInfo from './HeaderAndPatientInfo';
import StageSelector from './StageSelector';
import TabNavigation from './TabNavigation';
import AlertDisplay from './AlertDisplay';
import { Line } from 'react-chartjs-2';
import { Carousel } from 'react-bootstrap'; // Import Carousel
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

  const [momData, setMomData] = useState(generatePlaceholderData('mom'));
  const [fetusData, setFetusData] = useState(
    Array.from({ length: fetal_count }, () => generatePlaceholderData('fetus'))
  );

  // Carousel active state
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 1 + fetal_count; // Mom chart + fetus charts

  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: { y: { beginAtZero: true } },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMomData((prevData) => updateRandomData(prevData, 'mom'));
      setFetusData((prevData) =>
        prevData.map((data) => updateRandomData(data, 'fetus'))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [fetal_count]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
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
      <HeaderAndPatientInfo patient={patient} />

      {/* Patient Monitoring Charts */}
      <div className="chart-container">
        <div className="carousel">
          <div className="carousel-inner">
            {/* Mom's Chart */}
            <div className={`carousel-item ${activeIndex === 0 ? 'active' : ''}`}>
              <div className="chart">
                <Line data={momData} options={options("Mom's Monitoring Chart")} />
              </div>
            </div>

            {/* Fetus Charts */}
            {fetusData.map((data, index) => (
              <div
                className={`carousel-item ${activeIndex === index + 1 ? 'active' : ''}`}
                key={index}
              >
                <div className="chart">
                  <Line data={data} options={options(`Fetus ${index + 1} Monitoring Chart`)} />
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Controls */}
          <button className="carousel-control-prev" onClick={handlePrev}>
            <span aria-hidden="true">&lt;</span>
          </button>
          <button className="carousel-control-next" onClick={handleNext}>
            <span aria-hidden="true">&gt;</span>
          </button>

          {/* Carousel Indicators */}
          <div className="carousel-indicators">
            {[...Array(totalSlides).keys()].map((index) => (
              <button
                key={index}
                className={activeIndex === index ? 'active' : ''}
                onClick={() => handleIndicatorClick(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <StageSelector onStageSelect={handleStageSelect} />
      <AlertDisplay alerts={alerts} />
      <TabNavigation selectedStage={selectedStage} patient_id={patient_id} />
    </div>
  );
}

export default UserInterface;

// Helper functions
function generatePlaceholderData(type) {
  const labels = generateTimestamps(200); // Generate 200 timestamps for 10 minutes
  const datasets = [
    {
      label: `${type === 'mom' ? 'Heart Rate (bpm)' : 'Fetal Heart Rate (bpm)'}`,
      data: Array.from({ length: 200 }, () => getRandomValue(60, 100)), // Random heart rate
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      tension: 0.3, // Smooth lines
      pointRadius: 0, // Invisible nodes
      pointHoverRadius: 0, // No hover effect
      fill: false, // No fill under the line
    },
  ];

  if (type === 'mom') {
    datasets.push({
      label: 'Blood Pressure (mmHg)',
      data: Array.from({ length: 200 }, () => getRandomValue(110, 130)), // Random blood pressure
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    });
  }

  return { labels, datasets };
}

function updateRandomData(data, type) {
  const newTimestamp = new Date().toLocaleTimeString(); // Generate new timestamp
  const updatedLabels = [...data.labels.slice(1), newTimestamp]; // Retain last 200 labels
  const updatedDatasets = data.datasets.map((dataset) => ({
    ...dataset,
    data: [
      ...dataset.data.slice(1),
      getRandomValue(60, type === 'mom' ? 100 : 120), // Append new value
    ],
  }));

  return { labels: updatedLabels, datasets: updatedDatasets };
}

function generateTimestamps(count) {
  const now = new Date();
  const timestamps = [];

  for (let i = 0; i < count; i++) {
    const time = new Date(now - (count - 1 - i) * 3000); // Subtract 3-second intervals
    timestamps.push(time.toLocaleTimeString());
  }

  return timestamps;
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}