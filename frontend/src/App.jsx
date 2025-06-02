import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HealthControls from "./components/HealthControls";
import HealthDataForm from "./components/HealthDataForm";
import HumanCanvas from "./components/HumanCanvas";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CalorieEstimator from "./pages/CalorieEstimator";

export default function App() {
  const [healthData, setHealthData] = useState(() => {
    const savedData = localStorage.getItem("healthData");
    return savedData ? JSON.parse(savedData) : null;
  });

  const [googleFitData, setGoogleFitData] = useState(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleSaveHealthData = (data) => {
    setHealthData(data);
  };

  const handleUpdateHealthData = () => {
    setHealthData(null);
  };

  return (
    <Router>
      <Navbar onHealthUpdate={handleUpdateHealthData} onGoogleSignIn={setGoogleFitData} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            healthData ? (
              <HealthControls setIsAdjusting={setIsAdjusting} />
            ) : (
              <HealthDataForm onSave={handleSaveHealthData} />
            )
          }
        />

        <Route path="/calorie-estimator" element={<CalorieEstimator />} />
      </Routes>
    </Router>
  );
}
