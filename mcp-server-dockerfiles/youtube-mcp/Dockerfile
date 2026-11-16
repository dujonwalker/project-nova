FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm init -y && npm install --no-audit --no-fund zubeid-youtube-mcp-server@1.0.2

ENV MCP_TRANSPORT=http \
    MCP_HOST=0.0.0.0 \
    MCP_PORT=3021 \
    MCP_STATELESS=true

EXPOSE 3021

CMD ["node", "/app/node_modules/zubeid-youtube-mcp-server/dist/cli.js"]
