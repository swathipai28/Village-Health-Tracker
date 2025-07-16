import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PatientDetails() {
  const { id } = useParams(); // patient ID from route
  const token = localStorage.getItem("token");

  const [patient, setPatient] = useState(null);
  const [form, setForm] = useState({ visitType: "", details: "" });

  const fetchPatient = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched patient data:", res.data); // ✅ debug line
      setPatient(res.data);
    } catch (err) {
      console.error("Error fetching patient:", err.message);
      alert("Could not load patient details.");
    }
  };

  useEffect(() => {
    fetchPatient();
  }, []);

  const logVisit = async (e) => {
    e.preventDefault();
    if (!form.visitType || !form.details) return alert("All fields required!");

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: long } = pos.coords;

      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/patients/${id}/log`,
          { ...form, geolocation: { lat, long } },
          { headers: { Authorization: `Bearer ${token}`} }
        );

        alert("Visit logged!");
        setForm({ visitType: "", details: "" });
        fetchPatient(); // refresh logs and doctor note
      } catch (err) {
        console.error("Log visit error:", err.message);
        alert("Error logging visit.");
      }
    });
  };

  if (!patient) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {patient.name} – {patient.type}
      </h2>

      <form onSubmit={logVisit} className="mb-6 space-y-3">
        <select
          value={form.visitType}
          onChange={(e) => setForm({ ...form, visitType: e.target.value })}
          required
        >
          <option value="">Select Visit Type</option>
          <option>ANC</option>
          <option>Vaccination</option>
          <option>General Checkup</option>
        </select>
        <textarea
          rows="3"
          placeholder="Details of the visit"
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          required
        />
        <button className="bg-blue-600 text-white p-2 rounded">
          ➕ Log Visit
        </button>
      </form>

      {/* ✅ Always show doctor's note section */}
      <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded">
        <strong className="block text-yellow-800 mb-1">
          🩺 Doctor's Note:
        </strong>
        <p>{patient.doctorNote || "No note available from the doctor."}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2 mt-6">📋 Visit Logs</h3>
      <ul className="space-y-2">
        {patient.healthLogs.slice().reverse().map((log, index) => (
          <li key={index} className="p-3 border rounded shadow-sm">
            <strong>{log.visitType}</strong> — {log.details}
            <br />
            📅 {new Date(log.date).toLocaleString()}
            <br />
            📍 Location:{" "}
            {log.geolocation?.place ||
              `Lat: ${log.geolocation?.lat}, Long: ${log.geolocation?.long}`}
          </li>
        ))}
      </ul>
    </div>
  );
}