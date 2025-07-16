import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Worker",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, formData);
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 via-white to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
   <div className="hidden md:flex flex-col items-center justify-start bg-indigo-100 p-0 h-full w-full pt-6 overflow-hidden">
  <motion.img
    src="https://th.bing.com/th/id/OIG4.HwOGWBywjoU25ihMtx7B?w=1024&h=1024&rs=1&pid=ImgDetMain&o=7&rm=3"
    alt="Signup Visual"
    className="w-full h-[70%] object-contain -mt-6"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1, ease: "easeOut" }}
  />

  <motion.h3
    className="text-lg font-semibold text-gray-700 text-center mt-2"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    Join the Village Health Mission
  </motion.h3>

  <motion.p
    className="text-sm text-gray-500 text-center mt-1 px-4"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.6 }}
  >
    Empower communities. Deliver care. Go digital.
  </motion.p>
</div>



        {/* Right: Signup Form */}
        <div className="p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create your account
          </h2>
          <p className="text-center text-sm text-gray-500">
            Register as an ASHA Worker or Doctor
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Create a secure password"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Worker">ASHA Worker</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-md shadow hover:shadow-lg transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
