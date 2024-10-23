import React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import NavBar from "./components/NavBar";
import Login from "./views/Login";
import Register from "./views/Register";
import Weather from "./views/Weather";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <main>
          <Routes>
            <Route path="/" element={<Weather />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
