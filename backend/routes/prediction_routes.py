from flask import Blueprint, jsonify, request # type: ignore
import traceback

predict_bp = Blueprint("predict", __name__, url_prefix="/api/predict")


@predict_bp.route("/<symbol>", methods=["POST"])
def predict_stock(symbol):
    """POST /api/predict/<SYMBOL>"""
    try:
        from models.lstm_model import train_and_predict
        from config import Config
        
        data = request.get_json(silent=True) or {}
        prediction_days = int(data.get("prediction_days", Config.PREDICTION_DAYS))
        prediction_days = max(7, min(prediction_days, 90))
        
        print(f"[DEBUG] Predicting {symbol} for {prediction_days} days")
        
        result = train_and_predict(symbol.upper(), prediction_days=prediction_days)
        
        if not result.get("success"):
            return jsonify(result), 400
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"[ERROR] Exception in predict_stock: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500


@predict_bp.route("/quick/<symbol>", methods=["GET"])
def quick_predict(symbol):
    """GET /api/predict/quick/<SYMBOL>"""
    try:
        from models.lstm_model import train_and_predict
        from config import Config
        
        result = train_and_predict(symbol.upper(), prediction_days=Config.PREDICTION_DAYS)
        
        if not result.get("success"):
            return jsonify(result), 400
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"[ERROR] Exception in quick_predict: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Prediction failed: {str(e)}"
        }), 500


@predict_bp.route("/test", methods=["GET"])
def test_endpoint():
    """Test endpoint"""
    return jsonify({"success": True, "message": "Prediction routes are working!"}), 200
