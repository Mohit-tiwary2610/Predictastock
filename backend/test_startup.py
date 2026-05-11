#!/usr/bin/env python3
"""
Quick startup diagnostic script to verify all imports work
and the API can start successfully.
"""
import sys

print("=" * 60)
print("🔍 StockSeer Backend Startup Diagnostic")
print("=" * 60)

# Test 1: Python version
print("\n1️⃣  Checking Python version...")
if sys.version_info < (3, 10):
    print(f"   ❌ Python {sys.version_info.major}.{sys.version_info.minor} detected. Need 3.10+")
    sys.exit(1)
print(f"   ✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")

# Test 2: Required packages
print("\n2️⃣  Checking required packages...")
required = {
    "flask": "Flask",
    "flask_cors": "Flask-CORS",
    "yfinance": "yfinance",
    "pandas": "pandas",
    "numpy": "numpy",
    "sklearn": "scikit-learn"
}

missing = []
for module, name in required.items():
    try:
        __import__(module)
        print(f"   ✅ {name}")
    except ImportError:
        print(f"   ❌ {name} not installed")
        missing.append(name)

if missing:
    print(f"\n   💡 Install missing: pip install {' '.join(missing)}")
    sys.exit(1)

# Test 3: TensorFlow (optional)
print("\n3️⃣  Checking TensorFlow (optional)...")
try:
    import tensorflow as tf
    print(f"   ✅ TensorFlow {tf.__version__}")
except ImportError:
    print("   ⚠️  TensorFlow not installed - will use fallback mode")
    print("   💡 Install: pip install tensorflow==2.15.0")

# Test 4: Import app modules
print("\n4️⃣  Checking app imports...")
try:
    from config import Config
    print(f"   ✅ config.py")
except Exception as e:
    print(f"   ❌ config.py: {e}")
    sys.exit(1)

try:
    from utils.data_fetcher import fetch_stock_data
    print(f"   ✅ utils/data_fetcher.py")
except Exception as e:
    print(f"   ❌ utils/data_fetcher.py: {e}")
    sys.exit(1)

try:
    from utils.preprocessor import preprocess_for_lstm
    print(f"   ✅ utils/preprocessor.py")
except Exception as e:
    print(f"   ❌ utils/preprocessor.py: {e}")
    sys.exit(1)

try:
    from models.lstm_model import train_and_predict
    print(f"   ✅ models/lstm_model.py")
except Exception as e:
    print(f"   ❌ models/lstm_model.py: {e}")
    sys.exit(1)

try:
    from routes.stock_routes import stock_bp
    from routes.prediction_routes import predict_bp
    print(f"   ✅ routes/stock_routes.py")
    print(f"   ✅ routes/prediction_routes.py")
except Exception as e:
    print(f"   ❌ routes: {e}")
    sys.exit(1)

# Test 5: Create Flask app
print("\n5️⃣  Testing Flask app creation...")
try:
    from app import app
    print(f"   ✅ Flask app created")
    print(f"   📍 Host: {Config.HOST}")
    print(f"   🚪 Port: {Config.PORT}")
    print(f"   🐛 Debug: {Config.DEBUG}")
except Exception as e:
    print(f"   ❌ Failed to create app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Test 6: Test route registration
print("\n6️⃣  Checking registered routes...")
with app.app_context():
    routes = [str(rule) for rule in app.url_map.iter_rules()]
    api_routes = [r for r in routes if r.startswith('/api/')]
    print(f"   ✅ Found {len(api_routes)} API routes:")
    for route in sorted(api_routes):
        print(f"      • {route}")

# Test 7: Quick yfinance test
print("\n7️⃣  Testing Yahoo Finance API...")
try:
    import yfinance as yf
    ticker = yf.Ticker("AAPL")
    hist = ticker.history(period="5d")
    if not hist.empty:
        print(f"   ✅ yfinance working (AAPL last: ${hist['Close'].iloc[-1]:.2f})")
    else:
        print("   ⚠️  yfinance returned no data - may be rate limited")
except Exception as e:
    print(f"   ⚠️  yfinance error: {e}")

print("\n" + "=" * 60)
print("✨ All checks passed! Ready to start the server.")
print("   Run: python app.py")
print("=" * 60)
