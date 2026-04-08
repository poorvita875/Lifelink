// ============================================================
// LIFELINK — Case Routes
// ============================================================

const express = require("express");
const router = express.Router();
const { createCase, getCaseById, getAllCasesHandler } = require("../controllers/caseController");

// POST /create-case — Create a new emergency case
router.post("/create-case", createCase);

// GET /cases — Get all recent cases (hospital dashboard)
router.get("/cases", getAllCasesHandler);

// GET /case/:id — Get case by ID (used when QR is scanned)
router.get("/case/:id", getCaseById);

module.exports = router;
