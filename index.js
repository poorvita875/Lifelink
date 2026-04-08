// ============================================================
// LIFELINK — Main Server Entry Point
// AI-Powered Emergency Response Backend
// ============================================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const caseRoutes = require("./routes/caseRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const { initFirebase } = require("./services/firebaseService");

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(cors()); // Allow frontend (Next.js) to call this backend
app.use(express.json()); // Parse JSON request bodies

// ------------------------------------------------------------
// Initialize Firebase on startup
// ------------------------------------------------------------
initFirebase();

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------
app.use("/api", caseRoutes);
app.use("/api", hospitalRoutes);

// ------------------------------------------------------------
// Health Check — confirms backend is running
// ------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    status: "✅ LifeLink Backend is running",
    version: "1.0.0",
    endpoints: {
      createCase: "POST /api/create-case",
      getCase: "GET /api/case/:id",
      getAllCases: "GET /api/cases",
      getHospitals: "GET /api/hospitals",
      getHospital: "GET /api/hospitals/:id"
    }
  });
});

// ------------------------------------------------------------
// 404 Handler
// ------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ------------------------------------------------------------
// Start Server
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 LifeLink Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/`);
  console.log(`🏥 Create case: POST http://localhost:${PORT}/api/create-case`);
});

module.exports = app;
