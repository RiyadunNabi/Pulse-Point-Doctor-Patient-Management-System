const express = require("express");
const cors = require("cors");
const pool = require("./db/connection");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes
const doctorRoutes = require("./routes/doctorRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const userRoutes = require("./routes/userRoutes");
const patientRoutes = require("./routes/patientRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const drugRoutes = require("./routes/drugRoutes");
const prescriptionDrugRoutes = require("./routes/prescriptionDrugRoutes");
const investigationRoutes = require("./routes/investigationRoutes");
const prescriptionInvestigationRoutes = require("./routes/prescriptionInvestigationRoutes");
const investigationReportRoutes = require("./routes/investigationReportRoutes");
const prescriptionFileRoutes = require("./routes/prescriptionFileRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const bookmarkedDoctorRoutes = require('./routes/bookmarkedDoctorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const healthLogRoutes = require("./routes/healthLogRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const medicalDocumentRoutes = require("./routes/medicalDocumentRoutes");
const healthArticleRoutes = require("./routes/healthArticleRoutes");


app.use("/api/doctors", doctorRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/drugs", drugRoutes);
app.use("/api/prescription-drugs", prescriptionDrugRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/prescription-investigations", prescriptionInvestigationRoutes);
app.use("/api/investigation-reports", investigationReportRoutes);
app.use("/api/prescription-files", prescriptionFileRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/bookmarked-doctors', bookmarkedDoctorRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/health-logs", healthLogRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/medical-documents", medicalDocumentRoutes);
app.use("/api/health-articles", healthArticleRoutes);



app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("✅ Connected to DB. Server time: " + result.rows[0].now);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    res.status(500).send("DB connection failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
