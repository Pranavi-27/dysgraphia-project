import React, { useState, useEffect, useRef } from "react";
import opentype from "opentype.js";
import "./trace.css";

const Letter = ({ char }) => {
  const [pathData, setPathData] = useState(null);
  const pathRef = useRef(null);
  const svgRef = useRef(null);
  const boxRef = useRef(null); // ✅ NEW

  const [deviation, setDeviation] = useState(false);
  const [success, setSuccess] = useState(false);
  const [insideBox, setInsideBox] = useState(false);

  // 🔤 Load and center letter
  useEffect(() => {
    async function loadFont() {
      const font = await opentype.load("/fonts/arial.ttf");
      const glyph = font.charToGlyph(char);

      const fontSize = 260;

      const path = glyph.getPath(0, 0, fontSize);
      const bbox = path.getBoundingBox();

      const width = bbox.x2 - bbox.x1;
      const height = bbox.y2 - bbox.y1;

      const x = (240 - width) / 2 - bbox.x1;
      const y = (240 + height) / 2 - bbox.y2;

      const finalPath = glyph.getPath(x, y, fontSize);

      setPathData(finalPath.toPathData());
      setDeviation(false);
      setSuccess(false);
      setInsideBox(false);
    }

    loadFont();
  }, [char]);

  // 🖱 Mouse tracking
  const handleMouseMove = (e) => {
    if (!pathRef.current || !svgRef.current || !boxRef.current) return;

    // ✅ Get actual box position on screen
    const boxRect = boxRef.current.getBoundingClientRect();

    // 🚫 If outside visible box → ignore completely
    if (
      e.clientX < boxRect.left ||
      e.clientX > boxRect.right ||
      e.clientY < boxRect.top ||
      e.clientY > boxRect.bottom
    ) {
      setInsideBox(false);
      setDeviation(false);
      setSuccess(false);
      return;
    }

    // ✅ Inside box
    setInsideBox(true);

    // Convert to SVG coords
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    const { x, y } = svgP;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const path2d = new Path2D(pathRef.current.getAttribute("d"));

    // ✅ Check inside letter (filled area)
    if (ctx.isPointInPath(path2d, x, y)) {
      setDeviation(false);
      setSuccess(true);
    } else {
      setDeviation(true);
      setSuccess(false);
    }
  };

  return (
    <div className="letter-container">
      <h3>Trace: {char}</h3>

      {pathData && (
        <svg
          ref={svgRef}
          className="trace-svg"
          viewBox="0 0 240 240"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            // ✅ Extra safety
            setInsideBox(false);
            setDeviation(false);
            setSuccess(false);
          }}
        >
          {/* 🟦 Practice Box */}
          <rect
            ref={boxRef}
            x="5"
            y="5"
            width="230"
            height="230"
            className="trace-box"
          />

          {/* ✏️ Letter */}
          <path
            ref={pathRef}
            d={pathData}
            stroke={deviation ? "red" : success ? "#d3687f" : "#444"}
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* ✅ Messages ONLY when inside box */}
      {insideBox && deviation && !success && (
        <p className="error-msg">❌ Stay on the letter</p>
      )}

      {insideBox && success && !deviation && (
        <p className="success-msg">✅ Good tracing!</p>
      )}
    </div>
  );
};

export default Letter;