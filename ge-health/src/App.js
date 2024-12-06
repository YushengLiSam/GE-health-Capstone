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
import AnnotationList from './Components/builder/AnnotationList';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName,setUserName] = useState();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
    // const userId = sessionStorage.getItem('userID');
    setIsLoggedIn(loggedInStatus);
    // if (userId) {
    //   setUserId(userId); // Assume there's a state for userId
    // }
  }, []);

  const handleLogin = () => {
    const userName = sessionStorage.getItem('userName');
    if (userName) {
        setUserName(userName); // Assume there's a state for userId
      }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('userName');
  };

  const AdminPanel = () => (
    <div className="Config">
      <TopBar user_name={userName} onLogout={handleLogout} />
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/annotation-list" />} />
          <Route path="annotation-list" element={<AnnotationList />} />
          <Route path="rule-builder" element={<RuleBuilder />} />
          <Route path="annotation-builder" element={<AnnotationBuilder />} />
          <Route path="users-roles" element={<UsersRoles />} />
          <Route path="patient-info" element={<PatientList />} />
          <Route path="add-patient" element={<PatientInformation />} />
          <Route path="patient/:patient_id" element={<UserInterface />} />
        </Routes>
      </div>
    </div>
  );

  // console.log(localStorage.getItem('isLoggedIn'));
  // useEffect(() => {
  //   const loggedInStatus = localStorage.getItem('isLoggedIn');
  //   console.log("Initial loggedInStatus from localStorage:", loggedInStatus);
  //   setIsLoggedIn(loggedInStatus === 'true');
  // }, []);  

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />} />

        {/* Authentication Routes */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />

        {/* Wildcard Route for Undefined Paths */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/admin" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
