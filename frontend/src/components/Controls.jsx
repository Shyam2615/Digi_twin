import React, { useState } from "react";

export default function Controls({ onUpdate }) {
  const [physicalActivity, setPhysicalActivity] = useState(5);
  const [bmi, setBmi] = useState(22);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ physicalActivity, bmi });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md mx-auto text-white">
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Physical Activity Level (1-10):</label>
        <input
          type="number"
          min="1"
          max="10"
          value={physicalActivity}
          onChange={(e) => setPhysicalActivity(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">BMI:</label>
        <input
          type="number"
          min="10"
          max="40"
          value={bmi}
          onChange={(e) => setBmi(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
      >
        Update Model
      </button>
    </form>
  );
}
