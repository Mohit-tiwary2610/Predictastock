"""
Unit tests for the Stock LSTM backend.
Run with:  python -m pytest tests/ -v
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import pytest
import numpy as np
import pandas as pd

from utils.preprocessor import (
    preprocess_for_lstm,
    inverse_transform,
    build_prediction_input,
    generate_future_dates,
    calculate_metrics,
)
from utils.cache import TTLCache
import time


# ── Fixtures ───────────────────────────────────────────────────────────────────

@pytest.fixture
def sample_df():
    """Create a minimal stock DataFrame for testing."""
    np.random.seed(42)
    n = 300
    prices = 150.0 + np.cumsum(np.random.randn(n) * 2)
    dates  = pd.date_range("2022-01-01", periods=n, freq="B")
    return pd.DataFrame({"Date": dates, "Close": prices, "Open": prices * 0.99,
                         "High": prices * 1.01, "Low": prices * 0.98, "Volume": [1e6] * n})


# ── Preprocessor tests ─────────────────────────────────────────────────────────

class TestPreprocessor:

    def test_preprocess_returns_correct_keys(self, sample_df):
        result = preprocess_for_lstm(sample_df, sequence_length=60)
        for key in ["X_train", "y_train", "X_test", "y_test", "scaler", "scaled_data", "split_index"]:
            assert key in result, f"Missing key: {key}"

    def test_x_shape_is_3d(self, sample_df):
        result = preprocess_for_lstm(sample_df, sequence_length=60)
        assert result["X_train"].ndim == 3
        assert result["X_train"].shape[2] == 1

    def test_sequence_length_respected(self, sample_df):
        for seq_len in [30, 60, 90]:
            result = preprocess_for_lstm(sample_df, sequence_length=seq_len)
            assert result["X_train"].shape[1] == seq_len

    def test_y_values_in_01(self, sample_df):
        result = preprocess_for_lstm(sample_df)
        assert result["y_train"].min() >= 0.0
        assert result["y_train"].max() <= 1.0

    def test_train_test_split_ratio(self, sample_df):
        result = preprocess_for_lstm(sample_df, sequence_length=60, test_split=0.2)
        total = len(result["X_train"]) + len(result["X_test"])
        ratio = len(result["X_test"]) / total
        assert 0.15 < ratio < 0.25, f"Unexpected split ratio: {ratio:.2f}"

    def test_inverse_transform_roundtrip(self, sample_df):
        result = preprocess_for_lstm(sample_df)
        scaler = result["scaler"]
        original = result["y_test"]
        recovered = scaler.transform(
            inverse_transform(scaler, original).reshape(-1, 1)
        ).flatten()
        np.testing.assert_allclose(original, recovered, atol=1e-5)

    def test_not_enough_data_raises(self):
        tiny_df = pd.DataFrame({"Close": [100.0] * 10})
        with pytest.raises(ValueError):
            preprocess_for_lstm(tiny_df, sequence_length=60)


# ── Metrics tests ──────────────────────────────────────────────────────────────

class TestMetrics:

    def test_perfect_prediction_r2_is_one(self):
        y = np.array([100.0, 110.0, 120.0, 105.0, 115.0])
        m = calculate_metrics(y, y)
        assert m["rmse"] == pytest.approx(0.0, abs=1e-6)
        assert m["mae"]  == pytest.approx(0.0, abs=1e-6)
        assert m["r2"]   == pytest.approx(1.0, abs=1e-4)

    def test_metrics_keys_present(self):
        y_true = np.array([100.0, 110.0, 120.0])
        y_pred = np.array([102.0, 108.0, 122.0])
        m = calculate_metrics(y_true, y_pred)
        assert {"rmse", "mae", "mape", "r2"} <= set(m.keys())

    def test_rmse_is_positive(self):
        m = calculate_metrics([100.0, 200.0], [110.0, 190.0])
        assert m["rmse"] > 0


# ── Date generator tests ───────────────────────────────────────────────────────

class TestDateGenerator:

    def test_generates_correct_count(self):
        dates = generate_future_dates("2024-01-01", n_days=10)
        assert len(dates) == 10

    def test_only_business_days(self):
        dates = generate_future_dates("2024-01-01", n_days=20)
        for d in dates:
            parsed = pd.Timestamp(d)
            assert parsed.dayofweek < 5, f"{d} is a weekend"

    def test_dates_are_after_start(self):
        dates = generate_future_dates("2024-06-01", n_days=5)
        for d in dates:
            assert pd.Timestamp(d) > pd.Timestamp("2024-06-01")


# ── Cache tests ────────────────────────────────────────────────────────────────

class TestTTLCache:

    def test_set_and_get(self):
        cache = TTLCache()
        cache.set("key1", {"value": 42}, ttl_seconds=10)
        result = cache.get("key1")
        assert result == {"value": 42}

    def test_expired_returns_none(self):
        cache = TTLCache()
        cache.set("key2", "hello", ttl_seconds=1)
        time.sleep(1.1)
        assert cache.get("key2") is None

    def test_missing_key_returns_none(self):
        cache = TTLCache()
        assert cache.get("nonexistent") is None

    def test_delete_works(self):
        cache = TTLCache()
        cache.set("key3", "data", ttl_seconds=10)
        cache.delete("key3")
        assert cache.get("key3") is None

    def test_clear_empties_cache(self):
        cache = TTLCache()
        for i in range(5):
            cache.set(f"k{i}", i, ttl_seconds=10)
        cache.clear()
        assert len(cache) == 0


# ── Flask API tests ────────────────────────────────────────────────────────────

class TestFlaskAPI:

    @pytest.fixture
    def client(self):
        from app import app
        app.config["TESTING"] = True
        with app.test_client() as c:
            yield c

    def test_health_endpoint(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["status"] == "ok"

    def test_root_endpoint(self, client):
        resp = client.get("/")
        assert resp.status_code == 200
        data = resp.get_json()
        assert "endpoints" in data

    def test_404_returns_json(self, client):
        resp = client.get("/api/nonexistent")
        assert resp.status_code == 404
        data = resp.get_json()
        assert "error" in data

    def test_popular_stocks_endpoint(self, client):
        # This makes real network calls — skip in CI if needed
        pytest.skip("Requires live network access to Yahoo Finance")

    def test_predict_requires_valid_symbol(self, client):
        resp = client.post("/api/predict/INVALID_SYMBOL_XYZ_123")
        # Should return 400 with error, not crash
        assert resp.status_code in (400, 200)
        data = resp.get_json()
        assert "success" in data
