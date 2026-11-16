FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/pab1it0/prometheus-mcp-server.git . && \
    pip install --no-cache-dir .

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV SSE_PORT=3014
EXPOSE 3014

ENTRYPOINT ["/app/start.sh"]
