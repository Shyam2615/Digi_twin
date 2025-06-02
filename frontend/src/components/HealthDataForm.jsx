import axios from "axios";
import React, { useState } from "react";

const HealthDataForm = ({ onSave }) => {
  const [formData, setFormData] = useState(() => {
    const storedHealthData = localStorage.getItem("health_data");
    const parsedHealthData = storedHealthData ? JSON.parse(storedHealthData) : null;

    return parsedHealthData || {
      user: localStorage.getItem("user"),
      gender: localStorage.getItem("gender"),
      sleep_duration: 8,
      physical_activity_level: 5,
      stress_level: 5,
      bmi_category: "Normal",
      heart_rate: 72,
      daily_steps: 5000,
      systolic: 120,
      diastolic: 80,
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/health/", formData);
      localStorage.setItem("health_data", JSON.stringify(formData));
      onSave(formData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Enter Your Health Data</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Gender */}
          <div>
            <label className="block text-gray-300 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Sleep Duration */}
          <div>
            <label className="block text-gray-300 mb-1">Sleep Duration ({formData.sleep_duration} hours)</label>
            <input
              type="range"
              name="sleep_duration"
              min="0"
              max="12"
              value={formData.sleep_duration}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Physical Activity Level */}
          <div>
            <label className="block text-gray-300 mb-1">Physical Activity Level ({formData.physical_activity_level}/10)</label>
            <input
              type="range"
              name="physical_activity_level"
              min="1"
              max="10"
              value={formData.physical_activity_level}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Stress Level */}
          <div>
            <label className="block text-gray-300 mb-1">Stress Level ({formData.stress_level}/10)</label>
            <input
              type="range"
              name="stress_level"
              min="1"
              max="10"
              value={formData.stress_level}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* BMI Category */}
          <div>
            <label className="block text-gray-300 mb-1">BMI Category</label>
            <select
              name="bmi_category"
              value={formData.bmi_category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Normal">Normal</option>
              <option value="Underweight">Underweight</option>
              <option value="Overweight">Overweight</option>
              <option value="Obese">Obese</option>
            </select>
          </div>

          {/* Heart Rate */}
          <div>
            <label className="block text-gray-300 mb-1">Heart Rate ({formData.heart_rate} bpm)</label>
            <input
              type="range"
              name="heart_rate"
              min="40"
              max="150"
              value={formData.heart_rate}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Daily Steps */}
          <div>
            <label className="block text-gray-300 mb-1">Daily Steps ({formData.daily_steps})</label>
            <input
              type="range"
              name="daily_steps"
              min="0"
              max="20000"
              step="100"
              value={formData.daily_steps}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Systolic Blood Pressure */}
          <div>
            <label className="block text-gray-300 mb-1">Systolic Blood Pressure ({formData.systolic})</label>
            <input
              type="range"
              name="systolic"
              min="80"
              max="200"
              value={formData.systolic}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Diastolic Blood Pressure */}
          <div>
            <label className="block text-gray-300 mb-1">Diastolic Blood Pressure ({formData.diastolic})</label>
            <input
              type="range"
              name="diastolic"
              min="50"
              max="130"
              value={formData.diastolic}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Save Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthDataForm;
