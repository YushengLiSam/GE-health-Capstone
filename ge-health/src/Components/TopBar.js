// src/Components/TopBar.js
import React from 'react';
import './TopBar.css';

function TopBar() {
  return (
    <div className="top-bar">
      <div className="logo-section">
        <img src="/GE_HealthCare_logo_2023.png" alt="GE HealthCare Logo" className="logo" />
        <span className="title">Configuration Demo</span>
      </div>
      <div className="account-section">
        <span className="account-info">admin, dcs</span>
      </div>
    </div>
  );
}

export default TopBar;
