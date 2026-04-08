// ============================================================
// LIFELINK — Mock Hospital Dataset
// Realistic hospital data for Bengaluru, India
// In production, replace with live hospital API / Firestore
// ============================================================

const hospitals = [
  {
    id: "hosp_001",
    name: "Apollo Hospital Bannerghatta",
    coordinates: { lat: 12.8933, lng: 77.5975 },
    availableBeds: 12,
    icuBeds: 5,
    specialties: ["trauma", "cardiac", "neuro", "icu"],
    responseTimeMinutes: 8,
    contact: "+91-80-26304050"
  },
  {
    id: "hosp_002",
    name: "Manipal Hospital Old Airport Road",
    coordinates: { lat: 12.9592, lng: 77.6489 },
    availableBeds: 8,
    icuBeds: 3,
    specialties: ["cardiac", "orthopedic", "icu", "burns"],
    responseTimeMinutes: 12,
    contact: "+91-80-25023456"
  },
  {
    id: "hosp_003",
    name: "Fortis Hospital Cunningham Road",
    coordinates: { lat: 12.9902, lng: 77.5982 },
    availableBeds: 0,
    icuBeds: 0,
    specialties: ["general", "pediatric"],
    responseTimeMinutes: 10,
    contact: "+91-80-66214444"
  },
  {
    id: "hosp_004",
    name: "Narayana Health City",
    coordinates: { lat: 12.8882, lng: 77.6435 },
    availableBeds: 20,
    icuBeds: 8,
    specialties: ["cardiac", "trauma", "icu", "neuro", "burns"],
    responseTimeMinutes: 15,
    contact: "+91-80-71222222"
  },
  {
    id: "hosp_005",
    name: "Victoria Government Hospital",
    coordinates: { lat: 12.9659, lng: 77.5803 },
    availableBeds: 30,
    icuBeds: 2,
    specialties: ["general", "trauma", "pediatric"],
    responseTimeMinutes: 7,
    contact: "+91-80-26703163"
  },
  {
    id: "hosp_006",
    name: "Sakra World Hospital",
    coordinates: { lat: 12.9352, lng: 77.6912 },
    availableBeds: 6,
    icuBeds: 4,
    specialties: ["neuro", "orthopedic", "icu", "cardiac"],
    responseTimeMinutes: 18,
    contact: "+91-80-49694969"
  },
  {
    id: "hosp_007",
    name: "MS Ramaiah Memorial Hospital",
    coordinates: { lat: 13.0143, lng: 77.5565 },
    availableBeds: 15,
    icuBeds: 6,
    specialties: ["trauma", "burns", "icu", "neuro"],
    responseTimeMinutes: 11,
    contact: "+91-80-23605050"
  }
];

module.exports = hospitals;
