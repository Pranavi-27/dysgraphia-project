import React, { useState, useEffect } from "react";
import "../tracepath/trace.css";

/* ========= IMAGE IMPORTS ========= */
import cat from "../../images/cat.png";
import chocolate from "../../images/chocolate.png";
import sun from "../../images/sun.png";
import book from "../../images/book.png";
import park from "../../images/park.png";

/* ========= SENTENCES ========= */
const sentencesList = [
  "The cat is sleeping on the mat",
  "I love eating chocolate ice cream",
  "The sun rises in the east",
  "She is reading a big book",
  "We are going to the park",
];

/* ========= IMAGE MAP ========= */
const imageMap = {
  "The cat is sleeping on the mat": cat,
  "I love eating chocolate ice cream": chocolate,
  "The sun rises in the east": sun,
  "She is reading a big book": book,
  "We are going to the park": park,
};

const SentenceBuilder = ({ onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [userSentence, setUserSentence] = useState([]);
  const [completed, setCompleted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(60);

  // ⭐ NEW STATES
  const [errorCount, setErrorCount] = useState(0);
  const [results, setResults] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentSentence = sentencesList[currentIndex];
  const correctWords = currentSentence.split(" ");

  /* ===== Initialize ===== */
  useEffect(() => {
    if (!currentSentence) return;

    setUserSentence(Array(correctWords.length).fill(""));
    setCompleted(false);
    setShuffledWords([...correctWords].sort(() => Math.random() - 0.5));
    setTimeLeft(60);
    setErrorCount(0);
  }, [currentSentence]);

  /* ===== Timer ===== */
  useEffect(() => {
    if (completed || showReport) return;

    if (timeLeft <= 0) {
      reset();
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, completed, showReport]);

  const playErrorSound = () => {
    try {
      new Audio("/error.mp3").play();
    } catch {}
  };

  /* ===== Word click ===== */
  const handleWordClick = (word, index) => {
    const nextEmpty = userSentence.findIndex((w) => w === "");
    if (nextEmpty === -1) return;

    // ❌ WRONG WORD
    if (word !== correctWords[nextEmpty]) {
      playErrorSound();
      setErrorCount((prev) => prev + 1);
      return;
    }

    // ✅ CORRECT WORD
    const newSentence = [...userSentence];
    newSentence[nextEmpty] = word;
    setUserSentence(newSentence);

    const newShuffled = [...shuffledWords];
    newShuffled[index] = "";
    setShuffledWords(newShuffled);

    // 🎉 COMPLETED
    if (newSentence.join(" ") === currentSentence) {
      setCompleted(true);

      // Save result
      setResults((prev) => [
        ...prev,
        { sentence: currentSentence, errors: errorCount },
      ]);

      const msg = new SpeechSynthesisUtterance(
      "You built the sentence correctly!"
      );
      window.speechSynthesis.speak(msg);
    }
  };

  const reset = () => {
    setUserSentence(Array(correctWords.length).fill(""));
    setShuffledWords([...correctWords].sort(() => Math.random() - 0.5));
    setCompleted(false);
    setTimeLeft(60);
    setErrorCount(0);
  };

  const nextSentence = () => {
    if (currentIndex < sentencesList.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowReport(true); // ⭐ final report
    }
  };

  return (
    <div className="letter-container">
      <h3>Build the Sentence</h3>

      {/* Timer */}
      <p style={{ fontSize: "18px", textAlign: "center" }}>
        ⏱️ Time Left: <b>{timeLeft}s</b>
      </p>

      {/* Image */}
      <img
        src={imageMap[currentSentence]}
        alt="Sentence context"
        style={{
          width: "300px",
          height: "200px",
          display: "block",
          margin: "10px auto",
          objectFit: "contain",
        }}
      />

      {/* Sentence slots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "20px",
        }}
      >
        {userSentence.map((w, i) => (
          <div
            key={i}
            style={{
              minWidth: "80px",
              minHeight: "50px",
              borderBottom: "3px solid black",
              textAlign: "center",
              fontSize: "22px",
              margin: "5px",
              lineHeight: "50px",
              padding: "0 10px",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Shuffled words */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          margin: "10px",
        }}
      >
        {shuffledWords.map(
          (w, i) =>
            w && (
              <button
                key={i}
                onClick={() => handleWordClick(w, i)}
                style={{
                  margin: "5px",
                  padding: "10px 15px",
                  fontSize: "18px",
                }}
              >
                {w}
              </button>
            )
        )}
      </div>

      {/* ✅ RESULT AFTER COMPLETION */}
      {completed && (
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "green", fontSize: "20px" }}>
            ✅ Sentence Completed!
          </p>

          <p style={{ fontSize: "18px" }}>
            ❌ Errors Made: <b>{errorCount}</b>
          </p>

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
            onClick={nextSentence}
            style={{
              margin: "10px",
              padding: "10px 20px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Next Sentence
          </button>
        </div>
      )}

      {/* Controls */}
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

      {/* 📊 FINAL REPORT */}
      {showReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            <h2>📊 Report Card</h2>

            {results.map((r, i) => (
              <p key={i}>
                {r.sentence} <br />
                ❌ Errors: <b>{r.errors}</b> |{" "}
                <span
                  style={{
                    color: r.errors <= 2 ? "green" : "orange",
                  }}
                >
                  {r.errors <= 2 ? "🌟 Good" : "⚠ Needs Practice"}
                </span>
              </p>
            ))}

            <button
              onClick={onHome}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
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

export default SentenceBuilder;