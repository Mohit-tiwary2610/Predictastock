from flask import Flask, jsonify # pyright: ignore[reportMissingImports]
from flask_cors import CORS # pyright: ignore[reportMissingModuleSource]
from config import Config
from routes.stock_routes import stock_bp
from routes.prediction_routes import predict_bp

# ── Create Flask app ───────────────────────────────────────────────────────────
app = Flask(__name__)
app.config.from_object(Config)

# Allow React dev server (port 3000) and production
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173", "*"]}})

# ── Register blueprints ────────────────────────────────────────────────────────
app.register_blueprint(stock_bp)
app.register_blueprint(predict_bp)


# ── Health check ───────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "message":   "Stock Price Forecasting API with LSTM",
        "version":   "1.0.0",
        "status":    "running",
        "endpoints": {
            "health":         "GET  /api/health",
            "stock_data":     "GET  /api/stock/data/<SYMBOL>",
            "popular_stocks": "GET  /api/stock/popular",
            "stock_search":   "GET  /api/stock/search?q=<QUERY>",
            "stock_info":     "GET  /api/stock/info/<SYMBOL>",
            "predict":        "POST /api/predict/<SYMBOL>",
            "quick_predict":  "GET  /api/predict/quick/<SYMBOL>",
        },
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "LSTM Stock Forecaster API is healthy"})


# ── Error handlers ─────────────────────────────────────────────────────────────
@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error", "details": str(e)}), 500


# ── Run ────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 55)
    print("  📈  Stock LSTM Forecasting API")
    print(f"  🚀  Running on http://{Config.HOST}:{Config.PORT}")
    print("=" * 55)
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
