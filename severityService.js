// ============================================================
// LIFELINK — Severity Analysis Service
// Classifies emergency text into RED / YELLOW / GREEN
// Uses keyword matching — replace with OpenAI call in production
// ============================================================

// Keywords mapped to severity levels
// RED = life-threatening, immediate danger
// YELLOW = urgent but not immediately life-threatening
// GREEN = stable, non-critical

const RED_KEYWORDS = [
  "unconscious", "not breathing", "no pulse", "cardiac arrest",
  "heart attack", "stroke", "bleeding heavily", "severe bleeding",
  "critical", "dying", "collapsed", "unresponsive", "head injury",
  "chest pain", "cannot breathe", "choking", "severe burn",
  "major accident", "high fall", "gunshot", "stabbed", "seizure"
];

const YELLOW_KEYWORDS = [
  "broken bone", "fracture", "moderate pain", "vomiting", "fever",
  "breathless", "dizzy", "unconscious briefly", "mild bleeding",
  "sprain", "allergy", "bite", "infection", "swelling", "fainted"
];

// GREEN = everything else (stable, minor)

// ------------------------------------------------------------
// Specialty mapping — what kind of hospital does this need?
// ------------------------------------------------------------
const SPECIALTY_MAP = {
  RED: {
    "cardiac arrest": "cardiac",
    "heart attack": "cardiac",
    "stroke": "neuro",
    "head injury": "neuro",
    "bleeding": "trauma",
    "accident": "trauma",
    "burn": "burns",
    "seizure": "neuro",
    "default": "icu"
  },
  YELLOW: {
    "fracture": "orthopedic",
    "broken": "orthopedic",
    "burn": "burns",
    "default": "general"
  },
  GREEN: {
    "default": "general"
  }
};

// ------------------------------------------------------------
// Main severity classification function
// Input: emergency description string
// Output: { severity, neededSpecialty, summary }
// ------------------------------------------------------------
function analyzeSeverity(description) {
  const text = description.toLowerCase();

  // Check RED first (most critical)
  const isRed = RED_KEYWORDS.some((kw) => text.includes(kw));
  if (isRed) {
    return {
      severity: "RED",
      neededSpecialty: detectSpecialty(text, "RED"),
      summary: buildSummary(description, "RED")
    };
  }

  // Check YELLOW
  const isYellow = YELLOW_KEYWORDS.some((kw) => text.includes(kw));
  if (isYellow) {
    return {
      severity: "YELLOW",
      neededSpecialty: detectSpecialty(text, "YELLOW"),
      summary: buildSummary(description, "YELLOW")
    };
  }

  // Default to GREEN
  return {
    severity: "GREEN",
    neededSpecialty: "general",
    summary: buildSummary(description, "GREEN")
  };
}

// Detect which hospital specialty is needed
function detectSpecialty(text, severity) {
  const map = SPECIALTY_MAP[severity];
  for (const [keyword, specialty] of Object.entries(map)) {
    if (keyword !== "default" && text.includes(keyword)) {
      return specialty;
    }
  }
  return map["default"];
}

// Build a human-readable structured summary
function buildSummary(description, severity) {
  const severityLabels = {
    RED: "CRITICAL — Immediate intervention required",
    YELLOW: "URGENT — Prompt medical attention needed",
    GREEN: "STABLE — Non-emergency medical care needed"
  };
  return `${severityLabels[severity]}. Patient report: "${description.trim()}"`;
}

module.exports = { analyzeSeverity };
