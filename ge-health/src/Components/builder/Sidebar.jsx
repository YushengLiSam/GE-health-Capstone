// src/Components/builder/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Labor & Delivery</h3>
      <nav>
        <NavLink to="/rule-builder" activeClassName="active">Rule Builder</NavLink>
        <NavLink to="/annotation-builder" activeClassName="active">Annotation Builder</NavLink>
        <NavLink to="/users-roles" activeClassName="active">Users & Roles</NavLink>
        <NavLink to="/patient-info" activeClassName="active">Patient Information</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
