FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/xiangmy21/ragflow_mcp_server.git . && \
    pip install --no-cache-dir "mcp[cli]>=1.10.0,<2.0.0" httpx uvicorn starlette

COPY http_server.py /app/http_server.py
COPY start.sh /app/start.sh
RUN chmod +x /app/http_server.py /app/start.sh && mkdir -p /app/logs

ENV MCP_SSE_PORT=3015
EXPOSE 3015

ENTRYPOINT ["/app/start.sh"]
