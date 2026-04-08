// ============================================================
// LIFELINK — AERA (Adaptive Emergency Routing Algorithm)
// Custom weighted scoring to select the BEST hospital
// This is NOT random — it uses multi-factor decision logic
// ============================================================

const { haversineDistance } = require("../utils/helpers");
const hospitals = require("../data/hospitals");

// ------------------------------------------------------------
// SCORING WEIGHTS
// Lower score = better hospital (like a cost function)
// ------------------------------------------------------------
const WEIGHTS = {
  distance: 0.4,      // 40% — distance matters most
  responseTime: 0.2,  // 20% — how fast they can respond
  bedAvailability: 0.2, // 20% — no beds = useless
  specialtyMatch: 0.2   // 20% — right hospital for right case
};

// Penalty values
const NO_BED_PENALTY = 10000;    // Hospital with 0 beds gets eliminated
const SPECIALTY_MISMATCH_PENALTY = 5; // Wrong specialty = penalized
const ICU_BONUS = -3;             // ICU hospitals get a bonus for RED cases

// ------------------------------------------------------------
// Main AERA Function
// Input: patientCoords {lat, lng}, severity, neededSpecialty
// Output: { hospital, score, reason }
// ------------------------------------------------------------
function runAERA(patientCoords, severity, neededSpecialty) {
  // Simulate real-time bed availability updates
  const updatedHospitals = simulateLiveUpdates(hospitals);

  const scoredHospitals = updatedHospitals.map((hospital) => {
    const result = scoreHospital(hospital, patientCoords, severity, neededSpecialty);
    return { ...hospital, ...result };
  });

  // Sort by score ascending (lower = better)
  scoredHospitals.sort((a, b) => a.score - b.score);

  const best = scoredHospitals[0];

  return {
    hospital: {
      id: best.id,
      name: best.name,
      contact: best.contact,
      coordinates: best.coordinates,
      availableBeds: best.availableBeds,
      icuBeds: best.icuBeds,
      responseTimeMinutes: best.responseTimeMinutes,
      specialties: best.specialties,
      distanceKm: parseFloat(best.distanceKm.toFixed(2))
    },
    score: best.score,
    reason: best.reason,
    allHospitalsEvaluated: scoredHospitals.map((h) => ({
      name: h.name,
      score: parseFloat(h.score.toFixed(2)),
      distanceKm: parseFloat(h.distanceKm.toFixed(2)),
      available: h.availableBeds > 0
    }))
  };
}

// ------------------------------------------------------------
// Score a single hospital
// ------------------------------------------------------------
function scoreHospital(hospital, patientCoords, severity, neededSpecialty) {
  // --- HARD RULE: No beds = eliminated ---
  if (hospital.availableBeds === 0) {
    return {
      score: NO_BED_PENALTY,
      distanceKm: 0,
      reason: `${hospital.name} eliminated: no available beds`
    };
  }

  // 1. Distance score (normalized: km / 50 to keep it 0-1 range)
  const distanceKm = haversineDistance(patientCoords, hospital.coordinates);
  const distanceScore = (distanceKm / 50) * WEIGHTS.distance;

  // 2. Response time score (normalized: minutes / 30)
  const responseScore = (hospital.responseTimeMinutes / 30) * WEIGHTS.responseTime;

  // 3. Bed availability score (inverse: fewer beds = higher cost)
  const maxBeds = 30;
  const bedScore = (1 - Math.min(hospital.availableBeds, maxBeds) / maxBeds) * WEIGHTS.bedAvailability;

  // 4. Specialty match score
  let specialtyScore = WEIGHTS.specialtyMatch; // default: mismatch
  if (hospital.specialties.includes(neededSpecialty)) {
    specialtyScore = 0; // perfect match = no penalty
  } else if (hospital.specialties.includes("general")) {
    specialtyScore = WEIGHTS.specialtyMatch * 0.5; // partial match
  }

  // 5. RED severity bonus — hospitals with ICU get rewarded
  let icuBonus = 0;
  if (severity === "RED" && hospital.icuBeds > 0) {
    icuBonus = ICU_BONUS;
  }

  const totalScore = distanceScore + responseScore + bedScore + specialtyScore + icuBonus;

  // Build human-readable reason
  const reason = buildReason(hospital, distanceKm, severity, neededSpecialty);

  return { score: totalScore, distanceKm, reason };
}

// ------------------------------------------------------------
// Build a human-readable decision reason string
// This is what gets shown in the UI / demo
// ------------------------------------------------------------
function buildReason(hospital, distanceKm, severity, neededSpecialty) {
  const parts = [];

  parts.push(`Selected ${hospital.name}`);

  if (distanceKm < 5) {
    parts.push("nearest available hospital");
  } else {
    parts.push(`located ${distanceKm.toFixed(1)} km away`);
  }

  if (hospital.specialties.includes(neededSpecialty)) {
    parts.push(`with ${neededSpecialty} capability`);
  }

  if (severity === "RED" && hospital.icuBeds > 0) {
    parts.push(`${hospital.icuBeds} ICU beds available`);
  }

  parts.push(`estimated response time: ${hospital.responseTimeMinutes} min`);
  parts.push(`${hospital.availableBeds} beds available`);

  return parts.join(" — ") + ".";
}

// ------------------------------------------------------------
// Simulate real-time hospital availability updates
// In production: replace with live Firestore data
// ------------------------------------------------------------
function simulateLiveUpdates(hospitalList) {
  return hospitalList.map((h) => {
    // Randomly vary bed count by ±1 to simulate live changes
    const variation = Math.floor(Math.random() * 3) - 1;
    const updatedBeds = Math.max(0, h.availableBeds + variation);
    return { ...h, availableBeds: updatedBeds };
  });
}

module.exports = { runAERA };
