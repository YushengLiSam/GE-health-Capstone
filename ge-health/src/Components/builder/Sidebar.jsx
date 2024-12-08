// src/Components/builder/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Labor & Delivery</h3>
      <nav>
        <NavLink
          to="/admin/annotation-list"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Annotation List
        </NavLink>
        <NavLink to="/admin/annotation-builder" className={({ isActive }) => (isActive ? 'active' : '')}>
          Annotation Builder
        </NavLink>
        <NavLink to="/admin/patient-info" className={({ isActive }) => (isActive ? 'active' : '')}>
          Patient List
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
