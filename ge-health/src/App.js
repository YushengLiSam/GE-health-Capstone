// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// // import PatientInformation from './Components/PatientInformation';
// // import ImageGallery from './Components/ImageGallery/ImageGallery';
// // import NewPage from './Components/NewPage';
// import AnnotationBuilder from './Components/builder/AnnotationBuilder';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>
//           {/* Home route for PatientInformation component */}
//           {/* <Route path="/" element={<PatientInformation />} /> */}

//           {/* Route for ImageGallery component */}
//           {/* <Route path="/gallery" element={<ImageGallery />} /> */}

//           {/* Route for NewPage component */}
//           {/* <Route path="/new-page" element={<NewPage />} /> */}

//           {/* Route for AnnotationBuilder component */}
//           <Route path="/annotation-builder" element={<AnnotationBuilder />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopBar from './Components/TopBar';
import Sidebar from './Components/builder/Sidebar';
import RuleBuilder from './Components/builder/RuleBuilder';
import AnnotationBuilder from './Components/builder/AnnotationBuilder';
import UsersRoles from './Components/builder/UsersRoles';
import PatientInformation from './Components/PatientInformation';
import UserInterface from './Components/UserInterface/UIStructure'
import './App.css';

function App() {
  return (
    <Router>
      <div className="Config">
        <TopBar />
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/rule-builder" element={<RuleBuilder />} />
            <Route path="/annotation-builder" element={<AnnotationBuilder />} />
            <Route path="/users-roles" element={<UsersRoles />} />
            <Route path="/patient-info" element={<PatientInformation />} />
            <Route path="/ui" element={<UserInterface />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;





