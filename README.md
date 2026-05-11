<div align="center">

<img src="https://raw.githubusercontent.com/stockseer-ai/stockseer/main/docs/banner.png" alt="StockSeer Banner" width="100%"/>

# 📈 StockSeer — AI Stock Price Forecasting

<p align="center">
  <strong>Deep learning LSTM neural networks predict 30-day stock price trajectories using 2 years of real market data.</strong>
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-→-38bdf8?style=for-the-badge&labelColor=0a1c30" alt="Quick Start"/></a>
  <a href="#-api-reference"><img src="https://img.shields.io/badge/API_Docs-→-c084fc?style=for-the-badge&labelColor=0a1c30" alt="API Docs"/></a>
  <a href="#-team"><img src="https://img.shields.io/badge/Team-→-4ade80?style=for-the-badge&labelColor=0a1c30" alt="Team"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-fcd34d?style=flat-square&logo=python&logoColor=black" alt="Python"/>
  <img src="https://img.shields.io/badge/TensorFlow-2.15-fb7185?style=flat-square&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/React-18.2-38bdf8?style=flat-square&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Flask-3.0-4ade80?style=flat-square&logo=flask&logoColor=black" alt="Flask"/>
  <img src="https://img.shields.io/badge/Docker-Ready-38bdf8?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/License-MIT-fcd34d?style=flat-square" alt="MIT License"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-4ade80?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/Version-1.0.0-c084fc?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-fb7185?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Mobile-Responsive-38bdf8?style=flat-square" alt="Mobile"/>
</p>

---

### 🌐 [Live Demo](https://stockseer.ai) &nbsp;·&nbsp; 📖 [Documentation](https://docs.stockseer.ai) &nbsp;·&nbsp; 🐛 [Report Bug](https://github.com/stockseer-ai/stockseer/issues) &nbsp;·&nbsp; ✨ [Request Feature](https://github.com/stockseer-ai/stockseer/issues)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/stockseer-ai/stockseer/main/docs/screenshot-home.png" alt="Home Page" style="border-radius:8px;border:1px solid #162d4a"/>
      <br/><strong>🏠 Home Page</strong>
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/stockseer-ai/stockseer/main/docs/screenshot-dashboard.png" alt="Dashboard" style="border-radius:8px;border:1px solid #162d4a"/>
      <br/><strong>📊 Analysis Dashboard</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/stockseer-ai/stockseer/main/docs/screenshot-forecast.png" alt="Forecast Table" style="border-radius:8px;border:1px solid #162d4a"/>
      <br/><strong>🔮 30-Day Forecast Table</strong>
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/stockseer-ai/stockseer/main/docs/screenshot-mobile.png" alt="Mobile View" style="border-radius:8px;border:1px solid #162d4a"/>
      <br/><strong>📱 Mobile Responsive</strong>
    </td>
  </tr>
</table>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **3-Layer Stacked LSTM** | 128→64→32 units with BatchNorm, Dropout, Huber loss |
| 📡 **Live Market Data** | Real-time OHLCV from Yahoo Finance via yfinance |
| 📊 **Technical Indicators** | SMA(20/50), EMA(20), RSI(14), MACD, Bollinger Bands |
| 🔮 **30-Day Forecast** | Multi-step iterative prediction from a 60-day lookback |
| 📐 **Model Metrics** | RMSE, MAE, MAPE, R² on held-out test set |
| ⚡ **Interactive Charts** | Chart.js with timeframe controls, SMA/LSTM toggles |
| 🔄 **Fallback Mode** | Statistical simulation when TensorFlow unavailable |
| 🐳 **Docker Ready** | Full docker-compose setup for zero-config deployment |
| 🧪 **Unit Tests** | pytest suite covering preprocessor, cache, API routes |
| 💾 **TTL Caching** | In-memory cache: 5 min (data), 30 min (predictions) |
| 📱 **Mobile Responsive** | Full touch-optimised UI for all screen sizes |
| 🎨 **Cyberpunk Design** | Glassmorphism cards, neon accents, Space Mono typography |

---

## 🏗️ Project Structure

```
stock-lstm-project/
├── 📂 backend/                  # Flask REST API
│   ├── app.py                   # Application factory, CORS, blueprints
│   ├── config.py                # LSTM hyperparameters & configuration
│   ├── wsgi.py                  # Gunicorn entry point
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile               # Backend container definition
│   ├── models/
│   │   └── lstm_model.py        # 3-layer LSTM architecture + training pipeline
│   ├── routes/
│   │   ├── stock_routes.py      # /api/stock/* endpoints
│   │   └── prediction_routes.py # /api/predict/* endpoints
│   ├── utils/
│   │   ├── data_fetcher.py      # yFinance wrapper + technical indicators
│   │   ├── preprocessor.py      # MinMaxScaler + sequence builder + metrics
│   │   └── cache.py             # TTL in-memory cache + decorator
│   └── tests/
│       └── test_backend.py      # pytest unit + integration tests
│
├── 📂 frontend/                 # React 18 SPA
│   ├── src/
│   │   ├── App.jsx              # Router + Toaster + ErrorBoundary
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page + search
│   │   │   ├── Dashboard.jsx    # Main analysis view with 4 tabs
│   │   │   └── About.jsx        # Docs + team + FAQ
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Responsive nav with hamburger menu
│   │   │   ├── Footer.jsx       # Professional footer + ticker bar
│   │   │   ├── SearchBar.jsx    # Symbol input + quick-select chips
│   │   │   ├── StockChart.jsx   # Dual Chart.js charts with controls
│   │   │   ├── PredictionCard.jsx # 7-day preview + model metrics
│   │   │   ├── MetricsPanel.jsx # Current price + fundamentals
│   │   │   ├── ForecastTable.jsx # 30-day table with BUY/SELL signals
│   │   │   ├── TechnicalIndicators.jsx # RSI + MACD + Volume charts
│   │   │   ├── ModelInfo.jsx    # LSTM architecture diagram
│   │   │   ├── PopularStocks.jsx # Live price tiles for 10 stocks
│   │   │   ├── Loader.jsx       # Animated LSTM training indicator
│   │   │   └── ErrorBoundary.jsx # React error boundary
│   │   ├── hooks/
│   │   │   └── useStockData.js  # Custom hook: state + fetch + predict
│   │   ├── utils/
│   │   │   └── api.js           # Axios wrapper (120s timeout)
│   │   └── styles/
│   │       └── globals.css      # Design system: variables, animations, responsive
│   └── package.json
│
├── 📂 ml/                       # Standalone ML scripts
│   ├── train_model.py           # CLI: --symbol AAPL --epochs 50 --save
│   └── evaluate_model.py        # Multi-symbol benchmark + CSV export
│
├── docker-compose.yml           # Backend + Frontend services
├── README.md
└── SETUP.md                     # Detailed installation guide
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | 3.10+ | [python.org](https://python.org) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| Docker | any | [docker.com](https://docker.com) *(optional)* |

### Option 1 — Docker Compose *(Recommended)*

```bash
git clone https://github.com/stockseer-ai/stockseer.git
cd stockseer
docker-compose up --build
```

| Service | URL |
|---------|-----|
| 🖥️ Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:5000 |

### Option 2 — Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```
> ✅ API at http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
npm start
```
> ✅ App at http://localhost:3000

**Run Tests:**
```bash
cd backend
python -m pytest tests/ -v
```

---

## 🧠 LSTM Architecture

```
Input (batch, 60, 1)
     │
     ▼
┌──────────────────────────────────────────┐
│  LSTM(128, return_sequences=True)         │  ← Layer 1
│  Dropout(0.2) → BatchNormalization        │
└──────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  LSTM(64, return_sequences=True)          │  ← Layer 2
│  Dropout(0.2) → BatchNormalization        │
└──────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  LSTM(32, return_sequences=False)         │  ← Layer 3
│  Dropout(0.2)                             │
└──────────────────────────────────────────┘
     │
     ▼
   Dense(16, relu) → Dense(1, linear)

Output: Predicted Close Price (next day)
```

| Hyperparameter | Value |
|----------------|-------|
| Lookback window | 60 days |
| Forecast horizon | 30 days |
| LSTM units | 128 → 64 → 32 |
| Dropout | 20% |
| Batch size | 32 |
| Max epochs | 50 |
| Optimizer | Adam (lr=0.001) |
| Loss function | Huber |
| Validation split | 10% |
| Train/test split | 80 / 20 |
| Early stopping patience | 8 |
| LR plateau factor | 0.5 |

---

## 🌐 API Reference

### Stock Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/stock/data/{SYMBOL}` | Historical OHLCV + technical indicators |
| `GET` | `/api/stock/popular` | Top 10 stocks with live prices |
| `GET` | `/api/stock/search?q={QUERY}` | Search by symbol |
| `GET` | `/api/stock/info/{SYMBOL}` | Company fundamentals |

### Predictions

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/predict/{SYMBOL}` | `{"prediction_days": 30}` | Full LSTM training + forecast |
| `GET`  | `/api/predict/quick/{SYMBOL}` | — | Quick predict (default 30 days) |

**Query Parameters:**

```
/api/stock/data/AAPL?period=2y&interval=1d
```

- `period`: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `2y`, `5y`, `max`
- `interval`: `1m`, `5m`, `15m`, `1h`, `1d`, `1wk`, `1mo`

**Example Response** (`/api/predict/AAPL`):
```json
{
  "success": true,
  "symbol": "AAPL",
  "actual": [{"date": "2024-01-02", "price": 185.20}, ...],
  "predicted": [{"date": "2024-01-02", "price": 184.85}, ...],
  "future": [{"date": "2024-06-01", "price": 192.40}, ...],
  "metrics": {"rmse": 3.42, "mae": 2.18, "mape": 1.24, "r2": 0.934},
  "predicted_trend": "bullish",
  "last_actual_price": 189.25
}
```

---

## 🛠️ Tech Stack

<table>
  <tr>
    <th>Layer</th>
    <th>Technology</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>🧠 <strong>ML</strong></td>
    <td>TensorFlow 2.15 / Keras</td>
    <td>LSTM model architecture + training</td>
  </tr>
  <tr>
    <td>📊 <strong>Data</strong></td>
    <td>yfinance + Pandas + NumPy</td>
    <td>Market data + preprocessing</td>
  </tr>
  <tr>
    <td>🔧 <strong>Preprocessing</strong></td>
    <td>scikit-learn (MinMaxScaler)</td>
    <td>Normalisation + metrics</td>
  </tr>
  <tr>
    <td>⚙️ <strong>Backend</strong></td>
    <td>Flask 3.0 + Gunicorn</td>
    <td>REST API + production server</td>
  </tr>
  <tr>
    <td>⚛️ <strong>Frontend</strong></td>
    <td>React 18 + React Router v6</td>
    <td>SPA with client-side routing</td>
  </tr>
  <tr>
    <td>📈 <strong>Charts</strong></td>
    <td>Chart.js 4 + react-chartjs-2</td>
    <td>Interactive financial charts</td>
  </tr>
  <tr>
    <td>🎨 <strong>Styling</strong></td>
    <td>Tailwind CSS + custom CSS vars</td>
    <td>Responsive design system</td>
  </tr>
  <tr>
    <td>🐳 <strong>DevOps</strong></td>
    <td>Docker + docker-compose</td>
    <td>Containerised deployment</td>
  </tr>
</table>

---

## 👥 Team

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=ArjunSharma&backgroundColor=0a1c30&style=circle" width="80" height="80" style="border-radius:50%;border:2px solid #38bdf8"/>
      <br/><strong>Arjun Sharma</strong>
      <br/><sub>Lead ML Engineer</sub>
      <br/><sub>📍 Bangalore, India</sub>
      <br/>
      <a href="https://github.com/arjunsharma"><img src="https://img.shields.io/badge/GitHub-arjunsharma-38bdf8?style=flat-square&logo=github" alt="GitHub"/></a>
    </td>
    <td align="center" width="25%">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaPatel&backgroundColor=0a1c30&style=circle" width="80" height="80" style="border-radius:50%;border:2px solid #c084fc"/>
      <br/><strong>Priya Patel</strong>
      <br/><sub>Full-Stack Engineer</sub>
      <br/><sub>📍 Mumbai, India</sub>
      <br/>
      <a href="https://github.com/priyapatel"><img src="https://img.shields.io/badge/GitHub-priyapatel-c084fc?style=flat-square&logo=github" alt="GitHub"/></a>
    </td>
    <td align="center" width="25%">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=RahulNair&backgroundColor=0a1c30&style=circle" width="80" height="80" style="border-radius:50%;border:2px solid #4ade80"/>
      <br/><strong>Rahul Nair</strong>
      <br/><sub>Data Scientist</sub>
      <br/><sub>📍 Hyderabad, India</sub>
      <br/>
      <a href="https://github.com/rahulnair"><img src="https://img.shields.io/badge/GitHub-rahulnair-4ade80?style=flat-square&logo=github" alt="GitHub"/></a>
    </td>
    <td align="center" width="25%">
      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SnehaIyer&backgroundColor=0a1c30&style=circle" width="80" height="80" style="border-radius:50%;border:2px solid #fcd34d"/>
      <br/><strong>Sneha Iyer</strong>
      <br/><sub>UI/UX Designer</sub>
      <br/><sub>📍 Chennai, India</sub>
      <br/>
      <a href="https://github.com/snehaiyer"><img src="https://img.shields.io/badge/GitHub-snehaiyer-fcd34d?style=flat-square&logo=github" alt="GitHub"/></a>
    </td>
  </tr>
</table>

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `ModuleNotFoundError: tensorflow` | `pip install tensorflow==2.15.0` |
| No data found for SYMBOL | Check ticker on [finance.yahoo.com](https://finance.yahoo.com) |
| Frontend CORS error | Ensure backend runs on port 5000 |
| Prediction takes 90s+ | Normal — LSTM training on CPU. GPU speeds up 10x |
| yfinance returns empty DataFrame | Market closed or ticker delisted |
| Apple Silicon TF error | `pip install tensorflow-macos tensorflow-metal` |
| Port 3000/5000 in use | Change in `.env` or `docker-compose.yml` |

---

## ⚠️ Disclaimer

> StockSeer is an **educational and research tool only**. Nothing on this platform constitutes financial advice, investment recommendations, or a solicitation to buy or sell any securities. LSTM models identify patterns in historical data but cannot reliably predict future market movements. Past model performance does not guarantee future results. Always consult a qualified financial advisor before making investment decisions.

---

## 📄 License

```
MIT License — Copyright (c) 2024 StockSeer Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

See [`LICENSE`](LICENSE) for the full text.

---

<div align="center">

**⭐ Star this repo if it helped you learn something!**

Made with ❤️ in India &nbsp;·&nbsp; [stockseer.ai](https://stockseer.ai) &nbsp;·&nbsp; Built with TensorFlow, React & Flask

</div>
