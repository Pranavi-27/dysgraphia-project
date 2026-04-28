import React, { useState, useRef } from "react";
import "./DysgraphiaDetector.css";

export default function DysgraphiaDetector({ goToHome }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // ✅ NEW

  // --- Handle file upload & preview ---
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  // --- Reset ---
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);

    // ✅ CLEAR FILE INPUT VALUE
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Prediction ---
  const handlePredict = async () => {
    if (!file) {
      alert("⚠️ Please upload an image first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Prediction failed");

      const data = await response.json();
      const label = data.prediction === 1 ? "Dysgraphic" : "Normal";

      setResult({ predictions: [{ class: label }] });

    } catch (error) {
      console.error("Prediction failed:", error);
      alert("❌ Prediction failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // --- Result rendering ---
  const renderResult = () => {
    if (!result?.predictions || result.predictions.length === 0) {
      return (
        <div className="result-card normal">
          🟩 <b>Normal Sample</b>
        </div>
      );
    }

    const label = result.predictions[0]?.class?.toLowerCase() || "normal";

    if (label.includes("normal")) {
      return (
        <div className="result-card normal">
          🟩 <b>Normal Sample</b>
        </div>
      );
    }

    return (
      <>
        <div className="result-card dysgraphia">
          🟥 <b>Dysgraphic Sample</b>
        </div>

        <div className="advice-card">
          💡 <b>Tips:</b>
          <ul>
            <li>Consult a psychologist or occupational therapist.</li>
            <li>Practice handwriting with guided worksheets.</li>
            <li>Use assistive tools like typing or speech-to-text.</li>
            <li>Encourage multisensory learning techniques.</li>
          </ul>

          {/* Assistive Tool Button */}
          <button className="assistive-btn" onClick={goToHome}>
            🔗 Go to Assistive Tool
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="detector-container">
      <h2 className="detector-title">📝 Dysgraphia Detection App</h2>
      <p className="detector-subtitle">
        Upload a handwriting image to detect signs of dysgraphia
      </p>

      {/* Upload */}
      <div className="upload-card">
        <h4>📁 Upload Handwriting Image:</h4>

        {/* ✅ IMPORTANT: attach ref */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />

        <div className="btn-group">
          <button onClick={handlePredict} disabled={loading} className="predict-btn">
            {loading ? "⏳ Processing..." : "🔍 Predict Dysgraphia"}
          </button>
          <button onClick={handleReset} className="reset-btn">
            🔁 Reset
          </button>
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="card">
          <h4>📸 Uploaded Image Preview:</h4>
          <img src={preview} alt="Preview" className="preview-img" />
        </div>
      )}

      {/* Result */}
      {result && <div className="card">{renderResult()}</div>}
    </div>
  );
}