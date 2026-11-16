FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app
RUN npm init -y && npm install siyuan-mcp @modelcontextprotocol/sdk

COPY http-server.mjs /app/http-server.mjs
COPY start.sh /app/start.sh
RUN chmod +x /app/http-server.mjs /app/start.sh

ENV SSE_PORT=3003
EXPOSE 3003

ENTRYPOINT ["/app/start.sh"]
