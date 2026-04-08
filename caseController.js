// ============================================================
// LIFELINK — Emergency Case Controller
// Handles POST /create-case and GET /case/:id
// Orchestrates severity analysis + AERA + storage
// ============================================================

const { analyzeSeverity } = require("../services/severityService");
const { runAERA } = require("../services/aeraService");
const { saveCase, getCase, getAllCases } = require("../services/firebaseService");
const { generateCaseId, logCase } = require("../utils/helpers");

// ------------------------------------------------------------
// POST /create-case
// Main entry point — creates a full emergency case
// ------------------------------------------------------------
async function createCase(req, res) {
  try {
    const { description, location } = req.body;

    // --- Validate input ---
    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid emergency description (min 5 characters)"
      });
    }

    // --- Step 1: Parse location ---
    // Accept { lat, lng } object OR default to Bengaluru center for testing
    const patientCoords = parseLocation(location);

    // --- Step 2: Analyze severity using keyword intelligence ---
    const { severity, neededSpecialty, summary } = analyzeSeverity(description);

    // --- Step 3: Run AERA to find best hospital ---
    const aeraResult = runAERA(patientCoords, severity, neededSpecialty);

    // --- Step 4: Generate unique case ID ---
    const caseId = generateCaseId(severity);

    // --- Step 5: Build full case object ---
    const caseData = {
      caseId,
      description: description.trim(),
      severity,
      neededSpecialty,
      summary,
      location: patientCoords,
      selectedHospital: aeraResult.hospital,
      hospitalSelectionReason: aeraResult.reason,
      allHospitalsEvaluated: aeraResult.allHospitalsEvaluated,
      timestamp: new Date().toISOString(),
      status: "ACTIVE",
      // QR URL — frontend will use this to generate the QR code
      qrUrl: `${process.env.BASE_URL || "http://localhost:3000"}/case/${caseId}`
    };

    // --- Step 6: Save to Firebase / in-memory ---
    await saveCase(caseData);

    // --- Step 7: Log for audit trail ---
    logCase(caseData);

    console.log(`🚨 NEW CASE: ${caseId} | Severity: ${severity} | Hospital: ${aeraResult.hospital.name}`);

    // --- Return response ---
    return res.status(201).json({
      success: true,
      message: "Emergency case created successfully",
      data: caseData
    });

  } catch (error) {
    console.error("❌ Error creating case:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again."
    });
  }
}

// ------------------------------------------------------------
// GET /case/:id
// Retrieves full case details — used when QR code is scanned
// ------------------------------------------------------------
async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    const caseData = await getCase(id);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        error: `Case ${id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: caseData
    });

  } catch (error) {
    console.error("❌ Error fetching case:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}

// ------------------------------------------------------------
// GET /cases
// Returns all recent cases — for hospital dashboard
// ------------------------------------------------------------
async function getAllCasesHandler(req, res) {
  try {
    const cases = await getAllCases();
    return res.status(200).json({
      success: true,
      total: cases.length,
      data: cases
    });
  } catch (error) {
    console.error("❌ Error fetching all cases:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
}

// ------------------------------------------------------------
// Helper: Parse location from request body
// Accepts { lat, lng } or defaults to Bengaluru center
// ------------------------------------------------------------
function parseLocation(location) {
  if (location && location.lat && location.lng) {
    return { lat: parseFloat(location.lat), lng: parseFloat(location.lng) };
  }
  // Default: Bengaluru city center (for testing without GPS)
  return { lat: 12.9716, lng: 77.5946 };
}

module.exports = { createCase, getCaseById, getAllCasesHandler };
