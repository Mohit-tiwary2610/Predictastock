"""
WSGI entry point for production deployment.

Usage with Gunicorn:
    gunicorn wsgi:app --bind 0.0.0.0:5000 --workers 2 --timeout 300

The --timeout 300 is important because LSTM training can take up to 90 seconds.
"""

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from app import app

if __name__ == "__main__":
    app.run()
