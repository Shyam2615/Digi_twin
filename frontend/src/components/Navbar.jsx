import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { initGoogleAuth, signInWithGoogle } from "../utils/googleAuth";
import axios from "axios";

const Navbar = ({ onHealthUpdate }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [googleToken, setGoogleToken] = useState(localStorage.getItem("google_token"));

  useEffect(() => {
    initGoogleAuth();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleGoogleFitIntegration = async () => {
    const token = await signInWithGoogle();
    if (token) {
      setGoogleToken(token);
      localStorage.setItem("google_token", token);
      fetchGoogleFitData(token);
    }
  };

  const fetchGoogleFitData = async (token) => {
    try {
      const response = await axios.post(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          aggregateBy: [
            { dataTypeName: "com.google.step_count.delta" },   // Steps
            { dataTypeName: "com.google.heart_rate.bpm" },    // Heart Rate
            { dataTypeName: "com.google.sleep.segment" }      // Sleep
          ],
          bucketByTime: { durationMillis: 86400000 },  // Aggregate daily data
          startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
          endTimeMillis: Date.now(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Google Fit Response:", response.data);

      // Extract Steps (ensure it's an integer)
      let steps = 0;
      const stepDataset = response.data?.bucket?.[0]?.dataset?.find(d =>
        d.dataSourceId.includes("step_count")
      );
      if (stepDataset && stepDataset.point.length > 0) {
        steps = stepDataset.point[0].value[0].intVal || 0;
      }

      // Extract Heart Rate (ensure it's a float)
      let heartRate = 0;
      const heartRateDataset = response.data?.bucket?.[0]?.dataset?.find(d =>
        d.dataSourceId.includes("heart_rate")
      );
      if (heartRateDataset && heartRateDataset.point.length > 0) {
        heartRate = heartRateDataset.point[0].value[0].fpVal || 0;
      }

      // Extract Sleep Duration (convert to hours, default to 0)
      let sleepHours = 0;
      const sleepDataset = response.data?.bucket?.[0]?.dataset?.find(d =>
        d.dataSourceId.includes("sleep")
      );
      if (sleepDataset && sleepDataset.point.length > 0) {
        let sleepDurationMillis = sleepDataset.point.reduce(
          (total, entry) => total + (entry.value[0]?.intVal || 0),
          0
        );
        sleepHours = (sleepDurationMillis / (1000 * 60 * 60)).toFixed(2) || 0;
      }

      // Store in localStorage
      const googleFitData = { steps, heartRate, sleepHours };
      localStorage.setItem("google_fit_data", JSON.stringify(googleFitData));

      console.log("Google Fit Parsed Data:", googleFitData);
    } catch (error) {
      console.error("Error fetching Google Fit data:", error);
    }
  };


  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center text-blue-500 text-lg font-bold">
          <FaUserCircle size={28} className="mr-2" />
          Digital Twin
        </Link>

        {/* Navbar Links */}
        <div className="flex items-center space-x-4">
          {username ? (
            <>
              <span className="text-gray-300 hidden sm:block">Hello, {username}!</span>

              <button
                onClick={onHealthUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
              >
                Update Health Info
              </button>

              <Link to="/calorie-estimator" className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
                Calculate Calories
              </Link>

              {/* Google Fit Integration */}
              <button
                onClick={handleGoogleFitIntegration}
                className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 transition"
              >
                Integrate Google Fit Data
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-blue-400 transition">Login</Link>
              <Link to="/register" className="text-gray-300 hover:text-blue-400 transition">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
