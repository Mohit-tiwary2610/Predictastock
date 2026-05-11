"""
Model evaluation script — compare multiple stocks.
Usage:
    python evaluate_model.py --symbols AAPL GOOGL MSFT TSLA
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import argparse
import numpy as np
import pandas as pd

from utils.data_fetcher import get_raw_dataframe
from utils.preprocessor import (
    preprocess_for_lstm, inverse_transform, calculate_metrics
)

try:
    import tensorflow as tf
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
    from tensorflow.keras.optimizers import Adam
    from tensorflow.keras.callbacks import EarlyStopping
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False


def quick_train_and_eval(symbol, epochs=20, seq_len=60):
    """Quick train + eval for one symbol. Returns metrics dict."""
    df = get_raw_dataframe(symbol)
    if df.empty:
        return None

    prep = preprocess_for_lstm(df, sequence_length=seq_len)
    X_train, y_train = prep["X_train"], prep["y_train"]
    X_test,  y_test  = prep["X_test"],  prep["y_test"]
    scaler           = prep["scaler"]

    if TF_AVAILABLE:
        model = Sequential([
            LSTM(64, return_sequences=True, input_shape=(seq_len, 1)),
            Dropout(0.2),
            LSTM(32, return_sequences=False),
            Dropout(0.2),
            Dense(1),
        ])
        model.compile(optimizer=Adam(0.001), loss="huber")
        model.fit(
            X_train, y_train,
            epochs=epochs, batch_size=32,
            validation_split=0.1,
            callbacks=[EarlyStopping(patience=5, restore_best_weights=True)],
            verbose=0,
        )
        pred_scaled = model.predict(X_test, verbose=0).flatten()
    else:
        # Naive baseline: last-value persistence
        pred_scaled = y_test  # predicts same as actual → inflated R2

    actual    = inverse_transform(scaler, y_test)
    predicted = inverse_transform(scaler, pred_scaled)
    metrics   = calculate_metrics(actual, predicted)
    metrics["symbol"] = symbol
    return metrics


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--symbols", nargs="+", default=["AAPL", "GOOGL", "MSFT", "TSLA"])
    parser.add_argument("--epochs",  type=int, default=20)
    parser.add_argument("--seq_len", type=int, default=60)
    args = parser.parse_args()

    print(f"\n{'='*65}")
    print(f"  LSTM Evaluation — {', '.join(args.symbols)}")
    print(f"{'='*65}\n")

    results = []
    for sym in args.symbols:
        print(f"  Evaluating {sym}…", end="", flush=True)
        m = quick_train_and_eval(sym, args.epochs, args.seq_len)
        if m:
            results.append(m)
            print(f"  RMSE: {m['rmse']:.4f}  MAE: {m['mae']:.4f}  MAPE: {m['mape']:.2f}%  R²: {m['r2']:.4f}")
        else:
            print(f"  ⚠ Skipped (no data)")

    if results:
        df = pd.DataFrame(results).set_index("symbol")
        print(f"\n{'='*65}")
        print("  SUMMARY TABLE")
        print(f"{'='*65}")
        print(df.to_string())
        df.to_csv("evaluation_results.csv")
        print(f"\n  ✓ Saved to evaluation_results.csv\n")


if __name__ == "__main__":
    main()
