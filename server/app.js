const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./utils/auth/authRoutes.js");
const checkToken = require("./utils/auth/auth.js");
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

app.get("/api/weather", checkToken, async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res
      .status(400)
      .json({ message: "You must to put one city", error: true });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );

    res.status(200).json({ weather: response.data, error: false });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weather forecast data", error: true });
  }
});

app.get("/protected", checkToken, (req, res) => {
  res
    .status(200)
    .json({ message: "You have accessed a protected route!", user: req.user });
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
