import React, { useState, useEffect } from "react";

/* ================= IMAGE IMPORTS ================= */
import elephant from "../../images/elephant.png";
import bicycle from "../../images/bicycle.png";
import notebook from "../../images/notebook.png";
import calendar from "../../images/calendar.png";
import hospital from "../../images/hospital.png";
import television from "../../images/television.png";
import kangaroo from "../../images/kangaroo.png";
import umbrella from "../../images/umbrella.png";
import computer from "../../images/computer.png";

/* =============== IMAGE MAP ================= */
const imageMap = {
  ELEPHANT: elephant,
  BICYCLE: bicycle,
  NOTEBOOK: notebook,
  CALENDAR: calendar,
  HOSPITAL: hospital,
  TELEVISION: television,
  KANGAROO: kangaroo,
  UMBRELLA: umbrella,
  COMPUTER: computer,
};

const FillMissingLetters = () => {
  const words = [
    { word: "BICYCLE", missing: [1, 4] },
    { word: "NOTEBOOK", missing: [2, 6] },
    { word: "CALENDAR", missing: [1, 4, 6] },
    { word: "HOSPITAL", missing: [2, 5] },
    { word: "TELEVISION", missing: [3, 6, 8] },
    { word: "KANGAROO", missing: [1, 4, 6] },
    { word: "UMBRELLA", missing: [2, 5, 7] },
    { word: "ELEPHANT", missing: [2, 5] },
    { word: "COMPUTER", missing: [1, 4, 6] },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayWord, setDisplayWord] = useState([]);
  const [options, setOptions] = useState([]);
  const [timer, setTimer] = useState(30);

  const [popup, setPopup] = useState(null);

  // ✅ NEW: error tracking
  const [errorCount, setErrorCount] = useState(0);
  const [report, setReport] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const currentWord = words[currentIndex].word;
  const missing = words[currentIndex].missing;

  /* ===== Initialize ===== */
  useEffect(() => {
    const temp = currentWord.split("");
    missing.forEach((i) => (temp[i] = "_"));
    setDisplayWord(temp);

    const correctLetters = missing.map((i) => currentWord[i]);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const randomLetters = Array.from(
      { length: 6 },
      () => alphabet[Math.floor(Math.random() * alphabet.length)]
    );

    setOptions(
      [...correctLetters, ...randomLetters].sort(() => Math.random() - 0.5)
    );

    setTimer(30);
    setErrorCount(0); // reset errors for new word
  }, [currentIndex]);

  /* ===== Timer ===== */
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setPopup({ type: "error", message: "⏳ Time's up! Try again." });
    }
  }, [timer]);

  /* ===== Letter click ===== */
  const handleLetterClick = (letter, index) => {
    const nextBlank = displayWord.indexOf("_");
    if (nextBlank === -1) return;

    if (currentWord[nextBlank] === letter) {
      const updated = [...displayWord];
      updated[nextBlank] = letter;
      setDisplayWord(updated);

      const newOptions = [...options];
      newOptions[index] = null;
      setOptions(newOptions);

      // ✅ Completed
      if (updated.join("") === currentWord) {
        const performance =
          errorCount <= 2
            ? "✅ Good"
            : errorCount <= 5
            ? "⚠ Needs Practice"
            : "❌ Needs Improvement";

        setReport((prev) => [
          ...prev,
          { word: currentWord, errors: errorCount, performance },
        ]);

        setPopup({
          type: "success",
          message: `🎉 Correct!\nErrors: ${errorCount}\n${performance}`,
        });
      }
    } else {
      new Audio("/error.mp3").play();
      setErrorCount((prev) => prev + 1); // ✅ increment error
    }
  };

  /* ===== Next ===== */
  const handleNext = () => {
    setPopup(null);

    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowReport(true); // ✅ show report card
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold my-4">
        📝 Fill in the Missing Letters
      </h2>

      <p className="text-xl text-red-600 mb-4">
        ⏳ Time Left: {timer}s
      </p>

      {/* Image */}
      <div className="w-[300px] h-[200px] bg-white rounded-xl shadow mb-6 flex items-center justify-center">
        <img
          src={imageMap[currentWord]}
          alt={currentWord}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Word */}
      <div className="flex space-x-4 text-5xl font-mono mb-8">
        {displayWord.map((ch, i) => (
          <span
            key={i}
            className={`px-4 py-2 border-b-4 ${
              ch === "_"
                ? "border-gray-400 text-gray-400"
                : "border-green-500 text-black"
            }`}
          >
            {ch}
          </span>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {options.map((letter, i) =>
          letter ? (
            <button
              key={i}
              onClick={() => handleLetterClick(letter, i)}
              className="px-6 py-4 bg-blue-600 text-white text-2xl font-bold rounded-xl shadow hover:bg-blue-700"
            >
              {letter}
            </button>
          ) : (
            <div key={i} className="w-16 h-16"></div>
          )
        )}
      </div>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl text-center">
            <p className="text-2xl mb-6 whitespace-pre-line">
              {popup.message}
            </p>
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-green-500 text-white rounded-xl"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ FINAL REPORT */}
      {showReport && (
        <div className="mt-10 p-6 bg-white rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold mb-4">
            📊 Performance Report
          </h2>

          {report.map((item, i) => (
            <p key={i} className="text-lg">
              <b>{item.word}</b> → Errors: {item.errors} → {item.performance}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default FillMissingLetters;