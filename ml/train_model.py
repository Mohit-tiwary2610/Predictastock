"""
Standalone LSTM training script.
Usage:
    python train_model.py --symbol AAPL --epochs 50 --save
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

import argparse
import numpy as np # pyright: ignore[reportMissingImports]
import matplotlib.pyplot as plt # pyright: ignore[reportMissingModuleSource]

from utils.data_fetcher import get_raw_dataframe # pyright: ignore[reportMissingImports]
from utils.preprocessor import preprocess_for_lstm, inverse_transform, calculate_metrics # pyright: ignore[reportMissingImports]


def main():
    parser = argparse.ArgumentParser(description="Train LSTM on a stock symbol")
    parser.add_argument("--symbol",  type=str, default="AAPL", help="Stock ticker symbol")
    parser.add_argument("--period",  type=str, default="2y",   help="Data period (1y, 2y, 5y)")
    parser.add_argument("--epochs",  type=int, default=50,     help="Training epochs")
    parser.add_argument("--seq_len", type=int, default=60,     help="Lookback sequence length")
    parser.add_argument("--save",    action="store_true",      help="Save trained model")
    args = parser.parse_args()

    print(f"\n{'='*55}")
    print(f"  LSTM Stock Forecaster — Training for {args.symbol}")
    print(f"{'='*55}\n")

    # ── 1. Fetch data ──────────────────────────────────────────────────────────
    print(f"[1/4] Fetching {args.period} of {args.symbol} data from Yahoo Finance…")
    df = get_raw_dataframe(args.symbol, period=args.period)
    if df.empty:
        print(f"ERROR: No data found for {args.symbol}")
        sys.exit(1)
    print(f"      ✓ {len(df)} trading days loaded")

    # ── 2. Preprocess ──────────────────────────────────────────────────────────
    print(f"\n[2/4] Preprocessing (sequence_length={args.seq_len})…")
    prep = preprocess_for_lstm(df, sequence_length=args.seq_len)
    X_train, y_train = prep["X_train"], prep["y_train"]
    X_test,  y_test  = prep["X_test"],  prep["y_test"]
    scaler           = prep["scaler"]
    print(f"      ✓ Train: {X_train.shape}  |  Test: {X_test.shape}")

    # ── 3. Build & train model ─────────────────────────────────────────────────
    print(f"\n[3/4] Building LSTM model and training for {args.epochs} epochs…")

    try:
        import tensorflow as tf # pyright: ignore[reportMissingModuleSource, reportMissingImports]
        from tensorflow.keras.models import Sequential # pyright: ignore[reportMissingModuleSource, reportMissingImports]
        from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization # pyright: ignore[reportMissingModuleSource, reportMissingImports]
        from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau # pyright: ignore[reportMissingModuleSource, reportMissingImports]
        from tensorflow.keras.optimizers import Adam # pyright: ignore[reportMissingModuleSource, reportMissingImports]

        model = Sequential([
            LSTM(128, return_sequences=True, input_shape=(args.seq_len, 1)),
            Dropout(0.2), BatchNormalization(),
            LSTM(64, return_sequences=True),
            Dropout(0.2), BatchNormalization(),
            LSTM(32, return_sequences=False),
            Dropout(0.2),
            Dense(16, activation="relu"),
            Dense(1),
        ])
        model.compile(optimizer=Adam(0.001), loss="huber", metrics=["mae"])
        model.summary()

        history = model.fit(
            X_train, y_train,
            epochs=args.epochs,
            batch_size=32,
            validation_split=0.1,
            callbacks=[
                EarlyStopping(patience=8, restore_best_weights=True),
                ReduceLROnPlateau(patience=4, factor=0.5),
            ],
            verbose=1,
        )

        # ── 4. Evaluate ────────────────────────────────────────────────────────
        print(f"\n[4/4] Evaluating on test set…")
        test_pred = model.predict(X_test, verbose=0).flatten()
        actual    = inverse_transform(scaler, y_test)
        predicted = inverse_transform(scaler, test_pred)
        metrics   = calculate_metrics(actual, predicted)

        print(f"\n  Metrics:")
        for k, v in metrics.items():
            print(f"    {k.upper():8s}: {v}")

        # ── Plot ───────────────────────────────────────────────────────────────
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        fig.suptitle(f"{args.symbol} LSTM Training Results", fontsize=14, fontweight="bold")

        ax1.plot(actual,    label="Actual",    color="#22d3ee",  linewidth=2)
        ax1.plot(predicted, label="Predicted", color="#10b981", linestyle="--", linewidth=2)
        ax1.set_title("Price Prediction vs Actual")
        ax1.set_xlabel("Trading Days")
        ax1.set_ylabel("Price ($)")
        ax1.legend()
        ax1.grid(alpha=0.3)

        ax2.plot(history.history["loss"],     label="Train Loss", color="#22d3ee")
        ax2.plot(history.history["val_loss"], label="Val Loss",   color="#a78bfa")
        ax2.set_title("Training Loss Curve")
        ax2.set_xlabel("Epoch")
        ax2.set_ylabel("Loss")
        ax2.legend()
        ax2.grid(alpha=0.3)

        plt.tight_layout()
        plt.savefig(f"{args.symbol}_training_results.png", dpi=150)
        print(f"\n  ✓ Plot saved: {args.symbol}_training_results.png")

        # ── Save model ─────────────────────────────────────────────────────────
        if args.save:
            save_path = f"{args.symbol}_lstm_model.keras"
            model.save(save_path)
            print(f"  ✓ Model saved: {save_path}")

    except ImportError:
        print("  ⚠ TensorFlow not available. Install it with: pip install tensorflow")
        sys.exit(1)

    print(f"\n{'='*55}")
    print(f"  ✅  Training complete for {args.symbol}")
    print(f"{'='*55}\n")


if __name__ == "__main__":
    main()
