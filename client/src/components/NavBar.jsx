import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [activeNav, setActiveNav] = useState(false);
  const openNav = () => {
    setActiveNav(!activeNav);
  };

  return (
    <header>
      <nav>
        <i
          onClick={openNav}
          class={`material-symbols-outlined menu-icon ${
            activeNav ? "active" : ""
          }`}
        >
          menu
        </i>
        <div className={`links ${activeNav ? "active" : ""}`}>
          <div className="nav-icons">
            <Link to="/">
              <i class="material-symbols-outlined">partly_cloudy_day</i>
            </Link>
            <Link to="/login">
              <i class="material-symbols-outlined">login</i>
            </Link>
            <Link to="/register">
              <i class="material-symbols-outlined">person_add</i>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
