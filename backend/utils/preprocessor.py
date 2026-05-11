import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from typing import Tuple, Optional


def preprocess_for_lstm(
    df: pd.DataFrame,
    target_col: str = "Close",
    sequence_length: int = 60,
    test_split: float = 0.2,
) -> dict:
    """
    Preprocess stock data for LSTM training.

    Returns:
        dict with X_train, y_train, X_test, y_test,
        scaler, scaled_data, and split_index.
    """
    # Extract target column
    data = df[[target_col]].values.astype(float)

    if len(data) < sequence_length + 10:
        raise ValueError(
            f"Not enough data. Need at least {sequence_length + 10} rows, got {len(data)}."
        )

    # Fit MinMaxScaler on full data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Build sequences
    X, y = [], []
    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i - sequence_length : i, 0])
        y.append(scaled_data[i, 0])

    X, y = np.array(X), np.array(y)
    X = X.reshape((X.shape[0], X.shape[1], 1))   # (samples, timesteps, features)

    # Train / test split (no shuffle – temporal order matters)
    split_idx = int(len(X) * (1 - test_split))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    return {
        "X_train":      X_train,
        "y_train":      y_train,
        "X_test":       X_test,
        "y_test":       y_test,
        "scaler":       scaler,
        "scaled_data":  scaled_data,
        "split_index":  split_idx + sequence_length,  # index in original df
        "sequence_length": sequence_length,
        "raw_data":     data,
    }


def inverse_transform(scaler: MinMaxScaler, values: np.ndarray) -> np.ndarray:
    """Inverse-scale predictions back to original price range."""
    values = np.array(values).reshape(-1, 1)
    return scaler.inverse_transform(values).flatten()


def build_prediction_input(
    scaled_data: np.ndarray,
    sequence_length: int = 60,
) -> np.ndarray:
    """Build the last sequence for making future predictions."""
    last_seq = scaled_data[-sequence_length:, 0]
    return last_seq.reshape(1, sequence_length, 1)


def generate_future_dates(last_date: str, n_days: int = 30) -> list:
    """Generate business-day future dates starting from last_date."""
    import pandas as pd
    start = pd.Timestamp(last_date) + pd.Timedelta(days=1)
    future_dates = pd.bdate_range(start=start, periods=n_days)
    return [d.strftime("%Y-%m-%d") for d in future_dates]


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculate RMSE, MAE, MAPE for model evaluation."""
    y_true = np.array(y_true, dtype=float)
    y_pred = np.array(y_pred, dtype=float)

    rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
    mae  = float(np.mean(np.abs(y_true - y_pred)))
    mape = float(np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100)
    r2   = float(1 - np.sum((y_true - y_pred)**2) / (np.sum((y_true - np.mean(y_true))**2) + 1e-8))

    return {"rmse": round(rmse, 4), "mae": round(mae, 4), "mape": round(mape, 4), "r2": round(r2, 4)}
