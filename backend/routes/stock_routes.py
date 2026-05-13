from flask import Blueprint, jsonify, request, current_app # type: ignore
import traceback
import time
import random

stock_bp = Blueprint("stock", __name__, url_prefix="/api/stock")


def get_cache():
    return getattr(current_app, 'cache', None)


@stock_bp.route("/data/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    """GET /api/stock/data/<SYMBOL>"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        period = request.args.get("period") or Config.DEFAULT_PERIOD
        interval = request.args.get("interval") or Config.DEFAULT_INTERVAL

        # Check cache first
        cache = get_cache()
        cache_key = f"stock_data_{symbol.upper()}_{period}_{interval}"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        print(f"[DEBUG] Fetching fresh: symbol={symbol}, period={period}, interval={interval}")
        time.sleep(random.uniform(0.5, 1.5))

        result = fetch_stock_data(symbol, period=period, interval=interval)

        if not result.get("success"):
            return jsonify(result), 404

        if cache:
            cache.set(cache_key, result, timeout=600)
            print(f"[CACHE SET] {cache_key}")

        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] Exception in get_stock_data: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Internal error: {str(e)}",
        }), 500


@stock_bp.route("/popular", methods=["GET"])
def get_popular_stocks():
    """GET /api/stock/popular"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        # Check cache first
        cache = get_cache()
        cache_key = "popular_stocks"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        stocks = []
        # Only fetch 5 stocks with bigger delay to avoid rate limiting
        for s in Config.POPULAR_STOCKS[:5]:
            time.sleep(random.uniform(1.5, 2.5))
            result = fetch_stock_data(s["symbol"], period="5d")
            stocks.append({
                "symbol":           s["symbol"],
                "name":             s["name"],
                "current_price":    result.get("current_price")    if result.get("success") else None,
                "price_change":     result.get("price_change")     if result.get("success") else None,
                "price_change_pct": result.get("price_change_pct") if result.get("success") else None,
            })

        response = {"success": True, "stocks": stocks}

        if cache:
            cache.set(cache_key, response, timeout=300)
            print(f"[CACHE SET] {cache_key}")

        return jsonify(response), 200

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

        cache = get_cache()
        cache_key = f"search_{query.upper()}"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        time.sleep(random.uniform(0.3, 0.8))
        results = search_stock(query)
        response = {"success": True, "results": results}

        if cache:
            cache.set(cache_key, response, timeout=300)

        return jsonify(response), 200

    except Exception as e:
        print(f"[ERROR] Exception in search_stocks: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@stock_bp.route("/info/<symbol>", methods=["GET"])
def get_stock_info(symbol):
    """GET /api/stock/info/<SYMBOL>"""
    try:
        from utils.data_fetcher import fetch_stock_data

        cache = get_cache()
        cache_key = f"stock_info_{symbol.upper()}"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        time.sleep(random.uniform(0.3, 0.8))
        result = fetch_stock_data(symbol, period="5d")

        if not result.get("success"):
            return jsonify(result), 404

        response = {
            "success":          True,
            "symbol":           result["symbol"],
            "info":             result.get("info", {}),
            "current_price":    result.get("current_price"),
            "price_change":     result.get("price_change"),
            "price_change_pct": result.get("price_change_pct"),
        }

        if cache:
            cache.set(cache_key, response, timeout=300)

        return jsonify(response), 200

    except Exception as e:
        print(f"[ERROR] Exception in get_stock_info: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@stock_bp.route("/test", methods=["GET"])
def test_endpoint():
    """Test endpoint to verify routing works"""
    return jsonify({"success": True, "message": "Stock routes are working!"}), 200