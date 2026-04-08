// ============================================================
// LIFELINK — Firebase / Firestore Service
// Handles all database read/write operations
// Falls back to in-memory store if Firebase not configured
// ============================================================

let db = null;
const inMemoryStore = {}; // fallback store for local testing

// ------------------------------------------------------------
// Initialize Firebase
// Reads credentials from environment variables
// If not set up, gracefully falls back to in-memory storage
// ------------------------------------------------------------
function initFirebase() {
  try {
    const admin = require("firebase-admin");

    // Only initialize if not already done
    if (admin.apps.length === 0) {
      // Option A: Use service account JSON file
      // const serviceAccount = require("../serviceAccountKey.json");
      // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

      // Option B: Use environment variable (recommended for deployment)
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
          })
        });
        db = admin.firestore();
        console.log("✅ Firebase Firestore connected");
      } else {
        console.log("⚠️  Firebase not configured — using in-memory store (fine for local testing)");
      }
    }
  } catch (err) {
    console.log("⚠️  Firebase init failed — using in-memory store:", err.message);
  }
}

// ------------------------------------------------------------
// Save a case to Firestore (or in-memory fallback)
// ------------------------------------------------------------
async function saveCase(caseData) {
  if (db) {
    await db.collection("cases").doc(caseData.caseId).set(caseData);
  } else {
    // In-memory fallback
    inMemoryStore[caseData.caseId] = caseData;
  }
}

// ------------------------------------------------------------
// Retrieve a case by ID
// ------------------------------------------------------------
async function getCase(caseId) {
  if (db) {
    const doc = await db.collection("cases").doc(caseId).get();
    if (!doc.exists) return null;
    return doc.data();
  } else {
    return inMemoryStore[caseId] || null;
  }
}

// ------------------------------------------------------------
// Get all cases (for dashboard / admin view)
// ------------------------------------------------------------
async function getAllCases() {
  if (db) {
    const snapshot = await db
      .collection("cases")
      .orderBy("timestamp", "desc")
      .limit(20)
      .get();
    return snapshot.docs.map((doc) => doc.data());
  } else {
    return Object.values(inMemoryStore).reverse();
  }
}

module.exports = { initFirebase, saveCase, getCase, getAllCases };
