import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import HumanCanvas from "./HumanCanvas"; // Import Human Model
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HealthControls = () => {
  const [healthData, setHealthData] = useState(() => {
    const storedHealthData = localStorage.getItem("health_data");
    return storedHealthData
      ? JSON.parse(storedHealthData)
      : {
          sleep_duration: 0,
          physical_activity_level: 0,
          stress_level: 0,
          heart_rate: 72,
          daily_steps: 5000,
        };
  });

  const [googleFitData, setGoogleFitData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  // Fetch Google Fit Data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("google_fit_data");
    if (data) {
      const fitData = JSON.parse(data);
      setGoogleFitData(fitData);

      // Merge Google Fit Data with existing healthData
      setHealthData((prev) => ({
        ...prev,
        daily_steps: fitData?.steps || prev.daily_steps,
        heart_rate: fitData?.heart_rate || prev.heart_rate,
        sleep_duration: fitData?.sleep_duration || prev.sleep_duration,
      }));
    }
  }, []);

  const handleSliderChange = (key, value) => {
    setIsAdjusting(true);  // Set adjusting to true when user moves slider
    setHealthData((prev) => ({ ...prev, [key]: value }));

    // Reset the adjusting flag after 2 seconds of inactivity
    setTimeout(() => {
      setIsAdjusting(false);
    }, 2000);
  };

  const getPrediction = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/health/", healthData);

      if (res.data && res.data.prediction) {
        setPrediction(res.data.prediction);
        setShowModal(true);
      } else {
        alert("Failed to fetch prediction.");
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Error fetching prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const UpdateInfo = async () => {
    try {
      const user = localStorage.getItem("user");
      setHealthData((prev) => ({
        ...prev,
        user: user,
      }));
      await axios.post("http://127.0.0.1:8000/health/", healthData);
      localStorage.setItem("health_data", JSON.stringify(healthData));
    } catch (error) {
      console.error("Error updating information", error);
    }
  };

  return (
    <div className="flex h-screen text-white">
      {/* Left side: Human Model */}
      <div className="w-1/2 flex items-center justify-center sticky bg-black top-0 h-screen">
        <HumanCanvas healthData={healthData} isAdjusting={setIsAdjusting} />
      </div>

      {/* Right side: Controls */}
      <div className="w-1/2 flex flex-col items-center p-6 bg-gray-900 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Health Dashboard</h2>

        {/* Health Controls */}
        <div className="w-full max-w-lg bg-gray-800 p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold text-center mb-4">Adjust Health Data</h3>

          {[
            { label: "Sleep Duration (hrs)", key: "sleep_duration", min: 0, max: 12, step: 0.5 },
            { label: "Physical Activity Level", key: "physical_activity_level", min: 0, max: 10, step: 1 },
            { label: "Stress Level", key: "stress_level", min: 0, max: 10, step: 1 },
            { label: "Heart Rate (bpm)", key: "heart_rate", min: 50, max: 200, step: 5 },
            { label: "Daily Steps", key: "daily_steps", min: 1000, max: 20000, step: 500 },
          ].map(({ label, key, min, max, step }) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 text-lg">{label}: <span className="font-bold">{healthData[key]}</span></label>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={healthData[key]}
                onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          ))}
        </div>

              {/* Google Fit Data Section */}
      {googleFitData && (
        <div className="mt-6 w-full max-w-lg bg-gray-800 p-6 rounded-md shadow-md">
          <h3 className="text-xl font-semibold text-center text-green-400">Google Fit Data</h3>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <p><strong>Steps:</strong> {googleFitData?.steps || "N/A"}</p>
            <p><strong>Heart Rate:</strong> {googleFitData?.heart_rate || "N/A"} bpm</p>
            <p><strong>Sleep Duration:</strong> {googleFitData?.sleep_duration || "N/A"} hrs</p>
            <p><strong>Calories Burned:</strong> {googleFitData?.calories || "N/A"} kcal</p>
            <p><strong>Distance Walked:</strong> {googleFitData?.distance || "N/A"} km</p>
            <p><strong>Active Minutes:</strong> {googleFitData?.active_minutes || "N/A"} mins</p>
          </div>
        </div>
      )}

        {/* Bar Graphs Section */}
      {googleFitData && (
        <div className="w-full max-w-lg mt-6">
          <h3 className="text-xl font-semibold text-center text-yellow-400 mb-3">Activity Trends</h3>

          {/* Steps Trend Graph */}
          <Bar
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Steps",
                  data: googleFitData?.steps_trend || [0, 0, 0, 0, 0, 0, 0],
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />

          {/* Heart Rate Variation Graph */}
          <Bar
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Heart Rate (bpm)",
                  data: googleFitData?.heart_rate_trend || [72, 75, 78, 76, 74, 72, 70],
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
              ],
            }}
            className="mt-6"
          />

          {/* Sleep Duration Graph */}
          <Bar
            data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              datasets: [
                {
                  label: "Sleep (hrs)",
                  data: googleFitData?.sleep_trend || [7, 6.5, 7.2, 6, 5.5, 8, 7],
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
              ],
            }}
            className="mt-6"
          />
        </div>
      )}

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-3">
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition text-white"
            onClick={UpdateInfo}
          >
            Update Information
          </button>

          <button
            className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition text-white"
            onClick={getPrediction}
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Health Report"}
          </button>
        </div>

        {/* Modal */}
        {showModal && prediction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white text-gray-900 p-6 rounded-md w-[90vw] md:w-[60vw] max-h-[80vh] overflow-y-auto shadow-lg relative">
              <button
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h5 className="text-xl font-semibold">Health Analysis</h5>
              <p className="mt-2 text-md"
                dangerouslySetInnerHTML={{ __html: prediction.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>") }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthControls;
