from flask import Flask, jsonify # type: ignore
from flask_cors import CORS # type: ignore
from flask_caching import Cache # type: ignore
from flask_limiter import Limiter # type: ignore
from flask_limiter.util import get_remote_address # type: ignore
from config import Config
from routes.stock_routes import stock_bp
from routes.prediction_routes import predict_bp

app = Flask(__name__)
app.config.from_object(Config)

# Cache config
app.config["CACHE_TYPE"] = "SimpleCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = 600
cache = Cache(app)
app.cache = cache

# Rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)
app.limiter = limiter

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173", "*"]}})

app.register_blueprint(stock_bp)
app.register_blueprint(predict_bp)


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


@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "error": "Endpoint not found"}), 404

@app.errorhandler(429)
def rate_limit_exceeded(e):
    return jsonify({
        "success": False,
        "error": "Too many requests. Please slow down!",
        "retry_after": "60 seconds"
    }), 429

@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "error": "Internal server error", "details": str(e)}), 500


if __name__ == "__main__":
    print("=" * 55)
    print("  📈  Stock LSTM Forecasting API")
    print(f"  🚀  Running on http://{Config.HOST}:{Config.PORT}")
    print("=" * 55)
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)