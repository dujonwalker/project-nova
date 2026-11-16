FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/matthewhand/mcp-flowise.git . && \
    pip install --no-cache-dir . uvicorn starlette

COPY http_server.py /app/http_server.py
COPY start.sh /app/start.sh
RUN chmod +x /app/http_server.py /app/start.sh && mkdir -p /app/data

ENV SSE_PORT=3011
EXPOSE 3011

ENTRYPOINT ["/app/start.sh"]
