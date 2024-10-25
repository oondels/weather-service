import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React, { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  let [weather, setWeather] = useState(null);
  const [showWeather, setShoWeather] = useState(null);

  const [transition, setTransition] = useState(false);

  const handleTransition = () => {
    setTransition(!transition);
  };

  const handleWeather = () => {
    if (showWeather) {
      setTimeout(() => {
        setWeather(null);
      }, 1000);
    }
    setShoWeather(!showWeather);
  };

  const [showAlert, setAlert] = useState(false);
  const toggleAlert = (title, message) => {
    const alertTitle = document.querySelector(".alert-title");
    const alertMessage = document.querySelector(".alert-message");

    if (title && message) {
      alertTitle.innerText = title;
      alertMessage.innerText = message;
    }

    setAlert(!showAlert);
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/weather?city=${city}`
      );
      setWeather(response.data.weather);
      console.log(response.data.weather);
      setTimeout(() => {
        handleWeather();
      }, 300);
    } catch (error) {
      toggleAlert("Error", error.response.data.message);
      console.error(error.response.data.message);
      setWeather(null);
    }
  };

  return (
    <div className={`weather-container ${transition ? "" : "transition"}`}>
      <div className={`weather-first-view ${transition ? "transition" : ""}`}>
        <img src="/weather.png" alt="Weather" />

        <div className="weather-title">
          <h1>Weather</h1> <span>ForeCasts</span>
        </div>

        <button onClick={handleTransition} className="get-start-button">
          Get Start
        </button>
      </div>

      {!weather && (
        <div className={`second-view ${transition ? "transition" : ""}`}>
          <div className="weather-title">
            <h1>Search</h1> <span>Your City</span>
          </div>

          <input
            type="text"
            placeholder="Enter the city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>Search Weather</button>
        </div>
      )}

      {weather && (
        <div className={`weather-data`}>
          {showWeather && (
            <span
              onClick={() => {
                handleWeather();
              }}
              className="material-symbols-outlined close-weather"
            >
              undo
            </span>
          )}

          <div className={`weather-card ${showWeather ? "show" : ""}`}>
            <h2>Previsão do Tempo para {weather.location.name}</h2>

            <div className="temperature">
              <img
                className="condition-icon"
                src={`https:${weather.current.condition.icon}`}
                alt="Ícone da condição climática"
              />
              {weather.current.temp_c}°C
            </div>

            <div className="condition">
              <img
                className="condition-icon"
                src={`https:${weather.current.condition.icon}`}
                alt="Ícone da condição climática"
              />
              <p>{weather.current.condition.text}</p>
            </div>

            <div className="weather-details">
              <span>
                <strong>Vento:</strong> {weather.current.wind_kph} km/h (
                {weather.current.wind_dir})
              </span>
              <span>
                <strong>Pressão:</strong> {weather.current.pressure_mb} mb
              </span>
              <span>
                <strong>Umidade:</strong> {weather.current.humidity}%
              </span>
              <span>
                <strong>Sensação Térmica:</strong> {weather.current.feelslike_c}
                °C
              </span>
              <span>
                <strong>Índice UV:</strong> {weather.current.uv}
              </span>
            </div>
          </div>
        </div>
      )}
      <div id="alert-message" className={`${showAlert ? "show" : ""}`}>
        <h1 className="alert-title">Sucesso</h1>
        <p className="alert-message"></p>
        <button onClick={toggleAlert}>Fechar</button>
      </div>
    </div>
  );
}

export default Weather;
