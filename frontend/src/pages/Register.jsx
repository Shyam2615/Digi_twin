import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/login_img.jpg"; // Import background image
import { FaDumbbell } from "react-icons/fa6";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    age: "",
    gender: "Male",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/register/", formData);
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Try again.");
      console.log(err);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-black bg-opacity-80 text-white p-8 rounded-lg shadow-lg w-96">

        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <FaDumbbell size={28} className="text-blue-400 mr-2" />
          <h2 className="text-xl font-bold">Digi Twin</h2>
        </div>

        {/* Register Header */}
        <h5 className="text-center text-2xl font-semibold mb-4">Register</h5>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        {/* Register Form */}
        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Username</label>
            <input 
              type="text" 
              name="username" 
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input 
              type="email" 
              name="email" 
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input 
              type="password" 
              name="password" 
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Age</label>
            <input 
              type="number" 
              name="age" 
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Gender</label>
            <select 
              name="gender" 
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none" 
              onChange={handleChange} 
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Register Button */}
          <button 
            type="submit" 
            className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="mt-4 text-center text-sm">
            Already have an account? 
            <Link to="/login" className="text-blue-400 hover:underline ml-1">
              Login here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;
