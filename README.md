# RailMate — Live Train Tracking & Demo Ticket Booking Simulation

**A Professional Indian Railway Train Tracking & Ticket Reservation Simulation**  
Created by: **RailMate**  
Course: **BCA College Project**  
Mode: **SIMULATION MODE — DEMO DATA (Academic & Demonstration Purposes Only)**

---

## 🌟 Overview & Key Features

RailMate is a responsive web application designed for BCA college presentation that integrates both **Real-Time Train Simulation Tracking** and an **Indian Railway-Style Demo Ticket Booking Portal** without requiring any paid APIs, API keys, or external redirection.

### 1. 🚆 RailMate
* **Free Leaflet.js & OpenStreetMap**: Renders full railway track polylines, station stops with scheduled arrival/departures, and an animated train marker (🚆).
* **5-Second Simulation Engine**: Automatically glides along the route every 5 seconds, updating current location, next stop, ETA, distance covered, and simulated delay.
* **Dual Search**: Search trains by 5-digit number or name (e.g. *12951*, *22436*, *12002*, *11077*, *12301*, *12626*), or search by station (e.g. *Jalgaon*, *New Delhi*, *Mumbai*, *Bhopal*, *Kanpur*).
* **Station Progression Timeline**: Stop-by-stop visualizer highlighting passed stops (green), current stop (pulsing orange), and upcoming stops.
* **Viva Presentation Controls**: Play, Pause, Reset, Step-Ahead, Speed Multipliers (`1x`, `2x`, `5x`), and Route Scrubbing Slider.

### 2. 🎫 Indian Railway Demo Ticket Booking System
* **Search Trains Between Stations**: Enter *From Station*, *To Station*, *Journey Date*, *Passenger Count (1-6)*, and *Travel Class*.
* **Class Fare & Availability**: Instant calculation of demo fares (Base fare, reservation fee, superfast charge, GST) and demo seat availability (`AVAILABLE 42`, `RAC 6`, etc.) for `1A`, `2A`, `3A`, `SL`, `EC`, and `CC`.
* **Multi-Passenger Details Form**: Add details for up to 6 passengers with Name, Age, Gender, and Berth Preferences (Lower, Middle, Upper, Side Lower, Side Upper, Window).
* **Instant Demo Reservation**: Generates a realistic **10-Digit DEMO PNR** (e.g., `642-1893425`), Booking ID, allocated coach & berth numbers (e.g., `B2 / Seat 34 (Lower Berth)`).
* **Printable Electronic Reservation Slip (ERS)**: Formatted Indian Railway e-ticket layout with demo barcode/watermark and a one-click **Print Ticket** button.
* **Direct "Track Train" Link**: One click jumps directly from your booked ticket to the Live Simulation map to watch that train run!

### 3. 📋 My Bookings Management
* **View All Demo Bookings**: Loaded from the local server and saved to `data/bookings.json`.
* **Search by PNR**: Lookup any demo booking by PNR number.
* **Cancel Booking**: Instant demo cancellation with simulated refund calculation and seat release.

---

## 🔒 Privacy & Academic Transparency
* **No External Redirections**: 100% self-contained inside RailMate (no IRCTC or third-party redirects).
* **Zero Paid APIs**: Uses open-source Leaflet.js and built-in simulation datasets.
* **Safe Local Data**: Does **not** collect credit cards, UPI, passwords, Aadhaar, or sensitive personal information.
* **Prominent Disclaimer**: Every page and ticket displays:  
  `"DEMO BOOKING ONLY — NOT A REAL RAILWAY TICKET. NO REAL RESERVATION OR PAYMENT IS MADE."`

---

## 🚆 Predefined Indian Train Routes in Demo

| Train No | Train Name | Route | Classes Available |
| :--- | :--- | :--- | :--- |
| **12951** | Mumbai Tejas Rajdhani | Mumbai Central (MMCT) ↔ New Delhi (NDLS) | 1A, 2A, 3A |
| **22436** | Vande Bharat Express | New Delhi (NDLS) ↔ Varanasi (BSB) | EC, CC |
| **12002** | Bhopal Shatabdi Express | New Delhi (NDLS) ↔ Rani Kamalapati (RKMP) | EC, CC |
| **11077** | Jhelum Express | Pune (PUNE) ↔ Jammu Tawi (JAT) via **Jalgaon Jn (JL)** | 2A, 3A, SL |
| **12301** | Howrah Rajdhani Express | Howrah (HWH) ↔ New Delhi (NDLS) | 1A, 2A, 3A |
| **12626** | Kerala Express | New Delhi (NDLS) ↔ Thiruvananthapuram (TVC) | 2A, 3A, SL |

---

## 💻 How to Run in VS Code

### 1. Open Project Folder
Open **VS Code**, go to **File** &rarr; **Open Folder...**, and select:  
`c:\Users\Admin\OneDrive\Desktop\Railmate`

### 2. Start the Express Server
Open the VS Code terminal (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and run:
```bash
npm start
```
You will see:
```text
=================================================
  RailMate — Live Tracking & Demo Ticket Booking
  Creator: RailMate
  Mode: SIMULATION MODE (No Paid API Required)
  Server running at: http://localhost:3000
=================================================
```

### 3. Open in Browser
Navigate to: [**http://localhost:3000**](http://localhost:3000)

*(Offline / Zero-Setup Mode: You can also double-click [`index.html`](file:///c:/Users/Admin/OneDrive/Desktop/Railmate/index.html) directly in Windows Explorer; the built-in simulation and booking fallbacks work right out of the box!)*

---

## 📁 Project Structure

```
Railmate/
├── backups/                   # Safe backups of all previous iterations
│   ├── index.original.html
│   ├── server.original.js
│   ├── index.v1.html
│   ├── server.v1.js
│   └── trains.v1.js
├── data/
│   ├── trains.js              # Indian Railway routes, classes & fare calculator
│   └── bookings.json          # Local persistence for demo booked tickets
├── index.html                 # Complete UI: Live Tracking, Demo Booking & My Bookings
├── server.js                  # Express.js backend with simulation & booking APIs
├── package.json               # Node.js dependencies (express, cors)
├── README.md                  # Comprehensive documentation
└── .env                       # Preserved untouched
```

---

## 🎓 Academic Disclaimer

RailMate was created by RailMate as an educational college project to simulate railway tracking and reservation workflows. All train locations, fares, seat availability, and PNR allocations are simulated and intended strictly for academic demonstration.
