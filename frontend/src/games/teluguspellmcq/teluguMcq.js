import React, { useState, useEffect } from "react";

/* ================= IMAGE IMPORTS ================= */
import knowledge from "../../images/knowledge.png";
import focus from "../../images/focus.png";
import apology from "../../images/apology.png";
import letter from "../../images/letter.png";
import question from "../../images/question.png";
import science from "../../images/science.png";
import decision from "../../images/decision.png";

/* =============== QUESTIONS DATA ================= */
const questions = [
  { image: knowledge, correct: "జ్ఞానం", options: ["జ్ఞానం", "జ్నానం", "జ్ఞానమ్", "జ్ఞాన"] },
  { image: focus, correct: "శ్రద్ధ", options: ["శ్రద్ధ", "శ్రధ్ధ", "స్రద్ధ", "శ్రధ"] },
  { image: apology, correct: "క్షమించండి", options: ["క్షమించండి", "క్షమించండి్", "కషమించండి", "క్షమించండీ"] },
  { image: letter, correct: "అక్షరం", options: ["అక్షరం", "అక్షరమ్", "అక్సరం", "అక్షర"] },
  { image: question, correct: "ప్రశ్న", options: ["ప్రశ్న", "ప్రస్న", "ప్రశ్న్", "ప్రశన"] },
  { image: science, correct: "విజ్ఞానం", options: ["విజ్ఞానం", "విజ్నానం", "విజ్ఞానమ్", "విజ్ఞాన"] },
  { image: decision, correct: "నిర్ణయం", options: ["నిర్ణయం", "నిర్నయం", "నిర్ణయమ్", "నిర్నయ"] },
];

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const TeluguSpellingMCQ = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const [timer, setTimer] = useState(30);

  // ⭐ NEW STATES
  const [errorCount, setErrorCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentQuestion = questions[currentIndex];

  /* ===== Initialize ===== */
  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuestion.options));
    setTimer(30);
    setErrorCount(0);
    setCompleted(false);
  }, [currentIndex]);

  /* ===== Timer ===== */
  useEffect(() => {
    if (completed || showReport) return;

    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setErrorCount((prev) => prev + 1);
    }
  }, [timer, completed, showReport]);

  /* ===== Option Click ===== */
  const handleOptionClick = (option) => {
    if (completed) return;

    if (option === currentQuestion.correct) {
      setCompleted(true);

      // ⭐ Save result
      setReport((prev) => [
        ...prev,
        {
          word: currentQuestion.correct,
          errors: errorCount,
        },
      ]);
    } else {
      new Audio("/error.mp3").play();
      setErrorCount((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowReport(true);
    }
  };

  const getPerformance = (errors) => {
    if (errors === 0) return "Excellent 🌟";
    if (errors <= 2) return "Good 👍";
    return "Needs Practice ⚠️";
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      <h2 className="text-4xl font-bold my-4">
        🖼️ Choose the Correct Telugu Word
      </h2>

      {!showReport && (
        <>
          <p className="text-xl text-red-600 mb-4">
            ⏳ Time Left: {timer}s
          </p>

          {/* Image */}
          <div className="w-[300px] h-[200px] bg-white rounded-xl shadow mb-8 flex items-center justify-center">
            <img
              src={currentQuestion.image}
              alt="question"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Options */}
          <div className="mcq-container">
            {shuffledOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="mcq-btn"
                disabled={completed}
              >
                <span className="font-bold">{i + 1}.</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>

          {/* ✅ RESULT AFTER CORRECT */}
          {completed && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p style={{ fontSize: "20px", color: "green" }}>
                ✅ Correct Answer!
              </p>

              <p style={{ fontSize: "18px" }}>
                ❌ Errors Made: <b>{errorCount}</b>
              </p>

              <p style={{ fontSize: "18px", fontWeight: "bold" }}>
                {getPerformance(errorCount)}
              </p>

              <button
                onClick={nextQuestion}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* 🏆 FINAL REPORT */}
      {showReport && (
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            width: "80%",
            maxWidth: "500px",
          }}
        >
          <h2>📊 Report Card</h2>

          {report.map((item, i) => (
            <p key={i} style={{ margin: "10px 0", fontSize: "18px" }}>
              <b>{item.word}</b> → {item.errors} errors (
              {getPerformance(item.errors)})
            </p>
          ))}

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default TeluguSpellingMCQ;