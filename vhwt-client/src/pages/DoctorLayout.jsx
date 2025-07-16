import React from "react";
import { Link } from "react-router-dom";

export default function DoctorLayout({ children, darkMode, toggleDarkMode }) {
  return (
    <div className={`${darkMode ? "dark bg-gray-950 text-white" : "bg-gray-100"} min-h-screen`}>
      {/* Navbar */}
      <header className="bg-indigo-700 text-white p-4 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Doctor Dashboard</h1>
          <nav className="space-x-4">
            <Link to="/dashboard/doctor" className="hover:underline">
              Home
            </Link>
          
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
}