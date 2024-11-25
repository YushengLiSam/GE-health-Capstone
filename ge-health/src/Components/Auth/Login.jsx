import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5002/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log(username);
      const data = await response.json();
      if (response.ok) {
        const userID = data.userID; // Pass userID to update sessionStorage
        const userName = data.username;
        
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userID', userID);
        sessionStorage.setItem('userName', userName);
        onLogin();
      } else {
        console.error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // Call the login handler passed as a prop (if necessary for parent component updates)
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <img src="/GE_HealthCare_logo_2023.png" alt="GE Health Logo" className="auth-logo" />
        <h2 className="auth-title">Sign in to GE-Health Admin</h2>
        <form onSubmit={handleLogin} className="auth-form">
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
          <button type="submit" className="auth-button">Sign In</button>
        </form>
        <div className="auth-footer">
          <span>New to admin? <Link to="/signup">Signup</Link></span>
        </div>
      </div>
    </div>
  );
}

export default Login;
