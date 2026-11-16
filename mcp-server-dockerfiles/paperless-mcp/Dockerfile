FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm init -y && npm install --no-audit --no-fund @retiform/paperless-mcp@2.3.6

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV SSE_PORT=3001
EXPOSE 3001

ENTRYPOINT ["/app/start.sh"]
