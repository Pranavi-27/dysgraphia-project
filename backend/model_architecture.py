# model_architecture.py
import torch
import torch.nn as nn

# ============================================================
# Autoencoder
# ============================================================
class Autoencoder(nn.Module):
    def __init__(self, input_dim, latent_dim=16):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 64), nn.ReLU(),
            nn.Linear(64, latent_dim)
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 64), nn.ReLU(),
            nn.Linear(64, input_dim)
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z)

# ============================================================
# GDST (uses AE encoder for hybrid features)
# ============================================================
class GDST:
    def __init__(self, ae, device):
        self.ae = ae.to(device)
        self.device = device

    def encode(self, x):
        with torch.no_grad():
            x = torch.tensor(x, dtype=torch.float32).to(self.device)
            return self.ae.encoder(x).cpu().numpy()

# ============================================================
# CNN + LSTM Model
# ============================================================
class CNNLSTMModel(nn.Module):
    def __init__(self, raw_dim, hybrid_dim, lstm_hidden=16):
        super().__init__()
        # CNN branch
        self.cnn = nn.Sequential(
            nn.Conv1d(1, 16, 3, padding=1), nn.ReLU(), nn.Dropout(0.3),
            nn.Conv1d(16, 32, 3, padding=1), nn.ReLU(),
            nn.AdaptiveMaxPool1d(8),
            nn.Flatten()
        )
        # LSTM branch
        self.lstm = nn.LSTM(input_size=1, hidden_size=lstm_hidden,
                            batch_first=True, bidirectional=True)
        self.lstm_dropout = nn.Dropout(0.3)
        # Hybrid branch
        self.hybrid_branch = nn.Sequential(
            nn.Linear(hybrid_dim, 64), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(64, 32), nn.ReLU()
        )
        lstm_flat_dim = (2 * lstm_hidden) * raw_dim
        combined_dim = 256 + lstm_flat_dim + 32
        self.classifier = nn.Sequential(
            nn.Linear(combined_dim, 128), nn.ReLU(), nn.Dropout(0.4),
            nn.Linear(128, 1)
        )

    def forward(self, raw_feat, hybrid_feat):
        cnn_in = raw_feat.unsqueeze(1)  # [B,1,raw_dim]
        cnn_out = self.cnn(cnn_in)

        lstm_in = raw_feat.unsqueeze(-1)  # [B,raw_dim,1]
        lstm_out, _ = self.lstm(lstm_in)
        lstm_out = self.lstm_dropout(lstm_out)
        lstm_out = lstm_out.reshape(lstm_out.size(0), -1)

        hybrid_out = self.hybrid_branch(hybrid_feat)
        combined = torch.cat([cnn_out, lstm_out, hybrid_out], dim=1)
        return self.classifier(combined)

# ============================================================
# Model Loader
# ============================================================
def load_model(model_class, ae_class, input_dim, latent_dim, hybrid_dim, lstm_hidden, path, device):
    checkpoint = torch.load(path, map_location=device)
    ae = ae_class(input_dim=input_dim, latent_dim=latent_dim).to(device)
    ae.load_state_dict(checkpoint["autoencoder_state"])
    model = model_class(raw_dim=input_dim, hybrid_dim=hybrid_dim,
                        lstm_hidden=lstm_hidden).to(device)
    model.load_state_dict(checkpoint["cnn_lstm_state"])
    model.eval()
    ae.eval()
    return model, ae
