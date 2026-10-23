// RailMate - Indian Railway Simulation & Demo Ticket Booking Server
// Mode: SIMULATION MODE (SQLite Database Active)
// All tracking, schedules, seat inventory, and bookings are simulated demo data.

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const {
  getDb,
  getAllTrains,
  getTrainByNumber,
  searchTrains,
  getAllStationsList,
  getTrainsForStation,
  findTrainsBetweenStations: dbFindTrainsBetweenStations,
  getSeatInventory,
  getPlatformInfo,
  getFareChart,
  registerUser,
  loginUser,
  getUserProfile,
  getUserBookings,
  getAllBookings,
  getBookingByPnr,
  createBooking: dbCreateBooking,
  cancelBooking: dbCancelBooking
} = require("./data/db");

const {
  CLASS_CONFIG,
  calculateFare
} = require("./data/trains");

// Initialize SQLite database schema and seed on boot
getDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files directly
app.use(express.static(path.join(__dirname)));

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
// 1. TRAIN SEARCH & SIMULATION ENDPOINTS
// ==========================================

// Get all trains summary
app.get("/api/trains", (req, res) => {
  try {
    const trainList = getAllTrains();
    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      database: "SQLite",
      count: trainList.length,
      data: trainList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get all trains with full stop lists
app.get("/api/trains/all", (req, res) => {
  try {
    const trainSummaries = getAllTrains();
    const detailed = trainSummaries.map(t => getTrainByNumber(t.trainNumber)).filter(Boolean);
    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      database: "SQLite",
      count: detailed.length,
      data: detailed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search train by query (multi-match for autocomplete & suggestions)
app.get("/api/trains/search/:query", (req, res) => {
  const query = (req.params.query || "").trim();
  if (!query) {
    return res.status(400).json({ success: false, message: "Search query required." });
  }

  const results = searchTrains(query);
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: results.length,
    data: results
  });
});

// Get single train by number or exact match
app.get("/api/train/:query", (req, res) => {
  const query = (req.params.query || "").trim();
  let train = getTrainByNumber(query);

  if (!train) {
    const matches = searchTrains(query);
    if (matches.length > 0) {
      train = matches[0];
    }
  }

  if (!train) {
    return res.status(404).json({
      success: false,
      mode: "SIMULATION_DEMO",
      message: `No simulation train found matching "${query}". Available demo trains: 12951, 22436, 12002, 12301, 11077, 12626, 12004, 20901, 12137, 12259, 12431, 12051.`
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
  try {
    const stations = getAllStationsList();
    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      count: stations.length,
      data: stations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search trains stopping at a station
app.get("/api/station/:query", (req, res) => {
  const query = (req.params.query || "").trim();
  const trains = getTrainsForStation(query);

  if (trains.length === 0) {
    return res.status(404).json({
      success: false,
      mode: "SIMULATION_DEMO",
      message: `No demo trains found stopping at "${query}". Try searching stations like New Delhi (NDLS), Mumbai, Surat, Kota, Bhopal, or Pune.`
    });
  }

  const results = trains.map(t => ({
    trainNumber: t.trainNumber,
    trainName: t.trainName,
    trainType: t.trainType,
    from: t.from,
    to: t.to,
    departureTime: t.departureTime,
    arrivalTime: t.arrivalTime,
    stationCount: t.stations.length
  }));

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    station: query,
    count: results.length,
    data: results
  });
});

// Simulation position calculation
app.get("/api/simulation/:trainNo", (req, res) => {
  const train = getTrainByNumber(req.params.trainNo);
  if (!train) {
    return res.status(404).json({ success: false, message: "Train not found in SQLite database" });
  }

  const progress = Math.min(100, Math.max(0, parseFloat(req.query.progress) || 0));
  const stations = train.stations;
  const totalStations = stations.length;

  const segmentFraction = (progress / 100) * (totalStations - 1);
  const currentIndex = Math.min(Math.floor(segmentFraction), totalStations - 2);
  const nextIndex = currentIndex + 1;
  const previousIndex = Math.max(0, currentIndex);
  const subFraction = segmentFraction - currentIndex;

  const prevSt = stations[previousIndex];
  const currentSt = stations[currentIndex];
  const nextSt = stations[nextIndex];
  const destSt = stations[totalStations - 1];

  const currentLat = currentSt.lat + (nextSt.lat - currentSt.lat) * subFraction;
  const currentLng = currentSt.lng + (nextSt.lng - currentSt.lng) * subFraction;
  const coveredKm = Math.round(currentSt.distanceKm + (nextSt.distanceKm - currentSt.distanceKm) * subFraction);
  const remainingKm = Math.max(0, train.totalDistanceKm - coveredKm);

  // Speed and delay
  const simSpeed = progress >= 100 ? 0 : Math.round(train.avgSpeedKmh + (Math.sin(progress) * 8));
  const simDelay = train.demoDelayMinutes === 0 ? "On Time" : `${train.demoDelayMinutes} mins late`;

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    trainType: train.trainType,
    progressPercent: Math.round(progress),
    coordinates: {
      lat: parseFloat(currentLat.toFixed(5)),
      lng: parseFloat(currentLng.toFixed(5))
    },
    previousStation: prevSt.name,
    previousStationCode: prevSt.code,
    currentStation: currentSt.name,
    currentStationCode: currentSt.code,
    nextStation: nextSt.name,
    nextStationCode: nextSt.code,
    destinationStation: destSt.name,
    destinationStationCode: destSt.code,
    distanceCoveredKm: coveredKm,
    distanceRemainingKm: remainingKm,
    totalDistanceKm: train.totalDistanceKm,
    simulatedSpeedKmh: simSpeed,
    simulatedDelay: simDelay,
    nextStationEta: nextSt.scheduledArrival,
    lastUpdated: "Just now (5s interval)",
    isArrived: progress >= 100
  });
});

// Search trains between stations (Find Trains by Station)
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

  const matches = dbFindTrainsBetweenStations(from, to, travelClass, date);

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

// ==========================================
// 2. PNR STATUS, SEATS, FARES & PLATFORMS
// ==========================================

// PNR Status Demo lookup
app.get("/api/pnr/:pnr", (req, res) => {
  const pnrRaw = req.params.pnr || "";
  const booking = getBookingByPnr(pnrRaw);

  if (!booking) {
    return res.status(404).json({
      success: false,
      mode: "SIMULATION_DEMO",
      message: `No demo booking found with PNR "${pnrRaw}". Try using sample test PNR: 642-1893425 or create a new demo ticket in 'Book Demo Tickets'.`,
      samplePnr: "642-1893425"
    });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: booking
  });
});

// Seat Availability lookup & inventory
app.get("/api/seat-availability", (req, res) => {
  const { trainNumber, travelClass, journeyDate, from, to, passengerCount } = req.query;

  if (!trainNumber) {
    return res.status(400).json({ success: false, message: "Train number is required." });
  }

  const train = getTrainByNumber(trainNumber);
  if (!train) {
    return res.status(404).json({ success: false, message: `Train ${trainNumber} not found.` });
  }

  const cls = travelClass || train.availableClasses[0] || "3A";
  const pCount = Math.max(1, parseInt(passengerCount, 10) || 1);
  const inv = getSeatInventory(train.trainNumber, cls, journeyDate);

  // Calculate fare
  let distanceKm = train.totalDistanceKm;
  if (from && to) {
    const fIdx = train.stations.findIndex(st => st.code.toLowerCase() === from.toLowerCase() || st.name.toLowerCase().includes(from.toLowerCase()));
    const tIdx = train.stations.findIndex(st => st.code.toLowerCase() === to.toLowerCase() || st.name.toLowerCase().includes(to.toLowerCase()));
    if (fIdx !== -1 && tIdx !== -1 && tIdx > fIdx) {
      distanceKm = train.stations[tIdx].distanceKm - train.stations[fIdx].distanceKm;
    }
  }

  const fareObj = calculateFare(cls, distanceKm);
  const totalFare = fareObj.totalFare * pCount;

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      trainType: train.trainType,
      travelClass: cls,
      className: fareObj.className,
      journeyDate: inv.journeyDate,
      totalSeats: inv.totalSeats,
      bookedSeats: inv.bookedSeats,
      availableSeats: inv.availableSeats,
      status: inv.status,
      badge: `${inv.status} - ${inv.availableSeats}`,
      passengerCount: pCount,
      farePerPassenger: fareObj.totalFare,
      totalFare,
      demoNotice: "Simulated seat inventory. Changes dynamically when demo bookings are confirmed or cancelled."
    }
  });
});

// Train Fare Chart comparison
app.get("/api/fare-chart", (req, res) => {
  const { trainNumber, from, to, passengerCount } = req.query;

  if (!trainNumber) {
    return res.status(400).json({ success: false, message: "Train number is required." });
  }

  const chart = getFareChart(trainNumber, from, to, passengerCount);
  if (!chart) {
    return res.status(404).json({ success: false, message: `No fare chart available for train "${trainNumber}".` });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: chart
  });
});

// Platform Locator lookup
app.get("/api/platform-locator", (req, res) => {
  const { trainNumber, station } = req.query;

  if (!trainNumber || !station) {
    return res.status(400).json({ success: false, message: "Both train number and station are required." });
  }

  const info = getPlatformInfo(trainNumber, station);
  if (!info) {
    return res.status(404).json({
      success: false,
      message: `Train "${trainNumber}" not found in database.`
    });
  }

  if (!info.found) {
    return res.status(404).json({
      success: false,
      message: info.message
    });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: info
  });
});

// ==========================================
// 3. DEMO AUTHENTICATION & PROFILES
// ==========================================

// Register demo user
app.post("/api/auth/register", (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;
    const user = registerUser(name, mobile, email, password);
    res.status(201).json({
      success: true,
      mode: "SIMULATION_DEMO",
      message: "Demo account created successfully!",
      user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Login demo user
app.post("/api/auth/login", (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = loginUser(mobile, password);
    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      message: "Login successful!",
      user
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get user profile & history
app.get("/api/auth/profile", (req, res) => {
  const mobile = req.query.mobile;
  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number required." });
  }

  const profile = getUserProfile(mobile);
  if (!profile) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    data: profile
  });
});

// ==========================================
// 4. DEMO TICKET BOOKING & CANCELLATION
// ==========================================

// Create a new Demo Booking in SQLite
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
  const train = getTrainByNumber(trainNumber);
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
      mobile: contactMobile || "9876543210",
      email: contactEmail || "passenger@railmate.local"
    }
  };

  // Persist into SQLite and update seat inventory
  try {
    dbCreateBooking(newBooking);
    res.status(201).json({
      success: true,
      mode: "SIMULATION_DEMO",
      message: "Demo ticket booked successfully!",
      pnr: demoPnr,
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database save error: " + err.message });
  }
});

// Get all Demo Bookings from SQLite
app.get("/api/bookings", (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Demo Booking by PNR from SQLite
app.get("/api/booking/:pnr", (req, res) => {
  try {
    const booking = getBookingByPnr(req.params.pnr);
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
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Cancel a Demo Booking in SQLite
app.post("/api/booking/:pnr/cancel", (req, res) => {
  try {
    const result = dbCancelBooking(req.params.pnr);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No demo booking found with PNR "${req.params.pnr}".`
      });
    }

    if (result.alreadyCancelled) {
      return res.status(400).json({
        success: false,
        message: "This demo ticket has already been cancelled."
      });
    }

    res.json({
      success: true,
      mode: "SIMULATION_DEMO",
      message: `Demo booking PNR ${result.booking.pnr} has been cancelled.`,
      demoRefundAmount: result.demoRefundAmount,
      booking: result.booking
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("=================================================");
  console.log("  RailMate — Live Tracking & Demo Ticket Booking");
  console.log("  Mode: SIMULATION MODE (SQLite Database Active)");
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log("=================================================");
});
