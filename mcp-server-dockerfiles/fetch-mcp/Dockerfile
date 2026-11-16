FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends git curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN git clone https://github.com/zcaceres/fetch-mcp.git /app/fetch-mcp && \
    cd /app/fetch-mcp && \
    npm install && \
    npm run build

RUN npm init -y && npm install @modelcontextprotocol/sdk

COPY http-server.mjs /app/http-server.mjs
COPY start.sh /app/start.sh
RUN chmod +x /app/http-server.mjs /app/start.sh

ENV SSE_PORT=3020
EXPOSE 3020

ENTRYPOINT ["/app/start.sh"]
