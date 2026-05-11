import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120000,   // 2-minute timeout (model training takes time)
  headers: { "Content-Type": "application/json" },
});

// ── Response interceptor ──────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const msg =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(msg));
  }
);

// ── Stock Data ────────────────────────────────────────────────────────────────
export const getStockData = (symbol, period = "2y") =>
  api.get(`/api/stock/data/${symbol}`, { params: { period } });

export const getPopularStocks = () =>
  api.get("/api/stock/popular");

export const searchStocks = (query) =>
  api.get("/api/stock/search", { params: { q: query } });

export const getStockInfo = (symbol) =>
  api.get(`/api/stock/info/${symbol}`);

// ── Predictions ───────────────────────────────────────────────────────────────
export const getPrediction = (symbol, predictionDays = 30) =>
  api.post(`/api/predict/${symbol}`, { prediction_days: predictionDays });

export const getQuickPrediction = (symbol) =>
  api.get(`/api/predict/quick/${symbol}`);

// ── Health ────────────────────────────────────────────────────────────────────
export const healthCheck = () =>
  api.get("/api/health");

export default api;
