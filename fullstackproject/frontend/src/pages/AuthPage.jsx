import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';

const AuthPage = () => {
  const location = useLocation();
  
  // If user is already authenticated, redirect to home
  const isAuthenticated = localStorage.getItem('token');
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AuthPage;
