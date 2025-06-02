import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import background from "../assets/login_img.jpg"; // Import Image
import { FaDumbbell } from "react-icons/fa6";
import { motion } from "framer-motion"; // Import animation library

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", formData);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user", res.data.user);
      localStorage.setItem("gender", res.data.gender);
      localStorage.setItem("health_data", JSON.stringify(res.data.health_data));
      navigate("/");
    } catch (err) {
      setError("Invalid Credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg w-96 border border-gray-500"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <FaDumbbell size={28} className="text-blue-400 mr-2" />
          <h2 className="text-xl font-bold text-white">Digi Twin</h2>
        </div>

        {/* Login Header */}
        <h2 className="text-center text-2xl font-semibold text-white mb-4">Login</h2>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ x: -10 }}
            animate={{ x: [10, -10, 10, -10, 0] }}
            transition={{ duration: 0.4 }}
            className="text-red-500 text-center mb-2"
          >
            {error}
          </motion.p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-3 py-2 mt-1 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-2 mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all"
          >
            Login
          </motion.button>

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-gray-300">
            Don't have an account?
            <Link to="/register" className="text-blue-400 hover:underline ml-1">
              Register here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
