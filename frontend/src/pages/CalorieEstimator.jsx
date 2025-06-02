import React, { useState, useRef } from "react";
import axios from "axios";

const CalorieEstimator = () => {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [calorieEstimate, setCalorieEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [flaggedCalories, setFlaggedCalories] = useState([]); // Store flagged calorie values
  const [prediction, setPrediction] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setImage(URL.createObjectURL(selectedFile));
    setFile(selectedFile);
  };

  const openCamera = async () => {
    setIsCameraOpen(true);
    setCalorieEstimate(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      canvasRef.current.toBlob((blob) => {
        const capturedFile = new File([blob], "captured_image.jpg", { type: "image/jpeg" });

        setImage(URL.createObjectURL(blob));
        setFile(capturedFile);

        stopCamera();
      }, "image/jpeg");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select or capture an image first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "digi_twin");
      formData.append("cloud_name", "dou2gktzi");

      console.log("Uploading image to Cloudinary...");

      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dou2gktzi/image/upload",
        formData
      );

      const imageUrl = uploadResponse.data.secure_url;
      console.log("Image URL:", imageUrl);

      const response = await axios.post("http://127.0.0.1:8000/calorie-estimate/", {
        image_url: imageUrl,
      });

      console.log("Calorie Response:", response.data);
      setCalorieEstimate(response.data.calorie_estimate);
    } catch (error) {
      console.error("Error fetching calorie estimate", error);
      alert("Error estimating calories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const flagCalories = () => {
    if (!calorieEstimate) {
      alert("No calorie estimate to flag!");
      return;
    }

    const newFlaggedCalories = [...flaggedCalories, { id: Date.now(), value: calorieEstimate }];
    setFlaggedCalories(newFlaggedCalories);
  };

  const deleteFlaggedCalorie = (id) => {
    const updatedFlags = flaggedCalories.filter((entry) => entry.id !== id);
    setFlaggedCalories(updatedFlags);
  };

  const handlePrediction = async () => {
    if (flaggedCalories.length === 0) {
      alert("No flagged calories to predict.");
      return;
    }

    // ✅ Extract numbers from strings
    const totalCalories = flaggedCalories.reduce((sum, item) => {
      const match = item.value.match(/Total Calories:\s*(\d+)/); // Extracts the number after "Total Calories:"
      const calories = match ? parseInt(match[1], 10) : 0; // Convert to number (default 0 if no match)
      return sum + calories;
    }, 0);

    console.log("Total Calories Sent:", totalCalories); // 🔍 Debugging

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict-calories/",
        { total_calories: totalCalories }, // ✅ Send a proper number
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Prediction Response:", response.data);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction", error);
      alert("Failed to get prediction.");
    }
  };

  return (
    <div className="flex flex-col items-center text-white p-6 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-blue-400">Calorie Estimator</h2>

      <label className="cursor-pointer bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mb-4">
        Select Image
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {!isCameraOpen ? (
        <button
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition mb-4"
          onClick={openCamera}
        >
          Open Camera
        </button>
      ) : (
        <div className="flex flex-col items-center">
          <video ref={videoRef} autoPlay className="w-64 h-48 border mb-2"></video>
          <button
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition mb-2"
            onClick={captureImage}
          >
            Capture Image
          </button>
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 transition"
            onClick={stopCamera}
          >
            Stop Camera
          </button>
          <canvas ref={canvasRef} width={640} height={480} className="hidden"></canvas>
        </div>
      )}

      {image && <img src={image} alt="Selected" className="mt-4 w-64 h-48 border" />}

      <button
        className={`px-4 py-2 mt-4 rounded transition ${loading ? "bg-gray-500" : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Estimating..." : "Estimate Calories"}
      </button>

      {calorieEstimate && (
        <div className="mt-4 p-4 bg-gray-800 rounded text-white w-80">
          <h3 className="text-xl font-bold mb-2">Calorie Estimate:</h3>
          <p dangerouslySetInnerHTML={{ __html: calorieEstimate.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>") }}></p>
          <button
            className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
            onClick={flagCalories}
          >
            Flag Calories
          </button>
        </div>
      )}

      <div className="mt-6 w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-2">Flagged Calories:</h3>
        <div className="grid grid-cols-3 gap-4">
          {flaggedCalories.map((entry) => (
            <div key={entry.id} className="p-4 bg-gray-700 rounded flex flex-col items-center">
              <span className="text-white">{entry.value}</span>
              <button
                className="mt-2 px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
                onClick={() => deleteFlaggedCalorie(entry.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition"
        onClick={handlePrediction}
      >
        Get insights on daily food intake
      </button>

      {prediction && (
        <div className="mt-4 p-4 bg-gray-800 rounded text-white">
        <h3 className="text-xl font-bold mb-2">Insights:</h3>
        <p dangerouslySetInnerHTML={{ __html: prediction.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>") }}></p>
      </div>
      )}

    </div>
  );
};

export default CalorieEstimator;
