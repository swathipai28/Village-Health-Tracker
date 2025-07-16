import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorLayout from "./DoctorLayout";
import PatientDetailsForDoctor from "./PatientDetailsForDoctor";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DoctorDashboard() {
  const [workers, setWorkers] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/doctor/workers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWorkers(res.data))
      .catch(() => alert("Error loading data"));
  }, []);

  // Filtered workers for search
  const filteredWorkers = workers.map((worker) => ({
    ...worker,
    patients: worker.patients.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const chartData = {
    labels: workers.map((w) => w.workerName),
    datasets: [
      {
        label: "Patients",
        data: workers.map((w) => w.totalPatients),
        backgroundColor: "#93c5fd", // light indigo
      },
    ],
  };

  return (
    <DoctorLayout>
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        Doctor Dashboard
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search patient by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-300 shadow-sm"
        />
      </div>

      {/* Grid: Chart and Worker Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Analytics Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            📊 Patients per Health Worker
          </h2>
          <div className="h-64">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                      precision: 0,
                      color: "#6b7280", // gray-600
                    },
                    grid: { color: "#e5e7eb" }, // gray-200
                  },
                  x: {
                    ticks: { color: "#6b7280" },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Worker & Patient Cards */}
        <div className="space-y-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.workerId}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-md"
            >
              <h2 className="text-lg font-semibold text-blue-700">
                👩‍⚕ {worker.workerName} – {worker.assignedVillage}
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                Patients: {worker.totalPatients}
              </p>

              {worker.patients.length === 0 ? (
                <p className="italic text-gray-400">No matching patients.</p>
              ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {worker.patients.map((p) => (
                    <li
                      key={p._id}
                      className="p-4 bg-indigo-50 rounded shadow-sm cursor-pointer hover:bg-indigo-100 transition"
                      onClick={() => setSelectedPatient(p)}
                    >
                      <strong>{p.name}</strong> — {p.type}
                      <br />
                      📍 {p.village}
                      <br />
                      🗓 Next:{" "}
                      {p.nextFollowUp
                        ? new Date(p.nextFollowUp).toLocaleDateString()
                        : "N/A"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] md:w-[60%] max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSelectedPatient(null)}
            >
              ❌
            </button>
            <PatientDetailsForDoctor patientId={selectedPatient._id} />
          </div>
        </div>
      )}
    </DoctorLayout>
  );
}