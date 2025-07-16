const router = require("express").Router();
const User = require("../models/User");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");

// Middleware to verify doctor
function verifyDoctor(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Doctor") return res.status(403).json({ msg: "Forbidden" });
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Invalid token" });
  }
}

// GET: All workers and their patients
router.get("/workers", verifyDoctor, async (req, res) => {
  try {
    const workers = await User.find({ role: "Worker" });
    const response = [];

    for (const worker of workers) {
      const patients = await Patient.find({ assignedWorker: worker._id });
      response.push({
        workerId: worker._id,
        workerName: worker.name,
        assignedVillage: worker.assignedVillage,
        totalPatients: patients.length,
        patients,
      });
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT: Update doctor note
router.put("/note/:id", verifyDoctor, async (req, res) => {
  try {
    const { note } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { doctorNote: note },
      { new: true }
    );
    res.json({ msg: "Note updated", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update error" });
  }
});

module.exports = router;
