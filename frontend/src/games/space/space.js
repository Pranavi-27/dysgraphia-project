import React, { useState, useEffect } from "react";

/* ✅ Sentences */
const sentences = [
  "Elephants live in the jungle",
  "The airplane is flying high",
  "Bananas are yellow fruits",
  "Children are playing football",
  "The rainbow has many colors",
];

/* ✅ Image mapping */
const sentenceImages = {
  "Elephants live in the jungle": require("../../images/elephant.png"),
  "The airplane is flying high": require("../../images/aeroplane.png"),
  "Bananas are yellow fruits": require("../../images/banana.png"),
  "Children are playing football": require("../../images/children.png"),
  "The rainbow has many colors": require("../../images/rainbow.png"),
};

const CopySentenceGame = ({ onHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(45);
  const [completed, setCompleted] = useState(false);
const [lastErrorIndex, setLastErrorIndex] = useState(-1);
  const [popup, setPopup] = useState(null);

  // ✅ NEW: tracking
  const [errorCount, setErrorCount] = useState(0);
  const [report, setReport] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentSentence = sentences[currentIndex];
  const cleanSentence = currentSentence.replace(/\s+/g, "").toLowerCase();
  const imageSrc = sentenceImages[currentSentence];

useEffect(() => {
  setUserInput("");
  setCompleted(false);
  setTimeLeft(45);
  setPopup(null);
  setErrorCount(0);
  setLastErrorIndex(-1); // 🔥 reset
}, [currentIndex]);
  /* ⏱️ Timer */
  useEffect(() => {
    if (completed || popup) return;

    if (timeLeft <= 0) {
      setPopup({
        title: "⏰ Time’s up!",
        message: "Try again!",
        action: reset,
      });
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, completed, popup]);

  const playErrorSound = () => {
    try {
      new Audio(process.env.PUBLIC_URL + "/error.mp3").play();
    } catch {}
  };

 const handleChange = (e) => {
  const val = e.target.value;
  setUserInput(val);

  const cleanVal = val.replace(/\s+/g, "").toLowerCase();

  // Check only latest typed character
  const i = cleanVal.length - 1;

  if (i >= 0 && cleanVal[i] !== cleanSentence[i]) {
    // ✅ Prevent counting same position multiple times
    if (lastErrorIndex !== i) {
      setErrorCount((prev) => prev + 1);
      setLastErrorIndex(i);
      playErrorSound();
    }
  }
};

  /* ✅ SUBMIT LOGIC */
  const handleSubmit = () => {
  const cleanVal = userInput.replace(/\s+/g, "").toLowerCase();

  if (cleanVal !== cleanSentence) {
    playErrorSound();
    setPopup({
      title: "❌ Incorrect",
      message: `You made ${errorCount} errors. Try again!`,
      action: () => setPopup(null),
    });
    return;
  }

  setCompleted(true);

  const performance =
    errorCount === 0
      ? "🌟 Excellent"
      : errorCount <= 2
      ? "✅ Good"
      : errorCount <= 5
      ? "⚠ Needs Practice"
      : "❌ Needs Improvement";

  setReport((prev) => [
    ...prev,
    {
      sentence: currentSentence,
      errors: errorCount,
      performance,
    },
  ]);

  setPopup({
    title: "🎉 Great job!",
    message: `Errors: ${errorCount}\n${performance}`,
    action: nextSentence,
  });
};
  const reset = () => {
    setUserInput("");
    setCompleted(false);
    setTimeLeft(45);
    setPopup(null);
  };

  const nextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowReport(true);
    }
  };

  return (
    <div className="letter-container" style={{ textAlign: "center" }}>
      <h3>✍️ Copy the Sentence</h3>

      <p style={{ fontSize: "18px" }}>
        ⏱️ Time Left: <b>{timeLeft}s</b>
      </p>

      {/* Image */}
      <img
        src={imageSrc}
        alt={currentSentence}
        style={{
          width: "300px",
          height: "200px",
          objectFit: "contain",
          margin: "10px auto",
        }}
      />

      {/* Sentence */}
      <p style={{ fontSize: "22px", fontWeight: "bold" }}>
        {currentSentence}
      </p>

      {/* Input */}
     <textarea
  value={userInput}
  onChange={handleChange}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent new line
      handleSubmit();     // trigger submit
    }
  }}
  rows={2}
  cols={40}
  placeholder="Type here..."
  style={{
    fontSize: "20px",
    padding: "10px",
    borderRadius: "8px",
  }}
/>

      {/* Buttons */}
      <div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={reset}>Reset</button>
        <button onClick={onHome}>Home</button>
      </div>

      {/* Popup */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{popup.title}</h2>
            <p style={{ whiteSpace: "pre-line" }}>{popup.message}</p>
            <button
              onClick={() => {
                popup.action();
                setPopup(null);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* 📊 FINAL REPORT */}
      {showReport && (
        <div style={{ marginTop: "20px" }}>
          <h2>📊 Report Card</h2>
          {report.map((item, i) => (
            <p key={i}>
              <b>{item.sentence}</b> → Errors: {item.errors} →{" "}
              {item.performance}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default CopySentenceGame;