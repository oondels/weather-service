const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/api/weather", async (req, res) => {
  const city = req.body.city;
  if (!city) {
    return res.status(400).send({ error: "Cidade é obrigatória" });
  }

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Erro ao buscar dados da previsão do tempo" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});
