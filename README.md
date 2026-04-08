# LifeLink Backend — Setup & API Docs

## Quick Start

```bash
cd backend
npm install
npm run dev     # development with auto-reload
# OR
npm start       # production
```

Backend runs on: http://localhost:5000

---

## API Endpoints

### POST /api/create-case
Create a new emergency case.

**Request:**
```json
{
  "description": "Patient is unconscious and not breathing after a road accident",
  "location": { "lat": 12.9716, "lng": 77.5946 }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "caseId": "LL-RED-2024-4821",
    "severity": "RED",
    "summary": "CRITICAL — Immediate intervention required.",
    "selectedHospital": {
      "name": "Apollo Hospital Bannerghatta",
      "distanceKm": 3.2,
      "responseTimeMinutes": 8,
      "icuBeds": 5
    },
    "hospitalSelectionReason": "Selected Apollo Hospital — nearest available hospital — with icu capability — 5 ICU beds available — estimated response time: 8 min — 12 beds available.",
    "qrUrl": "http://localhost:3000/case/LL-RED-2024-4821",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### GET /api/case/:id
Retrieve case by ID (called when QR is scanned).

```
GET /api/case/LL-RED-2024-4821
```

---

### GET /api/cases
Get all recent cases (for hospital dashboard).

```
GET /api/cases
```

---

### GET /api/hospitals
Get all hospitals with live simulated bed availability.

---

### GET /api/hospitals/:id
Get a single hospital's current status.

---

## Firebase Setup (Optional)

If you want Firebase:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate a new private key → download JSON
3. Copy values into your `.env` file

If Firebase is NOT set up, the backend automatically uses in-memory storage — perfectly fine for the hackathon demo.

---

## Project Structure

```
backend/
├── index.js                    # Server entry point
├── controllers/
│   ├── caseController.js       # Case creation & retrieval
│   └── hospitalController.js   # Hospital status
├── routes/
│   ├── caseRoutes.js
│   └── hospitalRoutes.js
├── services/
│   ├── severityService.js      # RED/YELLOW/GREEN classification
│   ├── aeraService.js          # AERA hospital routing algorithm
│   └── firebaseService.js      # Database operations
├── utils/
│   └── helpers.js              # Haversine, ID generator, logger
├── data/
│   └── hospitals.js            # Mock hospital dataset
└── logs/
    └── emergency_log.txt       # Auto-generated case log
```
