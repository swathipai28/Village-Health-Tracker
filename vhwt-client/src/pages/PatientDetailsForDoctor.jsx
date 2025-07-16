import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PatientDetailsForDoctor({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [note, setNote] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPatient(res.data);
        setNote(res.data.doctorNote || "");
      });
  }, [patientId]);

  const updateNote = () => {
    axios
      .put(
        `http://localhost:5000/api/doctor/note/${patientId}`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => alert("Note saved"))
      .catch(() => alert("Failed to save note"));
  };

  const exportPatientPDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Patient Report: ${patient.name}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Type: ${patient.type}`, 14, 30);
    doc.text(`Village: ${patient.village}`, 14, 36);
    doc.text(`Doctor's Note: ${patient.doctorNote || "N/A"}`, 14, 44);

    const logs = patient.healthLogs?.slice().reverse().map((log, index) => [
      index + 1,
      log.visitType,
      log.details,
      new Date(log.date).toLocaleString(),
      log.geolocation?.place || "Unknown",
    ]) || [];

    if (logs.length > 0) {
      autoTable(doc, {
        startY: 50,
        head: [["#", "Visit Type", "Details", "Date", "Location"]],
        body: logs,
        theme: "striped",
      });
    } else {
      doc.text("No health logs available.", 14, 54);
    }

    doc.save(`${patient.name}_Report.pdf`);
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-indigo-700">{patient.name}</h2>
        <p className="text-sm text-gray-600">Type: {patient.type}</p>
        <p className="text-sm text-gray-600">Village: {patient.village}</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => exportPatientPDF(patient)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📥 Download PDF
        </button>
        <button
          onClick={updateNote}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💾 Save Note
        </button>
      </div>

      <div>
        <label className="block font-semibold mb-1 mt-4">📝 Doctor's Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">📋 Visit Logs</h3>
        <ul className="space-y-3">
          {patient.healthLogs
            ?.slice()
            .reverse()
            .map((log, i) => (
              <li
                key={i}
                className="p-3 bg-gray-50 border rounded shadow-sm text-sm"
              >
                <strong>{log.visitType}</strong> — {log.details}
                <br />
                📅 {new Date(log.date).toLocaleString()}
                <br />
                📍 {log.geolocation?.place || "Unknown location"}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
