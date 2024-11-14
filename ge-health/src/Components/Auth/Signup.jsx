import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Direct navigation for now; can be replaced with actual signup API call
    alert("Signup successful! You can now log in.");
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src="/GE_HealthCare_logo_2023.png" alt="GE Health Logo" className="auth-logo" />
        <h2 className="auth-title">Sign up for GE-Health Admin</h2>
        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <div className="auth-footer">
          <span>Already have an account? <Link to="/login">Log in</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Signup;