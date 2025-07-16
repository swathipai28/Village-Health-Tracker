const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  village: String,
  type: {
    type: String,
    enum: ["Pregnant Woman", "Child", "Chronic Patient"],
  },
  healthLogs: [
    {
      date: Date,
      visitType: String,
      details: String,
      geolocation: {
        lat: Number,
        long: Number,
        place: String,
      },
    },
  ],
  nextFollowUp: Date,
  missedFollowUp: { type: Boolean, default: false },
  assignedWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctorNote: {
  type: String,
  default: "",
},
});

module.exports = mongoose.model("Patient", patientSchema);
