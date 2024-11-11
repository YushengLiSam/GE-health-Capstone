import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './Components/TopBar';
import Sidebar from './Components/builder/Sidebar';
import RuleBuilder from './Components/builder/RuleBuilder';
import AnnotationBuilder from './Components/builder/AnnotationBuilder';
import UsersRoles from './Components/builder/UsersRoles';
import PatientInformation from './Components/PatientInformation';
import UserInterface from './Components/UserInterface/UIStructure';
import PatientList from './Components/PatientList';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';
import './App.css';

function App() {
  // State to check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status from localStorage on component mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus);
  }, []);

  // Function to handle login (set `isLoggedIn` to true and save to localStorage)
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Function to handle logout (set `isLoggedIn` to false and remove from localStorage)
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Admin Panel Layout Component
  const AdminPanel = () => (
    <div className="Config">
      <TopBar onLogout={handleLogout} />
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content">
        <Routes>
          <Route path="rule-builder" element={<RuleBuilder />} />
          <Route path="annotation-builder" element={<AnnotationBuilder />} />
          <Route path="users-roles" element={<UsersRoles />} />
          <Route path="patient-info" element={<PatientList />} />
          <Route path="add-patient" element={<PatientInformation />} />
          <Route path="patient/:id" element={<UserInterface />} />
        </Routes>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />

        {/* Redirect any unknown routes to login or admin based on login status */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/admin" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
