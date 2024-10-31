import React, { useState } from "react";
import { Link } from "react-router-dom";
import ip from "../ip";
import { useAuth } from "../utils/Auth";

const NavBar = () => {
  const { user, logout } = useAuth();

  const [activeNav, setActiveNav] = useState(false);
  const openNav = () => {
    setActiveNav(!activeNav);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${ip}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Error during logout. Please try again later.");
      }
      const responseData = await response.json();

      alert(responseData.message);

      setTimeout(() => {
        logout();
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Failed to log out. Please check your connection and try again.");
    }
  };

  return (
    <header>
      <nav>
        <i
          onClick={openNav}
          className={`material-symbols-outlined menu-icon ${
            activeNav ? "active" : ""
          }`}
        >
          menu
        </i>
        <div className={`links ${activeNav ? "active" : ""}`}>
          <div className="nav-icons">
            <Link to="/">
              <i className="material-symbols-outlined">partly_cloudy_day</i>
            </Link>
            {!user && (
              <>
                <Link to="/login">
                  <i className="material-symbols-outlined">login</i>
                </Link>
                <Link to="/register">
                  <i className="material-symbols-outlined">person_add</i>
                </Link>
              </>
            )}
            {user && (
              <>
                {/* Fazer Lógica para logout no backend */}
                <i onClick={handleLogout} className="material-symbols-outlined">
                  logout
                </i>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
