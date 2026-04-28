// src/Game.js
import React, { useRef, useState, useEffect } from "react";
import Trace from "./games/tracepath/trace";
import BuildWord from "./games/puzzle/puzzle";
import SentenceBuilder from "./games/sentences/sentence";
import FillMissingLetters from "./games/missing/missing";
import CopySentenceGame from "./games/space/space";
import DotToDotGame from "./games/Dot/DotToDotGame";
import WarmupVideos from "./components/WarmupVideos";

const Game = ({ level, onHome }) => {
  /* ================= OTHER GAMES ================= */
  if (level === "Trace") return <Trace onHome={onHome} />;
  if (level === "Build") return <BuildWord letter="E" onHome={onHome} />;
  if (level === "Sentence") return <SentenceBuilder onHome={onHome} />;
  if (level === "Missing") return <FillMissingLetters onHome={onHome} />;
  if (level === "Space") return <CopySentenceGame onHome={onHome} />;
  if (level === "DotToDot") return <DotToDotGame onHome={onHome} />;
  if (level === "Warmup") return <WarmupVideos onHome={onHome} />;

  /* ================= TRACE GAME ================= */

  const canvasRef = useRef(null);
  const maskCanvasRef = useRef(null);

  // FIX: useRef instead of state for stable tracking
  const hasDeviatedRef = useRef(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [warning, setWarning] = useState(false);
  const [positiveMessage, setPositiveMessage] = useState("");
  const [isLevelDone, setIsLevelDone] = useState(false);

  const shapes = ["Circle", "Square", "Pentagon"];
  const englishAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const teluguAlphabets = [
    "అ","ఆ","ఇ","ఈ","ఉ","ఊ","ఋ","ౠ","ఎ","ఏ",
    "ఐ","ఒ","ఓ","ఔ","క","ఖ","గ","ఘ","ఙ","చ",
    "ఛ","జ","ఝ","ఞ","ట","ఠ","డ","ఢ","ణ","త",
    "థ","ద","ధ","న","ప","ఫ","బ","భ","మ","య",
    "ర","ల","వ","శ","ష","స","హ","ళ","ఴ"
  ];

  const targets =
    level === "Shapes"
      ? shapes
      : level === "English Alphabets"
      ? englishAlphabets
      : teluguAlphabets;

  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const currentTarget = targets[currentTargetIndex];

  /* ================= DRAW OUTLINE ================= */
  const drawOutline = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.lineWidth = 6;
    ctx.strokeStyle = "#999";

    if (level === "Shapes") {
      if (currentTarget === "Circle") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 140, 0, 2 * Math.PI);
        ctx.stroke();
      }

      if (currentTarget === "Square") {
        ctx.strokeRect(centerX - 140, centerY - 140, 280, 280);
      }

      if (currentTarget === "Pentagon") {
        const radius = 140;
        const angle = (2 * Math.PI) / 5;

        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const x = centerX + radius * Math.cos(i * angle);
          const y = centerY + radius * Math.sin(i * angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else {
      ctx.font = "bold 220px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";

// IMPORTANT: use fill instead of stroke
ctx.fillStyle = "white";
ctx.fillText(currentTarget, centerX, centerY);
    }
  };

  /* ================= MASK ================= */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawOutline();

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    const ctx = maskCanvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = level === "Shapes" ? 30 : 25;

    if (level === "Shapes") {
      const radius = 130;

      if (currentTarget === "Circle") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }

      if (currentTarget === "Square") {
        ctx.strokeRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
      }

      if (currentTarget === "Pentagon") {
        const angle = (2 * Math.PI) / 5;

        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const x = centerX + radius * Math.cos(i * angle);
          const y = centerY + radius * Math.sin(i * angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else {
      ctx.font = "bold 200px Arial";
      ctx.strokeText(currentTarget, centerX - 100, centerY + 80);
    }

    maskCanvasRef.current = maskCanvas;

    // reset state
    setWarning(false);
    setPositiveMessage("");
    setIsLevelDone(false);
    hasDeviatedRef.current = false;
  }, [currentTarget, level]);

  /* ================= CHECK PATH ================= */
const isPointOnPath = (x, y) => {
  const mask = maskCanvasRef.current;
  if (!mask) return true;

  const ctx = mask.getContext("2d");

  const radius = 6; // tolerance radius (VERY IMPORTANT)

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const px = x + dx;
      const py = y + dy;

      if (px < 0 || py < 0 || px >= mask.width || py >= mask.height)
        continue;

      const pixel = ctx.getImageData(px, py, 1, 1).data;

      if (pixel[0] > 50) {
        return true;
      }
    }
  }

  return false;
};
  /* ================= DRAW HANDLERS ================= */
  const startDrawing = (e) => {
    e.preventDefault(); // FIX SCROLL ISSUE

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault(); // FIX SCROLL ISSUE

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");

    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 3;
    ctx.stroke();

    const inside = isPointOnPath(x, y);

    if (!inside) {
      setWarning(true);
      setPositiveMessage("⚠️ Deviating! Stay on path");
      hasDeviatedRef.current = true;
    } else {
      setWarning(false);
      setPositiveMessage("👍 Good! Back on track");
    }
  };

  const stopDrawing = (e) => {
    e.preventDefault();

    setIsDrawing(false);

    if (!hasDeviatedRef.current) {
      setPositiveMessage("🎉 Perfect tracing!");
      setIsLevelDone(true);
    } else {
      setPositiveMessage("🙂 Good try! Improve accuracy");
      setIsLevelDone(false);
    }
  };

  /* ================= CONTROLS ================= */
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawOutline();

    setWarning(false);
    setPositiveMessage("");
    setIsLevelDone(false);
    hasDeviatedRef.current = false;
  };

  const nextTarget = () => {
    if (currentTargetIndex < targets.length - 1) {
      setCurrentTargetIndex((prev) => prev + 1);
    } else {
      alert("You completed this level!");
      onHome();
    }
  };

  /* ================= UI ================= */
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{
          border: "2px solid black",
          display: "block",
          margin: "20px auto",
          touchAction: "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <h3>Trace: {currentTarget}</h3>

      {warning && <p style={{ color: "red" }}>Deviating!</p>}
      {positiveMessage && <p style={{ color: "green" }}>{positiveMessage}</p>}

      <div>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={nextTarget} >
          Next
        </button>
        <button onClick={onHome}>Home</button>
      </div>
    </div>
  );
};

export default Game;