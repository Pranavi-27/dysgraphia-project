import React, { useState, useEffect } from "react";
import "../tracepath/trace.css";

/* ========= IMAGE IMPORTS ========= */
import elephant from "../../images/elephant.png";
import bicycle from "../../images/bicycle.png";
import notebook from "../../images/notebook.png";
import calendar from "../../images/calendar.png";
import hospital from "../../images/hospital.png";
import television from "../../images/television.png";
import kangaroo from "../../images/kangaroo.png";
import umbrella from "../../images/umbrella.png";
import computer from "../../images/computer.png";

/* ========= IMAGE MAP ========= */
const imageMap = {
  COMPUTER: computer,
  UMBRELLA: umbrella,
  KANGAROO: kangaroo,
  TELEVISION: television,
  HOSPITAL: hospital,
  CALENDAR: calendar,
  NOTEBOOK: notebook,
  BICYCLE: bicycle,
  ELEPHANT: elephant,
};

/* ========= WORD LIST ========= */
const wordsList = [
  "COMPUTER",
  "UMBRELLA",
  "KANGAROO",
  "TELEVISION",
  "HOSPITAL",
  "CALENDAR",
  "NOTEBOOK",
  "BICYCLE",
  "ELEPHANT",
];

const BuildWord = ({ onHome }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [completed, setCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);

  // ⭐ NEW STATES
  const [errorCount, setErrorCount] = useState(0);
  const [results, setResults] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentWord = wordsList[currentWordIndex];

  /* ===== Initialize word ===== */
  useEffect(() => {
    if (!currentWord) return;

    setUserInput(Array(currentWord.length).fill(""));
    setCompleted(false);
    setShuffledLetters(currentWord.split("").sort(() => Math.random() - 0.5));
    setTimeLeft(60);
    setErrorCount(0);
  }, [currentWord]);

  /* ===== Timer ===== */
  useEffect(() => {
    if (completed || showReport) return;

    if (timeLeft <= 0) {
      reset();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, completed, showReport]);

  const playErrorSound = () => {
    try {
      new Audio("/error.mp3").play();
    } catch {}
  };

  /* ===== Letter click ===== */
  const handleLetterClick = (letter, index) => {
    const nextEmpty = userInput.findIndex((l) => l === "");
    if (nextEmpty === -1) return;

    // ❌ WRONG LETTER
    if (letter !== currentWord[nextEmpty]) {
      playErrorSound();
      setErrorCount((prev) => prev + 1);
      return;
    }

    // ✅ CORRECT LETTER
    const newInput = [...userInput];
    newInput[nextEmpty] = letter;
    setUserInput(newInput);

    const newShuffled = [...shuffledLetters];
    newShuffled[index] = "";
    setShuffledLetters(newShuffled);

    // 🎉 WORD COMPLETED
    if (newInput.join("") === currentWord) {
      setCompleted(true);

      // Save result
      setResults((prev) => [
        ...prev,
        { word: currentWord, errors: errorCount },
      ]);
    }
  };

  const reset = () => {
    setUserInput(Array(currentWord.length).fill(""));
    setShuffledLetters(currentWord.split("").sort(() => Math.random() - 0.5));
    setCompleted(false);
    setTimeLeft(60);
    setErrorCount(0);
  };

  const nextWord = () => {
    if (currentWordIndex < wordsList.length - 1) {
      setCurrentWordIndex((prev) => prev + 1);
    } else {
      setShowReport(true); // ⭐ show final report
    }
  };

  return (
    <div className="letter-container">
      <h3>Build the Word</h3>

      {/* Timer */}
      <div style={{ textAlign: "center", fontSize: "20px", margin: "10px" }}>
        ⏱️ Time Left: <b>{timeLeft}s</b>
      </div>

      {/* Image */}
      <img
        src={imageMap[currentWord]}
        alt={currentWord}
        style={{
          width: "300px",
          height: "200px",
          display: "block",
          margin: "10px auto",
          objectFit: "contain",
        }}
      />

      {/* Word slots */}
      <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
        {userInput.map((l, i) => (
          <div
            key={i}
            style={{
              width: "60px",
              height: "60px",
              borderBottom: "3px solid black",
              textAlign: "center",
              fontSize: "32px",
              margin: "0 5px",
              lineHeight: "60px",
            }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Shuffled letters */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "10px",
        }}
      >
        {shuffledLetters.map(
          (l, i) =>
            l && (
              <button
                key={i}
                onClick={() => handleLetterClick(l, i)}
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "5px",
                  fontSize: "28px",
                }}
              >
                {l}
              </button>
            )
        )}
      </div>

      {/* ✅ RESULT AFTER COMPLETION (NO POPUP) */}
      {/* ✅ RESULT AFTER COMPLETION */}
{completed && (
  <div style={{ textAlign: "center" }}>
    <p style={{ color: "green", fontSize: "20px" }}>
      ✅ Word Completed!
    </p>

    <p style={{ fontSize: "18px" }}>
      ❌ Errors Made: <b>{errorCount}</b>
    </p>

    {/* ⭐ PERFORMANCE LABEL */}
    <p
      style={{
        fontSize: "18px",
        fontWeight: "bold",
        color: errorCount <= 2 ? "green" : "orange",
      }}
    >
      {errorCount <= 2 ? "🌟 Good" : "⚠ Needs Practice"}
    </p>

    <button
      onClick={nextWord}
      style={{
        margin: "10px",
        padding: "10px 20px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Next Word
    </button>
  </div>
)}
      {/* Reset & Home */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={reset}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Reset
        </button>

        <button
          onClick={onHome}
          style={{
            margin: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Home
        </button>
      </div>

      {/* 📊 FINAL REPORT CARD */}
      {showReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h2>📊 Report Card</h2>

            {results.map((r, i) => (
              <p key={i}>
                <p key={i}>
  {r.word} → ❌ Errors: <b>{r.errors}</b> |{" "}
  <span style={{ color: r.errors <= 2 ? "green" : "orange" }}>
    {r.errors <= 2 ? "🌟 Good" : "⚠ Needs Practice"}
  </span>
</p>
              </p>
            ))}

            <button
              onClick={onHome}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "8px",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildWord;