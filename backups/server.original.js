const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/train/:trainNo", async (req, res) => {
  try {
    const trainNo = req.params.trainNo;

    if (!/^\d{4,6}$/.test(trainNo)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid train number."
      });
    }

    const response = await axios.get(
      `https://irctc-indian-railway-pnr-status.p.rapidapi.com/live-train/${trainNo}/status`,
      {
        params: { startDay: "0" },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("API STATUS:", error.response?.status);
    console.log("API ERROR:", error.response?.data);
    console.log("ERROR MESSAGE:", error.message);

    res.status(500).json({
      success: false,
      message: "Train status is unavailable right now."
    });
  }
});

app.listen(3000, () => {
  console.log("RailMate server running at http://localhost:3000");
});