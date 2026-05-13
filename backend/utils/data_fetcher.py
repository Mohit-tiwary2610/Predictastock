import yfinance as yf # type: ignore
import pandas as pd # type: ignore
import numpy as np # type: ignore
from datetime import datetime, timedelta
import ta # type: ignore
import time
import random


def fetch_with_retry(symbol: str, period: str, interval: str, max_retries: int = 3) -> pd.DataFrame:
    """Fetch stock data with exponential backoff retry logic."""
    for attempt in range(max_retries):
        try:
            # Exponential backoff: 1s, 2s, 4s
            wait_time = (2 ** attempt) + random.uniform(0.5, 1.5)
            time.sleep(wait_time)

            ticker = yf.Ticker(symbol.upper())
            df = ticker.history(period=period, interval=interval)

            if df is not None and not df.empty:
                print(f"[SUCCESS] Fetched {symbol} on attempt {attempt + 1}")
                return df, ticker

            print(f"[WARN] Empty data for {symbol}, attempt {attempt + 1}")

        except Exception as e:
            error_msg = str(e).lower()
            if "too many requests" in error_msg or "rate limit" in error_msg:
                wait = (2 ** attempt) * 3 + random.uniform(1, 3)
                print(f"[RATE LIMIT] {symbol} attempt {attempt + 1}, waiting {wait:.1f}s")
                time.sleep(wait)
            else:
                print(f"[ERROR] {symbol} attempt {attempt + 1}: {e}")

    return pd.DataFrame(), None


def fetch_stock_data(symbol: str, period: str = "2y", interval: str = "1d") -> dict:
    """
    Fetch historical stock data from Yahoo Finance.
    Returns dict with OHLCV data + technical indicators.
    """
    try:
        df, ticker = fetch_with_retry(symbol, period, interval)

        print(f"[DEBUG] fetch_stock_data: {symbol}, period={period}, interval={interval}, rows={len(df)}")

        if df is None or df.empty:
            return {"success": False, "error": f"No data found for symbol '{symbol}'"}

        df = df.reset_index()
        df.columns = [c.replace(" ", "_") for c in df.columns]

        # Add technical indicators
        df = add_technical_indicators(df)

        # Get company info
        info = {}
        try:
            raw_info = ticker.info
            info = {
                "name":                raw_info.get("longName", symbol),
                "sector":              raw_info.get("sector", "N/A"),
                "industry":            raw_info.get("industry", "N/A"),
                "market_cap":          raw_info.get("marketCap", 0),
                "pe_ratio":            raw_info.get("trailingPE", 0),
                "fifty_two_week_high": raw_info.get("fiftyTwoWeekHigh", 0),
                "fifty_two_week_low":  raw_info.get("fiftyTwoWeekLow", 0),
                "avg_volume":          raw_info.get("averageVolume", 0),
                "currency":            raw_info.get("currency", "USD"),
            }
        except Exception as e:
            print(f"[WARN] Could not fetch company info for {symbol}: {e}")
            info = {"name": symbol}

        # Prepare historical data for charting
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
        ticker = yf.Ticker(symbol.upper())
        df = ticker.history(period=period, interval="1d")
        df = df.reset_index()
        df.columns = [c.replace(" ", "_") for c in df.columns]
        return df
    except Exception as e:
        print(f"Error fetching raw data: {e}")
        return pd.DataFrame()


def search_stock(query: str) -> list:
    """Simple stock symbol search."""
    try:
        ticker = yf.Ticker(query.upper())
        info = ticker.info
        if info and info.get("symbol"):
            return [{
                "symbol":   info["symbol"],
                "name":     info.get("longName", query),
                "exchange": info.get("exchange", ""),
            }]
        return []
    except Exception:
        return []