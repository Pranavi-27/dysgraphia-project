import React, { useState, useEffect } from "react";

/* ================= IMAGE IMPORTS ================= */
import cat from "../../images/cat.png";
import chocolate from "../../images/chocolate.png";
import sun from "../../images/sun.png";
import book from "../../images/book.png";
import park from "../../images/park.png";

/* ================= SENTENCE DATA ================= */
const questions = [
  {
    image: cat,
    correct: "పిల్లి చాపపై నిద్రపోతుంది",
    options: [
      "పిల్లి చాపపై నిద్రపోతుంది",
      "చాపపై పిల్లి నిద్రపోతుంది",
      "నిద్రపోతుంది పిల్లి చాపపై",
      "పిల్లి నిద్ర చాపపై పోతుంది",
    ],
  },
  {
    image: chocolate,
    correct: "నాకు చాక్లెట్ ఐస్‌క్రీమ్ చాలా ఇష్టం",
    options: [
      "నాకు చాక్లెట్ ఐస్‌క్రీమ్ చాలా ఇష్టం",
      "చాక్లెట్ నాకు ఐస్‌క్రీమ్ చాలా ఇష్టం",
      "ఐస్‌క్రీమ్ చాలా నాకు చాక్లెట్ ఇష్టం",
      "నాకు చాలా ఐస్‌క్రీమ్ చాక్లెట్ ఇష్టం",
    ],
  },
  {
    image: sun,
    correct: "సూర్యుడు తూర్పున ఉదయిస్తాడు",
    options: [
      "సూర్యుడు తూర్పున ఉదయిస్తాడు",
      "తూర్పున సూర్యుడు ఉదయిస్తాడు",
      "ఉదయిస్తాడు సూర్యుడు తూర్పున",
      "సూర్యుడు ఉదయ తూర్పున ఇస్తాడు",
    ],
  },
  {
    image: book,
    correct: "ఆమె ఒక పెద్ద పుస్తకం చదువుతోంది",
    options: [
      "ఆమె ఒక పెద్ద పుస్తకం చదువుతోంది",
      "ఒక పెద్ద పుస్తకం ఆమె చదువుతోంది",
      "చదువుతోంది ఆమె ఒక పెద్ద పుస్తకం",
      "ఆమె చదువు పెద్ద ఒక పుస్తకం",
    ],
  },
  {
    image: park,
    correct: "మేము పార్కుకు వెళ్తున్నాము",
    options: [
      "మేము పార్కుకు వెళ్తున్నాము",
      "పార్కుకు మేము వెళ్తున్నాము",
      "వెళ్తున్నాము మేము పార్కుకు",
      "మేము వెళ్తున్నాము పార్కు కు",
    ],
  },
];

const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const SentenceOrderMCQ = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const [errorCount, setErrorCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [report, setReport] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentQuestion = questions[currentIndex];

  /* ===== Initialize ===== */
  useEffect(() => {
    setShuffledOptions(shuffleArray(currentQuestion.options));
    setErrorCount(0);
    setCompleted(false);
  }, [currentIndex]);

  /* ===== Option click ===== */
  const handleOptionClick = (option) => {
    if (completed) return;

    if (option === currentQuestion.correct) {
      setCompleted(true);

      // save result
      setReport((prev) => [
        ...prev,
        {
          sentence: currentQuestion.correct,
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

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      <h2 className="text-4xl font-bold my-6">
        📘 సరైన వాక్యాన్ని ఎంచుకోండి
      </h2>

      {!showReport && (
        <>
          {/* Image */}
          <div className="w-[300px] h-[200px] bg-white rounded-xl shadow mb-6 flex items-center justify-center">
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
                ✅ సరైన వాక్యం!
              </p>

              <p style={{ fontSize: "18px" }}>
                ❌ Errors: <b>{errorCount}</b>
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
              <b>{item.sentence}</b> → {item.errors} errors (
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

export default SentenceOrderMCQ;