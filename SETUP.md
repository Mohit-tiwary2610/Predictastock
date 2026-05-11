# 🚀 Setup Guide — Stock Price Forecasting with LSTM

## Prerequisites

| Tool       | Version  | Install |
|------------|----------|---------|
| Python     | 3.10+    | python.org |
| Node.js    | 18+      | nodejs.org |
| npm        | 9+       | (comes with Node) |
| Git        | any      | git-scm.com |

---

## 1. Clone / Extract Project

```bash
# If using Git
git clone https://github.com/yourname/stock-lstm-project.git
cd stock-lstm-project

# Or just extract the ZIP and open in VS Code
```

---

## 2. Backend Setup (Flask + TensorFlow)

```bash
cd backend

# Create a virtual environment (strongly recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Run the development server
python app.py
```

✅ API will be running at: **http://localhost:5000**

Test it:
```bash
curl http://localhost:5000/api/health
# {"message": "LSTM Stock Forecaster API is healthy", "status": "ok"}
```

---

## 3. Frontend Setup (React)

Open a **new terminal** (keep backend running):

```bash
cd frontend

# Install Node dependencies
npm install

# Start React dev server
npm start
```

✅ App will open at: **http://localhost:3000**

---

## 4. Using the App

1. Open **http://localhost:3000**
2. Click **DASHBOARD** in the navbar
3. Type a stock symbol (e.g. `AAPL`) or click a quick-select chip
4. Historical data loads with candlestick chart + technical indicators
5. Click **🚀 Run Prediction** in the right panel
6. Wait ~30–90 seconds for LSTM training to complete
7. View forecast chart, 30-day table, model metrics

---

## 5. API Endpoints Reference

| Method | URL | Description |
|--------|-----|-------------|
| GET    | `/api/health` | Health check |
| GET    | `/api/stock/data/<SYMBOL>` | Historical OHLCV + indicators |
| GET    | `/api/stock/popular` | Top 10 stocks with current prices |
| GET    | `/api/stock/search?q=<QUERY>` | Search stock symbols |
| GET    | `/api/stock/info/<SYMBOL>` | Company info only |
| POST   | `/api/predict/<SYMBOL>` | Run full LSTM pipeline |
| GET    | `/api/predict/quick/<SYMBOL>` | Quick predict (GET version) |

### POST /api/predict/AAPL — Request Body
```json
{
  "prediction_days": 30
}
```

### POST /api/predict/AAPL — Response Shape
```json
{
  "success": true,
  "symbol": "AAPL",
  "actual": [{"date": "2024-01-02", "price": 185.20}, ...],
  "predicted": [{"date": "2024-01-02", "price": 184.90}, ...],
  "future": [{"date": "2024-03-01", "price": 192.40}, ...],
  "metrics": {
    "rmse": 3.42,
    "mae": 2.18,
    "mape": 1.23,
    "r2": 0.94
  },
  "training_history": [{"epoch": 1, "loss": 0.042, "val_loss": 0.051}, ...],
  "model_config": {
    "sequence_length": 60,
    "prediction_days": 30,
    "lstm_units": [128, 64, 32],
    "dropout": 0.2,
    "epochs": 50
  },
  "predicted_trend": "bullish",
  "last_actual_price": 185.20,
  "last_predicted_price": 187.60
}
```

---

## 6. Standalone ML Scripts

### Train a model for a specific stock
```bash
cd ml
python train_model.py --symbol AAPL --epochs 50 --save
# Saves AAPL_lstm_model.keras + training plot PNG
```

### Evaluate multiple stocks
```bash
python evaluate_model.py --symbols AAPL GOOGL MSFT TSLA NVDA
# Prints metrics table + saves evaluation_results.csv
```

---

## 7. Docker (Optional)

```bash
# Build and start both services
docker-compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

---

## 8. Run Tests

```bash
cd backend
pip install pytest
python -m pytest tests/ -v
```

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError: tensorflow` | `pip install tensorflow==2.15.0` |
| `No data found for SYMBOL` | Check ticker is valid on finance.yahoo.com |
| Frontend shows CORS error | Make sure backend is running on port 5000 |
| Prediction takes forever | Normal — LSTM training takes 30–90s on CPU |
| `yfinance` returns empty df | Market may be closed or ticker delisted |

### TensorFlow Not Available?
If TensorFlow fails to install (e.g., Apple Silicon without proper setup), the app
**automatically falls back to a statistical simulation** mode and still produces
forecast outputs. Install TensorFlow for real deep learning predictions.

For Apple Silicon:
```bash
pip install tensorflow-macos tensorflow-metal
```

---

## 10. Project Configuration (config.py)

Key settings you can tune in `backend/config.py`:

```python
SEQUENCE_LENGTH = 60    # Days to look back
PREDICTION_DAYS = 30    # Days to forecast
EPOCHS = 50             # Max training epochs
BATCH_SIZE = 32         # Training batch size
LSTM_UNITS_1 = 128      # First LSTM layer units
LSTM_UNITS_2 = 64       # Second LSTM layer units
LSTM_UNITS_3 = 32       # Third LSTM layer units
DROPOUT_RATE = 0.2      # Dropout probability
LEARNING_RATE = 0.001   # Adam optimizer LR
DEFAULT_PERIOD = "2y"   # Historical data period
```
