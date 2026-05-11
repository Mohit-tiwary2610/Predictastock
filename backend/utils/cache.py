"""
Simple in-memory cache with TTL.
Used to cache stock data fetches and avoid repeated yFinance calls.
"""

import time
from functools import wraps
from typing import Any, Optional


class TTLCache:
    """
    A lightweight in-memory key→value cache with per-entry TTL.
    Thread-safety is NOT guaranteed for multi-worker deployments;
    use Redis for production multi-worker setups.
    """

    def __init__(self):
        self._store: dict[str, tuple[Any, float]] = {}

    def get(self, key: str) -> Optional[Any]:
        """Return cached value or None if expired / not found."""
        entry = self._store.get(key)
        if entry is None:
            return None
        value, expires_at = entry
        if time.time() > expires_at:
            del self._store[key]
            return None
        return value

    def set(self, key: str, value: Any, ttl_seconds: int = 300) -> None:
        """Store value with TTL (seconds)."""
        self._store[key] = (value, time.time() + ttl_seconds)

    def delete(self, key: str) -> None:
        self._store.pop(key, None)

    def clear(self) -> None:
        self._store.clear()

    def __len__(self) -> int:
        # Evict expired entries and count
        now = time.time()
        self._store = {k: v for k, v in self._store.items() if v[1] > now}
        return len(self._store)


# ── Singleton cache instances ──────────────────────────────────────────────────
stock_cache      = TTLCache()   # 5-minute TTL  — live price / OHLCV data
prediction_cache = TTLCache()   # 30-minute TTL — LSTM predictions (expensive)


# ── Decorator helper ───────────────────────────────────────────────────────────
def cached(cache: TTLCache, key_fn, ttl: int = 300):
    """
    Decorator that caches the return value of a function.

    Usage:
        @cached(stock_cache, lambda symbol: f"stock:{symbol}", ttl=300)
        def expensive_fetch(symbol):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = key_fn(*args, **kwargs)
            result = cache.get(key)
            if result is not None:
                return result
            result = func(*args, **kwargs)
            if result and result.get("success"):
                cache.set(key, result, ttl)
            return result
        return wrapper
    return decorator
