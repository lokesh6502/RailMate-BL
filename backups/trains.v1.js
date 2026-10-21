// RailMate - Indian Railways Simulation Dataset
// Author: RailMate
// Academic & Demo Simulation Dataset - No paid external API required

const TRAINS = [
  {
    trainNumber: "12951",
    trainName: "Mumbai Tejas Rajdhani Express",
    trainType: "Tejas Rajdhani",
    from: "Mumbai Central (MMCT)",
    to: "New Delhi (NDLS)",
    departureTime: "17:00",
    arrivalTime: "08:32 (+1 day)",
    totalDistanceKm: 1386,
    avgSpeedKmh: 92,
    demoDelayMinutes: 5,
    stations: [
      { code: "MMCT", name: "Mumbai Central", lat: 18.9696, lng: 72.8193, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "17:00", platform: "1", day: 1 },
      { code: "BVI",  name: "Borivali",       lat: 19.2288, lng: 72.8569, distanceKm: 30, scheduledArrival: "17:22", scheduledDeparture: "17:24", platform: "6", day: 1 },
      { code: "ST",   name: "Surat",          lat: 21.2052, lng: 72.8407, distanceKm: 263, scheduledArrival: "19:43", scheduledDeparture: "19:48", platform: "1", day: 1 },
      { code: "BRC",  name: "Vadodara Jn",    lat: 22.3107, lng: 73.1812, distanceKm: 393, scheduledArrival: "21:06", scheduledDeparture: "21:16", platform: "2", day: 1 },
      { code: "RTM",  name: "Ratlam Jn",      lat: 23.3340, lng: 75.0375, distanceKm: 653, scheduledArrival: "00:25", scheduledDeparture: "00:28", platform: "5", day: 2 },
      { code: "KOTA", name: "Kota Jn",        lat: 25.2217, lng: 75.8754, distanceKm: 920, scheduledArrival: "03:15", scheduledDeparture: "03:20", platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",      lat: 28.6430, lng: 77.2197, distanceKm: 1386, scheduledArrival: "08:32", scheduledDeparture: "Destination", platform: "3", day: 2 }
    ]
  },
  {
    trainNumber: "22436",
    trainName: "Vande Bharat Express",
    trainType: "Vande Bharat",
    from: "New Delhi (NDLS)",
    to: "Varanasi Jn (BSB)",
    departureTime: "06:00",
    arrivalTime: "14:00",
    totalDistanceKm: 759,
    avgSpeedKmh: 95,
    demoDelayMinutes: 0,
    stations: [
      { code: "NDLS", name: "New Delhi",         lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:00", platform: "16", day: 1 },
      { code: "CNB",  name: "Kanpur Central",     lat: 26.4539, lng: 80.3510, distanceKm: 440, scheduledArrival: "10:08", scheduledDeparture: "10:10", platform: "1", day: 1 },
      { code: "PRYJ", name: "Prayagraj Jn",      lat: 25.4484, lng: 81.8335, distanceKm: 634, scheduledArrival: "12:08", scheduledDeparture: "12:10", platform: "6", day: 1 },
      { code: "BSB",  name: "Varanasi Jn",        lat: 25.3284, lng: 82.9868, distanceKm: 759, scheduledArrival: "14:00", scheduledDeparture: "Destination", platform: "1", day: 1 }
    ]
  },
  {
    trainNumber: "12002",
    trainName: "Bhopal Shatabdi Express",
    trainType: "Shatabdi Express",
    from: "New Delhi (NDLS)",
    to: "Rani Kamalapati Bhopal (RKMP)",
    departureTime: "06:00",
    arrivalTime: "14:40",
    totalDistanceKm: 708,
    avgSpeedKmh: 83,
    demoDelayMinutes: 12,
    stations: [
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:00", platform: "1", day: 1 },
      { code: "MTJ",  name: "Mathura Jn",           lat: 27.4924, lng: 77.6737, distanceKm: 141, scheduledArrival: "07:19", scheduledDeparture: "07:20", platform: "1", day: 1 },
      { code: "AGC",  name: "Agra Cantt",           lat: 27.1592, lng: 77.9904, distanceKm: 195, scheduledArrival: "07:50", scheduledDeparture: "07:55", platform: "1", day: 1 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 313, scheduledArrival: "09:23", scheduledDeparture: "09:28", platform: "1", day: 1 },
      { code: "VGLJ", name: "VGL Jhansi Jn",        lat: 25.4484, lng: 78.5685, distanceKm: 410, scheduledArrival: "10:45", scheduledDeparture: "10:50", platform: "1", day: 1 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 702, scheduledArrival: "14:07", scheduledDeparture: "14:12", platform: "1", day: 1 },
      { code: "RKMP", name: "Rani Kamalapati",      lat: 23.2045, lng: 77.4390, distanceKm: 708, scheduledArrival: "14:40", scheduledDeparture: "Destination", platform: "5", day: 1 }
    ]
  },
  {
    trainNumber: "12301",
    trainName: "Howrah Rajdhani Express",
    trainType: "Rajdhani Express",
    from: "Howrah Jn (HWH)",
    to: "New Delhi (NDLS)",
    departureTime: "16:50",
    arrivalTime: "10:05 (+1 day)",
    totalDistanceKm: 1451,
    avgSpeedKmh: 85,
    demoDelayMinutes: 8,
    stations: [
      { code: "HWH",  name: "Howrah Jn",            lat: 22.5839, lng: 88.3433, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "16:50", platform: "9", day: 1 },
      { code: "ASN",  name: "Asansol Jn",           lat: 23.6841, lng: 86.9634, distanceKm: 200, scheduledArrival: "18:57", scheduledDeparture: "19:00", platform: "4", day: 1 },
      { code: "DHN",  name: "Dhanbad Jn",           lat: 23.7957, lng: 86.4304, distanceKm: 259, scheduledArrival: "19:50", scheduledDeparture: "19:55", platform: "3", day: 1 },
      { code: "GAYA", name: "Gaya Jn",              lat: 24.8016, lng: 85.0069, distanceKm: 459, scheduledArrival: "22:19", scheduledDeparture: "22:22", platform: "1", day: 1 },
      { code: "DDU",  name: "Pt Deen Dayal Upadhyaya", lat: 25.2818, lng: 83.1197, distanceKm: 664, scheduledArrival: "00:45", scheduledDeparture: "00:55", platform: "4", day: 2 },
      { code: "PRYJ", name: "Prayagraj Jn",         lat: 25.4484, lng: 81.8335, distanceKm: 816, scheduledArrival: "02:43", scheduledDeparture: "02:45", platform: "1", day: 2 },
      { code: "CNB",  name: "Kanpur Central",        lat: 26.4539, lng: 80.3510, distanceKm: 1010, scheduledArrival: "04:40", scheduledDeparture: "04:45", platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1451, scheduledArrival: "10:05", scheduledDeparture: "Destination", platform: "4", day: 2 }
    ]
  },
  {
    trainNumber: "11077",
    trainName: "Jhelum Express",
    trainType: "Express",
    from: "Pune Jn (PUNE)",
    to: "Jammu Tawi (JAT)",
    departureTime: "17:20",
    arrivalTime: "09:45 (+2 days)",
    totalDistanceKm: 2176,
    avgSpeedKmh: 54,
    demoDelayMinutes: 15,
    stations: [
      { code: "PUNE", name: "Pune Jn",              lat: 18.5289, lng: 73.8744, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "17:20", platform: "3", day: 1 },
      { code: "ANG",  name: "Ahmednagar",           lat: 19.0948, lng: 74.7479, distanceKm: 155, scheduledArrival: "19:57", scheduledDeparture: "20:00", platform: "1", day: 1 },
      { code: "MMR",  name: "Manmad Jn",            lat: 20.2520, lng: 74.4379, distanceKm: 308, scheduledArrival: "23:10", scheduledDeparture: "23:15", platform: "2", day: 1 },
      { code: "JL",   name: "Jalgaon Jn",           lat: 21.0077, lng: 75.5626, distanceKm: 468, scheduledArrival: "01:43", scheduledDeparture: "01:45", platform: "3", day: 2 },
      { code: "BSL",  name: "Bhusawal Jn",          lat: 21.0475, lng: 75.7953, distanceKm: 492, scheduledArrival: "02:15", scheduledDeparture: "02:20", platform: "5", day: 2 },
      { code: "KNW",  name: "Khandwa Jn",           lat: 21.8242, lng: 76.3533, distanceKm: 616, scheduledArrival: "04:32", scheduledDeparture: "04:35", platform: "2", day: 2 },
      { code: "ET",   name: "Itarsi Jn",            lat: 22.6139, lng: 77.7639, distanceKm: 799, scheduledArrival: "07:15", scheduledDeparture: "07:25", platform: "1", day: 2 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 891, scheduledArrival: "08:50", scheduledDeparture: "08:55", platform: "2", day: 2 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 1280, scheduledArrival: "14:40", scheduledDeparture: "14:45", platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1593, scheduledArrival: "21:25", scheduledDeparture: "21:40", platform: "7", day: 2 },
      { code: "JAT",  name: "Jammu Tawi",           lat: 32.7063, lng: 74.8797, distanceKm: 2176, scheduledArrival: "09:45", scheduledDeparture: "Destination", platform: "1", day: 3 }
    ]
  },
  {
    trainNumber: "12626",
    trainName: "Kerala Express",
    trainType: "Superfast",
    from: "New Delhi (NDLS)",
    to: "Thiruvananthapuram Central (TVC)",
    departureTime: "20:10",
    arrivalTime: "19:00 (+2 days)",
    totalDistanceKm: 3036,
    avgSpeedKmh: 65,
    demoDelayMinutes: 20,
    stations: [
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "20:10", platform: "2", day: 1 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 313, scheduledArrival: "00:03", scheduledDeparture: "00:05", platform: "1", day: 2 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 702, scheduledArrival: "05:20", scheduledDeparture: "05:25", platform: "1", day: 2 },
      { code: "NGP",  name: "Nagpur Jn",            lat: 21.1524, lng: 79.0888, distanceKm: 1092, scheduledArrival: "11:45", scheduledDeparture: "11:50", platform: "2", day: 2 },
      { code: "BZA",  name: "Vijayawada Jn",        lat: 16.5173, lng: 80.6206, distanceKm: 1754, scheduledArrival: "21:40", scheduledDeparture: "21:50", platform: "1", day: 2 },
      { code: "KPD",  name: "Katpadi Jn",           lat: 12.9702, lng: 79.1384, distanceKm: 2200, scheduledArrival: "04:40", scheduledDeparture: "04:45", platform: "3", day: 3 },
      { code: "CBE",  name: "Coimbatore Jn",        lat: 11.0016, lng: 76.9628, distanceKm: 2570, scheduledArrival: "10:25", scheduledDeparture: "10:30", platform: "1", day: 3 },
      { code: "ERS",  name: "Ernakulam Jn",         lat: 9.9678,  lng: 76.2925, distanceKm: 2831, scheduledArrival: "15:20", scheduledDeparture: "15:25", platform: "1", day: 3 },
      { code: "TVC",  name: "Thiruvananthapuram",   lat: 8.4875,  lng: 76.9525, distanceKm: 3036, scheduledArrival: "19:00", scheduledDeparture: "Destination", platform: "2", day: 3 }
    ]
  }
];

// Helper: Extract all unique stations across all trains
function getAllStations() {
  const map = new Map();
  TRAINS.forEach(train => {
    train.stations.forEach(st => {
      if (!map.has(st.code)) {
        map.set(st.code, {
          code: st.code,
          name: st.name,
          lat: st.lat,
          lng: st.lng
        });
      }
    });
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Helper: Find trains passing through a station
function findTrainsByStation(stationQuery) {
  const q = stationQuery.toLowerCase().trim();
  return TRAINS.filter(train =>
    train.stations.some(st =>
      st.code.toLowerCase() === q || st.name.toLowerCase().includes(q)
    )
  );
}

// Helper: Find train by number or name
function findTrain(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  return TRAINS.find(train =>
    train.trainNumber === q ||
    train.trainName.toLowerCase().includes(q) ||
    train.trainNumber.includes(q)
  );
}

module.exports = {
  TRAINS,
  getAllStations,
  findTrainsByStation,
  findTrain
};
