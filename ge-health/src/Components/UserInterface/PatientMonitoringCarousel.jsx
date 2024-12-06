import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import './carousel.css'; // Ensure it includes the styles for the carousel
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const PatientMonitoringCarousel = ({ fetalCount }) => {
  const [momData, setMomData] = useState(generatePlaceholderData('mom'));
  const [fetusData, setFetusData] = useState(
    Array.from({ length: fetalCount }, () => generatePlaceholderData('fetus'))
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = 1 + fetalCount; // Mom chart + fetus charts

  // Update data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMomData((prevData) => updateRandomData(prevData, 'mom'));
      setFetusData((prevData) =>
        prevData.map((data) => updateRandomData(data, 'fetus'))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [fetalCount]);

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const handleIndicatorClick = (index) => {
    setActiveIndex(index);
  };

  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: { y: { beginAtZero: true } },
  });

  return (
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
  );
};

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

export default PatientMonitoringCarousel;
