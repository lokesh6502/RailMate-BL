// RailMate - Indian Railway Simulation & Demo Ticket Booking Server
// Creator: Bhavi_LM
// Academic & College Project Demo — SIMULATION MODE

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const {
  TRAINS,
  CLASS_CONFIG,
  getAllStations,
  calculateFare,
  getSeatAvailability,
  findTrainsByStation,
  findTrain,
  findTrainsBetweenStations,
  matchStation
} = require("./data/trains");

const app = express();
const PORT = process.env.PORT || 3000;
const BOOKINGS_FILE = path.join(__dirname, "data", "bookings.json");

app.use(cors());
app.use(express.json());

// Serve static frontend files directly
app.use(express.static(path.join(__dirname)));

// Helper: Read bookings safely
function readBookings() {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      fs.writeFileSync(BOOKINGS_FILE, "[]", "utf8");
      return [];
    }
    const data = fs.readFileSync(BOOKINGS_FILE, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading bookings file:", err.message);
    return [];
  }
}

// Helper: Save bookings safely
function saveBookings(bookings) {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing bookings file:", err.message);
    return false;
  }
}

// Helper: Generate 10-digit Indian Railway format DEMO PNR (e.g. 642-1893425)
function generateDemoPnr() {
  const p1 = Math.floor(100 + Math.random() * 900); // 3 digits
  const p2 = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `${p1}-${p2}`;
}

// Helper: Generate demo Coach and Seat
function assignDemoSeats(travelClass, passengerCount, startSeat = null) {
  const cfg = CLASS_CONFIG[travelClass] || CLASS_CONFIG["SL"];
  const coachNum = Math.floor(Math.random() * 4) + 1;
  const coach = `${cfg.coachPrefix}${coachNum}`;
  const baseSeat = startSeat || (Math.floor(Math.random() * 55) + 1);

  const berthTypes = {
    "1A": ["Cabin Berth", "Coupe Berth"],
    "2A": ["Lower Berth", "Upper Berth", "Side Lower", "Side Upper"],
    "3A": ["Lower Berth", "Middle Berth", "Upper Berth", "Side Lower", "Side Upper"],
    "SL": ["Lower Berth", "Middle Berth", "Upper Berth", "Side Lower", "Side Upper"],
    "EC": ["Window Seat", "Aisle Seat"],
    "CC": ["Window Seat", "Middle Seat", "Aisle Seat"]
  };

  const types = berthTypes[travelClass] || ["Berth"];

  return Array.from({ length: passengerCount }, (_, i) => {
    const seatNo = baseSeat + i;
    const berth = types[i % types.length];
    return {
      coach,
      seatNo,
      berth,
      seatString: `${coach} / Seat ${seatNo} (${berth})`
    };
  });
}

// ==========================================
// 1. SIMULATION & TRACKING ENDPOINTS
// ==========================================

// Get all available simulation trains
app.get("/api/trains", (req, res) => {
  const trainList = TRAINS.map(t => ({
    trainNumber: t.trainNumber,
    trainName: t.trainName,
    trainType: t.trainType,
    from: t.from,
    to: t.to,
    departureTime: t.departureTime,
    arrivalTime: t.arrivalTime,
    totalDistanceKm: t.totalDistanceKm,
    stationCount: t.stations.length,
    availableClasses: t.availableClasses
  }));
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: trainList.length,
    data: trainList
  });
});

// Search train by number or name
app.get("/api/train/:query", (req, res) => {
  const query = req.params.query.trim();
  const train = findTrain(query);

  if (!train) {
    return res.status(404).json({
      success: false,
      mode: "SIMULATION_DEMO",
      message: `No simulation train found matching "${query}". Try searching 12951, 22436, 12002, 12301, 11077, or 12626.`
    });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: train
  });
});

// Get all unique stations
app.get("/api/stations", (req, res) => {
  const stations = getAllStations();
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: stations.length,
    data: stations
  });
});

// Search trains stopping at a station
app.get("/api/station/:query", (req, res) => {
  const query = req.params.query.trim();
  const trains = findTrainsByStation(query);

  if (trains.length === 0) {
    return res.status(404).json({
      success: false,
      mode: "SIMULATION_DEMO",
      message: `No simulation trains found for station "${query}". Try NDLS, Jalgaon, Mumbai, Bhopal, Kanpur, or Pune.`
    });
  }

  const results = trains.map(t => ({
    trainNumber: t.trainNumber,
    trainName: t.trainName,
    trainType: t.trainType,
    from: t.from,
    to: t.to
  }));

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    station: query,
    count: results.length,
    data: results
  });
});

// Simulation position calculation endpoint
app.get("/api/simulation/:trainNo", (req, res) => {
  const train = findTrain(req.params.trainNo);
  if (!train) {
    return res.status(404).json({ success: false, message: "Train not found" });
  }

  const progress = Math.min(100, Math.max(0, parseFloat(req.query.progress) || 0));
  const stations = train.stations;
  const totalStations = stations.length;

  const segmentFraction = (progress / 100) * (totalStations - 1);
  const currentIndex = Math.min(Math.floor(segmentFraction), totalStations - 2);
  const nextIndex = currentIndex + 1;
  const subFraction = segmentFraction - currentIndex;

  const currentSt = stations[currentIndex];
  const nextSt = stations[nextIndex];

  const currentLat = currentSt.lat + (nextSt.lat - currentSt.lat) * subFraction;
  const currentLng = currentSt.lng + (nextSt.lng - currentSt.lng) * subFraction;
  const currentDistance = Math.round(currentSt.distanceKm + (nextSt.distanceKm - currentSt.distanceKm) * subFraction);

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    progressPercent: Math.round(progress),
    coordinates: {
      lat: parseFloat(currentLat.toFixed(5)),
      lng: parseFloat(currentLng.toFixed(5))
    },
    currentStation: currentSt.name,
    currentStationCode: currentSt.code,
    nextStation: nextSt.name,
    nextStationCode: nextSt.code,
    distanceCoveredKm: currentDistance,
    totalDistanceKm: train.totalDistanceKm,
    simulatedSpeedKmh: progress >= 100 ? 0 : Math.round(train.avgSpeedKmh + (Math.sin(progress) * 8)),
    simulatedDelay: train.demoDelayMinutes === 0 ? "On Time" : `${train.demoDelayMinutes} mins late`,
    nextStationEta: nextSt.scheduledArrival,
    isArrived: progress >= 100
  });
});

// ==========================================
// 2. DEMO TICKET BOOKING ENDPOINTS
// ==========================================

// Search trains between stations for booking
app.get("/api/search-trains", (req, res) => {
  const { from, to, date, travelClass } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      success: false,
      message: "Both Origin ('from') and Destination ('to') stations are required."
    });
  }

  if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Origin and Destination stations cannot be the same."
    });
  }

  const matches = findTrainsBetweenStations(from, to, travelClass, date);

  if (matches.length === 0) {
    return res.status(404).json({
      success: false,
      message: `No demo trains found running from "${from}" to "${to}". Try searching routes like "Mumbai" to "New Delhi", "Pune" to "Jalgaon", or "New Delhi" to "Varanasi".`
    });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    from,
    to,
    journeyDate: date || "Today",
    count: matches.length,
    data: matches
  });
});

// Create a new Demo Booking
app.post("/api/bookings", (req, res) => {
  const {
    trainNumber,
    fromCode,
    toCode,
    journeyDate,
    travelClass,
    passengers,
    contactMobile,
    contactEmail
  } = req.body;

  // Validation 1: Required train
  const train = findTrain(trainNumber);
  if (!train) {
    return res.status(400).json({ success: false, message: "Invalid train number selected." });
  }

  // Validation 2: Stations check
  const fromIdx = train.stations.findIndex(st => st.code.toLowerCase() === (fromCode || "").toLowerCase());
  const toIdx = train.stations.findIndex(st => st.code.toLowerCase() === (toCode || "").toLowerCase());

  if (fromIdx === -1 || toIdx === -1) {
    return res.status(400).json({ success: false, message: "Selected stations are not valid stops for this train." });
  }

  if (fromIdx >= toIdx) {
    return res.status(400).json({ success: false, message: "Destination station must be after origin station along the route." });
  }

  // Validation 3: Travel class check
  if (!train.availableClasses.includes(travelClass)) {
    return res.status(400).json({ success: false, message: `Class ${travelClass} is not available on train ${train.trainNumber}.` });
  }

  // Validation 4: Journey Date
  if (!journeyDate) {
    return res.status(400).json({ success: false, message: "Journey date is required." });
  }

  const parsedDate = new Date(journeyDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(parsedDate.getTime()) || parsedDate < today) {
    return res.status(400).json({ success: false, message: "Journey date cannot be in the past." });
  }

  // Validation 5: Passengers array
  if (!Array.isArray(passengers) || passengers.length === 0 || passengers.length > 6) {
    return res.status(400).json({ success: false, message: "Please provide between 1 and 6 passengers." });
  }

  for (let i = 0; i < passengers.length; i++) {
    const p = passengers[i];
    if (!p.name || typeof p.name !== "string" || p.name.trim().length < 2) {
      return res.status(400).json({ success: false, message: `Passenger #${i + 1}: Name must be at least 2 characters.` });
    }
    const age = parseInt(p.age, 10);
    if (isNaN(age) || age < 1 || age > 120) {
      return res.status(400).json({ success: false, message: `Passenger #${i + 1}: Age must be between 1 and 120.` });
    }
    if (!p.gender || !["Male", "Female", "Transgender"].includes(p.gender)) {
      return res.status(400).json({ success: false, message: `Passenger #${i + 1}: Please select a valid gender.` });
    }
  }

  // Calculate fare
  const fromSt = train.stations[fromIdx];
  const toSt = train.stations[toIdx];
  const distanceKm = toSt.distanceKm - fromSt.distanceKm;
  const farePerPassenger = calculateFare(travelClass, distanceKm);
  const totalAmount = farePerPassenger.totalFare * passengers.length;

  // Assign demo seats
  const seatAssignments = assignDemoSeats(travelClass, passengers.length);
  const passengerDetails = passengers.map((p, idx) => ({
    name: p.name.trim(),
    age: parseInt(p.age, 10),
    gender: p.gender,
    berthPreference: p.berthPreference || "No Preference",
    coach: seatAssignments[idx].coach,
    seatNo: seatAssignments[idx].seatNo,
    berth: seatAssignments[idx].berth,
    seatString: seatAssignments[idx].seatString,
    bookingStatus: "CNF"
  }));

  const demoPnr = generateDemoPnr();
  const bookingId = `RM-${Date.now().toString().slice(-6)}`;

  const newBooking = {
    pnr: demoPnr,
    bookingId,
    status: "CONFIRMED",
    isDemo: true,
    demoNotice: "DEMO BOOKING ONLY — NOT A REAL RAILWAY TICKET. NO REAL RESERVATION OR PAYMENT IS MADE.",
    createdAt: new Date().toISOString(),
    train: {
      number: train.trainNumber,
      name: train.trainName,
      type: train.trainType
    },
    journey: {
      fromStation: fromSt.name,
      fromCode: fromSt.code,
      toStation: toSt.name,
      toCode: toSt.code,
      departureTime: fromSt.scheduledDeparture,
      arrivalTime: toSt.scheduledArrival,
      journeyDate,
      distanceKm
    },
    travelClass: {
      code: travelClass,
      name: CLASS_CONFIG[travelClass].name
    },
    passengers: passengerDetails,
    fareSummary: {
      passengerCount: passengers.length,
      farePerPassenger: farePerPassenger.totalFare,
      baseFareTotal: farePerPassenger.baseFare * passengers.length,
      reservationFeeTotal: farePerPassenger.reservationFee * passengers.length,
      superfastChargeTotal: farePerPassenger.superfastCharge * passengers.length,
      gstTotal: farePerPassenger.gst * passengers.length,
      totalAmount
    },
    contact: {
      mobile: contactMobile || "9876543210 (Demo)",
      email: contactEmail || "demo.passenger@railmate.local"
    }
  };

  const bookings = readBookings();
  bookings.unshift(newBooking);
  saveBookings(bookings);

  res.status(201).json({
    success: true,
    mode: "SIMULATION_DEMO",
    message: "Demo ticket booked successfully!",
    pnr: demoPnr,
    booking: newBooking
  });
});

// Get all Demo Bookings
app.get("/api/bookings", (req, res) => {
  const bookings = readBookings();
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: bookings.length,
    data: bookings
  });
});

// Get Demo Booking by PNR
app.get("/api/booking/:pnr", (req, res) => {
  const searchPnr = req.params.pnr.replace(/\D/g, ""); // digits only
  const bookings = readBookings();
  const booking = bookings.find(b => b.pnr.replace(/\D/g, "") === searchPnr);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: `No demo booking found with PNR "${req.params.pnr}".`
    });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: booking
  });
});

// Cancel a Demo Booking
app.post("/api/booking/:pnr/cancel", (req, res) => {
  const searchPnr = req.params.pnr.replace(/\D/g, "");
  const bookings = readBookings();
  const index = bookings.findIndex(b => b.pnr.replace(/\D/g, "") === searchPnr);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `No demo booking found with PNR "${req.params.pnr}".`
    });
  }

  const booking = bookings[index];

  if (booking.status === "CANCELLED") {
    return res.status(400).json({
      success: false,
      message: "This demo ticket has already been cancelled."
    });
  }

  booking.status = "CANCELLED";
  booking.cancelledAt = new Date().toISOString();
  booking.cancellationFee = Math.round(booking.fareSummary.totalAmount * 0.15); // demo 15% cancel fee
  booking.demoRefundAmount = booking.fareSummary.totalAmount - booking.cancellationFee;

  saveBookings(bookings);

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    message: `Demo booking PNR ${booking.pnr} has been cancelled.`,
    demoRefundAmount: booking.demoRefundAmount,
    booking
  });
});

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("=================================================");
  console.log("  RailMate — Live Tracking & Demo Ticket Booking");
  console.log("  Creator: Bhavi_LM");
  console.log("  Mode: SIMULATION MODE (No Paid API Required)");
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log("=================================================");
});
