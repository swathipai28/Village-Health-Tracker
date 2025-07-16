import React, { useState } from "react";
import axios from "axios";

export default function AddPatient() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    village: "",
    type: "Pregnant Woman",
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/patients`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Patient added successfully!");
      setFormData({ name: "", age: "", gender: "Female", village: "", type: "Pregnant Woman" });
    } catch (err) {
      alert("Error adding patient.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        required
        className="p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="number"
        placeholder="Age"
        value={formData.age}
        required
        className="p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
      />
      <select
        value={formData.gender}
        className="p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option>Female</option>
        <option>Male</option>
        <option>Other</option>
      </select>
      <input
        type="text"
        placeholder="Village"
        value={formData.village}
        required
        className="p-2 border rounded"
        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
      />
      <select
        value={formData.type}
        className="p-2 border rounded col-span-full sm:col-span-1"
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option>Pregnant Woman</option>
        <option>Child</option>
        <option>Chronic Patient</option>
      </select>
      <button className="bg-blue-600 text-white p-2 rounded col-span-full sm:col-span-1">
        Add Patient
      </button>
    </form>
  );
}