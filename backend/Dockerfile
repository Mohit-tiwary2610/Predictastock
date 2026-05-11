# ── Backend Dockerfile ────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install system deps for numpy/tensorflow
RUN apt-get update && apt-get install -y \
    build-essential \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend source
COPY . .

# Create model save directory
RUN mkdir -p saved_models

EXPOSE 5000

# Use gunicorn in production with extended timeout for LSTM training
CMD ["gunicorn", "wsgi:app", \
     "--bind", "0.0.0.0:5000", \
     "--workers", "2", \
     "--timeout", "300", \
     "--log-level", "info"]
