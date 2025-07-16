import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function MyPatients() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showOnlyOverdue, setShowOnlyOverdue] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPatients(res.data))
      .catch(() => alert("Error fetching patients"));
  }, [token]);

  const fetchPatientDetails = async (id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient({
        ...res.data,
        form: { visitType: "", details: "" },
      });
    } catch (err) {
      alert("Error fetching patient details.");
    }
  };

  const logVisit = async (e) => {
    e.preventDefault();
    const { visitType, details } = selectedPatient.form;
    if (!visitType || !details) return alert("All fields required!");

    try {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: long } = pos.coords;
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/patients/${selectedPatient._id}/log`,
          { visitType, details, geolocation: { lat, long } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Visit logged!");
        fetchPatientDetails(selectedPatient._id);
      });
    } catch {
      alert("Error logging visit.");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const today = new Date();

  const sortedPatients = patients
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.village.toLowerCase().includes(searchQuery.toLowerCase());

      const isOverdue = p.nextFollowUp && new Date(p.nextFollowUp) <= today;

      return matchesSearch && (!showOnlyOverdue || isOverdue);
    })
    .sort((a, b) => {
      const aDate = a.nextFollowUp ? new Date(a.nextFollowUp) : Infinity;
      const bDate = b.nextFollowUp ? new Date(b.nextFollowUp) : Infinity;
      return aDate - bDate;
    });

  const handleEdit = async (patient) => {
    const newName = prompt("Enter new name", patient.name);
    const newAge = prompt("Enter new age", patient.age);
    const newVillage = prompt("Enter new village", patient.village);
    const newType = prompt(
      "Enter new type (e.g., Pregnant Woman, Child, Chronic Patient)",
      patient.type
    );

    if (!newName || !newAge || !newVillage || !newType)
      return alert("All fields are required for update.");

    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/patients/${patient._id}`,
        { name: newName, age: newAge, village: newVillage, type: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Patient updated successfully.");
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/patients/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
      if (selectedPatient && selectedPatient._id === patient._id) {
        fetchPatientDetails(patient._id);
      }
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Patient deleted successfully.");
      setPatients(patients.filter((p) => p._id !== patientId));
      if (selectedPatient && selectedPatient._id === patientId) {
        setSelectedPatient(null);
      }
    } catch (err) {
      alert("Failed to delete patient.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 min-h-screen bg-gray-50">
      {/* Patient List Panel */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-700">👩‍⚕ My Patients</h2>
          <label className="text-sm flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyOverdue}
              onChange={() => setShowOnlyOverdue(!showOnlyOverdue)}
              className="accent-red-600"
            />
            Show Overdue Only
          </label>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or village..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <ul className="space-y-3 overflow-y-auto max-h-[70vh] pr-2">
          {sortedPatients.map((p) => {
            const isOverdue =
              p.nextFollowUp && new Date(p.nextFollowUp) <= today;

            return (
              <li
                key={p._id}
                onClick={() => fetchPatientDetails(p._id)}
                className={`p-4 border rounded-lg shadow-sm cursor-pointer transition hover:bg-indigo-50 ${
                  selectedPatient?._id === p._id ? "bg-indigo-100" : "bg-white"
                }`}
              >
                <strong className="text-indigo-700">
                  {p.name}
                  {isOverdue && (
                    <span className="ml-2 inline-block bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      OVERDUE
                    </span>
                  )}
                </strong>{" "}
                – {p.type}
                <br />
                <span className="text-sm text-gray-600">
                  Village: {p.village}, Age: {p.age}
                </span>
                <br />
                <span
                  className={`text-sm ${
                    isOverdue
                      ? "text-red-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  ⏰ Next Follow-up: {formatDate(p.nextFollowUp)}
                </span>
              </li>
            );
          })}

          {sortedPatients.length === 0 && (
            <p className="text-gray-500 italic mt-4">
              No patients {showOnlyOverdue ? "overdue" : "found"}.
            </p>
          )}
        </ul>
      </div>

      {/* Patient Detail Panel */}
      <div className="lg:col-span-2 min-h-[70vh]">
        <AnimatePresence mode="wait">
          {selectedPatient ? (
            <motion.div
              key={selectedPatient._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-700">
                  {selectedPatient.name} – {selectedPatient.type}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(selectedPatient)}
                    className="text-sm bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    ✏ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedPatient._id)}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>

              {selectedPatient.doctorNote && (
                <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded shadow-sm">
                  <strong className="block text-yellow-800 text-lg mb-1">
                    🩺 Doctor's Note
                  </strong>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedPatient.doctorNote}
                  </p>
                </div>
              )}

              <form onSubmit={logVisit} className="space-y-3 mb-6">
                <select
                  value={selectedPatient.form.visitType}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      form: {
                        ...selectedPatient.form,
                        visitType: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Visit Type</option>
                  <option>ANC</option>
                  <option>Vaccination</option>
                  <option>General Checkup</option>
                </select>
                <textarea
                  rows="3"
                  placeholder="Details of the visit"
                  value={selectedPatient.form.details}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      form: {
                        ...selectedPatient.form,
                        details: e.target.value,
                      },
                    })
                  }
                  required
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  ➕ Log Visit
                </button>
              </form>

              <h3 className="text-lg font-semibold mb-3">📋 Visit Logs</h3>
              <ul className="space-y-3">
                {selectedPatient.healthLogs
                  ?.slice()
                  .reverse()
                  .map((log, index) => (
                    <li
                      key={index}
                      className="p-3 bg-gray-50 border rounded shadow-sm"
                    >
                      <strong>{log.visitType}</strong> — {log.details}
                      <br />
                      📅 {new Date(log.date).toLocaleString()}
                      <br />
                      📍{" "}
                      {log.geolocation?.place ||
                        `Lat: ${log.geolocation?.lat}, Long: ${log.geolocation?.long}`}
                    </li>
                  ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="no-patient"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 italic pt-12"
            >
              Click on a patient to view details.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}