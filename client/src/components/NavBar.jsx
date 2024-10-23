import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  //   const openNav = () => {
  //     const navBar = document.querySelector("nav");
  //     navBar.classList.toggle("show");
  //   };

  return (
    <header>
      {/* <span onClick={openNav} className="material-symbols-outlined menu-icon">
        menu
      </span> */}
      <nav>
        <div className="links">
          <Link to="/">Weather</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
