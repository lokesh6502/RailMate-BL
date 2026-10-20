// RailMate - Indian Railway Simulation Server
// Creator: Bhavi_LM
// Academic & College Project Demo — SIMULATION MODE

const express = require("express");
const cors = require("cors");
const path = require("path");
const { TRAINS, getAllStations, findTrainsByStation, findTrain } = require("./data/trains");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files directly
app.use(express.static(path.join(__dirname)));

// API: Get all available simulation trains
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
    stationCount: t.stations.length
  }));
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: trainList.length,
    data: trainList
  });
});

// API: Search train by number or name
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

// API: Get all unique stations
app.get("/api/stations", (req, res) => {
  const stations = getAllStations();
  res.json({
    success: true,
    mode: "SIMULATION_DEMO",
    count: stations.length,
    data: stations
  });
});

// API: Search trains stopping at a station
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

// API: Simulation position calculation endpoint
app.get("/api/simulation/:trainNo", (req, res) => {
  const train = findTrain(req.params.trainNo);
  if (!train) {
    return res.status(404).json({ success: false, message: "Train not found" });
  }

  const progress = Math.min(100, Math.max(0, parseFloat(req.query.progress) || 0));
  const stations = train.stations;
  const totalStations = stations.length;

  // Calculate current station segment based on progress %
  const segmentFraction = (progress / 100) * (totalStations - 1);
  const currentIndex = Math.min(Math.floor(segmentFraction), totalStations - 2);
  const nextIndex = currentIndex + 1;
  const subFraction = segmentFraction - currentIndex;

  const currentSt = stations[currentIndex];
  const nextSt = stations[nextIndex];

  // Linear interpolation for latitude and longitude
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

// Fallback to index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log("=================================================");
  console.log("  RailMate — Live Train Tracking Simulation");
  console.log("  Creator: Bhavi_LM");
  console.log("  Mode: SIMULATION MODE (No Paid API Required)");
  console.log(`  Server running at: http://localhost:${PORT}`);
  console.log("=================================================");
});
