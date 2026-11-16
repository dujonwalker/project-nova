FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/avivsinai/langfuse-mcp.git . && \
    pip install --no-cache-dir .

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV SSE_PORT=3001
EXPOSE 3001

ENTRYPOINT ["/app/start.sh"]
