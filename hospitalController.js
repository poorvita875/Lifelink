// ============================================================
// LIFELINK — Hospital Controller
// Handles hospital status and real-time simulation endpoints
// ============================================================

const hospitals = require("../data/hospitals");

// ------------------------------------------------------------
// GET /hospitals
// Returns all hospitals with simulated live availability
// ------------------------------------------------------------
function getAllHospitals(req, res) {
  // Simulate live bed count variations (±1)
  const liveHospitals = hospitals.map((h) => ({
    ...h,
    availableBeds: Math.max(0, h.availableBeds + (Math.floor(Math.random() * 3) - 1)),
    lastUpdated: new Date().toISOString()
  }));

  return res.status(200).json({
    success: true,
    total: liveHospitals.length,
    data: liveHospitals
  });
}

// ------------------------------------------------------------
// GET /hospitals/:id
// Returns a single hospital's current status
// ------------------------------------------------------------
function getHospitalById(req, res) {
  const hospital = hospitals.find((h) => h.id === req.params.id);

  if (!hospital) {
    return res.status(404).json({ success: false, error: "Hospital not found" });
  }

  return res.status(200).json({
    success: true,
    data: {
      ...hospital,
      availableBeds: Math.max(0, hospital.availableBeds + (Math.floor(Math.random() * 3) - 1)),
      lastUpdated: new Date().toISOString()
    }
  });
}

module.exports = { getAllHospitals, getHospitalById };
