FROM node:22-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm init -y && npm install --no-audit --no-fund @karakeep/mcp@0.34.0 @modelcontextprotocol/sdk@1.32.2

COPY http-server.mjs /app/http-server.mjs
COPY start.sh /app/start.sh
RUN chmod +x /app/http-server.mjs /app/start.sh

ENV SSE_PORT=3002
EXPOSE 3002

ENTRYPOINT ["/app/start.sh"]
