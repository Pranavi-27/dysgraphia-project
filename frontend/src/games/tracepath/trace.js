import React, { useState } from "react";
import Letter from "./letters";
import "./trace.css";

const Trace = ({ onHome }) => {
  const [index, setIndex] = useState(0);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // ✅ Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const nextLetter = () => {
    if (index < letters.length - 1) {
      setIndex(index + 1);
    } else {
      setPopupMessage("🎉 You finished all letters!");
      setShowPopup(true);
      setIndex(0);
    }
  };

  const prevLetter = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setPopupMessage("⚠️ This is the first letter!");
      setShowPopup(true);
    }
  };

  return (
    <div className="trace-container">
      <h2>🎮 Game 1: Trace the Path</h2>

      <Letter char={letters[index]} />

      {/* Navigation Buttons */}
      <div className="trace-nav">
        <button onClick={prevLetter} className="prev-btn">
          ⬅ Previous
        </button>

        <button onClick={nextLetter} className="next-btn">
          Next ➡
        </button>
      </div>

      {/* ✅ POPUP (same style as your other component) */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <p style={{ fontSize: "18px" }}>{popupMessage}</p>

            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trace;