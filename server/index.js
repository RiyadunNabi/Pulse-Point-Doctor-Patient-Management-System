const express = require("express");
const cors = require("cors");
const pool = require("./db/connection");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("✅ Connected to DB. Server time: " + result.rows[0].now);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    res.status(500).send("DB connection failed");
  }
});

// ✅ Add this:
const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
