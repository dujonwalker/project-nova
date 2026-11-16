FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN pip install --no-cache-dir ha-mcp

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV SSE_PORT=3011
EXPOSE 3011

ENTRYPOINT ["/app/start.sh"]
