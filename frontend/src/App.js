import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import ResidentDashboard from './components/ResidentDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/resident" element={<ResidentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
