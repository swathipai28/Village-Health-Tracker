import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "Worker") {
        navigate("/dashboard/worker");
      } else if (role === "Doctor") {
        navigate("/dashboard/doctor");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
            
         <div className="hidden md:flex flex-col items-center justify-start bg-indigo-100 p-0 h-full w-full pt-6 overflow-hidden">
        <motion.img
          src="https://th.bing.com/th/id/OIG2.BpGolPx086xjwAEmW4.L?pid=ImgGn"
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
      

        {/* Right Side – Login Form */}
        <div className="p-8 md:p-10 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Login</h2>
          <p className="text-center text-sm text-gray-500">
            For registered doctors & health workers
          </p>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-md shadow hover:shadow-lg transition duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
