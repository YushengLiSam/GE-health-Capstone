import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientInformation from './Components/PatientInformation';
import ImageGallery from './Components/ImageGallery/ImageGallery';
import NewPage from './Components/NewPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for PatientInformation component */}
          <Route path="/" element={<PatientInformation />} />

          <Route path="/gallery" element={<NewPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
