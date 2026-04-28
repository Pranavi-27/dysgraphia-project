import torch
import numpy as np
from model_architecture import CNNLSTMModel, Autoencoder, GDST, load_model

def load_telugu_model(model_path="best_cnnlstm_model.pth", input_dim=None):
    device = "cuda" if torch.cuda.is_available() else "cpu"
    latent_dim = 16

    dummy_ae = Autoencoder(input_dim=input_dim, latent_dim=latent_dim)
    dummy_hybrid = np.zeros((1, latent_dim))
    dummy_model = CNNLSTMModel(raw_dim=input_dim, hybrid_dim=dummy_hybrid.shape[1])

    model, ae = load_model(
        CNNLSTMModel, Autoencoder, input_dim, latent_dim,
        dummy_hybrid.shape[1], lstm_hidden=16,
        path=model_path, device=device
    )
    return model, ae, device

def predict_from_features(features, model, ae, device):
    # Normalize features
    features = (features - features.mean(axis=0)) / (features.std(axis=0) + 1e-6)
    gtst = GDST(ae, device)
    hybrid_feats = gtst.encode(features.reshape(1, -1))

    raw_tensor = torch.tensor(features.reshape(1, -1), dtype=torch.float32).to(device)
    hybrid_tensor = torch.tensor(hybrid_feats, dtype=torch.float32).to(device)

    model.eval()
    with torch.no_grad():
        logits = model(raw_tensor, hybrid_tensor)
        prob = torch.sigmoid(logits).cpu().numpy()[0][0]
        pred = int(prob > 0.5)
    return pred, prob
