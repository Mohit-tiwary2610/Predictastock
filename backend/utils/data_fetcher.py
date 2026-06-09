import requests
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import time
import os
from threading import Lock
 
_api_lock = Lock()
 
TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY", "3f3c1a3549e24b5a96f67c505074693c")
BASE_URL = "https://api.twelvedata.com"
 
 
def fetch_with_retry(symbol: str, period: str, interval: str, max_retries: int = 3):
    """Fetch stock data from Twelve Data API with retry logic."""
 
    # Convert yfinance period format to Twelve Data outputsize
    period_map = {
        "1d": 1, "5d": 5, "1mo": 30, "3mo": 90,
        "6mo": 180, "1y": 365, "2y": 730, "5y": 1825
    }
    outputsize = period_map.get(period, 730)  # default 2 years
 
    for attempt in range(max_retries):
        try:
            url = f"{BASE_URL}/time_series"
            params = {
                "symbol": symbol.upper(),
                "interval": interval,
                "outputsize": outputsize,
                "apikey": TWELVE_DATA_API_KEY,
                "format": "JSON"
            }
            response = requests.get(url, params=params, timeout=15)
            data = response.json()
 
            if data.get("status") == "error":
                print(f"[ERROR] API error for {symbol}: {data.get('message')}")
                time.sleep(2 ** attempt)
                continue
 
            values = data.get("values", [])
            if not values:
                print(f"[WARN] Empty data for {symbol}, attempt {attempt + 1}")
                time.sleep(2 ** attempt)
                continue
 
            # Convert to DataFrame
            df = pd.DataFrame(values)
            df = df.rename(columns={
                "datetime": "Date",
                "open": "Open",
                "high": "High",
                "low": "Low",
                "close": "Close",
                "volume": "Volume"
            })
            df["Date"] = pd.to_datetime(df["Date"])
            df["Open"] = df["Open"].astype(float)
            df["High"] = df["High"].astype(float)
            df["Low"] = df["Low"].astype(float)
            df["Close"] = df["Close"].astype(float)
            df["Volume"] = df["Volume"].fillna(0).astype(float).astype(int)
            df = df.sort_values("Date").reset_index(drop=True)
 
            print(f"[SUCCESS] Fetched {symbol} on attempt {attempt + 1}")
            return df
 
        except Exception as e:
            print(f"[ERROR] {symbol} attempt {attempt + 1}: {e}")
            time.sleep(2 ** attempt)
 
    return pd.DataFrame()
 
 
def fetch_company_info(symbol: str) -> dict:
    """Fetch company profile from Twelve Data."""
    try:
        # Profile endpoint
        url = f"{BASE_URL}/profile"
        params = {"symbol": symbol.upper(), "apikey": TWELVE_DATA_API_KEY}
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
 
        if data.get("status") == "error":
            return {"name": symbol}
 
        # Statistics endpoint for PE ratio etc
        stats_url = f"{BASE_URL}/statistics"
        stats_params = {"symbol": symbol.upper(), "apikey": TWELVE_DATA_API_KEY}
        stats_response = requests.get(stats_url, params=stats_params, timeout=10)
        stats = stats_response.json()
 
        valuations = stats.get("statistics", {}).get("valuations_metrics", {})
        financials = stats.get("statistics", {}).get("financials", {})
 
        return {
            "name":                data.get("name", symbol),
            "sector":              data.get("sector", "N/A"),
            "industry":            data.get("industry", "N/A"),
            "market_cap":          financials.get("market_capitalization", 0),
            "pe_ratio":            valuations.get("trailing_pe", 0),
            "fifty_two_week_high": data.get("fifty_two_week", {}).get("high", 0) if isinstance(data.get("fifty_two_week"), dict) else 0,
            "fifty_two_week_low":  data.get("fifty_two_week", {}).get("low", 0) if isinstance(data.get("fifty_two_week"), dict) else 0,
            "avg_volume":          0,
            "currency":            data.get("currency", "USD"),
        }
    except Exception as e:
        print(f"[WARN] Could not fetch company info for {symbol}: {e}")
        return {"name": symbol}
 
 
def fetch_stock_data(symbol: str, period: str = "2y", interval: str = "1d") -> dict:
    """
    Fetch historical stock data from Twelve Data API.
    Returns dict with OHLCV data + technical indicators.
    """
    try:
        with _api_lock:
            df = fetch_with_retry(symbol, period, interval)
 
        print(f"[DEBUG] fetch_stock_data: {symbol}, period={period}, rows={len(df)}")
 
        if df is None or df.empty:
            return {"success": False, "error": f"No data found for symbol '{symbol}'"}
 
        df = add_technical_indicators(df)
 
        # Get company info
        info = fetch_company_info(symbol)
 
        historical = []
        for _, row in df.iterrows():
            try:
                date_val = row["Date"]
                if hasattr(date_val, "strftime"):
                    date_str = date_val.strftime("%Y-%m-%d")
                else:
                    date_str = str(date_val)[:10]
 
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
            "symbol":           symbol.upper(),
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
        df = fetch_with_retry(symbol, period, "1d")
        return df if df is not None else pd.DataFrame()
    except Exception as e:
        print(f"Error fetching raw data: {e}")
        return pd.DataFrame()
 
 
def search_stock(query: str) -> list:
    """Search stocks using Twelve Data symbol search."""
    try:
        url = f"{BASE_URL}/symbol_search"
        params = {
            "symbol": query.upper(),
            "apikey": TWELVE_DATA_API_KEY
        }
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
 
        results = []
        for item in data.get("data", [])[:5]:
            if item.get("instrument_type") == "Common Stock":
                results.append({
                    "symbol":   item.get("symbol", ""),
                    "name":     item.get("instrument_name", query),
                    "exchange": item.get("exchange", ""),
                })
        return results
    except Exception:
        return []
