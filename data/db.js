// RailMate - SQLite Database Manager
// Architecture: Node.js Native SQLite (node:sqlite DatabaseSync)
// Mode: SIMULATION & DEMO MODE

const path = require("path");
const fs = require("fs");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");
const { TRAINS, CLASS_CONFIG, calculateFare, getSeatAvailability } = require("./trains");

const DB_PATH = path.join(__dirname, "railmate.sqlite");
const BOOKINGS_JSON = path.join(__dirname, "bookings.json");

let db = null;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    initSchema();
  }
  return db;
}

// Password hashing using Node.js native scrypt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  try {
    const [salt, key] = stored.split(":");
    if (!salt || !key) return false;
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(hash, "hex"));
  } catch (e) {
    return false;
  }
}

function initSchema() {
  // 1. Stations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
    );
  `);

  // 2. Trains table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trains (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_number TEXT UNIQUE NOT NULL,
      train_name TEXT NOT NULL,
      train_type TEXT NOT NULL,
      from_name TEXT NOT NULL,
      to_name TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      total_distance_km INTEGER NOT NULL,
      avg_speed_kmh INTEGER NOT NULL,
      demo_delay_minutes INTEGER DEFAULT 0,
      available_classes TEXT NOT NULL
    );
  `);

  // 3. Train Stops table
  db.exec(`
    CREATE TABLE IF NOT EXISTS train_stops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_number TEXT NOT NULL,
      stop_sequence INTEGER NOT NULL,
      station_code TEXT NOT NULL,
      station_name TEXT NOT NULL,
      distance_km INTEGER NOT NULL,
      scheduled_arrival TEXT NOT NULL,
      scheduled_departure TEXT NOT NULL,
      halt_minutes INTEGER NOT NULL DEFAULT 2,
      platform TEXT NOT NULL DEFAULT '1',
      day INTEGER NOT NULL DEFAULT 1,
      is_major INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (train_number) REFERENCES trains(train_number)
    );
  `);

  // 4. Bookings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pnr TEXT UNIQUE NOT NULL,
      booking_id TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'CONFIRMED',
      train_number TEXT NOT NULL,
      train_name TEXT NOT NULL,
      from_code TEXT NOT NULL,
      from_name TEXT NOT NULL,
      to_code TEXT NOT NULL,
      to_name TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      journey_date TEXT NOT NULL,
      travel_class_code TEXT NOT NULL,
      travel_class_name TEXT NOT NULL,
      distance_km INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      passengers_json TEXT NOT NULL,
      contact_mobile TEXT,
      contact_email TEXT,
      demo_refund_amount INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      cancelled_at TEXT
    );
  `);

  // 5. Users table (Demo Authentication & Profiles)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      mobile TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // 6. Seat Inventory table
  db.exec(`
    CREATE TABLE IF NOT EXISTS seat_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      train_number TEXT NOT NULL,
      travel_class TEXT NOT NULL,
      journey_date TEXT NOT NULL,
      total_seats INTEGER NOT NULL DEFAULT 60,
      booked_seats INTEGER NOT NULL DEFAULT 0,
      UNIQUE(train_number, travel_class, journey_date)
    );
  `);

  seedData();
}

function seedData() {
  const trainCount = db.prepare("SELECT COUNT(*) as count FROM trains").get().count;

  if (trainCount === 0) {
    console.log("[DB] Seeding trains and stations into SQLite...");

    const insertStation = db.prepare(`
      INSERT OR IGNORE INTO stations (code, name, lat, lng)
      VALUES (?, ?, ?, ?)
    `);

    const insertTrain = db.prepare(`
      INSERT OR REPLACE INTO trains (
        train_number, train_name, train_type, from_name, to_name,
        departure_time, arrival_time, total_distance_km, avg_speed_kmh,
        demo_delay_minutes, available_classes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertStop = db.prepare(`
      INSERT INTO train_stops (
        train_number, stop_sequence, station_code, station_name,
        distance_km, scheduled_arrival, scheduled_departure,
        halt_minutes, platform, day, is_major
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    TRAINS.forEach(t => {
      insertTrain.run(
        t.trainNumber,
        t.trainName,
        t.trainType,
        t.from,
        t.to,
        t.departureTime,
        t.arrivalTime,
        t.totalDistanceKm,
        t.avgSpeedKmh,
        t.demoDelayMinutes || 0,
        JSON.stringify(t.availableClasses)
      );

      const totalStops = t.stations.length;
      t.stations.forEach((st, idx) => {
        insertStation.run(st.code, st.name, st.lat, st.lng);
        const isMajor = (idx === 0 || idx === totalStops - 1 || (st.haltMinutes && st.haltMinutes >= 5) || ['NDLS', 'MMCT', 'CSMT', 'HWH', 'MAS', 'PNBE', 'JAT', 'BSB', 'BPL', 'CNB', 'PUNE', 'JL'].includes(st.code)) ? 1 : 0;
        insertStop.run(
          t.trainNumber,
          idx + 1,
          st.code,
          st.name,
          st.distanceKm,
          st.scheduledArrival,
          st.scheduledDeparture,
          st.haltMinutes || (idx === 0 || idx === totalStops - 1 ? 0 : 2),
          st.platform || "1",
          st.day || 1,
          isMajor
        );
      });
    });

    console.log(`[DB] Successfully seeded ${TRAINS.length} trains into SQLite database.`);
  }

  // Seed sample demo user if users table is empty
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (userCount === 0) {
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (mobile, name, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUser.run(
      "9876543210",
      "BLM Shinde",
      "passenger@railmate.local",
      hashPassword("demo123"),
      new Date().toISOString()
    );
    console.log("[DB] Seeded default demo user (Mobile: 9876543210, Password: demo123)");
  }

  // Migrate existing bookings from bookings.json if bookings table is empty
  const bookingCount = db.prepare("SELECT COUNT(*) as count FROM bookings").get().count;
  if (bookingCount === 0 && fs.existsSync(BOOKINGS_JSON)) {
    try {
      const data = JSON.parse(fs.readFileSync(BOOKINGS_JSON, "utf8") || "[]");
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[DB] Migrating ${data.length} existing bookings from JSON to SQLite...`);
        const insertBooking = db.prepare(`
          INSERT OR REPLACE INTO bookings (
            pnr, booking_id, status, train_number, train_name,
            from_code, from_name, to_code, to_name,
            departure_time, arrival_time, journey_date,
            travel_class_code, travel_class_name, distance_km,
            total_amount, passengers_json, contact_mobile, contact_email,
            demo_refund_amount, created_at, cancelled_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        data.forEach(b => {
          insertBooking.run(
            b.pnr,
            b.bookingId || ("RM-" + Date.now().toString().slice(-6)),
            b.status || "CONFIRMED",
            b.train?.number || "",
            b.train?.name || "",
            b.journey?.fromCode || "",
            b.journey?.fromStation || "",
            b.journey?.toCode || "",
            b.journey?.toStation || "",
            b.journey?.departureTime || "",
            b.journey?.arrivalTime || "",
            b.journey?.journeyDate || "",
            b.travelClass?.code || "3A",
            b.travelClass?.name || "AC 3 Tier (3A)",
            b.journey?.distanceKm || 0,
            b.fareSummary?.totalAmount || 0,
            JSON.stringify(b.passengers || []),
            b.contact?.mobile || "9876543210",
            b.contact?.email || "passenger@railmate.local",
            b.demoRefundAmount || 0,
            b.createdAt || new Date().toISOString(),
            b.cancelledAt || null
          );
        });
        console.log(`[DB] Migrated ${data.length} bookings into SQLite.`);
      }
    } catch (e) {
      console.error("[DB] Error migrating bookings.json:", e.message);
    }
  }
}

// ========================================================
// QUERIES: TRAINS & STATIONS
// ========================================================

function getAllTrains() {
  const d = getDb();
  const rows = d.prepare(`
    SELECT t.*,
           (SELECT COUNT(*) FROM train_stops WHERE train_number = t.train_number) as station_count
    FROM trains t
    ORDER BY t.train_number ASC
  `).all();

  return rows.map(r => ({
    trainNumber: r.train_number,
    trainName: r.train_name,
    trainType: r.train_type,
    from: r.from_name,
    to: r.to_name,
    departureTime: r.departure_time,
    arrivalTime: r.arrival_time,
    totalDistanceKm: r.total_distance_km,
    avgSpeedKmh: r.avg_speed_kmh,
    demoDelayMinutes: r.demo_delay_minutes,
    stationCount: r.station_count,
    availableClasses: JSON.parse(r.available_classes || "[]")
  }));
}

function getTrainByNumber(trainNo) {
  const d = getDb();
  const t = d.prepare("SELECT * FROM trains WHERE train_number = ?").get(String(trainNo).trim());
  if (!t) return null;

  const stops = d.prepare(`
    SELECT ts.*, s.lat, s.lng
    FROM train_stops ts
    JOIN stations s ON ts.station_code = s.code
    WHERE ts.train_number = ?
    ORDER BY ts.stop_sequence ASC
  `).all(t.train_number);

  return {
    trainNumber: t.train_number,
    trainName: t.train_name,
    trainType: t.train_type,
    from: t.from_name,
    to: t.to_name,
    departureTime: t.departure_time,
    arrivalTime: t.arrival_time,
    totalDistanceKm: t.total_distance_km,
    avgSpeedKmh: t.avg_speed_kmh,
    demoDelayMinutes: t.demo_delay_minutes,
    availableClasses: JSON.parse(t.available_classes || "[]"),
    stations: stops.map((s, idx) => ({
      stopSequence: s.stop_sequence,
      code: s.station_code,
      name: s.station_name,
      lat: s.lat,
      lng: s.lng,
      distanceKm: s.distance_km,
      scheduledArrival: s.scheduled_arrival,
      scheduledDeparture: s.scheduled_departure,
      haltMinutes: s.halt_minutes,
      platform: s.platform || "1",
      day: s.day,
      isMajor: Boolean(s.is_major || idx === 0 || idx === stops.length - 1)
    }))
  };
}

function searchTrains(query) {
  if (!query) return [];
  const q = `%${query.trim().toLowerCase()}%`;
  const d = getDb();

  const rows = d.prepare(`
    SELECT DISTINCT t.*
    FROM trains t
    LEFT JOIN train_stops ts ON t.train_number = ts.train_number
    WHERE LOWER(t.train_number) LIKE ?
       OR LOWER(t.train_name) LIKE ?
       OR LOWER(t.from_name) LIKE ?
       OR LOWER(t.to_name) LIKE ?
       OR LOWER(ts.station_name) LIKE ?
       OR LOWER(ts.station_code) LIKE ?
    ORDER BY t.train_number ASC
  `).all(q, q, q, q, q, q);

  return rows.map(r => getTrainByNumber(r.train_number)).filter(Boolean);
}

function getAllStationsList() {
  const d = getDb();
  return d.prepare("SELECT code, name, lat, lng FROM stations ORDER BY name ASC").all();
}

function getTrainsForStation(query) {
  if (!query) return [];
  const q = `%${query.trim().toLowerCase()}%`;
  const d = getDb();

  const rows = d.prepare(`
    SELECT DISTINCT t.train_number
    FROM trains t
    JOIN train_stops ts ON t.train_number = ts.train_number
    WHERE LOWER(ts.station_code) LIKE ?
       OR LOWER(ts.station_name) LIKE ?
    ORDER BY t.train_number ASC
  `).all(q, q);

  return rows.map(r => getTrainByNumber(r.train_number)).filter(Boolean);
}

function findTrainsBetweenStations(fromQuery, toQuery, travelClass, journeyDate) {
  if (!fromQuery || !toQuery) return [];
  const fromClean = fromQuery.trim().toLowerCase();
  const toClean = toQuery.trim().toLowerCase();

  const all = getAllTrains();
  const results = [];

  all.forEach(trainSummary => {
    const fullTrain = getTrainByNumber(trainSummary.trainNumber);
    if (!fullTrain) return;

    const fromIdx = fullTrain.stations.findIndex(st =>
      st.code.toLowerCase() === fromClean || st.name.toLowerCase().includes(fromClean)
    );
    const toIdx = fullTrain.stations.findIndex(st =>
      st.code.toLowerCase() === toClean || st.name.toLowerCase().includes(toClean)
    );

    if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
      const fromSt = fullTrain.stations[fromIdx];
      const toSt = fullTrain.stations[toIdx];
      const distanceKm = toSt.distanceKm - fromSt.distanceKm;

      let classes = fullTrain.availableClasses;
      if (travelClass && travelClass !== "ALL" && classes.includes(travelClass)) {
        classes = [travelClass];
      } else if (travelClass && travelClass !== "ALL" && !classes.includes(travelClass)) {
        return;
      }

      const classFares = classes.map(cls => {
        const fare = calculateFare(cls, distanceKm);
        const inv = getSeatInventory(fullTrain.trainNumber, cls, journeyDate || "Today");
        return {
          ...fare,
          availability: {
            badge: `${inv.status} - ${inv.availableSeats}`,
            color: inv.availableSeats > 10 ? "#16a34a" : (inv.availableSeats > 0 ? "#d97706" : "#dc2626"),
            availableCount: inv.availableSeats,
            totalSeats: inv.totalSeats,
            bookedSeats: inv.bookedSeats
          }
        };
      });

      const segmentStations = fullTrain.stations.slice(fromIdx, toIdx + 1).map((st, i) => ({
        stopSequence: i + 1,
        code: st.code,
        name: st.name,
        distanceFromOriginKm: st.distanceKm - fromSt.distanceKm,
        totalDistanceKm: st.distanceKm,
        scheduledArrival: st.scheduledArrival,
        scheduledDeparture: st.scheduledDeparture,
        haltMinutes: st.haltMinutes || (i === 0 || i === (toIdx - fromIdx) ? 0 : 2),
        platform: st.platform || "1",
        day: st.day,
        isMajor: st.isMajor
      }));

      // Calculate approximate journey duration
      const durationHours = (distanceKm / fullTrain.avgSpeedKmh).toFixed(1);

      results.push({
        trainNumber: fullTrain.trainNumber,
        trainName: fullTrain.trainName,
        trainType: fullTrain.trainType,
        fromStation: fromSt,
        toStation: toSt,
        departureTime: fromSt.scheduledDeparture,
        arrivalTime: toSt.scheduledArrival,
        distanceKm,
        durationHours,
        classes: classFares,
        intermediateStations: segmentStations,
        intermediateStopsCount: segmentStations.length
      });
    }
  });

  return results;
}

// ========================================================
// SEAT INVENTORY MANAGEMENT (Real DB Inventory tracking)
// ========================================================

function getSeatInventory(trainNumber, travelClass, journeyDate) {
  const d = getDb();
  const dateStr = journeyDate || new Date().toISOString().split("T")[0];

  let row = d.prepare(`
    SELECT * FROM seat_inventory
    WHERE train_number = ? AND travel_class = ? AND journey_date = ?
  `).get(trainNumber, travelClass, dateStr);

  if (!row) {
    // Initialize default inventory: 54 seats total, seed initial booked count deterministically
    const baseHash = (trainNumber.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + travelClass.charCodeAt(0)) % 100;
    const initialBooked = Math.min(48, Math.max(4, Math.floor(baseHash / 2.2)));
    const totalSeats = 54;

    d.prepare(`
      INSERT OR IGNORE INTO seat_inventory (train_number, travel_class, journey_date, total_seats, booked_seats)
      VALUES (?, ?, ?, ?, ?)
    `).run(trainNumber, travelClass, dateStr, totalSeats, initialBooked);

    row = {
      train_number: trainNumber,
      travel_class: travelClass,
      journey_date: dateStr,
      total_seats: totalSeats,
      booked_seats: initialBooked
    };
  }

  const available = Math.max(0, row.total_seats - row.booked_seats);
  let status = "AVAILABLE";
  if (available === 0) status = "WL";
  else if (available <= 6) status = "RAC";

  return {
    trainNumber: row.train_number,
    travelClass: row.travel_class,
    journeyDate: row.journey_date,
    totalSeats: row.total_seats,
    bookedSeats: row.booked_seats,
    availableSeats: available,
    status
  };
}

function updateSeatInventoryOnBooking(trainNumber, travelClass, journeyDate, count = 1) {
  const d = getDb();
  const inv = getSeatInventory(trainNumber, travelClass, journeyDate);
  const newBooked = inv.bookedSeats + count;

  d.prepare(`
    UPDATE seat_inventory
    SET booked_seats = ?
    WHERE train_number = ? AND travel_class = ? AND journey_date = ?
  `).run(newBooked, trainNumber, travelClass, inv.journeyDate);

  return getSeatInventory(trainNumber, travelClass, journeyDate);
}

function restoreSeatInventoryOnCancel(trainNumber, travelClass, journeyDate, count = 1) {
  const d = getDb();
  const inv = getSeatInventory(trainNumber, travelClass, journeyDate);
  const newBooked = Math.max(0, inv.bookedSeats - count);

  d.prepare(`
    UPDATE seat_inventory
    SET booked_seats = ?
    WHERE train_number = ? AND travel_class = ? AND journey_date = ?
  `).run(newBooked, trainNumber, travelClass, inv.journeyDate);

  return getSeatInventory(trainNumber, travelClass, journeyDate);
}

// ========================================================
// PLATFORM LOCATOR & FARE CHART
// ========================================================

function getPlatformInfo(trainQuery, stationQuery) {
  let train = null;
  if (trainQuery) {
    train = getTrainByNumber(trainQuery) || searchTrains(trainQuery)[0];
  }
  if (!train) return null;

  const sQuery = (stationQuery || "").trim().toLowerCase();
  const stop = train.stations.find(st =>
    st.code.toLowerCase() === sQuery || st.name.toLowerCase().includes(sQuery)
  );

  if (!stop) {
    return {
      found: false,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      message: `Train ${train.trainNumber} does not have a scheduled halt at "${stationQuery}".`
    };
  }

  const simulatedDelay = train.demoDelayMinutes === 0 ? "On Time" : `${train.demoDelayMinutes} mins late`;
  return {
    found: true,
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    trainType: train.trainType,
    stationName: stop.name,
    stationCode: stop.code,
    platform: stop.platform || "1",
    scheduledArrival: stop.scheduledArrival,
    scheduledDeparture: stop.scheduledDeparture,
    haltMinutes: stop.haltMinutes,
    day: stop.day,
    status: simulatedDelay,
    note: `Expected on Platform ${stop.platform || "1"}. Foot overbridges and digital coach display boards are available near Coach B2/S4.`,
    lastUpdated: "Just now (Live Simulated)"
  };
}

function getFareChart(trainQuery, fromQuery, toQuery, passengerCount = 1) {
  let train = null;
  if (trainQuery) {
    train = getTrainByNumber(trainQuery) || searchTrains(trainQuery)[0];
  }
  if (!train) return null;

  const fromClean = (fromQuery || train.stations[0].code).trim().toLowerCase();
  const toClean = (toQuery || train.stations[train.stations.length - 1].code).trim().toLowerCase();

  const fromIdx = train.stations.findIndex(st => st.code.toLowerCase() === fromClean || st.name.toLowerCase().includes(fromClean));
  const toIdx = train.stations.findIndex(st => st.code.toLowerCase() === toClean || st.name.toLowerCase().includes(toClean));

  const startSt = (fromIdx !== -1) ? train.stations[fromIdx] : train.stations[0];
  const endSt = (toIdx !== -1 && toIdx > fromIdx) ? train.stations[toIdx] : train.stations[train.stations.length - 1];
  const distanceKm = Math.max(50, endSt.distanceKm - startSt.distanceKm);

  const fares = train.availableClasses.map(cls => {
    const f = calculateFare(cls, distanceKm);
    const count = Math.max(1, parseInt(passengerCount, 10) || 1);
    return {
      classCode: cls,
      className: f.className,
      baseFare: f.baseFare,
      reservationFee: f.reservationFee,
      superfastCharge: f.superfastCharge,
      gst: f.gst,
      farePerPassenger: f.totalFare,
      passengerCount: count,
      totalFare: f.totalFare * count
    };
  });

  return {
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    fromStation: startSt.name,
    fromCode: startSt.code,
    toStation: endSt.name,
    toCode: endSt.code,
    distanceKm,
    fares,
    disclaimer: "All fares are simulated estimates based on Indian Railways distance tariff; no real payment occurs."
  };
}

// ========================================================
// DEMO USER AUTHENTICATION & PROFILES
// ========================================================

function registerUser(name, mobile, email, password) {
  const d = getDb();
  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  if (!cleanMobile || cleanMobile.length < 10) {
    throw new Error("Please enter a valid 10-digit mobile number.");
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const existing = d.prepare("SELECT id FROM users WHERE mobile = ?").get(cleanMobile);
  if (existing) {
    throw new Error("An account already exists with this mobile number. Please log in.");
  }

  const hash = hashPassword(password);
  const now = new Date().toISOString();

  d.prepare(`
    INSERT INTO users (mobile, name, email, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(cleanMobile, (name || "Demo Traveler").trim(), (email || "").trim(), hash, now);

  return {
    mobile: cleanMobile,
    name: (name || "Demo Traveler").trim(),
    email: (email || "").trim(),
    createdAt: now
  };
}

function loginUser(mobile, password) {
  const d = getDb();
  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  const user = d.prepare("SELECT * FROM users WHERE mobile = ?").get(cleanMobile);

  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new Error("Invalid mobile number or password.");
  }

  return {
    mobile: user.mobile,
    name: user.name,
    email: user.email,
    createdAt: user.created_at
  };
}

function getUserProfile(mobile) {
  const d = getDb();
  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  const user = d.prepare("SELECT mobile, name, email, created_at FROM users WHERE mobile = ?").get(cleanMobile);
  if (!user) return null;

  const bookings = getUserBookings(cleanMobile);
  return {
    ...user,
    bookingsCount: bookings.length,
    bookings
  };
}

function getUserBookings(mobile) {
  const cleanMobile = String(mobile || "").replace(/\D/g, "");
  const all = getAllBookings();
  return all.filter(b => (b.contact?.mobile || "").replace(/\D/g, "") === cleanMobile);
}

// ========================================================
// BOOKINGS & PNR QUERIES
// ========================================================

function getAllBookings() {
  const d = getDb();
  const rows = d.prepare("SELECT * FROM bookings ORDER BY id DESC").all();

  return rows.map(r => ({
    pnr: r.pnr,
    bookingId: r.booking_id,
    status: r.status,
    isDemo: true,
    demoNotice: "DEMO BOOKING ONLY — NOT A REAL RAILWAY TICKET. NO REAL RESERVATION OR PAYMENT IS MADE.",
    createdAt: r.created_at,
    cancelledAt: r.cancelled_at,
    demoRefundAmount: r.demo_refund_amount,
    train: {
      number: r.train_number,
      name: r.train_name
    },
    journey: {
      fromStation: r.from_name,
      fromCode: r.from_code,
      toStation: r.to_name,
      toCode: r.to_code,
      departureTime: r.departure_time,
      arrivalTime: r.arrival_time,
      journeyDate: r.journey_date,
      distanceKm: r.distance_km
    },
    travelClass: {
      code: r.travel_class_code,
      name: r.travel_class_name
    },
    passengers: JSON.parse(r.passengers_json || "[]"),
    fareSummary: {
      totalAmount: r.total_amount
    },
    contact: {
      mobile: r.contact_mobile,
      email: r.contact_email
    }
  }));
}

function getBookingByPnr(pnr) {
  const search = pnr.replace(/\D/g, "");
  const all = getAllBookings();
  const booking = all.find(b => b.pnr.replace(/\D/g, "") === search) || null;
  if (!booking) return null;

  // Add simulated live tracking & chart status
  const train = getTrainByNumber(booking.train.number);
  const simulatedDelay = train ? (train.demoDelayMinutes === 0 ? "On Time" : `${train.demoDelayMinutes} mins late`) : "On Time";

  return {
    ...booking,
    chartStatus: "CHART PREPARED (SIMULATED)",
    simulatedCurrentStatus: booking.status === "CANCELLED" ? "CANCELLED - REFUND PROCESSED" : "CONFIRMED (CNF)",
    simulatedDelay
  };
}

function createBooking(b) {
  const d = getDb();
  d.prepare(`
    INSERT INTO bookings (
      pnr, booking_id, status, train_number, train_name,
      from_code, from_name, to_code, to_name,
      departure_time, arrival_time, journey_date,
      travel_class_code, travel_class_name, distance_km,
      total_amount, passengers_json, contact_mobile, contact_email,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    b.pnr,
    b.bookingId,
    b.status || "CONFIRMED",
    b.train.number,
    b.train.name,
    b.journey.fromCode,
    b.journey.fromStation,
    b.journey.toCode,
    b.journey.toStation,
    b.journey.departureTime,
    b.journey.arrivalTime,
    b.journey.journeyDate,
    b.travelClass.code,
    b.travelClass.name,
    b.journey.distanceKm,
    b.fareSummary.totalAmount,
    JSON.stringify(b.passengers),
    b.contact?.mobile || "9876543210",
    b.contact?.email || "passenger@railmate.local",
    b.createdAt || new Date().toISOString()
  );

  // Update real seat inventory
  try {
    updateSeatInventoryOnBooking(b.train.number, b.travelClass.code, b.journey.journeyDate, b.passengers.length);
  } catch (e) {}

  // Sync to bookings.json for file-based inspection
  try {
    const list = getAllBookings();
    fs.writeFileSync(BOOKINGS_JSON, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {}

  return b;
}

function cancelBooking(pnr) {
  const d = getDb();
  const search = pnr.replace(/\D/g, "");
  const row = d.prepare("SELECT * FROM bookings WHERE REPLACE(pnr, '-', '') = ?").get(search);

  if (!row) return null;
  if (row.status === "CANCELLED") {
    return { alreadyCancelled: true, booking: getBookingByPnr(pnr) };
  }

  const cancelFee = Math.round(row.total_amount * 0.15);
  const refundAmt = row.total_amount - cancelFee;
  const now = new Date().toISOString();

  d.prepare(`
    UPDATE bookings
    SET status = 'CANCELLED',
        demo_refund_amount = ?,
        cancelled_at = ?
    WHERE id = ?
  `).run(refundAmt, now, row.id);

  // Restore real seat inventory
  try {
    const pCount = JSON.parse(row.passengers_json || "[]").length || 1;
    restoreSeatInventoryOnCancel(row.train_number, row.travel_class_code, row.journey_date, pCount);
  } catch (e) {}

  // Sync to bookings.json
  try {
    const list = getAllBookings();
    fs.writeFileSync(BOOKINGS_JSON, JSON.stringify(list, null, 2), "utf8");
  } catch (e) {}

  return {
    alreadyCancelled: false,
    demoRefundAmount: refundAmt,
    booking: getBookingByPnr(pnr)
  };
}

module.exports = {
  getDb,
  getAllTrains,
  getTrainByNumber,
  searchTrains,
  getAllStationsList,
  getTrainsForStation,
  findTrainsBetweenStations,
  getSeatInventory,
  updateSeatInventoryOnBooking,
  restoreSeatInventoryOnCancel,
  getPlatformInfo,
  getFareChart,
  registerUser,
  loginUser,
  getUserProfile,
  getUserBookings,
  getAllBookings,
  getBookingByPnr,
  createBooking,
  cancelBooking
};
