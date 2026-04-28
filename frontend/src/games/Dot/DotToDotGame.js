import React, { useState, useEffect } from "react";
import "./DotToGame.css";

/* ========= SHAPES (Easy → Hard) ========= */
const shapes = [
  // Triangle
  [
    { x: 200, y: 150 },
    { x: 300, y: 300 },
    { x: 100, y: 300 }
  ],

  // Rectangle
  [
    { x: 120, y: 200 },
    { x: 320, y: 200 },
    { x: 320, y: 350 },
    { x: 120, y: 350 }
  ],

  // Rhombus
  [
    { x: 200, y: 120 },
    { x: 320, y: 250 },
    { x: 200, y: 380 },
    { x: 80, y: 250 }
  ],

  // Pentagon
  [
    { x: 200, y: 100 },
    { x: 320, y: 200 },
    { x: 270, y: 350 },
    { x: 130, y: 350 },
    { x: 80, y: 200 }
  ],

  // Hexagon
  [
    { x: 150, y: 150 },
    { x: 250, y: 150 },
    { x: 320, y: 250 },
    { x: 250, y: 350 },
    { x: 150, y: 350 },
    { x: 80, y: 250 }
  ]
];

const DotToDotGame = () => {
  const [shapeIndex, setShapeIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [redoStack, setRedoStack] = useState([]); // ✅ NEW
  const [dragging, setDragging] = useState(null);
  const [dragLine, setDragLine] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  const dots = shapes[shapeIndex];

  /* ========= VALID CONNECTIONS ========= */
  const getValidConnections = (dots) => {
    const connections = [];
    for (let i = 0; i < dots.length; i++) {
      const next = (i + 1) % dots.length;
      connections.push([i, next]);
    }
    return connections;
  };

  const validConnections = getValidConnections(dots);

  /* ========= TIMER ========= */
  useEffect(() => {
    if (timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  /* ========= MOUSE EVENTS ========= */
  const handleMouseDown = (index) => {
    setDragging(index);
    setDragLine({
      x1: dots[index].x,
      y1: dots[index].y,
      x2: dots[index].x,
      y2: dots[index].y
    });
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;

    const svg = e.target.ownerSVGElement || e.target;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());

    setDragLine((prev) => ({
      ...prev,
      x2: cursor.x,
      y2: cursor.y
    }));
  };

  const playErrorSound = () => {
    try {
      new Audio("/error.mp3").play();
    } catch {}
  };

  const isValidConnection = (a, b) => {
    return validConnections.some(
      ([x, y]) => (x === a && y === b) || (x === b && y === a)
    );
  };

  const handleMouseUp = (index) => {
    if (dragging !== null && dragging !== index) {
      const valid = isValidConnection(dragging, index);

      if (!valid) playErrorSound();

      const newLine = {
        from: dots[dragging],
        to: dots[index],
        color: valid ? "green" : "red"
      };

      setLines((prev) => [...prev, newLine]);

      // ✅ Clear redo stack when new action happens
      setRedoStack([]);
    }

    setDragging(null);
    setDragLine(null);
  };

  /* ========= UNDO ========= */
  const handleUndo = () => {
    if (lines.length === 0) return;

    const lastLine = lines[lines.length - 1];

    setLines((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, lastLine]);
  };

  /* ========= REDO ========= */
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const lastRedo = redoStack[redoStack.length - 1];

    setRedoStack((prev) => prev.slice(0, -1));
    setLines((prev) => [...prev, lastRedo]);
  };

  /* ========= CONTROLS ========= */
  const handleReset = () => {
    setLines([]);
    setRedoStack([]); // ✅ important
    setDragging(null);
    setDragLine(null);
    setTimeLeft(60);
  };

  const handleNext = () => {
    setShapeIndex((prev) => (prev + 1) % shapes.length);
    handleReset();
  };

  /* ========= PREVIEW ========= */
  const PreviewShape = () => (
    <svg width="120" height="120">
      {dots.map((dot, i) => {
        const next = dots[(i + 1) % dots.length];
        return (
          <line
            key={i}
            x1={dot.x / 4}
            y1={dot.y / 4}
            x2={next.x / 4}
            y2={next.y / 4}
            stroke="black"
          />
        );
      })}
    </svg>
  );

  return (
    <div className="dot-game-container">
      <h2>Dot-to-Dot Activity</h2>

      <p>🟢 Green = Correct | 🔴 Red = Wrong</p>

      <div style={{ marginBottom: "10px" }}>
        <p>Follow this shape:</p>
        <PreviewShape />
      </div>

      <p className="timer">
        Time Left: <b>{timeLeft}s</b>
      </p>

      <svg
        width="500"
        height="500"
        onMouseMove={handleMouseMove}
        onMouseUp={() => {
          setDragging(null);
          setDragLine(null);
        }}
      >
        {/* Draw Lines */}
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.from.x}
            y1={line.from.y}
            x2={line.to.x}
            y2={line.to.y}
            stroke={line.color}
            strokeWidth="3"
          />
        ))}

        {/* Drag Preview */}
        {dragLine && (
          <line
            x1={dragLine.x1}
            y1={dragLine.y1}
            x2={dragLine.x2}
            y2={dragLine.y2}
            stroke="blue"
            strokeDasharray="4"
          />
        )}

        {/* Dots */}
        {dots.map((dot, i) => (
          <circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r="7"
            fill="black"
            onMouseDown={() => handleMouseDown(i)}
            onMouseUp={() => handleMouseUp(i)}
          />
        ))}
      </svg>

      <div className="button-group">
        <button onClick={handleUndo} disabled={lines.length === 0}>
          ↩ Undo
        </button>

        <button onClick={handleRedo} disabled={redoStack.length === 0}>
          ↪ Redo
        </button>

        <button className="reset-btn" onClick={handleReset}>
          Reset
        </button>

        <button className="next-btn" onClick={handleNext}>
          Next
        </button>

        <button
          className="home-btn"
          onClick={() => (window.location.href = "/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default DotToDotGame;