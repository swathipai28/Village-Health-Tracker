
import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkerLayout from "./WorkerLayout";
import AddPatient from "./AddPatient";
import MyPatients from "./MyPatients";
import PatientDetails from "./PatientDetails";

export default function WorkerDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    upcomingFollowUps: 0,
    overduePatients: [],
    reminderPatients: [],
  });
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/patients/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <WorkerLayout setSelectedTab={setSelectedTab}>
      <div className="space-y-10">
        {selectedTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-indigo-700 mb-6">
              Welcome to your Dashboard
            </h1>

            {/* 🔢 Count Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Patients Added</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalPatients}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Follow-ups</h3>
                <p className="text-3xl font-bold text-green-600">{stats.upcomingFollowUps}</p>
              </div>
            </div>

            {/* 🟡 & 🔴 Side-by-side Reminder Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* 🔔 Upcoming Reminders Box */}
              <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-6 py-5 rounded-xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    🔔 Follow-Up Reminders <span className="text-sm">(Tomorrow)</span>
                  </h2>
                  {stats.reminderPatients?.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-base">
                      {stats.reminderPatients.map((p) => (
                        <li key={p._id}>
                          <span className="font-semibold">{p.name}</span> —{" "}
                          <span>{new Date(p.nextFollowUp).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-4 text-center text-gray-600">
                      <span className="text-3xl mb-2">📅</span>
                      <p className="italic">No upcoming follow-up reminders for tomorrow.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ⚠ Overdue Follow-ups Box */}
              <div className="bg-red-50 border border-red-400 text-red-700 px-6 py-5 rounded-xl shadow-sm h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    ⚠ Missed Follow-Ups
                  </h2>
                  {stats.overduePatients.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-base">
                      {stats.overduePatients.map((p) => (
                        <li key={p._id}>
                          <span className="font-semibold">{p.name}</span> —{" "}
                          <span>{new Date(p.nextFollowUp).toLocaleDateString()}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-4 text-center text-gray-600">
                      <span className="text-3xl mb-2">✅</span>
                      <p className="italic">No overdue follow-ups. You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === "add" && (
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">➕ Add New Patient</h2>
            <div className="bg-white rounded-xl shadow p-6 border border-blue-200">
              <AddPatient />
            </div>
          </div>
        )}

        {selectedTab === "mypatients" && (
          <div>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">🧍‍♀ My Patients</h2>
            <div className="bg-white rounded-xl shadow p-6 border border-green-200">
              <MyPatients onPatientClick={setSelectedPatientId} />
            </div>

            {selectedPatientId && (
              <div className="bg-white rounded-xl shadow p-6 border border-indigo-200 mt-6">
                <PatientDetails patientId={selectedPatientId} />
              </div>
            )}
          </div>
        )}
      </div>
    </WorkerLayout>
  );
}