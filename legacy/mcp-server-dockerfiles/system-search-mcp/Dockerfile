FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    plocate && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN pip install --no-cache-dir mcp-server-everything-search uvicorn starlette

COPY http_server.py /app/http_server.py
COPY start.sh /app/start.sh
RUN chmod +x /app/http_server.py /app/start.sh && mkdir -p /app/search_data

ENV SSE_PORT=3008
EXPOSE 3008

ENTRYPOINT ["/app/start.sh"]
