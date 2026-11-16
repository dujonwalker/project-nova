FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/Vortiago/mcp-outline.git . && \
    pip install --no-cache-dir .

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV MCP_TRANSPORT=streamable-http
ENV MCP_HOST=0.0.0.0
ENV MCP_PORT=6060

EXPOSE 6060

ENTRYPOINT ["/app/start.sh"]
