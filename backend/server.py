from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import os
from feature_extractor import extract_features_from_image
from model_inference import load_telugu_model, predict_from_features

app = Flask(__name__)
CORS(app)

# --------------------------
# Load Model and Normalization
# --------------------------
input_dim = 25  # must match number of features extracted during training
model, ae, device = load_telugu_model(model_path="best_cnnlstm_model.pth", input_dim=input_dim)

# Load normalization parameters
try:
    feature_mean = np.load("feature_mean.npy")
    feature_std = np.load("feature_std.npy")
    print(f"[INFO] Loaded normalization parameters: mean.shape={feature_mean.shape}, std.shape={feature_std.shape}")
except FileNotFoundError:
    feature_mean = None
    feature_std = None
    print("[WARN] No normalization parameters found — raw features will be used.")

# Decision threshold to control sensitivity
DECISION_THRESHOLD = 0.6  # adjust between 0.5 and 0.7 based on results


# --------------------------
# Error Handling
# --------------------------
@app.errorhandler(Exception)
def handle_exception(e):
    return jsonify({"error": str(e)}), 500


# --------------------------
# Prediction Endpoint
# --------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)

    if img is None:
        return jsonify({"error": "Invalid image"}), 400

    # Save a temp copy (optional, useful for debugging)
    temp_path = "temp_input.png"
    cv2.imwrite(temp_path, img)

    # Extract features
    features_dict = extract_features_from_image(temp_path)
    if features_dict is None:
        return jsonify({"error": "No features extracted (blank or invalid image?)"}), 400

    features_array = np.array(list(features_dict.values()), dtype=np.float32)

    if features_array.shape[0] != input_dim:
        return jsonify({"error": f"Feature mismatch: expected {input_dim}, got {features_array.shape[0]}"}), 500

    # Normalize features if parameters exist
    if feature_mean is not None and feature_std is not None:
        features_array = (features_array - feature_mean) / (feature_std + 1e-8)

    # Predict using model
    pred_class, pred_conf = predict_from_features(features_array, model, ae, device)
    print(f"[DEBUG] Raw model prediction: class={pred_class}, confidence={pred_conf:.4f}")

    # Apply decision threshold to reduce false positives
    final_class = int(pred_conf > DECISION_THRESHOLD)
    print(f"[INFO] Final prediction: {'Likely Dysgraphia' if final_class else 'Non-Dysgraphic'}")

    return jsonify({
        "prediction": final_class,
        "confidence": float(pred_conf),
        "threshold": DECISION_THRESHOLD
    })


# --------------------------
# Start Server
# --------------------------
if __name__ == "__main__":
    print("[INFO] Flask server running at http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
