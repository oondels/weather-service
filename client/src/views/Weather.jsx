import axios from "axios";
import React, { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const [user, putUser] = useState(false);

  const handleUser = () => {
    putUser(!user);
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather?city=${city}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error(error.response.data.error);
      setWeather(null);
    }
  };

  return (
    <div className="weather-container">
      <button onClick={handleUser}>User</button>

      <div className="weather-first-view">
        <div className="weather-title">
          <h1>Weather</h1> <span>ForeCasts</span>
        </div>

        <button className="get-start-button">Get Start</button>
      </div>

      {user && (
        <div className="weather-info">
          <input
            type="text"
            placeholder="Digite o nome da cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Buscar Clima</button>

          {weather && (
            <div>
              <h2>Previsão do Tempo para {weather.location.name}</h2>
              <p>Temperatura: {weather.current.temp_c}°C</p>
              <p>Condição: {weather.current.condition.text}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;
