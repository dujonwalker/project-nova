FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json /app/package.json
RUN npm install --omit=dev --no-audit --no-fund

COPY server.js /app/server.js

ENV SSE_PORT=8442
EXPOSE 8442

CMD ["node", "/app/server.js"]
