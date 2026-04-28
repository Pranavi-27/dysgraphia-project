// src/components/ThemeToggle.js
import React from "react";
import "../styles.css"; // keep styling consistent

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
};

export default ThemeToggle;
