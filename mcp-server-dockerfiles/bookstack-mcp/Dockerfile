# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app
RUN git clone https://github.com/ttpears/bookstack-mcp.git . && \
    npm ci && \
    npm run build

# Production stage
FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV NODE_ENV=production
ENV PORT=3003
EXPOSE 3003

ENTRYPOINT ["/app/start.sh"]
