# ── HuggingFace Spaces Dockerfile ─────────────────────────────────────────────
FROM python:3.11-slim
 
WORKDIR /app
 
RUN apt-get update && apt-get install -y \
    build-essential \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*
 
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
COPY . .
 
RUN mkdir -p saved_models
 
# HuggingFace Spaces MUST use port 7860
EXPOSE 7860
 
CMD ["gunicorn", "wsgi:app", \
     "--bind", "0.0.0.0:7860", \
     "--workers", "2", \
     "--timeout", "300", \
     "--log-level", "info"]
