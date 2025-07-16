const express = require("express");
const mongoose = require("mongoose");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctor");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", patientRoutes);
app.use("/api/doctor", doctorRoutes);

app.listen(process.env.PORT, () => console.log("Server running on port", process.env.PORT));
