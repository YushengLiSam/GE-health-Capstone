import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';

function PrivateRoute({ element }) {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
