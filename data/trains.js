// RailMate - Indian Railways Complete Train & Station Dataset
// RailMate - Indian Railways Simulation Dataset
// Academic & Demo Simulation Dataset - No paid external API required

const CLASS_CONFIG = {
  "1A": { name: "First AC (1A)", ratePerKm: 2.8, resFee: 60, minFare: 500, coachPrefix: "H" },
  "2A": { name: "AC 2 Tier (2A)", ratePerKm: 1.75, resFee: 50, minFare: 350, coachPrefix: "A" },
  "3A": { name: "AC 3 Tier (3A)", ratePerKm: 1.18, resFee: 40, minFare: 250, coachPrefix: "B" },
  "SL": { name: "Sleeper (SL)",   ratePerKm: 0.48, resFee: 20, minFare: 120, coachPrefix: "S" },
  "EC": { name: "Exec. Chair Car (EC)", ratePerKm: 2.3, resFee: 50, minFare: 400, coachPrefix: "E" },
  "CC": { name: "AC Chair Car (CC)", ratePerKm: 1.25, resFee: 40, minFare: 200, coachPrefix: "C" }
};

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
    availableClasses: ["1A", "2A", "3A"],
    stations: [
      { code: "MMCT", name: "Mumbai Central", lat: 18.9696, lng: 72.8193, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "17:00", haltMinutes: 0, platform: "1", day: 1 },
      { code: "BVI",  name: "Borivali",       lat: 19.2288, lng: 72.8569, distanceKm: 30, scheduledArrival: "17:22", scheduledDeparture: "17:24", haltMinutes: 2, platform: "6", day: 1 },
      { code: "ST",   name: "Surat",          lat: 21.2052, lng: 72.8407, distanceKm: 263, scheduledArrival: "19:43", scheduledDeparture: "19:48", haltMinutes: 5, platform: "1", day: 1 },
      { code: "BRC",  name: "Vadodara Jn",    lat: 22.3107, lng: 73.1812, distanceKm: 393, scheduledArrival: "21:06", scheduledDeparture: "21:16", haltMinutes: 10, platform: "2", day: 1 },
      { code: "RTM",  name: "Ratlam Jn",      lat: 23.3340, lng: 75.0375, distanceKm: 653, scheduledArrival: "00:25", scheduledDeparture: "00:28", haltMinutes: 3, platform: "5", day: 2 },
      { code: "KOTA", name: "Kota Jn",        lat: 25.2217, lng: 75.8754, distanceKm: 920, scheduledArrival: "03:15", scheduledDeparture: "03:20", haltMinutes: 5, platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",      lat: 28.6430, lng: 77.2197, distanceKm: 1386, scheduledArrival: "08:32", scheduledDeparture: "Destination", haltMinutes: 0, platform: "3", day: 2 }
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
    availableClasses: ["EC", "CC"],
    stations: [
      { code: "NDLS", name: "New Delhi",         lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:00", haltMinutes: 0, platform: "16", day: 1 },
      { code: "CNB",  name: "Kanpur Central",     lat: 26.4539, lng: 80.3510, distanceKm: 440, scheduledArrival: "10:08", scheduledDeparture: "10:10", haltMinutes: 2, platform: "1", day: 1 },
      { code: "PRYJ", name: "Prayagraj Jn",      lat: 25.4484, lng: 81.8335, distanceKm: 634, scheduledArrival: "12:08", scheduledDeparture: "12:10", haltMinutes: 2, platform: "6", day: 1 },
      { code: "BSB",  name: "Varanasi Jn",        lat: 25.3284, lng: 82.9868, distanceKm: 759, scheduledArrival: "14:00", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 1 }
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
    availableClasses: ["EC", "CC"],
    stations: [
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:00", haltMinutes: 0, platform: "1", day: 1 },
      { code: "MTJ",  name: "Mathura Jn",           lat: 27.4924, lng: 77.6737, distanceKm: 141, scheduledArrival: "07:19", scheduledDeparture: "07:20", haltMinutes: 1, platform: "1", day: 1 },
      { code: "AGC",  name: "Agra Cantt",           lat: 27.1592, lng: 77.9904, distanceKm: 195, scheduledArrival: "07:50", scheduledDeparture: "07:55", haltMinutes: 5, platform: "1", day: 1 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 313, scheduledArrival: "09:23", scheduledDeparture: "09:28", haltMinutes: 5, platform: "1", day: 1 },
      { code: "VGLJ", name: "VGL Jhansi Jn",        lat: 25.4484, lng: 78.5685, distanceKm: 410, scheduledArrival: "10:45", scheduledDeparture: "10:50", haltMinutes: 5, platform: "1", day: 1 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 702, scheduledArrival: "14:07", scheduledDeparture: "14:12", haltMinutes: 5, platform: "1", day: 1 },
      { code: "RKMP", name: "Rani Kamalapati",      lat: 23.2045, lng: 77.4390, distanceKm: 708, scheduledArrival: "14:40", scheduledDeparture: "Destination", haltMinutes: 0, platform: "5", day: 1 }
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
    availableClasses: ["1A", "2A", "3A"],
    stations: [
      { code: "HWH",  name: "Howrah Jn",            lat: 22.5839, lng: 88.3433, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "16:50", haltMinutes: 0, platform: "9", day: 1 },
      { code: "ASN",  name: "Asansol Jn",           lat: 23.6841, lng: 86.9634, distanceKm: 200, scheduledArrival: "18:57", scheduledDeparture: "19:00", haltMinutes: 3, platform: "4", day: 1 },
      { code: "DHN",  name: "Dhanbad Jn",           lat: 23.7957, lng: 86.4304, distanceKm: 259, scheduledArrival: "19:50", scheduledDeparture: "19:55", haltMinutes: 5, platform: "3", day: 1 },
      { code: "GAYA", name: "Gaya Jn",              lat: 24.8016, lng: 85.0069, distanceKm: 459, scheduledArrival: "22:19", scheduledDeparture: "22:22", haltMinutes: 3, platform: "1", day: 1 },
      { code: "DDU",  name: "Pt Deen Dayal Upadhyaya", lat: 25.2818, lng: 83.1197, distanceKm: 664, scheduledArrival: "00:45", scheduledDeparture: "00:55", haltMinutes: 10, platform: "4", day: 2 },
      { code: "PRYJ", name: "Prayagraj Jn",         lat: 25.4484, lng: 81.8335, distanceKm: 816, scheduledArrival: "02:43", scheduledDeparture: "02:45", haltMinutes: 2, platform: "1", day: 2 },
      { code: "CNB",  name: "Kanpur Central",        lat: 26.4539, lng: 80.3510, distanceKm: 1010, scheduledArrival: "04:40", scheduledDeparture: "04:45", haltMinutes: 5, platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1451, scheduledArrival: "10:05", scheduledDeparture: "Destination", haltMinutes: 0, platform: "4", day: 2 }
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
    availableClasses: ["2A", "3A", "SL"],
    stations: [
      { code: "PUNE", name: "Pune Jn",              lat: 18.5289, lng: 73.8744, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "17:20", haltMinutes: 0, platform: "3", day: 1 },
      { code: "ANG",  name: "Ahmednagar",           lat: 19.0948, lng: 74.7479, distanceKm: 155, scheduledArrival: "19:57", scheduledDeparture: "20:00", haltMinutes: 3, platform: "1", day: 1 },
      { code: "MMR",  name: "Manmad Jn",            lat: 20.2520, lng: 74.4379, distanceKm: 308, scheduledArrival: "23:10", scheduledDeparture: "23:15", haltMinutes: 5, platform: "2", day: 1 },
      { code: "JL",   name: "Jalgaon Jn",           lat: 21.0077, lng: 75.5626, distanceKm: 468, scheduledArrival: "01:43", scheduledDeparture: "01:45", haltMinutes: 2, platform: "3", day: 2 },
      { code: "BSL",  name: "Bhusawal Jn",          lat: 21.0475, lng: 75.7953, distanceKm: 492, scheduledArrival: "02:15", scheduledDeparture: "02:20", haltMinutes: 5, platform: "5", day: 2 },
      { code: "KNW",  name: "Khandwa Jn",           lat: 21.8242, lng: 76.3533, distanceKm: 616, scheduledArrival: "04:32", scheduledDeparture: "04:35", haltMinutes: 3, platform: "2", day: 2 },
      { code: "ET",   name: "Itarsi Jn",            lat: 22.6139, lng: 77.7639, distanceKm: 799, scheduledArrival: "07:15", scheduledDeparture: "07:25", haltMinutes: 10, platform: "1", day: 2 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 891, scheduledArrival: "08:50", scheduledDeparture: "08:55", haltMinutes: 5, platform: "2", day: 2 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 1280, scheduledArrival: "14:40", scheduledDeparture: "14:45", haltMinutes: 5, platform: "1", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1593, scheduledArrival: "21:25", scheduledDeparture: "21:40", haltMinutes: 15, platform: "7", day: 2 },
      { code: "JAT",  name: "Jammu Tawi",           lat: 32.7063, lng: 74.8797, distanceKm: 2176, scheduledArrival: "09:45", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 3 }
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
    availableClasses: ["2A", "3A", "SL"],
    stations: [
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "20:10", haltMinutes: 0, platform: "2", day: 1 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 313, scheduledArrival: "00:03", scheduledDeparture: "00:05", haltMinutes: 2, platform: "1", day: 2 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 702, scheduledArrival: "05:20", scheduledDeparture: "05:25", haltMinutes: 5, platform: "1", day: 2 },
      { code: "NGP",  name: "Nagpur Jn",            lat: 21.1524, lng: 79.0888, distanceKm: 1092, scheduledArrival: "11:45", scheduledDeparture: "11:50", haltMinutes: 5, platform: "2", day: 2 },
      { code: "BZA",  name: "Vijayawada Jn",        lat: 16.5173, lng: 80.6206, distanceKm: 1754, scheduledArrival: "21:40", scheduledDeparture: "21:50", haltMinutes: 10, platform: "1", day: 2 },
      { code: "KPD",  name: "Katpadi Jn",           lat: 12.9702, lng: 79.1384, distanceKm: 2200, scheduledArrival: "04:40", scheduledDeparture: "04:45", haltMinutes: 5, platform: "3", day: 3 },
      { code: "CBE",  name: "Coimbatore Jn",        lat: 11.0016, lng: 76.9628, distanceKm: 2570, scheduledArrival: "10:25", scheduledDeparture: "10:30", haltMinutes: 5, platform: "1", day: 3 },
      { code: "ERS",  name: "Ernakulam Jn",         lat: 9.9678,  lng: 76.2925, distanceKm: 2831, scheduledArrival: "15:20", scheduledDeparture: "15:25", haltMinutes: 5, platform: "1", day: 3 },
      { code: "TVC",  name: "Thiruvananthapuram",   lat: 8.4875,  lng: 76.9525, distanceKm: 3036, scheduledArrival: "19:00", scheduledDeparture: "Destination", haltMinutes: 0, platform: "2", day: 3 }
    ]
  },
  {
    trainNumber: "12004",
    trainName: "Lucknow Swarna Shatabdi Express",
    trainType: "Shatabdi Express",
    from: "New Delhi (NDLS)",
    to: "Lucknow Charbagh (LKO)",
    departureTime: "06:10",
    arrivalTime: "12:40",
    totalDistanceKm: 512,
    avgSpeedKmh: 79,
    demoDelayMinutes: 0,
    availableClasses: ["EC", "CC"],
    stations: [
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:10", haltMinutes: 0, platform: "6", day: 1 },
      { code: "GZB",  name: "Ghaziabad Jn",         lat: 28.6692, lng: 77.4538, distanceKm: 26, scheduledArrival: "06:48", scheduledDeparture: "06:50", haltMinutes: 2, platform: "2", day: 1 },
      { code: "ALJN", name: "Aligarh Jn",           lat: 27.8974, lng: 78.0880, distanceKm: 131, scheduledArrival: "07:50", scheduledDeparture: "07:52", haltMinutes: 2, platform: "3", day: 1 },
      { code: "TDL",  name: "Tundla Jn",            lat: 27.2081, lng: 78.2425, distanceKm: 209, scheduledArrival: "08:45", scheduledDeparture: "08:47", haltMinutes: 2, platform: "5", day: 1 },
      { code: "CNB",  name: "Kanpur Central",        lat: 26.4539, lng: 80.3510, distanceKm: 440, scheduledArrival: "11:20", scheduledDeparture: "11:25", haltMinutes: 5, platform: "1", day: 1 },
      { code: "LKO",  name: "Lucknow Charbagh",     lat: 26.8322, lng: 80.9197, distanceKm: 512, scheduledArrival: "12:40", scheduledDeparture: "Destination", haltMinutes: 0, platform: "2", day: 1 }
    ]
  },
  {
    trainNumber: "20901",
    trainName: "Mumbai - Gandhinagar Vande Bharat",
    trainType: "Vande Bharat",
    from: "Mumbai Central (MMCT)",
    to: "Gandhinagar Capital (GNC)",
    departureTime: "06:00",
    arrivalTime: "12:25",
    totalDistanceKm: 522,
    avgSpeedKmh: 82,
    demoDelayMinutes: 0,
    availableClasses: ["EC", "CC"],
    stations: [
      { code: "MMCT", name: "Mumbai Central",       lat: 18.9696, lng: 72.8193, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "06:00", haltMinutes: 0, platform: "5", day: 1 },
      { code: "BVI",  name: "Borivali",             lat: 19.2288, lng: 72.8569, distanceKm: 30, scheduledArrival: "06:23", scheduledDeparture: "06:25", haltMinutes: 2, platform: "7", day: 1 },
      { code: "VAPI", name: "Vapi",                 lat: 20.3713, lng: 72.9042, distanceKm: 168, scheduledArrival: "07:56", scheduledDeparture: "07:58", haltMinutes: 2, platform: "1", day: 1 },
      { code: "ST",   name: "Surat",                lat: 21.2052, lng: 72.8407, distanceKm: 263, scheduledArrival: "08:55", scheduledDeparture: "08:58", haltMinutes: 3, platform: "1", day: 1 },
      { code: "BRC",  name: "Vadodara Jn",          lat: 22.3107, lng: 73.1812, distanceKm: 393, scheduledArrival: "09:56", scheduledDeparture: "09:59", haltMinutes: 3, platform: "2", day: 1 },
      { code: "ADI",  name: "Ahmedabad Jn",         lat: 23.0225, lng: 72.5714, distanceKm: 493, scheduledArrival: "11:25", scheduledDeparture: "11:30", haltMinutes: 5, platform: "1", day: 1 },
      { code: "GNC",  name: "Gandhinagar Capital",  lat: 23.2323, lng: 72.6464, distanceKm: 522, scheduledArrival: "12:25", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 1 }
    ]
  },
  {
    trainNumber: "12137",
    trainName: "Punjab Mail",
    trainType: "Superfast",
    from: "Mumbai CSMT (CSMT)",
    to: "Firozpur Cantt (FZR)",
    departureTime: "19:35",
    arrivalTime: "05:10 (+2 days)",
    totalDistanceKm: 1928,
    avgSpeedKmh: 58,
    demoDelayMinutes: 10,
    availableClasses: ["1A", "2A", "3A", "SL"],
    stations: [
      { code: "CSMT", name: "Mumbai CSMT",          lat: 18.9400, lng: 72.8353, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "19:35", haltMinutes: 0, platform: "18", day: 1 },
      { code: "DR",   name: "Dadar Central",        lat: 19.0180, lng: 72.8432, distanceKm: 9, scheduledArrival: "19:47", scheduledDeparture: "19:50", haltMinutes: 3, platform: "4", day: 1 },
      { code: "KYN",  name: "Kalyan Jn",            lat: 19.2354, lng: 73.1299, distanceKm: 54, scheduledArrival: "20:32", scheduledDeparture: "20:35", haltMinutes: 3, platform: "4", day: 1 },
      { code: "NK",   name: "Nashik Road",          lat: 19.9572, lng: 73.8344, distanceKm: 186, scheduledArrival: "23:05", scheduledDeparture: "23:10", haltMinutes: 5, platform: "2", day: 1 },
      { code: "MMR",  name: "Manmad Jn",            lat: 20.2520, lng: 74.4379, distanceKm: 259, scheduledArrival: "00:07", scheduledDeparture: "00:10", haltMinutes: 3, platform: "2", day: 2 },
      { code: "JL",   name: "Jalgaon Jn",           lat: 21.0077, lng: 75.5626, distanceKm: 419, scheduledArrival: "02:18", scheduledDeparture: "02:20", haltMinutes: 2, platform: "3", day: 2 },
      { code: "BSL",  name: "Bhusawal Jn",          lat: 21.0475, lng: 75.7953, distanceKm: 443, scheduledArrival: "02:50", scheduledDeparture: "02:55", haltMinutes: 5, platform: "6", day: 2 },
      { code: "KNW",  name: "Khandwa Jn",           lat: 21.8242, lng: 76.3533, distanceKm: 567, scheduledArrival: "05:08", scheduledDeparture: "05:10", haltMinutes: 2, platform: "2", day: 2 },
      { code: "ET",   name: "Itarsi Jn",            lat: 22.6139, lng: 77.7639, distanceKm: 750, scheduledArrival: "07:55", scheduledDeparture: "08:05", haltMinutes: 10, platform: "1", day: 2 },
      { code: "BPL",  name: "Bhopal Jn",            lat: 23.2678, lng: 77.4126, distanceKm: 842, scheduledArrival: "09:30", scheduledDeparture: "09:35", haltMinutes: 5, platform: "2", day: 2 },
      { code: "VGLJ", name: "VGL Jhansi Jn",        lat: 25.4484, lng: 78.5685, distanceKm: 1134, scheduledArrival: "13:58", scheduledDeparture: "14:06", haltMinutes: 8, platform: "4", day: 2 },
      { code: "GWL",  name: "Gwalior Jn",           lat: 26.2183, lng: 78.1828, distanceKm: 1231, scheduledArrival: "15:10", scheduledDeparture: "15:12", haltMinutes: 2, platform: "2", day: 2 },
      { code: "AGC",  name: "Agra Cantt",           lat: 27.1592, lng: 77.9904, distanceKm: 1350, scheduledArrival: "17:15", scheduledDeparture: "17:20", haltMinutes: 5, platform: "2", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1545, scheduledArrival: "21:10", scheduledDeparture: "21:25", haltMinutes: 15, platform: "4", day: 2 },
      { code: "FZR",  name: "Firozpur Cantt",       lat: 30.9157, lng: 74.6186, distanceKm: 1928, scheduledArrival: "05:10", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 3 }
    ]
  },
  {
    trainNumber: "12259",
    trainName: "Sealdah - Bikaner AC Duronto Express",
    trainType: "Duronto Express",
    from: "Sealdah (SDAH)",
    to: "Bikaner Jn (BKN)",
    departureTime: "17:00",
    arrivalTime: "18:20 (+1 day)",
    totalDistanceKm: 1916,
    avgSpeedKmh: 75,
    demoDelayMinutes: 5,
    availableClasses: ["1A", "2A", "3A"],
    stations: [
      { code: "SDAH", name: "Sealdah",              lat: 22.5697, lng: 88.3697, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "17:00", haltMinutes: 0, platform: "12", day: 1 },
      { code: "DHN",  name: "Dhanbad Jn",           lat: 23.7957, lng: 86.4304, distanceKm: 266, scheduledArrival: "20:50", scheduledDeparture: "20:55", haltMinutes: 5, platform: "2", day: 1 },
      { code: "DDU",  name: "Pt Deen Dayal Upadhyaya", lat: 25.2818, lng: 83.1197, distanceKm: 672, scheduledArrival: "01:25", scheduledDeparture: "01:35", haltMinutes: 10, platform: "4", day: 2 },
      { code: "CNB",  name: "Kanpur Central",        lat: 26.4539, lng: 80.3510, distanceKm: 1018, scheduledArrival: "05:30", scheduledDeparture: "05:35", haltMinutes: 5, platform: "2", day: 2 },
      { code: "NDLS", name: "New Delhi",            lat: 28.6430, lng: 77.2197, distanceKm: 1459, scheduledArrival: "11:00", scheduledDeparture: "11:25", haltMinutes: 25, platform: "9", day: 2 },
      { code: "BKN",  name: "Bikaner Jn",           lat: 28.0167, lng: 73.3119, distanceKm: 1916, scheduledArrival: "18:20", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 2 }
    ]
  },
  {
    trainNumber: "12431",
    trainName: "Trivandrum Rajdhani Express",
    trainType: "Rajdhani Express",
    from: "Thiruvananthapuram (TVC)",
    to: "Hazrat Nizamuddin (NZM)",
    departureTime: "19:15",
    arrivalTime: "12:30 (+2 days)",
    totalDistanceKm: 2848,
    avgSpeedKmh: 69,
    demoDelayMinutes: 0,
    availableClasses: ["1A", "2A", "3A"],
    stations: [
      { code: "TVC",  name: "Thiruvananthapuram",   lat: 8.4875,  lng: 76.9525, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "19:15", haltMinutes: 0, platform: "1", day: 1 },
      { code: "ERS",  name: "Ernakulam Jn",         lat: 9.9678,  lng: 76.2925, distanceKm: 206, scheduledArrival: "22:30", scheduledDeparture: "22:35", haltMinutes: 5, platform: "1", day: 1 },
      { code: "SRR",  name: "Shoranur Jn",          lat: 10.7615, lng: 76.2737, distanceKm: 288, scheduledArrival: "23:55", scheduledDeparture: "00:00", haltMinutes: 5, platform: "6", day: 1 },
      { code: "CLT",  name: "Kozhikode Main",       lat: 11.2483, lng: 75.7839, distanceKm: 374, scheduledArrival: "00:52", scheduledDeparture: "00:55", haltMinutes: 3, platform: "3", day: 2 },
      { code: "MAJN", name: "Mangaluru Jn",         lat: 12.8703, lng: 74.8718, distanceKm: 597, scheduledArrival: "04:15", scheduledDeparture: "04:20", haltMinutes: 5, platform: "1", day: 2 },
      { code: "MAO",  name: "Madgaon Jn",           lat: 15.2736, lng: 73.9580, distanceKm: 909, scheduledArrival: "09:15", scheduledDeparture: "09:25", haltMinutes: 10, platform: "1", day: 2 },
      { code: "PNVL", name: "Panvel Jn",            lat: 18.9894, lng: 73.1175, distanceKm: 1449, scheduledArrival: "18:00", scheduledDeparture: "18:05", haltMinutes: 5, platform: "5", day: 2 },
      { code: "BRC",  name: "Vadodara Jn",          lat: 22.3107, lng: 73.1812, distanceKm: 1874, scheduledArrival: "23:45", scheduledDeparture: "23:55", haltMinutes: 10, platform: "2", day: 2 },
      { code: "KOTA", name: "Kota Jn",              lat: 25.2217, lng: 75.8754, distanceKm: 2382, scheduledArrival: "06:40", scheduledDeparture: "06:45", haltMinutes: 5, platform: "1", day: 3 },
      { code: "NZM",  name: "Hazrat Nizamuddin",    lat: 28.5886, lng: 77.2534, distanceKm: 2848, scheduledArrival: "12:30", scheduledDeparture: "Destination", haltMinutes: 0, platform: "2", day: 3 }
    ]
  },
  {
    trainNumber: "12051",
    trainName: "Madgaon Jan Shatabdi Express",
    trainType: "Jan Shatabdi",
    from: "Mumbai CSMT (CSMT)",
    to: "Madgaon Jn (MAO)",
    departureTime: "05:10",
    arrivalTime: "14:10",
    totalDistanceKm: 581,
    avgSpeedKmh: 65,
    demoDelayMinutes: 5,
    availableClasses: ["EC", "CC"],
    stations: [
      { code: "CSMT", name: "Mumbai CSMT",          lat: 18.9400, lng: 72.8353, distanceKm: 0, scheduledArrival: "Source", scheduledDeparture: "05:10", haltMinutes: 0, platform: "14", day: 1 },
      { code: "DR",   name: "Dadar Central",        lat: 19.0180, lng: 72.8432, distanceKm: 9, scheduledArrival: "05:18", scheduledDeparture: "05:20", haltMinutes: 2, platform: "5", day: 1 },
      { code: "TNA",  name: "Thane",                lat: 19.1860, lng: 72.9759, distanceKm: 34, scheduledArrival: "05:40", scheduledDeparture: "05:42", haltMinutes: 2, platform: "7", day: 1 },
      { code: "PNVL", name: "Panvel Jn",            lat: 18.9894, lng: 73.1175, distanceKm: 69, scheduledArrival: "06:23", scheduledDeparture: "06:25", haltMinutes: 2, platform: "7", day: 1 },
      { code: "RN",   name: "Ratnagiri",            lat: 16.9806, lng: 73.3308, distanceKm: 347, scheduledArrival: "10:35", scheduledDeparture: "10:40", haltMinutes: 5, platform: "1", day: 1 },
      { code: "KUDL", name: "Kudal",                lat: 16.0089, lng: 73.6883, distanceKm: 487, scheduledArrival: "12:18", scheduledDeparture: "12:20", haltMinutes: 2, platform: "1", day: 1 },
      { code: "THVM", name: "Thivim",               lat: 15.6322, lng: 73.8583, distanceKm: 537, scheduledArrival: "13:06", scheduledDeparture: "13:08", haltMinutes: 2, platform: "1", day: 1 },
      { code: "MAO",  name: "Madgaon Jn",           lat: 15.2736, lng: 73.9580, distanceKm: 581, scheduledArrival: "14:10", scheduledDeparture: "Destination", haltMinutes: 0, platform: "1", day: 1 }
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

// Helper: Calculate demo fare for class and distance
function calculateFare(classType, distanceKm) {
  const cfg = CLASS_CONFIG[classType] || CLASS_CONFIG["SL"];
  const baseFare = Math.max(cfg.minFare, Math.round(distanceKm * cfg.ratePerKm));
  const superfastCharge = 45;
  const gst = Math.round((baseFare + cfg.resFee + superfastCharge) * 0.05);
  const total = baseFare + cfg.resFee + superfastCharge + gst;

  return {
    classType,
    className: cfg.name,
    baseFare,
    reservationFee: cfg.resFee,
    superfastCharge,
    gst,
    totalFare: total
  };
}

// Helper: Generate deterministic demo seat availability
function getSeatAvailability(trainNumber, classType, dateStr) {
  const seed = (trainNumber + classType + (dateStr || "today"))
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const statusVal = seed % 10;
  if (statusVal === 0) {
    return { status: "RAC", count: (seed % 12) + 1, badge: `RAC ${(seed % 12) + 1}`, color: "#d97706" };
  } else if (statusVal === 9) {
    return { status: "WL", count: (seed % 8) + 1, badge: `WL ${(seed % 8) + 1}`, color: "#dc2626" };
  } else {
    const seats = (seed % 65) + 14;
    return { status: "AVAILABLE", count: seats, badge: `AVAILABLE ${seats}`, color: "#16a34a" };
  }
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

// Helper: Find all matching trains (not just first one)
function searchAllTrains(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return TRAINS.filter(train =>
    train.trainNumber === q ||
    train.trainNumber.includes(q) ||
    train.trainName.toLowerCase().includes(q) ||
    train.from.toLowerCase().includes(q) ||
    train.to.toLowerCase().includes(q)
  );
}

// Helper: Match station string to station object
function matchStation(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();
  const all = getAllStations();
  return all.find(s => s.code.toLowerCase() === q || s.name.toLowerCase() === q || s.name.toLowerCase().includes(q));
}

// Helper: Find all trains running from fromStation to toStation with INTERMEDIATE STATIONS
function findTrainsBetweenStations(fromQuery, toQuery, travelClass, journeyDate) {
  if (!fromQuery || !toQuery) return [];
  const fromQ = fromQuery.toLowerCase().trim();
  const toQ = toQuery.toLowerCase().trim();

  const results = [];

  TRAINS.forEach(train => {
    const fromIdx = train.stations.findIndex(st =>
      st.code.toLowerCase() === fromQ || st.name.toLowerCase().includes(fromQ)
    );
    const toIdx = train.stations.findIndex(st =>
      st.code.toLowerCase() === toQ || st.name.toLowerCase().includes(toQ)
    );

    // Both stations must be on this train AND from must come before to
    if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
      const fromSt = train.stations[fromIdx];
      const toSt = train.stations[toIdx];
      const distanceKm = toSt.distanceKm - fromSt.distanceKm;

      // Filter classes if specified
      let classes = train.availableClasses;
      if (travelClass && travelClass !== "ALL" && classes.includes(travelClass)) {
        classes = [travelClass];
      } else if (travelClass && travelClass !== "ALL" && !classes.includes(travelClass)) {
        return; // Train doesn't offer requested class
      }

      const classFares = classes.map(cls => {
        const fare = calculateFare(cls, distanceKm);
        const avail = getSeatAvailability(train.trainNumber, cls, journeyDate);
        return {
          ...fare,
          availability: avail
        };
      });

      // Extract all intermediate stations in correct order between origin and destination
      const segmentStations = train.stations.slice(fromIdx, toIdx + 1).map((st, i) => ({
        stopSequence: i + 1,
        code: st.code,
        name: st.name,
        distanceFromOriginKm: st.distanceKm - fromSt.distanceKm,
        totalDistanceKm: st.distanceKm,
        scheduledArrival: st.scheduledArrival,
        scheduledDeparture: st.scheduledDeparture,
        haltMinutes: st.haltMinutes || (i === 0 || i === (toIdx - fromIdx) ? 0 : 2),
        platform: st.platform || "1",
        day: st.day
      }));

      results.push({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        trainType: train.trainType,
        fromStation: fromSt,
        toStation: toSt,
        departureTime: fromSt.scheduledDeparture,
        arrivalTime: toSt.scheduledArrival,
        distanceKm,
        classes: classFares,
        intermediateStations: segmentStations,
        intermediateStopsCount: segmentStations.length
      });
    }
  });

  return results;
}

module.exports = {
  TRAINS,
  CLASS_CONFIG,
  getAllStations,
  calculateFare,
  getSeatAvailability,
  findTrainsByStation,
  findTrain,
  searchAllTrains,
  findTrainsBetweenStations,
  matchStation
};
