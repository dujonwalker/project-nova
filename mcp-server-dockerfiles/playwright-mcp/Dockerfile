FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm init -y && \
    npm install @playwright/mcp && \
    npx playwright install --with-deps chromium

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV SSE_PORT=3007
EXPOSE 3007

ENTRYPOINT ["/app/start.sh"]
