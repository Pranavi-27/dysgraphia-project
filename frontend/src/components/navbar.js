import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import "../styles.css";

const Navbar = ({ onBack, theme, toggleTheme, showDysgraphiaBtn=false, onDysgraphiaClick }) => {
  return (
    <nav className="navbar">
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Back
      </button>

      <div className="nav-right">
        {showDysgraphiaBtn && (
          <button className="screening-btn" onClick={onDysgraphiaClick}>
            📝 Dysgraphia Screening
          </button>
        )}
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
};

export default Navbar;
