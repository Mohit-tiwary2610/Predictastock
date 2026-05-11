import os
from dotenv import load_dotenv # pyright: ignore[reportMissingImports]

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "lstm-stock-secret-key-2024")
    DEBUG = os.getenv("DEBUG", "True") == "True"
    PORT = int(os.getenv("PORT", 5000))
    HOST = os.getenv("HOST", "0.0.0.0")

    # LSTM Model Configuration
    SEQUENCE_LENGTH = 60       # Days of historical data to look back
    PREDICTION_DAYS = 30       # Days to predict into future
    EPOCHS = 50
    BATCH_SIZE = 32
    LSTM_UNITS_1 = 128
    LSTM_UNITS_2 = 64
    LSTM_UNITS_3 = 32
    DROPOUT_RATE = 0.2
    VALIDATION_SPLIT = 0.1
    LEARNING_RATE = 0.001

    # Data Configuration
    DEFAULT_PERIOD = "2y"      # 2 years of training data
    DEFAULT_INTERVAL = "1d"    # Daily intervals
    FEATURE_COLUMNS = ["Open", "High", "Low", "Close", "Volume"]
    TARGET_COLUMN = "Close"

    # Popular Stock Tickers
    POPULAR_STOCKS = [
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "GOOGL", "name": "Alphabet Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corp."},
        {"symbol": "AMZN", "name": "Amazon.com Inc."},
        {"symbol": "TSLA", "name": "Tesla Inc."},
        {"symbol": "NVDA", "name": "NVIDIA Corp."},
        {"symbol": "META", "name": "Meta Platforms"},
        {"symbol": "NFLX", "name": "Netflix Inc."},
        {"symbol": "JPM",  "name": "JPMorgan Chase"},
        {"symbol": "V",    "name": "Visa Inc."},
    ]

    # Model Save Path
    MODEL_SAVE_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
    os.makedirs(MODEL_SAVE_DIR, exist_ok=True)
