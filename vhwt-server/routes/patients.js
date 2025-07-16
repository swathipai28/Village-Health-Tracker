const router = require("express").Router();
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// 🔐 Middleware to verify ASHA worker
function verifyWorker(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Worker") return res.status(403).json({ msg: "Forbidden" });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// 🔐 Middleware to allow both Doctor and Worker
function verifyDoctorOrWorker(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Worker" && decoded.role !== "Doctor")
      return res.status(403).json({ msg: "Forbidden" });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// ➕ POST: Add new patient (Worker only)
router.post("/", verifyWorker, async (req, res) => {
  const newPatient = new Patient({ ...req.body, assignedWorker: req.userId });
  await newPatient.save();
  res.status(201).json({ msg: "Patient added" });
});

// 📄 GET: My patients (Worker only)
router.get("/my", verifyWorker, async (req, res) => {
  const patients = await Patient.find({ assignedWorker: req.userId });
  res.json(patients);
});

// 📄 GET: Specific patient by ID (Doctor or assigned Worker)
router.get("/:id", verifyDoctorOrWorker, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ msg: "Patient not found" });

  if (
    req.userRole === "Worker" &&
    patient.assignedWorker.toString() !== req.userId
  ) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  res.json(patient);
});

// ✍ POST: Log a new visit for a patient (Worker only)
router.post("/:id/log", verifyWorker, async (req, res) => {
  const { visitType, details, geolocation } = req.body;
  const { lat, long } = geolocation;

  const patient = await Patient.findById(req.params.id);
  if (!patient || patient.assignedWorker.toString() !== req.userId)
    return res.status(403).json({ msg: "Not authorized" });

  // 📍 Reverse Geocode
  let locationName = "";
  try {
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.OPENCAGE_API_KEY}`
    );
    locationName = geoRes.data.results[0]?.formatted || "";
  } catch (err) {
    console.error("Reverse geocoding failed:", err.message);
  }

  // ⏰ Follow-up logic
  let nextFollowUp = null;
  const schedule = {
    "ANC": 28,
    "Vaccination": 14,
    "Child Checkup": 30,
  };

  if (schedule[visitType]) {
    nextFollowUp = new Date(Date.now() + schedule[visitType] * 24 * 60 * 60 * 1000);
    patient.nextFollowUp = nextFollowUp;
  }

  // 💾 Add to health logs
  patient.healthLogs.push({
    visitType,
    details,
    geolocation: { lat, long, place: locationName },
    date: new Date(),
  });

  await patient.save();
  res.json({ msg: "Visit logged", place: locationName });
});

// 📊 GET: Worker dashboard stats
// 📊 GET: Worker dashboard stats (with overdue + upcoming reminders)
router.get("/dashboard/stats", verifyWorker, async (req, res) => {
  try {
    const patients = await Patient.find({ assignedWorker: req.userId });
    const totalPatients = patients.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ✅ normalize to 00:00

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // ✅ now it's exactly tomorrow at 00:00

    const overduePatients = [];
    const reminderPatients = [];

    for (let patient of patients) {
      if (!patient.nextFollowUp) continue;

      const followUpDate = new Date(patient.nextFollowUp);
      followUpDate.setHours(0, 0, 0, 0); // ✅ normalize patient date too

      if (followUpDate < today) {
        overduePatients.push(patient);
      } else if (followUpDate.getTime() === tomorrow.getTime()) {
        reminderPatients.push(patient);
      }
    }

    res.json({
      totalPatients,
      upcomingFollowUps: reminderPatients.length,
      overduePatients: overduePatients.map((p) => ({
        _id: p._id,
        name: p.name,
        nextFollowUp: p.nextFollowUp,
      })),
      reminderPatients: reminderPatients.map((p) => ({
        _id: p._id,
        name: p.name,
        nextFollowUp: p.nextFollowUp,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✏ PUT: Edit patient (Worker only)
router.put("/:id", verifyWorker, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient || patient.assignedWorker.toString() !== req.userId)
    return res.status(403).json({ msg: "Not authorized" });

  const allowedFields = ["name", "age", "village", "type"];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      patient[field] = req.body[field];
    }
  });

  await patient.save();
  res.json({ msg: "Patient updated", patient });
});
// 🗑 DELETE: Remove patient (Worker only)
router.delete("/:id", verifyWorker, async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient || patient.assignedWorker.toString() !== req.userId)
    return res.status(403).json({ msg: "Not authorized" });

  await patient.deleteOne();
  res.json({ msg: "Patient deleted" });
});

module.exports = router;