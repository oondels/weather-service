import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import { Auth } from "./utils/Auth";
import ProtectedRoute from "./utils/ProtectedRoute";

import NavBar from "./components/NavBar";
import Login from "./views/Login";
import Register from "./views/Register";
import Weather from "./views/Weather";

function App() {
  return (
    <div className="App">
      <Auth>
        <Router>
          <NavBar />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Weather />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </Router>
      </Auth>
    </div>
  );
}

export default App;
