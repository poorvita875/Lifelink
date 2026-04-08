// ============================================================
// LIFELINK — Utility Functions
// Haversine distance + case ID generator + logger
// ============================================================

const fs = require("fs");
const path = require("path");

// ------------------------------------------------------------
// Haversine Formula
// Calculates straight-line distance between two GPS coordinates
// Returns distance in kilometers
// ------------------------------------------------------------
function haversineDistance(coord1, coord2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
}

// ------------------------------------------------------------
// Unique Case ID Generator
// Format: LL-RED-2024-XXXX (readable + unique)
// ------------------------------------------------------------
function generateCaseId(severity) {
  const prefix = "LL";
  const sev = severity.toUpperCase();
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `${prefix}-${sev}-${year}-${random}`;
}

// ------------------------------------------------------------
// Case Logger
// Appends each emergency case to a local log file
// ------------------------------------------------------------
function logCase(caseData) {
  const logDir = path.join(__dirname, "../logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const logFile = path.join(logDir, "emergency_log.txt");
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] CASE: ${caseData.caseId} | SEVERITY: ${caseData.severity} | HOSPITAL: ${caseData.selectedHospital?.name}\n`;

  fs.appendFileSync(logFile, entry, "utf8");
}

module.exports = { haversineDistance, generateCaseId, logCase };
