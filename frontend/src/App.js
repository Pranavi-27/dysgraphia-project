// src/App.js
import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Game from "./Game";
import DysgraphiaDetector from "./components/DysgraphiaDetector"; // your new component
import "./styles.css";
import SentenceOrderMCQ from "./games/sentenceordermcq/sentenceOrderMcq";
import TeluguSpellingMCQ from "./games/teluguspellmcq/teluguMcq";


const App = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [theme, setTheme] = useState("light"); // default theme
  const [showScreening, setShowScreening] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const startLevel = (level) => { 
    setSelectedLevel(level); 
    setShowScreening(false); 
  };
  const goToHome = () => { 
    setSelectedLevel(null); 
    setShowScreening(false); 
  };

  const games = [
  { 
    title: "1. Trace the Path (Hover or Drag)", 
    purpose: "Improves fine motor control and letter familiarity.", 
    example: "Follow the outline of the letter 'A' by dragging along the path without going outside the boundary.", 
    note: "✅ Strengthens hand–eye coordination and builds muscle memory for letter shapes.", 
    key: "Trace" 
  },
  { 
    title: "2. Build-a-Word", 
    purpose: "Enhances sequencing, spelling, and construction skills.", 
    example: "Given the word 'TREE' with shuffled letters → drag them into the correct order.", 
    note: "✅ Reinforces spelling patterns and word recognition in an interactive way.", 
    key: "Build" 
  },
  { 
    title: "3. Build-a-Sentence", 
    purpose: "Develops grammar, sequencing, and logical word order.", 
    example: "Given jumbled words: ['is', 'The', 'dog', 'running'] → arrange them into a proper sentence.", 
    note: "✅ Helps students practice sentence formation and improves language flow.", 
    key: "Sentence" 
  },
  { 
    title: "4. Fill in the Missing Letters", 
    purpose: "Supports spelling, visual recognition, and attention to detail.", 
    example: "For the word 'ELEPHANT' → show '_LEPHANT' and provide random letters for the student to choose the missing 'E'.", 
    note: "✅ Strengthens recall of letter patterns and improves spelling accuracy.", 
    key: "Missing" 
  },
  { 
    title: "5. Insert Spaces", 
    purpose: "Teaches proper spacing between words to improve readability.", 
    example: "Display 'Thedogisrunning' → student must insert spaces to make 'The dog is running'.", 
    note: "✅ Directly addresses one of the key difficulties dysgraphic students face: word spacing.", 
    key: "Space" 
  },
  { 
    title: "6. ✏️ Dot-to-Dot Shapes", 
    purpose: "Improves sequencing, fine motor control, and shape recognition.", 
    example: "Connect dots in order to form shapes like a star, house, or heart.", 
    note: "✅ Fun way to strengthen motor planning and spatial awareness.", 
    key: "DotToDot" 
  },
  { 
    title: "🖐 Hand Warm-Up & Stretch Videos", 
    purpose: "Reduce fatigue before writing.", 
    example: "Follow guided palm rubbing, finger spreads, wrist rotations.", 
    note: "✅ Prepares hand muscles before practice.", 
    key: "Warmup" 
  },
  {
  title: "7. Sentence Ordering (Telugu)",
  purpose: "Improves sentence structure, sequencing, and grammar in Telugu.",
  example: "Choose the correct sentence formed from jumbled words using picture clues.",
  note: "✅ Tests syntactic processing without requiring typing.",
  key: "SentenceMCQ",
},
{
  title: "8. Telugu Spelling (MCQ)",
  purpose: "Identifies spelling confusion and orthographic errors in Telugu.",
  example: "Choose the correctly spelled word among visually similar options.",
  note: "✅ Useful for detecting dysgraphic spelling patterns.",
  key: "TeluguSpellingMCQ",
},

];

  return (
    <div className="app-container">
      <Navbar
        onBack={goToHome}
        theme={theme}
        goToHome={goToHome}
        toggleTheme={toggleTheme}
        showDysgraphiaBtn={true}       // show Dysgraphia button on this page
        onDysgraphiaClick={() => setShowScreening(true)}
      />
{showScreening ? (
  <DysgraphiaDetector goToHome={goToHome} />
      ) : !selectedLevel ? (
        <div>
          <h1 style={{ textAlign: "center", fontSize: "2.5rem", marginBottom: "20px" }}>Assistive Tool for Dysgraphia</h1>

          {/* Game Cards */}
          <div className="game-grid">
            {games.map((game) => (
              <div key={game.key} className="game-card">
                <h3>{game.title}</h3>
                <p><b>Purpose:</b> {game.purpose}</p>
                <p><b>Example:</b> {game.example}</p>
                <p>{game.note}</p>
                <button onClick={() => startLevel(game.key)}>
                  Start {game.title.split(".")[1]}
                </button>
              </div>
            ))}
          </div>

          {/* Old Levels Section */}
          <h2>Practice Levels</h2>
          <p>Or practice basic tracing of shapes or alphabets:</p>
          <div className="button-row">
            <button onClick={() => startLevel("Shapes")}>Shapes</button>
            <button onClick={() => startLevel("English Alphabets")}>English Alphabets</button>
            <button onClick={() => startLevel("Telugu Alphabets")}>Telugu Alphabets</button>
          </div>
        </div>
      ) : selectedLevel === "SentenceMCQ" ? (
  <SentenceOrderMCQ />
) : selectedLevel === "TeluguSpellingMCQ" ? (
  <TeluguSpellingMCQ />
) : (
  <Game level={selectedLevel} onHome={goToHome} />
)
}
    </div>
  );
};

export default App;
