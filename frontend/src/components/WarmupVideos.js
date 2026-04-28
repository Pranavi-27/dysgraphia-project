
// src/components/WarmupVideos.js
import React from "react";

const WarmupVideos = ({ onHome }) => {
  return (
    <div>
      <h2>🖐 Hand Warm-Up & Stretch Videos</h2>
      <p>Do these quick exercises before writing to reduce fatigue:</p>

      <div className="video-grid">
        <div className="video-card">
          <h3>Hand Warm-Up Routine</h3>
          <iframe
            width="300"
            height="200"
            src="https://www.youtube.com/embed/wy9AS7kB1j4" // replace with real link
            title="Hand Warm-Up"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-card">
          <h3>Finger Stretch Exercise</h3>
          <iframe
            width="300"
            height="200"
            src="https://www.youtube.com/embed/C9x0KKHsrX8" // replace with real link
            title="Finger Stretch"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="video-card">
          <h3>Hand Strengthening for Kids</h3>
          <iframe
            width="300"
            height="200"
            src="https://www.youtube.com/embed/6uDN-_4v1So" // replace with real link
            title="Finger Stretch"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <button onClick={onHome} style={{ marginTop: "20px" }}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default WarmupVideos;