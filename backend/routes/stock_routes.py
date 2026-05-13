from flask import Blueprint, jsonify, request, current_app # type: ignore
import traceback
import time
import random
from threading import Lock

stock_bp = Blueprint("stock", __name__, url_prefix="/api/stock")

# Global request lock to queue requests one at a time
_request_lock = Lock()


def get_cache():
    return getattr(current_app, 'cache', None)


def locked_fetch(fetch_fn, *args, **kwargs):
    """Queue requests using a lock to prevent simultaneous Yahoo Finance calls."""
    with _request_lock:
        return fetch_fn(*args, **kwargs)


@stock_bp.route("/data/<symbol>", methods=["GET"])
def get_stock_data(symbol):
    """GET /api/stock/data/<SYMBOL>"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        period = request.args.get("period") or Config.DEFAULT_PERIOD
        interval = request.args.get("interval") or Config.DEFAULT_INTERVAL

        cache = get_cache()
        cache_key = f"stock_data_{symbol.upper()}_{period}_{interval}"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        print(f"[FETCH] Fresh data: {symbol}")
        result = locked_fetch(fetch_stock_data, symbol, period=period, interval=interval)

        if not result.get("success"):
            return jsonify(result), 404

        if cache:
            cache.set(cache_key, result, timeout=600)

        return jsonify(result), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal error: {str(e)}"}), 500


@stock_bp.route("/popular", methods=["GET"])
def get_popular_stocks():
    """GET /api/stock/popular"""
    try:
        from utils.data_fetcher import fetch_stock_data
        from config import Config

        cache = get_cache()
        cache_key = "popular_stocks"
        if cache:
            cached = cache.get(cache_key)
            if cached:
                print(f"[CACHE HIT] {cache_key}")
                return jsonify(cached), 200

        stocks = []
        for s in Config.POPULAR_STOCKS:
            # Queue each request one at a time
            result = locked_fetch(fetch_stock_data, s["symbol"], period="5d")
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

        return jsonify(response), 200

    except Exception as e:
        print(f"[ERROR] {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": f"Internal error: {str(e)}"}), 500


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
                return jsonify(cached), 200

        results = locked_fetch(search_stock, query)
        response = {"success": True, "results": results}

        if cache:
            cache.set(cache_key, response, timeout=300)

        return jsonify(response), 200

    except Exception as e:
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
                return jsonify(cached), 200

        result = locked_fetch(fetch_stock_data, symbol, period="5d")

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
        return jsonify({"success": False, "error": str(e)}), 500


@stock_bp.route("/test", methods=["GET"])
def test_endpoint():
    return jsonify({"success": True, "message": "Stock routes are working!"}), 200