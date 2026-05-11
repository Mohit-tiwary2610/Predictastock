from flask import Blueprint, jsonify, request  # pyright: ignore[reportMissingImports]
import traceback

stock_bp = Blueprint("stock", __name__, url_prefix="/api/stock")


@stock_bp.route("/data/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    """GET /api/stock/data/<SYMBOL>"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        # Ensure safe defaults
        period = request.args.get("period") or Config.DEFAULT_PERIOD
        interval = request.args.get("interval") or Config.DEFAULT_INTERVAL

        print(f"[DEBUG] Route called: symbol={symbol}, period={period}, interval={interval}")

        result = fetch_stock_data(symbol, period=period, interval=interval)

        print(f"[DEBUG] Result success: {result.get('success')}, data_points={result.get('data_points')}")

        if not result.get("success"):
            return jsonify(result), 404

        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] Exception in get_stock_data: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Internal error: {str(e)}",
            "traceback": traceback.format_exc()
        }), 500

@stock_bp.route("/popular", methods=["GET"])
def get_popular_stocks():
    """GET /api/stock/popular"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        stocks = []
        for s in Config.POPULAR_STOCKS:
            result = fetch_stock_data(s["symbol"], period="5d")
            stocks.append({
                "symbol":           s["symbol"],
                "name":             s["name"],
                "current_price":    result.get("current_price")    if result.get("success") else None,
                "price_change":     result.get("price_change")     if result.get("success") else None,
                "price_change_pct": result.get("price_change_pct") if result.get("success") else None,
            })
        return jsonify({"success": True, "stocks": stocks}), 200

    except Exception as e:
        print(f"[ERROR] Exception in get_popular_stocks: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Internal error: {str(e)}"
        }), 500


@stock_bp.route("/search", methods=["GET"])
def search_stocks():
    """GET /api/stock/search?q=AAPL"""
    try:
        from utils.data_fetcher import search_stock

        query = request.args.get("q", "").strip()
        if not query:
            return jsonify({"success": False, "error": "Query parameter 'q' required"}), 400

        results = search_stock(query)
        return jsonify({"success": True, "results": results}), 200

    except Exception as e:
        print(f"[ERROR] Exception in search_stocks: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@stock_bp.route("/info/<symbol>", methods=["GET"])
def get_stock_info(symbol):
    """GET /api/stock/info/<SYMBOL>"""
    try:
        from utils.data_fetcher import fetch_stock_data

        result = fetch_stock_data(symbol, period="5d")
        if not result.get("success"):
            return jsonify(result), 404

        return jsonify({
            "success":          True,
            "symbol":           result["symbol"],
            "info":             result.get("info", {}),
            "current_price":    result.get("current_price"),
            "price_change":     result.get("price_change"),
            "price_change_pct": result.get("price_change_pct"),
        }), 200

    except Exception as e:
        print(f"[ERROR] Exception in get_stock_info: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@stock_bp.route("/test", methods=["GET"])
def test_endpoint():
    """Test endpoint to verify routing works"""
    return jsonify({"success": True, "message": "Stock routes are working!"}), 200