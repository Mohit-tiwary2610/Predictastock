import finnhub # type: ignore
import pandas as pd # type: ignore
import numpy as np # type: ignore
from datetime import datetime, timedelta
import time
import random
import os
from threading import Lock

# Rate limiter - max 60 req/min for Finnhub free tier
_api_lock = Lock()
_last_request_time = 0
_min_interval = 1.0  # 1 second between requests

def get_finnhub_client():
    from config import Config
    return finnhub.Client(api_key=Config.FINNHUB_API_KEY)


def rate_limited_call(fn, *args, **kwargs):
    """Ensure minimum interval between API calls."""
    global _last_request_time
    with _api_lock:
        now = time.time()
        elapsed = now - _last_request_time
        if elapsed < _min_interval:
            time.sleep(_min_interval - elapsed)
        result = fn(*args, **kwargs)
        _last_request_time = time.time()
        return result


def fetch_stock_data(symbol: str, period: str = "2y", interval: str = "1d") -> dict:
    """
    Fetch historical stock data from Finnhub.
    Returns dict with OHLCV data + technical indicators.
    """
    try:
        client = get_finnhub_client()
        symbol = symbol.upper()

        # Calculate date range from period
        end = datetime.now()
        period_map = {
            "1d": 1, "5d": 5, "1mo": 30, "3mo": 90,
            "6mo": 180, "1y": 365, "2y": 730, "5y": 1825
        }
        days = period_map.get(period, 730)
        start = end - timedelta(days=days)

        start_ts = int(start.timestamp())
        end_ts = int(end.timestamp())

        print(f"[DEBUG] Fetching {symbol} from Finnhub, period={period}")

        # Fetch candle data
        res = rate_limited_call(
            client.stock_candles,
            symbol, "D", start_ts, end_ts
        )

        if res.get("s") != "ok" or not res.get("c"):
            return {"success": False, "error": f"No data found for symbol '{symbol}'"}

        # Build DataFrame
        df = pd.DataFrame({
            "Date":   pd.to_datetime(res["t"], unit="s"),
            "Open":   res["o"],
            "High":   res["h"],
            "Low":    res["l"],
            "Close":  res["c"],
            "Volume": res["v"],
        })

        print(f"[DEBUG] Got {len(df)} rows for {symbol}")

        # Add technical indicators
        df = add_technical_indicators(df)

        # Get company info
        info = {}
        try:
            profile = rate_limited_call(client.company_profile2, symbol=symbol)
            quote = rate_limited_call(client.quote, symbol)
            metrics = rate_limited_call(client.company_basic_financials, symbol, "all")

            info = {
                "name":                profile.get("name", symbol),
                "sector":              profile.get("finnhubIndustry", "N/A"),
                "industry":            profile.get("finnhubIndustry", "N/A"),
                "market_cap":          profile.get("marketCapitalization", 0) * 1_000_000,
                "pe_ratio":            metrics.get("metric", {}).get("peNormalizedAnnual", 0),
                "fifty_two_week_high": metrics.get("metric", {}).get("52WeekHigh", 0),
                "fifty_two_week_low":  metrics.get("metric", {}).get("52WeekLow", 0),
                "avg_volume":          metrics.get("metric", {}).get("10DayAverageTradingVolume", 0),
                "currency":            profile.get("currency", "USD"),
            }
        except Exception as e:
            print(f"[WARN] Could not fetch company info for {symbol}: {e}")
            info = {"name": symbol}

        # Prepare historical data
        historical = []
        for _, row in df.iterrows():
            try:
                date_str = row["Date"].strftime("%Y-%m-%d")
                historical.append({
                    "date":   date_str,
                    "open":   round(float(row["Open"]),  2),
                    "high":   round(float(row["High"]),  2),
                    "low":    round(float(row["Low"]),   2),
                    "close":  round(float(row["Close"]), 2),
                    "volume": int(row["Volume"]),
                    "sma_20": round(float(row.get("SMA_20", 0) or 0), 2),
                    "sma_50": round(float(row.get("SMA_50", 0) or 0), 2),
                    "rsi":    round(float(row.get("RSI",   0) or 0), 2),
                    "macd":   round(float(row.get("MACD",  0) or 0), 4),
                })
            except Exception:
                continue

        last_close = float(df["Close"].iloc[-1])
        prev_close = float(df["Close"].iloc[-2]) if len(df) > 1 else last_close
        price_change = last_close - prev_close
        price_change_pct = (price_change / prev_close) * 100 if prev_close else 0

        return {
            "success":          True,
            "symbol":           symbol,
            "info":             info,
            "current_price":    round(last_close, 2),
            "price_change":     round(price_change, 2),
            "price_change_pct": round(price_change_pct, 2),
            "historical":       historical,
            "data_points":      len(historical),
            "start_date":       historical[0]["date"] if historical else None,
            "end_date":         historical[-1]["date"] if historical else None,
        }

    except Exception as e:
        print(f"[ERROR] fetch_stock_data failed for {symbol}: {e}")
        return {"success": False, "error": str(e)}


def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Add SMA, EMA, RSI, MACD, Bollinger Bands to dataframe."""
    try:
        close = df["Close"]
        df["SMA_20"] = close.rolling(window=20).mean()
        df["SMA_50"] = close.rolling(window=50).mean()
        df["EMA_20"] = close.ewm(span=20, adjust=False).mean()

        delta = close.diff()
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)
        avg_gain = gain.rolling(14).mean()
        avg_loss = loss.rolling(14).mean()
        rs = avg_gain / avg_loss.replace(0, np.nan)
        df["RSI"] = 100 - (100 / (1 + rs))

        ema_12 = close.ewm(span=12, adjust=False).mean()
        ema_26 = close.ewm(span=26, adjust=False).mean()
        df["MACD"] = ema_12 - ema_26
        df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

        rolling_std = close.rolling(20).std()
        rolling_mean = close.rolling(20).mean()
        df["BB_Upper"] = rolling_mean + (rolling_std * 2)
        df["BB_Lower"] = rolling_mean - (rolling_std * 2)

        df = df.fillna(0)
    except Exception as e:
        print(f"[WARN] Could not add technical indicators: {e}")
    return df


def get_raw_dataframe(symbol: str, period: str = "2y") -> pd.DataFrame:
    """Return raw DataFrame for ML training."""
    try:
        client = get_finnhub_client()
        symbol = symbol.upper()
        end = datetime.now()
        start = end - timedelta(days=730)
        res = rate_limited_call(
            client.stock_candles,
            symbol, "D",
            int(start.timestamp()),
            int(end.timestamp())
        )
        if res.get("s") != "ok":
            return pd.DataFrame()

        df = pd.DataFrame({
            "Date":   pd.to_datetime(res["t"], unit="s"),
            "Open":   res["o"],
            "High":   res["h"],
            "Low":    res["l"],
            "Close":  res["c"],
            "Volume": res["v"],
        })
        return df
    except Exception as e:
        print(f"Error fetching raw data: {e}")
        return pd.DataFrame()


def search_stock(query: str) -> list:
    """Search stock symbols using Finnhub."""
    try:
        client = get_finnhub_client()
        results = rate_limited_call(client.symbol_lookup, query)
        matches = []
        for item in results.get("result", [])[:5]:
            if item.get("type") == "Common Stock":
                matches.append({
                    "symbol":   item.get("symbol", ""),
                    "name":     item.get("description", query),
                    "exchange": item.get("primaryExchange", ""),
                })
        return matches
    except Exception:
        return []