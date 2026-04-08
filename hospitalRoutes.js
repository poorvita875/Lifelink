// ============================================================
// LIFELINK — Hospital Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { getAllHospitals, getHospitalById } = require("../controllers/hospitalController");

// GET /hospitals — All hospitals with live status
router.get("/hospitals", getAllHospitals);

// GET /hospitals/:id — Single hospital status
router.get("/hospitals/:id", getHospitalById);

module.exports = router;
